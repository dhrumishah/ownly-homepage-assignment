# Ownly 0 Homepage

Food-delivery homepage built from the shared Figma, rendered from the supplied
fixture pack. No backend. Images load from the URLs in the fixtures, so the app
needs a network connection.

## Run

```bash
npm install
npm start          # scan the QR with Expo Go
```

`npm run ios` / `npm run android` for simulators, `npm run web` for the browser.
The design is a 390 px frame, so an iPhone 14/15-class device matches it 1:1.

Set `FORCE_NOT_SERVICEABLE = true` in `src/api/mockApi.ts` to see the blocked state.

## Assumptions

- **Section order follows the Figma**, not the brief's numbered steps - the two
  disagree on where the cuisine row goes, and fidelity is the first criterion.
- **Both curated rails resolve to the same fixture**, so `mockApi` slices it by rank
  to avoid two identical rows.
- **Titles come from fixture data** where the fixtures carry one. Two don't:
  `reOrderConfig.name` is an empty string, so "Order Again!" falls back to the
  Figma's label, and "All restaurants" has no config entry at all.
- **The fixture calls are given a fake 650 ms delay** (`mockApi.ts`), otherwise the
  loading states resolve instantly and can't be seen.
- **No pagination** - the feed holds 10 records with `TotalCount: 10`.
- **"Under 30 mins" matches nothing** - the fastest restaurant is 31 mins. The filter
  is correct; it exercises the empty state. Sort, Rating 4+ and Under ₹200 all filter
  the live list.
- **Controls the data can't drive** - the Veg chip, header VEG toggle, price-mode
  switch and search field are in the Figma, so they render and respond to touch, but
  nothing in the fixtures backs them. They hold their state and filter nothing.
- **No carousel dots** on the listing card - the feed gives one image per restaurant.
- **Strike-through prices** render only when `price > displayPrice`, which this
  fixture never has.
