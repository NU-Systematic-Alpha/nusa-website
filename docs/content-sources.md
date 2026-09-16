# Public content sources

Reviewed September 16, 2026. The website additions use public materials only.

- [NUSA LinkedIn](https://www.linkedin.com/company/https-nusa-website-henna.vercel.app-/): JRAP overview, April 14, 2026 research showcase, Fidelity Boston visit, member career panel. No unverified event date or partner offer expiry was inferred. Use the supplied posts URL in site links.
- [BondSpillover](https://github.com/NU-Systematic-Alpha/BondSpillover): repository purpose and public notebook names. The website links to the repository without claiming that its code has been independently validated.
- Existing published research summaries and PDFs in `projects.html`: preserved; linked from the homepage and research page.
- [Instagram](https://www.instagram.com/nusystematicalpha/): retained as an official announcement channel. Direct content fetching was unavailable, so no new claims depend on inaccessible Instagram posts.

The private shared drive, curriculum, applications, member records, and teaching materials must not be published. No curriculum page is included. Existing public JRAP application copy remains on the application page.

# SEO and maintenance

Keep the canonical origin `https://www.nusystematicalpha.com` consistent across metadata, robots.txt, and sitemap.xml. It returned HTTP 200 during this review.

The shared footer is present in each page's initial HTML. Edit `footer.html` and the matching block on all six pages together; the build checks they match. This keeps navigation available to crawlers and readers without requiring JavaScript.

Google guidance: [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), and [developer guidance](https://developers.google.com/search/docs/fundamentals/get-started-developers).

After deployment, verify the canonical URLs and submit the sitemap in the club's Google Search Console property. Track indexed pages and relevant query impressions over time. Local checks do not establish indexing or ranking gains.
