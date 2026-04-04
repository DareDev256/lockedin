# Changelog

## [5.1.1] - 2026-04-04

### Added
- README documentation for Auto-Select Feed Embeds feature
  - Platform-to-embed mapping table (GitHub charts, YouTube players, Spotify embeds, etc.)
  - Manual override reference (image, video_thumbnail, text_card, custom_embed)
  - Feed config parameters and `showInFeed` toggle
- Updated project structure description to reference feed auto-select logic

## [5.1.0] - 2026-04-04

### Added
- Test infrastructure with Vitest
- `src/utils.js` — extracted pure utility functions for testability
- `src/utils.test.js` — 38 unit tests covering:
  - `getAnalyticsKey`: determinism, collision avoidance, empty/missing inputs
  - `computeAnalytics`: CTR calculation, division-by-zero guard, sparkline binning, platform aggregation, event type classification
  - `encodeProfile`/`decodeProfile`: roundtrip integrity, unicode support, empty handle stripping, garbage input handling, default theme fallback
  - `getAvatarUrl`: priority chain (GitHub > Twitter > Instagram), null fallback
  - `buildVCardLines`: vCard 3.0 structure, field omission, empty handle/URL filtering, default label fallback
- `npm test` and `npm run test:watch` scripts
- README.md with project documentation
- CHANGELOG.md

## [5.0.0] - 2026-03-31

### Added
- Analytics dashboard with animated counters, sparkline, platform breakdown
- Viral growth loop banner (post-follow CTA)
- Product Hunt pre-launch page

## [4.1.0] - 2026-03-31

### Added
- Embeddable widget (`widget.js`)
- NFC tag writer page
- Embed documentation

## [4.0.0] - 2026-03-30

### Added
- 60+ platforms across 13 categories
- Customizable feed panels (5 types)
- Custom links feature
- Editor tabs reorganization

## [3.0.0] - 2026-03-30

### Added
- Landing page, create-your-own flow
- 5 themes, PWA support

## [2.0.0] - 2026-03-30

### Added
- Dashboard mode, live social feeds

## [1.0.0] - 2026-03-30

### Added
- Initial one-tap connection card
