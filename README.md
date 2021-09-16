# Next.js Weather App <!-- omit in toc -->

⛈ A simple weather app using the both the [National Weather Service API](https://weather-gov.github.io/api/general-faqs) and [Google Maps API](https://developers.google.com/maps/documentation/geocoding/overview).

👉 <https://weather-flame-alpha.vercel.app/>

---

## Table of Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Install](#install)
  - [Set ENV Variables](#set-env-variables)
- [Working with Next.js](#working-with-nextjs)
  - [Folder Structure](#folder-structure)
  - [NPM Scripts](#npm-scripts)

---

## Prerequisites

1. [Google Maps API Key](https://developers.google.com/maps/documentation/geocoding/get-api-key)

---

## Install

Use [create-next-app](https://www.npmjs.com/package/create-next-app) to get up and running quickly:

```bash
npx create-next-app nextjs-weather --example https://github.com/gregrickaby/nextjs-weather
```

### Set ENV Variables

Create an `.env` file (or rename `.env.sample` to `.env`) in the root of the project.

Add your keys to the following vars:

```bash
GOOGLE_MAPS_API_KEY="YOUR-KEY"
```

---

## Working with Next.js

### Folder Structure

```text
├── pages
|  ├── _app.js
|  ├── _document.js
|  ├── api
|  |  ├── geocoding.js
|  |  └── weather.js
|  └── index.js
├── public
├── styles
|  └── globals.css
```

**Pages** - This folder contains standard Next.js pages and API middleware routes.

**Public** - This folder contains all of the static assets.

**Styles** - This folder contains styles.

---

### NPM Scripts

Start local dev server:

```bash
npm run dev
```

Test a build prior to deployment:

```bash
npm run build && npm start
```

---
