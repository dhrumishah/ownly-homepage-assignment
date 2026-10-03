# Ownly - Homepage

Food-delivery homepage built from the shared Figma, rendered from the supplied
fixture pack. No backend. Images load from the URLs in the fixtures, so the app
needs a network connection.

## Deployed link for web
[Deployed link](https://ownly-assignment-dhrumi-fwwd77v3m-dhrumishahs-projects.vercel.app/)

## Screen Recording
[Drive](https://drive.google.com/file/d/1HgBUzStphxtArQJs0ohvytEJDCKcPrsY/view?usp=sharing)

## Run

```bash
npm install
npm start          # scan the QR with Expo Go
```

`npm run ios` / `npm run android` for simulators, `npm run web` for the browser.

Set `FORCE_NOT_SERVICEABLE = true` in `src/api/mockApi.ts` to see the blocked state.

## Assumptions

-  ⁠*Section order follows the Figma*, not the brief's numbered steps — the two
  disagree on where the cuisine row goes, and fidelity is the first criterion.
- ⁠*Both curated rails resolve to the same fixture*, so ⁠ mockApi ⁠ slices it by rank
  to avoid two identical rows.
- ⁠*The fixture calls are given a fake delay totalling ~700 ms across the three sequential load stages* (⁠ mockApi.ts ⁠), otherwise the
  loading states resolve instantly and can't be seen.
- ⁠*"Under 30 mins" matches nothing* — the fastest restaurant is 31 mins. The filter
  is correct; it exercises the empty state. Sort, Rating 4+ and Under ₹200 all filter
- *Controls the data can't drive* — the Veg chip, header VEG toggle, price-mode
  switch and search field are in the Figma, so they render and respond to touch, but
  nothing in the fixtures backs them. They hold their state and filter nothing.
- ⁠*The header address is the Figma's placeholder copy* — every ⁠ address ⁠ in the
  fixtures belongs to a restaurant, not to a user.
