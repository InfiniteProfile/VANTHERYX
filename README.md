# VANTHERYX — The Infinite Identity Dimension

**ONE UNIVERSE. INFINITE IDENTITIES. NO FINAL DESTINATION.**

A dependency-light static website that deterministically generates fictional identities from positive decimal-string IDs.

## Files

- `index.html` — semantic page structure and accessible controls
- `style.css` — dark-luxury responsive visual system
- `generator.js` — deterministic identity data, exact ID normalization, embedded SVG portrait generation
- `script.js` — feed controller, automatic generation, search, detail overlay, history and bounded DOM window

## Run locally

Open `index.html` in a modern browser. For a local server, run one of these from this directory:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a repository and upload the four files.
2. Open **Settings → Pages**.
3. Choose deployment from the `main` branch and `/ (root)`.
4. Save and wait for the published site.

The same files work on compatible static hosts. Profile links use the query parameter `?profile=12345678901234567890`, which works without server-side route rewrites.

## How it works

- IDs are canonical decimal strings. Leading zeroes are removed; zero and non-digit input are rejected.
- `BigInt` advances the feed sequence, while identity attributes are derived from stable hashes over the full decimal string.
- Search calls the generator directly. It does not search the DOM or walk through preceding IDs.
- Portraits are inline SVG compositions, so the core experience does not depend on a paid image API or remote portrait host.
- The feed creates small batches on demand, uses both `IntersectionObserver` and a scroll-distance fallback, and explicitly rechecks after each batch.
- The DOM is bounded by trimming old cards and compensating the scroll position. It does not accumulate an enormous spacer or render every prior identity.
- Identity detail state is represented by the `profile` query parameter and browser history.

## Honest limitations

This is an effectively unbounded deterministic identity space, not a claim of physically infinite computing resources. Browser sessions, memory, layout engines, and device performance remain finite. Names and portraits are generated from a finite set of components, so collisions are possible; the application does **not** claim mathematical uniqueness. The current visual portraits are generated SVG illustrations, not unique photographic images.

## Manual acceptance checklist

- [ ] Initial load renders identities immediately.
- [ ] Scroll for several thousand logical IDs; confirm automatic continuation and no 99/100/1000 cap.
- [ ] Search for a 100-digit positive ID; confirm exact ID in the detail view.
- [ ] Reload the same ID; compare all generated fields.
- [ ] Open and close a card; confirm scroll position is restored.
- [ ] Confirm DOM card count stays around the configured buffer.
- [ ] Block network access; confirm portraits still render (Google Fonts are optional).
- [ ] Test on a narrow mobile viewport and with reduced-motion enabled.
- [ ] Test browser back/forward while a profile is open.

The source includes recovery for a failed generation batch, but browser/device acceptance tests should be run on the actual target devices before claiming those tests passed.
