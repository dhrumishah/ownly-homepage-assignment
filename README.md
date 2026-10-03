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

- **Section order follows the Figma**, not the brief's numbered steps.
- **Both curated rails share one fixture**, so `mockApi` splits it by rank to avoid
    duplicate rows.
- **Controls without backing data** (Veg chip, VEG toggle, price-mode switch, search)
    render and hold state but filter nothing.
- **Fake latency in `mockApi.ts`** keeps the loading state visible. The flow is
    sequential (gate → config → rest), adding ~700 ms before content appears.
- **"Under 30 mins" matches nothing** - the fastest restaurant is 31 mins, so it shows
    the empty state. Sort, Rating 4+ and Under ₹200 filter the live list.
- **The header address is Figma placeholder copy** - fixture addresses belong to
    restaurants, not the user.
