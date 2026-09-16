# nusa-website
Northeastern Systematic Alpha Website

## Build and verify

Run `python3 scripts/check-site.py`, then `node scripts/build.mjs`.
Vercel uses the same build command and serves only `dist/`. The build uses an
explicit list of public pages and asset folders; the private shared drive and
curriculum are excluded. Do not copy private files into a public asset folder.

For a local preview with clean URLs, run `npx serve dist` after building.
The public site is six static HTML pages; no frontend framework is required.

See [content sources and SEO maintenance](docs/content-sources.md) for provenance,
footer maintenance, and checks to perform after deployment.
