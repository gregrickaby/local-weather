# Contributing <!-- omit in toc -->

Here are the ways to get involved with this project:

- [Issues & Discussions](#issues--discussions)
- [Contributing Code](#contributing-code)
  - [Install Locally](#install-locally)
  - [Generate API Keys](#generate-api-keys)
    - [OpenWeatherMap API](#openweathermap-api)
    - [Google Maps API](#google-maps-api)
    - [ENV Variables](#env-variables)
  - [Git Workflow](#git-workflow)
  - [NPM Scripts](#npm-scripts)
  - [Vercel CLI](#vercel-cli)
- [Legal Stuff](#legal-stuff)

---

## Issues & Discussions

Before submitting your issue, make sure it has not been mentioned earlier. You can search through the [existing issues](https://github.com/gregrickaby/local-weather/issues) or active [discussions](https://github.com/gregrickaby/local-weather/discussions).

---

## Contributing Code

Found a bug you can fix? Fantastic! Patches are always welcome. Here are the steps to get up and running:

### Install Locally

Clone the repo:

```bash
git clone git@github.com:gregrickaby/local-weather.git local-weather
```

Install the dependencies:

```bash
cd local-weather && npm i
```

---

### Generate API Keys

#### OpenWeatherMap API

First, you'll need an [OpenWeatherMap API Key](https://home.openweathermap.org/users/sign_up). If you don't have an account, you can create one for free.

#### Google Maps API

Next, you'll need to generate a [Google Maps API Key](https://developers.google.com/maps/documentation/geocoding/get-api-key).

After you've generated a key, visit the [Credentials page](https://console.cloud.google.com/projectselector2/google/maps-apis/credentials) and follow the instructions below:

1. Set application restrictions to "None"
2. Select "Restrict key"
3. Choose "Geocoding" and "Places" from the dropdown
4. Save

![screenshot of google api settings](https://dl.dropbox.com/s/2vj1qa2l1602prc/Screen%20Shot%202022-02-12%20at%2008.38.25.png?dl=0)

#### ENV Variables

Now add the API keys to `.env.`

Copy `.env.example` to `.env` in the root of the project:

```bash
cp .env.example .env
```

Open `.env` and add your API keys to `.env`

```text
// .env
GOOGLE_MAPS_API_KEY="YOUR-KEY-HERE"
OPENWEATHER_API_KEY="YOUR-KEY-HERE"
```

---

### Git Workflow

1. Fork the repo and create a feature/patch branch off `main`
2. Work locally adhering to coding standards
3. Run `npm run lint`
4. Make sure the app builds locally with `npm run build && npm run start`
5. Push your code, open a PR, and fill out the PR template
6. After peer review, the PR will be merged back into `main`
7. Repeat ♻️

> Your PR must pass automated assertions, deploy to Vercel successfully, and pass a peer review before it can be merged.

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

### Vercel CLI

I've found that running `vercel` locally is a great way to verify Edge Functions and Middleware are working as expected.

To install the [Vercel CLI](https://vercel.com/docs/cli), run:

```bash
npm i -g vercel
```

Start a Vercel development server locally:

```bash
vercel dev
```

---

## Legal Stuff

This repo is maintained by [Greg Rickaby](https://gregrickaby.com/). By contributing code you grant its use under the [MIT](https://github.com/gregrickaby/local-weather/blob/main/LICENSE).

---
