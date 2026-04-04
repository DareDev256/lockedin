# TapIn

One-tap connection card — share all your socials with a single link. NFC-ready, embeddable, zero backend.

## Features

- **60+ platforms** across 13 categories (social, video, music, gaming, developer, creator, shopping, payment, booking, messaging, portfolio, podcast, website)
- **5 action modes** — Follow, Connect, DM, Book, Pay
- **Follow All** — one tap opens every connected platform with staggered timing
- **Analytics dashboard** — views, clicks, CTR, 7-day sparkline, platform breakdown (localStorage-backed)
- **Profile encoding** — Base64 URL hash for zero-backend profile sharing
- **vCard export** — download contact card with all socials and custom links
- **Embeddable widget** — drop `widget.js` into any page
- **NFC writer** — program NFC tags with your TapIn link
- **5 themes** — Midnight, Ocean, Sunset, Neon, Minimal
- **PWA** — installable, works offline
- **Viral growth loop** — post-follow CTA banner

## Tech Stack

- React 19 + Vite 8
- Vitest (unit tests)
- Vanilla JS embeddable widget
- Zero backend — all data in URL hash + localStorage

## Setup

```bash
npm install
npm run dev        # dev server on :3000
npm run build      # production build
npm test           # run test suite
npm run test:watch # watch mode
```

## Testing

Core utilities are extracted to `src/utils.js` and tested in `src/utils.test.js`:

- **getAnalyticsKey** — deterministic djb2 hashing for localStorage keys
- **computeAnalytics** — event aggregation, CTR, sparkline binning, platform breakdown
- **encodeProfile / decodeProfile** — Base64 roundtrip with unicode support
- **getAvatarUrl** — priority-based avatar resolution (GitHub > Twitter > Instagram)
- **buildVCardLines** — vCard 3.0 generation with field validation

## Project Structure

```
src/
  TapIn.jsx      # Main React app (all UI components)
  utils.js       # Extracted pure utilities (analytics, encoding, vCard)
  utils.test.js  # 38 unit tests
  main.jsx       # Entry point
public/
  widget.js      # Embeddable Follow All widget
  embed.html     # Widget documentation
  nfc.html       # NFC tag writer
  producthunt.html # Pre-launch page
```

## Live

[tapin-bay.vercel.app](https://tapin-bay.vercel.app)
