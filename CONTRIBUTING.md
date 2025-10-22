# Contributing <!-- omit in toc -->

Here are the ways to get involved with this project:

- [Issues \& Discussions](#issues--discussions)
- [Contributing Code](#contributing-code)
  - [Install Locally](#install-locally)
  - [Git Workflow](#git-workflow)
  - [NPM Scripts](#npm-scripts)
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

### Git Workflow

1. Fork the repo and create a feature/patch branch off `main`
2. Work locally adhering to coding standards
3. Run `npm run lint && npm run typecheck`
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

```bash
npm run typecheck
```

Test a build prior to deployment:

```bash
npm run build && npm start
```

---

## Legal Stuff

This repo is maintained by [Greg Rickaby](https://gregrickaby.com/). By contributing code you grant its use under the [MIT](https://github.com/gregrickaby/local-weather/blob/main/LICENSE).

---
