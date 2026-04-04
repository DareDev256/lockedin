# TapIn

One-tap connection card — share all your socials with a single link. NFC-ready, embeddable, zero backend.

## Features

- **60+ platforms** across 13 categories (social, video, music, gaming, developer, creator, shopping, payment, booking, messaging, portfolio, podcast, website)
- **5 action modes** — Follow, Connect, DM, Book, Pay
- **Auto-select feed embeds** — automatically picks the richest embed format per platform (see below)
- **Follow All** — one tap opens every connected platform with staggered timing
- **Analytics dashboard** — views, clicks, CTR, 7-day sparkline, platform breakdown (localStorage-backed)
- **Profile encoding** — Base64 URL hash for zero-backend profile sharing
- **vCard export** — download contact card with all socials and custom links
- **Embeddable widget** — drop `widget.js` into any page
- **NFC writer** — program NFC tags with your TapIn link
- **5 themes** — Midnight, Ocean, Sunset, Neon, Minimal
- **PWA** — installable, works offline
- **Viral growth loop** — post-follow CTA banner

## Auto-Select Feed Embeds

Every connected platform gets a live feed panel in dashboard mode. The **Auto Embed** system (`feedType: "auto"`) inspects the platform and selects the best visual format — no manual configuration needed.

| Platform | Auto-selected embed |
|---|---|
| **GitHub** | Contribution chart (via ghchart) + profile link |
| **YouTube** | Inline video player (iframe) — detects video IDs and channel handles |
| **Spotify** | Artist player embed (dark theme) |
| **Twitch** | Live channel player (muted by default) |
| **Twitter/X** | Profile card with follow CTA |
| **Instagram** | Avatar + gradient follow button |
| **All others** | Icon + handle + visit link card |

### Manual overrides

Users can override auto-select per-platform via the feed config editor:

| Feed type | Config fields | Description |
|---|---|---|
| `auto` | — | Platform-aware smart embed (default) |
| `image` | `imageUrl`, `caption` | Static image with optional caption |
| `video_thumbnail` | `videoUrl`, `thumbnailUrl`, `caption` | Video thumbnail or inline YouTube player |
| `text_card` | `textContent` | Styled text block with platform accent |
| `custom_embed` | `embedUrl` | Any iframe URL |

Set `showInFeed: false` on any platform to hide it from the dashboard feed.

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
  TapIn.jsx      # Main React app (all UI components, feed auto-select logic)
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
