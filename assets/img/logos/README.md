# Logo files for the home-page trust bar marquee

Drop the official PNG or (preferably) SVG logo for each partner here, using the
filenames below. The home page is already wired to swap in image files — once a
file exists at the expected path, replace the wordmark span inside its tile in
`index.html` with an `<img>` tag.

Expected filenames
------------------
- tal.svg
- aia.svg
- zurich.svg
- mlc.svg
- metlife.svg
- neos.svg
- macquarie.svg
- netwealth.svg
- hub24.svg
- bt.svg
- cfs.svg
- australiansuper.svg
- awaresuper.svg

Sourcing
--------
Each brand publishes a media kit with press-quality logos. Visit the site
listed inside the comment block at the top of the trust-bar section in
`index.html` (or email their media/PR team — most respond within a day with
press-ready SVGs).

Sizing tips
-----------
- SVG is best — it stays crisp at any size.
- If using PNG, save at 2x the display size (~120px tall) with a transparent
  background.
- Logos display at ~32px tall in the marquee. The CSS handles scaling.

How to swap in (example)
------------------------
In `index.html`, find:
    <div class="logo-tile" title="TAL"><span class="wordmark" style="color:#E40521;">TAL</span></div>
Replace with:
    <div class="logo-tile" title="TAL"><img src="assets/img/logos/tal.svg" alt="TAL"></div>

Remember to do the swap in BOTH copies of the row (the marquee duplicates the
row to make the scroll loop seamless).
