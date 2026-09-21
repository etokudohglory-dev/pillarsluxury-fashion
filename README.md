# Pillarsluxury Fashion — Website Files

## Deploy to Netlify

**Option A — drag & drop (fastest)**
1. Go to https://app.netlify.com/drop
2. Drag this entire folder (or the ZIP, unzipped) onto the page.
3. Netlify gives you a live `.netlify.app` link immediately.

**Option B — Netlify dashboard**
1. Log into Netlify → "Add new site" → "Deploy manually".
2. Drag this folder in the same way.

No build step is required — this is a static site. `netlify.toml` is already
configured with `publish = "."` and caching headers for the `assets`, `css`
and `js` folders.

**Important — for the admin panel to work, this must be a Git-connected
site, not a drag-and-drop one.** See "Admin Panel" below.

## Admin Panel (add/edit/delete outfits without code)

This site includes a private admin panel at `/admin`, powered by Decap CMS,
for managing the pieces shown in the Lookbook section — no code editing
required after setup.

**How it works:** the owner logs in with a GitHub account, edits outfits
through a simple form, and clicking Save commits the change to the GitHub
repo. Netlify detects that commit and automatically rebuilds the site
(~30–60 seconds), so the change goes live without anyone touching code.

**One-time setup required (not yet done — this package only contains the
code):**

1. Push this project to a GitHub repository (instead of drag-and-drop, link
   that repo to Netlify under Site configuration → Build & deploy →
   Continuous deployment).
2. Edit `admin/config.yml` and replace `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME`
   on the `repo:` line with your actual GitHub repo path.
3. Create a GitHub OAuth App (github.com/settings/developers) with:
   - Homepage URL: your Netlify site URL
   - Authorization callback URL: `https://api.netlify.com/auth/done` (exact)
4. In Netlify: Site configuration → Access control → OAuth → Authentication
   Providers → Install Provider → GitHub → paste in the OAuth App's Client
   ID and Client Secret.
5. Visit `https://your-site.netlify.app/admin`, log in with GitHub, and
   manage outfits.

**What outfit data lives where:**
- `content/outfits.json` — the 10 current outfits, in the exact format the
  admin panel reads and writes. This is what `js/main.js` fetches at
  runtime to build the Lookbook cards.
- New photos uploaded through the admin panel are saved to
  `assets/images/outfits/` (kept separate from the original hand-optimized
  photos in `assets/images/`) and are **not** automatically converted to
  WebP — they're used as plain JPG/PNG, which is a small, deliberate
  trade-off for keeping future edits fully code-free and reliable.
- Only the Lookbook section (the 10 scrollable outfit cards) is
  CMS-managed. The hero, categories, custom-made/ready-to-wear sections,
  pricing, and contact details are not — changing those still requires
  editing the code directly.

## Folder contents

```
index.html          – the site
css/style.css        – all styles
js/main.js            – all interactivity (nav, reveal animations, lightbox,
                         swatch selector, currency converter, WhatsApp links)
assets/images/*.jpg   – all product/editorial photos
assets/images/*.webp  – WebP versions (served to browsers that support them,
                         ~32% smaller; the .jpg is the automatic fallback)
assets/video/hero.mp4 – the hero background video
netlify.toml          – Netlify build/publish + cache headers config
robots.txt             – search-engine crawl rules (also blocks /admin/ from being indexed)
sitemap.xml             – search-engine sitemap
admin/index.html        – loads the Decap CMS admin panel
admin/config.yml        – defines the "Outfits" editing form (edit the repo: line — see above)
content/outfits.json    – the outfit data the admin panel and the site both read/write
```

## Two things to update once you have a live domain

Search for `pillarsluxuryfashion.com` in `index.html`, `robots.txt` and
`sitemap.xml` — it's a **placeholder domain**, not a real one. Once your
Netlify site is live (either the `.netlify.app` link or a connected custom
domain), replace every occurrence with your real URL:

1. `index.html` — the `<link rel="canonical">`, `og:url` and `og:image` tags
   near the top of `<head>` (both are marked with an HTML `<!-- TODO -->` comment).
2. `robots.txt` and `sitemap.xml` — the sitemap URL.

`og:image` currently points at one of the product photos on that placeholder
domain — once it's a real, reachable URL it will show up as the preview
image when the site is shared on WhatsApp, Facebook, etc.

## Contact details used on the site

- WhatsApp / phone: +234 913 720 2959
- Email: pillarsluxuryclothing@gmail.com

If either of these ever changes, they appear in `index.html` (search for the
number/email) and nowhere else.
