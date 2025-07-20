## Overview

A build tool CLI for simplifying and streamlining the build process for internal frontend projects in the Grab Taxi company, speed up build time and optimize performance. Support the Micro Frontend and make the dev experience smoother.

## RFC

[https://docs.google.com/document/d/1vrBsNyWoT91lkBWPt5pkej3dd15VhO8lCYshSjnuIbU](https://docs.google.com/document/d/1vrBsNyWoT91lkBWPt5pkej3dd15VhO8lCYshSjnuIbU)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Steps for local development](#steps-for-local-development)

## Install

- Setup @web-platform component registry using a `.npmrc` file.

- Install the package:

```bash
npm install @web-platform/build-tool
```

or

```bash
yarn add @web-platform/build-tool
```

## Usage

### Command Structure

```bash
web-platform-build-tool <action>
```

### Supported Bundlers

- rspack (default)
- webpack

### Supported Actions

| Action  | Description                               |
| ------- | ----------------------------------------- |
| `build` | Builds the ReactJS app for production     |
| `serve` | Starts the ReactJS app using build folder |
| `start` | Starts the ReactJS app in developer mode  |

## Steps for local development

- Require to install this `@web-platform/build-tool` CLI package in the app first
- Run `yarn link` in CLI's root folder
- Run `yarn link @web-platform/build-tool` in app's root folder to link the package to this local CLI folder
