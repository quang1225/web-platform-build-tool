import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const { GenerateSW } = require("workbox-webpack-plugin");
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
// @ts-ignore
import DeadCodePlugin from "webpack-deadcode-plugin";
// @ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  ProvidePlugin,
} from "webpack";
import { WebpackBlockProps } from "../../../types";
import getMicroFrontendConfig from "../utils/getMicroFrontendConfig";
import { DefaultFolderName, resolveApp } from "../../../utils/defaultPaths";

const isBundleAnalyze = parseInt(process.env.BUNDLE_ANALYZE ?? "0", 10) === 1;
let isDevServerStarted = false;

const enableTypescript = fs.existsSync(
  path.resolve(process.cwd(), "tsconfig.json")
);

export default (configProps: WebpackBlockProps): Configuration["plugins"] => {
  const { env, isDev, paths, cliConfig } = configProps;
  const { devSSL, appInput, appOutput, enableServiceWorker } = cliConfig;
  const { publicDir = DefaultFolderName.PUBLIC_DIR, appHtml = paths.appHtml } =
    appInput || {};
  const { publicPath = paths.publicPath, indexHtml } = appOutput || {};
  const { publicUrl = paths.publicUrl } = indexHtml || {};

  const appName = path.basename(paths.appDirectory);

  return [
    ...(isDev
      ? [
          new ReactRefreshPlugin(),
          new HotModuleReplacementPlugin(),
          {
            apply: (compiler: any) => {
              compiler.hooks.done.tap("DonePlugin", () => {
                if (isDevServerStarted) return;

                const devServerOptions = compiler.options.devServer;

                if (devServerOptions) {
                  const port = devServerOptions.port;
                  const domain = devSSL?.hostname
                    ? `https://${devSSL.hostname}`
                    : "http://localhost";

                  if (port === 443) {
                    console.info(`
                          \n"${chalk.green(
                            appName
                          )}" is running on "${chalk.cyan(domain)}"...
                        `);
                  } else {
                    console.info(`
                          \n"${chalk.green(
                            appName
                          )}" is running on "${chalk.cyan(
                      `${domain}:${port}`
                    )}"...
                        `);
                  }

                  isDevServerStarted = true;
                }
              });
            },
          },
        ]
      : [
          new DeadCodePlugin({
            patterns: [`${paths.appSrc}/**/*.*`],
            exclude: [
              `${paths.appSrc}/**/types/**`,
              `${paths.appSrc}/**/mocks/**`,
              `${paths.appSrc}/**/*.test.*`,
              `${paths.appSrc}/**/test-*.*`,
              `${paths.appSrc}/**/*.json`,
              `${paths.appSrc}/**/types.ts`,
              `${paths.appSrc}/**/*.types.ts`,
              `${paths.appSrc}/**/*.d.ts`,
            ],
            detectUnusedExport: false,
          }),
          ...(isBundleAnalyze
            ? [
                new BundleAnalyzerPlugin({
                  analyzerMode: "static",
                  reportFilename: "../bundle_analyzer_report.html",
                  openAnalyzer: false,
                }),
              ]
            : []),
          new MiniCssExtractPlugin({
            filename: `${DefaultFolderName.STATIC_DIR}/[name].[contenthash].css`,
            chunkFilename: `${DefaultFolderName.STATIC_DIR}/[name].[contenthash].css`,
          }),
          new CopyWebpackPlugin({
            patterns: [
              {
                from: publicDir,
                to: `${paths.appBuild}${publicPath}`,
                globOptions: {
                  ignore: [resolveApp(appHtml)],
                },
                noErrorOnMissing: true,
              },
            ],
          }),
          ...(enableServiceWorker
            ? [
                new GenerateSW({
                  directoryIndex: `${DefaultFolderName.BUILD_DIR}${publicPath}`,
                  dontCacheBustURLsMatching: /\.\w{8}\./,
                  swDest: `.${publicPath}service-worker.js`,
                  navigateFallback: `${publicPath}index.html`,
                  runtimeCaching: [
                    {
                      urlPattern: /\/config\.json/,
                      handler: "NetworkFirst",
                      options: {
                        cacheName: "runtime-config-cache",
                        networkTimeoutSeconds: 10,
                        expiration: {
                          maxEntries: 50,
                          maxAgeSeconds: 24 * 60 * 60, // 1 day
                        },
                      },
                    },
                  ],
                  clientsClaim: true,
                  skipWaiting: true,
                }),
              ]
            : []),
        ]),
    ...(enableTypescript ? [new ForkTsCheckerWebpackPlugin()] : []),
    new DefinePlugin(env.stringified),
    new ProvidePlugin({
      process: "process/browser",
    }),
    ...getMicroFrontendConfig(configProps),
    new HtmlWebpackPlugin({
      template: resolveApp(appHtml),
      hash: true,
      inject: true,
      templateParameters: env.raw,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
      publicPath: publicUrl + paths.publicPath,
    }),
  ];
};
