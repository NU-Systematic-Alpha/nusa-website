"""Validate the public static site with Python's standard library."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index', 'about', 'team', 'projects', 'events', 'apply']
DOMAIN = 'https://www.nusystematicalpha.com'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


parsed = {name: Page((ROOT / f'{name}.html').read_text()) for name in PAGES}
footer = (ROOT / 'footer.html').read_text().strip()
titles = set()
descriptions = set()
for name, page in parsed.items():
    text = (ROOT / f'{name}.html').read_text()
    tags = page.tags
    ids = [attrs['id'] for _, attrs in tags if 'id' in attrs]
    assert len(ids) == len(set(ids)), f'{name}: duplicate IDs'
    assert sum(tag == 'h1' for tag, _ in tags) == 1, f'{name}: one h1 required'
    assert sum(tag == 'main' for tag, _ in tags) == 1, f'{name}: one main required'
    assert footer in text, f'{name}: footer out of sync'
    assert 'footer-placeholder' not in text, f'{name}: client-only footer'
    assert 'NUSA Shared Drive' not in text, f'{name}: private source exposed'
    assert 'September 31' not in text, f'{name}: invalid date'
    assert 'education' not in [urlsplit(a.get('href', '')).path for _, a in tags], f'{name}: curriculum link'
    title = re.search(r'<title>(.*?)</title>', text).group(1)
    assert title not in titles, f'{name}: duplicate title'
    titles.add(title)
    metas = {a.get('name', a.get('property')): a.get('content') for t, a in tags if t == 'meta'}
    assert metas['description'] and metas['description'] not in descriptions, f'{name}: description'
    descriptions.add(metas['description'])
    assert metas['description'] == metas['og:description'] == metas['twitter:description']
    canonical = DOMAIN + ('/' if name == 'index' else '/' + name)
    assert [a['href'] for t, a in tags if t == 'link' and a.get('rel') == 'canonical'] == [canonical]
    assert metas['og:url'] == canonical
    schemas = [json.loads(s) for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)]
    assert schemas, f'{name}: missing structured data'
    if name != 'index':
        assert any(item['@type'] == 'BreadcrumbList' for schema in schemas for item in schema.get('@graph', []))
    for tag, attrs in tags:
        if tag == 'img':
            assert 'alt' in attrs, f'{name}: image missing alt'
        if tag == 'iframe':
            assert attrs.get('title') and attrs.get('loading') == 'lazy', f'{name}: iframe'
        if tag == 'button':
            assert attrs.get('aria-label') or 'mobile-toggle' not in attrs.get('class', ''), f'{name}: menu label'
        for attribute in ('href', 'src', 'data'):
            url = attrs.get(attribute)
            if not url:
                continue
            parts = urlsplit(url)
            if parts.scheme or parts.netloc or parts.path.startswith('/_vercel/'):
                continue
            relative = unquote(parts.path).lstrip('/')
            if relative in ('', 'index'):
                destination = name if not parts.path else 'index'
                target = ROOT / f'{destination}.html'
            else:
                target = ROOT / relative
                if not target.suffix:
                    target = target.with_suffix('.html')
                destination = target.stem
            assert target.is_file(), f'{name}: broken {attribute}={url}'
            if parts.fragment and target.suffix == '.html':
                assert any(a.get('id') == unquote(parts.fragment) for _, a in parsed[destination].tags), f'{name}: broken anchor {url}'

sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = {element.text for element in sitemap.findall('.//{*}loc')}
assert urls == {DOMAIN + ('/' if name == 'index' else '/' + name) for name in PAGES}
assert not (ROOT / 'education.html').exists(), 'Curriculum page must remain private'
print(f'PASS: {len(PAGES)} pages; metadata, schemas, landmarks, shared footer, local links, anchors, sitemap, and privacy checks.')
