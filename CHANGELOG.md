<br/>

# Changelog

## 0.2.8

`2024-06-06`

- 🐞 Fix minor bugs.

## 0.2.7

`2024-05-28`

- ⚙️ Update minor configs.

## 0.2.6

`2024-05-27`

- ⚙️ Remove unsuppoted `buildToolConfig.microFE.consume[].stgURL` config.

## 0.2.5

`2024-05-26`

- 🐞 Fix compatibility with external app (git+ssh://git).

## 0.2.4

`2024-05-25`

- 🐞 Update `overrideType` type from `OverrideType` to `string` to prevent Error: Cannot use import statement outside a module.

## 0.2.3

`2024-05-24`

- support `--dump-config` option to dump rspack/webpack config
- change `overrideType` type from `OverrideType` to `string`

## 0.2.2

`2024-05-23`

- ⚙️ Remove redundant `HotModuleReplacementPlugin` when using `rspack` bundler.
- 🐞 Fix: Cannot find module `memorystorage` error.

## 0.2.1

`2024-05-22`

- ⚙️ Correct `buildToolConfig.plugins` types.
- 🐞 Fix `Option 'bundler' can only be used when 'module' is set to 'preserve' or to 'es2015' or later` error for apps that have the config `moduleResolution: "bundler"` in tsconfig.

## 0.2.0

`2024-05-22`

⚠️ BREAKING CHANGES:

- 🔥 Support Typescript for build tool's config file (both Typescript and non-Typescript projects can use it). Changes: rename `web-platform.config.js` to `web-platform.config.ts`, new example content:

```
import {
  CliConfigProps,
  WebPlatformConfig,
} from '@web-platform/build-tool/src/types';

export default ({ paths, isDev }: CliConfigProps): WebPlatformConfig => ({
  // Your current configs
});
```

## 0.1.7

`2024-05-21`

- 🔥 Optimize start, build time.

## 0.1.6

`2024-05-20`

- 🆕 Support customizing loader's [plugins](https://gitlab.myteksi.net/chroma/web-platform/-/blob/master/modules/build-tool/src/types.ts#L21).
- ⚙️ Update `useSVGR` config.

## 0.1.5

`2024-05-14`

- 🐞 Fix: External packages should not be processed with CSS Modules and SVGR.

## 0.1.4

`2024-04-29`

- 🐞 Fix error with external packages (exports is not defined).

## 0.1.3

`2024-04-24`

- 🔥 Support Tailwind CSS v4.
- 🆕 Add `postcssPlugins` config field for custom PostCSS plugins.
- 🆕 Add `useSVGR` config field for using [SVGR](https://react-svgr.com).

## 0.1.2

`2024-03-07`

- 🆕 Support legacy CommonJS packages.

## 0.1.1

`2024-02-05`

- 🐞 Fix the React Refresh and Hot Module Replacement.

## 0.1.0

`2024-01-04`

- 🔥 Optimize the default bundler’s config for compatibility with most apps.
- 🔥 Support Tailwind CSS.
- 🔥 Support JSX/TSX Transpilation (apps using React 17+ no longer need to include `import React from 'react'` in JSX/TSX files)..
- 🆕 Add `useStyleModules` config to switch between 2 LESS/SCSS import methods: (import styles from 'styles.less') or (import 'styles.less')
- 🐞 Fix setting the Node.js variable in the command (e.g., WEB_APP_PORT=1234).
- 🐞 Fix reading the `config.json` file on STG/PRD.

## 0.0.4

`2024-12-16`

- 🔥 Use `TsCheckerRspackPlugin` with Rspack for faster type checking.

## 0.0.3

`2024-11-19`

- 🆕 Add `enableServiceWorker` config for supporting Service Worker.
- Update config `appEntry` to `appInput.appIndex`.
- 🐞 Fix “grab-ui” package's styles.
- 🐞 Fix "dts-plugin" error in Module Federation.

## 0.0.2

`2024-11-18`

- 🆕 Micro FE (Module Federation) supported.
- 🔥 Both `Rspack` (default) and `Webpack` supported, optimized for fast hot-reload and build time.
