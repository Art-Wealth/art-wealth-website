# Art Wealth — Website Source

The new home of [artwealth.com.au](https://www.artwealth.com.au) — a complete, hand-coded overhaul to replace the existing Wix build.

## What's in here

```
Art Wealth Website/
├── index.html              ← Home
├── about.html              ← About Arthur
├── services.html           ← The five services (Problem/Solution/How We Help)
├── client-wins.html        ← Seven client-win case studies
├── reviews.html            ← All 10 testimonials
├── blog.html               ← Blog grid (placeholder articles)
├── contact.html            ← Form + booking embed
├── assets/
│   ├── css/style.css       ← Single design-system stylesheet (edit colours/fonts here)
│   ├── js/main.js          ← Mobile nav, scroll reveals, reviews carousel
│   └── images/             ← Drop your photos and logos here
├── docs/                   ← Drop FSG / FDS PDFs here
├── MIGRATION-GUIDE.md      ← Plain-English step-by-step Wix → live cutover
└── README.md               ← This file
```

## Tech stack

- **Plain HTML, CSS and JavaScript** — no frameworks, no build step.
- **DM Sans** + **Inter** via Google Fonts.
- Designed mobile-first, responsive down to 360px.
- Total page weight: <100KB before images. Loads instantly anywhere.

## Why no framework?

You said you want minimal coding. A framework (Next.js, Astro etc.) is faster *to develop* but requires Node.js, a build step, and ongoing dependency upgrades. Plain HTML is something you can open in a text editor 10 years from now and it'll still work exactly the same.

## How to view it locally

Just double-click `index.html` — it opens straight in your browser. No server needed.

(For an even better preview with auto-reload, you can install the free [Live Server VS Code extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), but it's not required.)

## How to deploy it

See `MIGRATION-GUIDE.md` for the full step-by-step. The short version: drag this folder's contents into a GitHub repo, connect Cloudflare Pages, point the domain at it. Total cost: $0/month for hosting.

## How to edit content

| To change... | Open... | Find... |
|---|---|---|
| Headline on the home page | `index.html` | "Financial advisory that actually feels human" |
| Arthur's bio | `about.html` | The story section |
| A service description | `services.html` | The matching `<article class="service-block">` |
| A client win | `client-wins.html` | The matching `<article class="win-card">` |
| Colours, fonts, spacing site-wide | `assets/css/style.css` | The `:root { }` block at the top |
| Phone number | All pages | Search for `0423 047 700` |
| Email | All pages | Search for `arthur@artwealth.com.au` |

## Compliance

The licensee disclosure (Lifespan Financial Planning, AFSL 229 892) appears in the footer of every page, plus a general advice warning. The Privacy Policy link points to Lifespan's hosted page. The FSG link expects a PDF at `docs/financial-services-guide.pdf` — drop the latest version there.

The Authorised Representative number is currently `[TBC]` — search and replace across all files once you have it from Lifespan.

## What's still placeholder

- Photo of Arthur (currently a styled gradient block — see migration guide step 3.1)
- Trust-bar logos (currently text — see step 3.3)
- Hero image (currently a gradient — see step 3.4)
- FSG PDF (drop into `docs/`)
- Booking widget (Calendly/Wix iframe — see step 2.2)
- Contact form backend (Web3Forms/Formspree — see step 2.1)
- Blog articles (currently teaser cards with no destinations)
- LinkedIn URL (currently `https://www.linkedin.com`)

Everything else is real, copy-finalised content ready for launch.
