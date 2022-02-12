# Local Weather <!-- omit in toc -->

⛈ A weather app using Next.js, [Mantine UI](https://mantine.dev/) and both the [National Weather Service API](https://weather-gov.github.io/api/general-faqs) and [Google Maps API's](https://developers.google.com/maps/documentation/geocoding/overview).

👉 <https://localwx.vercel.app/>

---

## Table of Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Install](#install)
  - [Set ENV Variable](#set-env-variable)
- [Working with Next.js](#working-with-nextjs)
  - [Folder Structure](#folder-structure)
  - [NPM Scripts](#npm-scripts)
- [Contributing](#contributing)

---

## Prerequisites

First, you'll need to generate a [Google Maps API Key](https://developers.google.com/maps/documentation/geocoding/get-api-key).

After you've generated a key, visit the [Credentials page](https://console.cloud.google.com/projectselector2/google/maps-apis/credentials) and follow the instructions below:

1. Set application restrictions to "None"
2. Select "Restrict key"
3. Choose "Geocoding" and "Places" from the dropdown
4. Save

![screenshot of google api settings](https://uc3fbe0e54e3664b3207f1984fed.previews.dropboxusercontent.com/p/thumb/ABe-Gfyc2tMfBfhBTQ9UX603fTf-5qEE91YZCqEpJQNKzdFhnpU8alHs0SU8sZhWkk0N1NgGXpDkW4JmWpOksWLbAackO8uatlunZXH9z6XnVukMTZO2_k7L2JDc17YxuxuJcllPgaToZqVtUGWW_Gl8sCu9HC1f5qPwZEB8u_-Znfw14IV612OIoaAwhv97WuFyt6zqIRLQgvP68MN9OFN6_c2muXj394z-klQzeX25zENZQu2Uk9KX4HxY9PFIoxGshNIWfDTgjVrBOfHexzEKpft4TZ5tRWN2IPyhipnYnJSPIk_R8c2rf0Y--y8UQmAXIV2T77Z3JquZERQQNLQCztf2sTWt789wJYehM7OPnl6ysfT5bh8VQSwPqaz9EUQ/p.png)

---

## Install

Use [create-next-app](https://www.npmjs.com/package/create-next-app) to get up and running quickly:

```bash
npx create-next-app local-weather --example https://github.com/gregrickaby/local-weather
```

### Set ENV Variable

Rename `.env.sample` to `.env` in the root of the project. Add the Google Maps API key you generated earlier to the following ENV Var:

```text
GOOGLE_MAPS_API_KEY="YOUR-KEY"
```

---

## Working with Next.js

### Folder Structure

```text
├── components
|  ├── Alerts.tsx
|  ├── Footer.tsx
|  ├── Forecast.tsx
|  ├── etc...
├── lib
|  ├── fetcher.ts
|  ├── useWeather.ts
|  ├── usePlaces.ts
├── pages
|  ├── api
|  |  ├── geocoding.ts
|  |  ├── places.ts
|  |  └── weather.ts
|  ├── _app.tsx
|  ├── _document.tsx
|  └── index.tsx
├── public
|  ├── favicon.ico
|  ├── logo.webp
├── types
|  ├── index.ts
├── .env.sample
├── .gitignore
├── package.json
├── next.config.js
├── etc...
```

**Components** - This folder contains React components.

**Lib** - This folder contains internal hooks and function files.

**Pages** - This folder contains standard Next.js pages and `/api` middleware routes.

**Public** - This folder contains all of the static assets.

**Types** - This folder contains all TypeScript interface definitions.

---

### NPM Scripts

Start local dev server:

```bash
npm run dev
```

Lint code:

```bash
npm run lint
```

Test a build prior to deployment:

```bash
npm run build && npm start
```

---

## Contributing

Please see [CONTRIBUTING](./CONTRIBUTING.md) for more information.

---
