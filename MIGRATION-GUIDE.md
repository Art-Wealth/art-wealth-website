# Art Wealth — Step-by-Step Migration Guide (Wix → New Site)

This is your plain-English playbook for moving www.artwealth.com.au off Wix and onto your new site. Take your time — most steps are 10–30 minutes each, and you can pause anywhere.

> **Estimated total time:** ~6–10 hours of actual work, spread over 1–2 weeks.
> **Estimated annual cost after switching:** ~$15–30 AUD/year for the domain, **$0** for hosting (Cloudflare Pages or Netlify free tier).

---

## Phase 0 — Before you do anything (30 min)

### 0.1 Take a complete backup of your current Wix site
Inside Wix:
- Go to **My Sites → … → Duplicate Site** (creates a backup version inside your account).
- Export anything that isn't visible publicly: blog posts as `.txt`, image library as a download, contact list (CSV), bookings list (CSV).
- Screenshot every page on desktop and mobile so you have a visual record.

### 0.2 List everything on your current site that you need to keep working
Things people forget:
- Booking calendar (Wix Bookings)
- Contact form (where do submissions currently land?)
- Email address (`arthur@artwealth.com.au` — is this Wix-hosted email, Google Workspace, or M365?)
- Any inbound links: Google Business Profile, LinkedIn, Adviser Ratings, business cards, email signatures.

### 0.3 Find out where your domain is registered
Log into Wix → **Domains**. The domain is most likely registered through Wix itself, or possibly Crazy Domains / GoDaddy / VentraIP.
Note the registrar — you'll need login access for the DNS swap in Phase 5.

---

## Phase 1 — Get the new site running on a staging URL (1 hour)

We'll use **Cloudflare Pages** (free, fast, no bandwidth limits). Netlify is just as good if you prefer.

### 1.1 Sign up for a free GitHub account (skip if you already have one)
- Go to https://github.com → **Sign up**.
- Pick a username — it's only used internally.

### 1.2 Create a free Cloudflare account
- Go to https://dash.cloudflare.com → **Sign up**.

### 1.3 Upload the site to GitHub
You don't need to learn Git for this. Easiest way:
1. In GitHub, click **+ → New repository**, name it `artwealth-site`, set to **Private**, click **Create**.
2. On the empty repo page, click **uploading an existing file**.
3. Drag the entire contents of this folder (`index.html`, `about.html`, all the other HTML files, the `assets` folder, etc.) into the upload area.
4. Click **Commit changes**.

### 1.4 Connect Cloudflare Pages to the repo
1. In Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorise GitHub, pick `artwealth-site`.
3. **Build settings:** Framework preset = `None`. Build command = (leave blank). Build output directory = `/`.
4. Click **Save and Deploy**.

In ~60 seconds you'll have a live URL like `artwealth-site-x8k.pages.dev`. **This is your staging URL.** Bookmark it.

### 1.5 Test on phone, tablet, desktop
Open the staging URL on every device you can find. Click every link, fill the contact form, view every page. Anything that doesn't feel right, list it.

---

## Phase 2 — Wire up the form, booking and email (1–2 hours)

### 2.1 Make the contact form actually send emails
Pick one (all free for low volume):

| Provider | Best for | Setup time |
|---|---|---|
| **Web3Forms** (recommended for simplicity) | Just want emails to arrive — no account needed beyond an email confirmation | 5 minutes |
| **Formspree** | Want a dashboard of submissions | 10 minutes |
| **Cloudflare Pages Forms** | Already on Cloudflare, want everything in one place | 15 minutes |

**Web3Forms quick setup:**
1. Go to https://web3forms.com → enter `arthur@artwealth.com.au` → they email you an access key.
2. Open `contact.html` in a text editor (Notepad, TextEdit, VS Code — whatever).
3. Find the line `<form data-contact-form>`.
4. Replace it with:
   ```html
   <form action="https://api.web3forms.com/submit" method="POST">
     <input type="hidden" name="access_key" value="YOUR-KEY-HERE">
     <input type="hidden" name="from_name" value="Art Wealth Website">
   ```
5. Right at the bottom of the form (just before `</form>`), add a redirect:
   ```html
   <input type="hidden" name="redirect" value="https://artwealth.com.au/thank-you.html">
   ```
6. Save, drag the updated `contact.html` back into your GitHub repo (it'll auto-redeploy).

### 2.2 Get the booking calendar working
Two options:

**Option A — Keep Wix Bookings (free, fastest):**
- In Wix, open Bookings → **Embed code**. Copy the iframe HTML.
- Open `contact.html`, find the comment `REPLACE THIS BLOCK WITH YOUR BOOKING WIDGET`.
- Paste the Wix iframe in place of the placeholder div.

**Option B — Move to Calendly (recommended longer-term, $0–$15/mo):**
- Sign up at https://calendly.com.
- Create an event called "Intro Chat with Arthur" (30 min, video, your availability).
- On the event page, click **Share → Embed → Inline Embed** and copy the snippet.
- Paste it into `contact.html` in the same spot.

### 2.3 Make sure your email keeps working
**This is the step most people get wrong.** If `arthur@artwealth.com.au` is hosted by Wix and you switch DNS without preserving MX records, your email will stop. Do this:

1. Log in to wherever your domain is registered (Wix, Crazy Domains, etc.).
2. Open **DNS Records**.
3. Take a screenshot of every record — especially anything labelled `MX`, `TXT`, `CNAME` for `_dmarc`/`autodiscover`/`mail`.
4. Save the screenshot — you'll re-enter these exact values in Phase 5.

If your email is Google Workspace or Microsoft 365, your MX records will look something like `aspmx.l.google.com` or `outlook-com.olc.protection.outlook.com`. As long as you re-add them in Phase 5, email keeps working.

---

## Phase 3 — Replace placeholder content (1–2 hours)

The site is built — but it has placeholder bits you'll want to swap in.

### 3.1 Photo of Arthur
Right now the adviser photo is a styled gradient block. To replace:
1. Save a high-res, candid photo of yourself as `arthur.jpg` in `assets/images/`.
2. In `index.html` and `about.html`, find `<div class="adviser-photo"` and replace the entire block with:
   ```html
   <img class="adviser-photo" src="assets/images/arthur.jpg" alt="Arthur How, Certified Financial Planner">
   ```

### 3.2 Logo or favicon
- For a custom logo, save `logo.svg` or `logo.png` to `assets/images/` and replace `<span class="mark">A</span>` in the header with `<img src="assets/images/logo.svg" alt="Art Wealth" style="height:34px;">`.
- For a favicon, generate one at https://realfavicongenerator.net using a square version of your logo, then drop the files in the root.

### 3.3 Insurer / platform logos
Currently shown as text in the trust bar. To use real logos:
1. Get small SVG/PNG logos for each provider (most have a media kit page).
2. Save into `assets/images/logos/`.
3. In `index.html` replace each `<span class="trust-logo">TAL</span>` with `<img src="assets/images/logos/tal.svg" alt="TAL" style="height:32px;">`.

### 3.4 Lifestyle photography
The hero visual is currently a gradient. For real photography:
1. Choose 1–2 candid Melbourne lifestyle photos (Asian and Anglo families/couples in real-life settings — coffee, beach walks, in their homes). Stock libraries: Stocksy, Death to Stock, or commission a local photographer for $500–1500.
2. Save as `hero.jpg` in `assets/images/`.
3. In `index.html`, replace the `<div class="hero-visual"` block with:
   ```html
   <div class="hero-visual" style="background-image: url('assets/images/hero.jpg'); background-size: cover; background-position: center;">
     <div class="hero-card">
       <strong>Arthur How, CFP®</strong>
       <div class="meta">Founder · Art Wealth · Melbourne</div>
     </div>
   </div>
   ```

### 3.5 Financial Services Guide (FSG)
1. Get the latest FSG PDF from Lifespan (your licensee) — they'll provide the current branded version.
2. Save as `financial-services-guide.pdf` in the `docs/` folder.
3. The links throughout the site already point to `docs/financial-services-guide.pdf` — they'll just start working.

### 3.6 Authorised Representative number
Across all pages, find `AR No. [TBC]` and replace with your actual AR number from Lifespan.

### 3.7 LinkedIn URL
Find `https://www.linkedin.com` in the footer of every page and replace with your actual LinkedIn profile URL.

---

## Phase 4 — SEO and Google Business Profile (45 min)

### 4.1 Submit to Google Search Console
- Go to https://search.google.com/search-console.
- Add property → enter `artwealth.com.au`.
- Verify via DNS TXT record (Cloudflare makes this easy).
- This tells Google your new site exists and to start crawling.

### 4.2 Update your Google Business Profile
- https://business.google.com → make sure address, phone, hours, website are all correct.
- Add a few candid photos.
- Ask 2–3 happy clients to leave a Google Review (these show up on the Reviews page).

### 4.3 Add a sitemap (optional but helpful)
Create a file called `sitemap.xml` in the root. I can generate this for you on request — it's a 30-line file listing all your pages.

### 4.4 Add Google Analytics (optional)
- Sign up at https://analytics.google.com.
- They'll give you a snippet starting `<!-- Google tag (gtag.js) -->`.
- Paste it just before `</head>` in every HTML file.

---

## Phase 5 — DNS cutover: point artwealth.com.au at the new site (the scary bit, 30 min + 24hr wait)

This is the moment your old Wix site stops being live and the new one takes over. Do it on a quiet evening — submissions will not be lost (they go to your form provider directly), but you don't want to be caught on the phone with Wix support during business hours.

### 5.1 Pre-flight checklist
- [ ] You can edit DNS for `artwealth.com.au` (have logged in to your registrar).
- [ ] You've screenshotted **every existing DNS record** (especially MX records for email).
- [ ] The new site at the staging URL is fully tested and working.
- [ ] Your form provider (Web3Forms etc.) is verified and tested.
- [ ] You've told your booking provider the new URL (Calendly etc. don't need this; Wix Bookings will keep working from the embed).

### 5.2 In Cloudflare Pages, add the custom domain
1. Open your Pages project → **Custom domains → Set up a custom domain**.
2. Enter `artwealth.com.au` and `www.artwealth.com.au`.
3. Cloudflare will tell you what DNS records to point at it — typically a CNAME for `www` and a flattening A/CNAME for the apex.

### 5.3 Move DNS to Cloudflare (recommended for one-stop management)
This step is optional but makes life much easier going forward — you get DDoS protection, CDN, and easy DNS edits free.
1. In Cloudflare → **Add a Site → enter artwealth.com.au**.
2. Cloudflare will scan and import your existing DNS records. **Verify the MX records are present** before continuing.
3. Cloudflare will give you 2 nameservers like `xxx.ns.cloudflare.com`.
4. Log in to your current registrar (Wix, Crazy Domains, etc.) → change nameservers to those two values.
5. Wait 1–24 hours for the change to propagate (often <1 hour in practice).

### 5.4 Verify after propagation
After a few hours, open https://www.artwealth.com.au — you should see your new site. Send yourself an email at arthur@artwealth.com.au to confirm email still works.

If anything looks broken, you can revert by changing nameservers back at the registrar.

---

## Phase 6 — Post-launch (the next week)

- [ ] Update email signature with the new (or same) website URL.
- [ ] Tell your Lifespan compliance contact the new site is live (they may want to review).
- [ ] Update your LinkedIn profile URL field if it had a Wix-specific link.
- [ ] Update business cards if printed.
- [ ] Watch Google Search Console for any crawl errors.
- [ ] Submit the new sitemap to Bing as well: https://www.bing.com/webmasters.

---

## Phase 7 — Cancel Wix (only after 30 days of new site running)

Once the new site has been running for a month with no problems, and you've confirmed nothing else (email, bookings, anything client-facing) depends on Wix:

1. Inside Wix → **Account Settings → Premium Subscriptions → Cancel**.
2. Don't cancel the domain through Wix — transfer it to your registrar of choice first if it's currently held inside Wix. Cloudflare Registrar charges at-cost (~$13/yr for `.com.au`) and is the cheapest option.

---

## Editing the site after launch — the cheat sheet

**To change text on a page:** Open the relevant `.html` file in any text editor, find the text, change it, save. Drag the file back into GitHub. Cloudflare auto-redeploys in ~60 seconds.

**To change colours or fonts site-wide:** Open `assets/css/style.css`. The first 30 lines (`:root { ... }`) define every colour and font on the site. Change once, applies everywhere.

**To add a new blog article:** Duplicate `blog.html`, rename to `blog-your-topic.html`, replace the grid of cards with a single article body. Add a card linking to it on the main `blog.html`. (I can build a proper template for this — just ask.)

**If you ever want a CMS so you don't touch HTML:** Decap CMS or Sanity Studio plug into this same setup and give you a friendly editor. ~2 hours to set up. Optional, not required.

---

## Help / what to come back to me for

I can come back any time and:
- Add a real Calendly/Wix booking embed once you've picked one
- Build the first 2–3 actual blog articles end to end
- Generate the sitemap.xml and robots.txt
- Wire up Google Analytics + Search Console
- Replace the placeholder photo blocks with your real images
- Add a client portal link if Lifespan provides one
- Build a "thank you" page for after form submissions

Just open this project and ask.
