# Next.js Weather App <!-- omit in toc -->

⛈ A simple weather app using the both the [National Weather Service API](https://weather-gov.github.io/api/general-faqs) and [Google Maps API](https://developers.google.com/maps/documentation/geocoding/overview).

👉 <https://localwx.vercel.app/>

---

## Table of Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Install](#install)
  - [Set ENV Variable](#set-env-variable)
- [Working with Next.js](#working-with-nextjs)
  - [Folder Structure](#folder-structure)
  - [NPM Scripts](#npm-scripts)

---

## Prerequisites

First, you'll need to generate a [Google Maps API Key](https://developers.google.com/maps/documentation/geocoding/get-api-key).

Once you've generated a key, visit the [Credentials page](https://console.cloud.google.com/apis/credentials) and follow the instructions below:

1. Set application restrictions to "None"
2. Select "Restrict key"
3. Choose "Geocoding" from the dropdown
4. Save

![screenshot of google api settings](https://dl.dropbox.com/s/56yhq22gvdip9gf/Screen%20Shot%202022-01-10%20at%2012.50.11.png?dl=0)

---

## Install

Use [create-next-app](https://www.npmjs.com/package/create-next-app) to get up and running quickly:

```bash
npx create-next-app nextjs-weather --example https://github.com/gregrickaby/nextjs-weather
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
├── pages
|  ├── api
|  |  ├── geocoding.js
|  |  └── weather.js
|  ├── _app.js
|  ├── _document.js
|  └── index.js
├── public
|  ├── favicon.ico
|  ├── logo.webp
├── styles
|  └── globals.css
├── .env.sample
├── .eslintrc.json
├── .gitignore
├── package-lock.json
├── package.json
├── postcss.config.js
├── next.config.js
├── tailwind.config.js
```

**Pages** - This folder contains standard Next.js pages and `/api` middleware routes.

**Public** - This folder contains all of the static assets.

**Styles** - This folder contains styles.

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
