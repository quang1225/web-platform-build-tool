import path from "path";
import fs from "fs-extra";
import { Configuration, CssExtractRspackPlugin } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";
import defaultPaths from "../../../utils/defaultPaths";
import getGitSshPackages from "../../../utils/getGitSshPackages";

const includeRoot = [defaultPaths.appDirectory, defaultPaths.packagesRoot];

const gitSshPackages = getGitSshPackages();

const enableTailwindCSS = fs.existsSync(
  path.resolve(process.cwd(), "tailwind.config.js")
);

const {
  version: reactVersion,
} = require(`${defaultPaths.appNodeModules}/react/package.json`);
const [major] = reactVersion.split(".").map(Number);
const isReact17OrHigher = major >= 17;

export default ({
  isDev,
  cliConfig,
  paths,
}: WebpackBlockProps): Configuration["module"] => {
  const {
    microFE,
    extendStaticFileExtensions,
    lessVars = {},
    useStyleModules,
    legacyCommonjsPackages = [],
    plugins = {},
    useSVGR,
  } = cliConfig;

  const microFeAppName = microFE?.appName;

  const styleLoader = isDev ? "style-loader" : CssExtractRspackPlugin.loader;

  const cssLoader = (isModules = false) =>
    isModules
      ? {
          loader: "css-loader",
          options: {
            importLoaders: 2,
            modules: {
              namedExport: false, // restore v6.x default behavior (import styles from '...')
              exportLocalsConvention: "as-is", // restore v6.x default behavior (styles.logo__image)
              localIdentName: `${
                microFeAppName ? `${microFeAppName}-` : ""
              }[name]__[local]__[hash:base64:5]`,
            },
            sourceMap: !isDev,
          },
        }
      : "css-loader";

  const postCssLoader = {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: {
          autoprefixer: {},
          ...(enableTailwindCSS ? { "@tailwindcss/postcss": {} } : {}),
          ...plugins.postcssLoader,
        },
      },
    },
  };

  const lessLoader = {
    loader: "less-loader",
    options: {
      sourceMap: !isDev,
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: lessVars,
        math: "always",
      },
    },
  };

  const sassLoader = {
    loader: "sass-loader",
    options: {
      sourceMap: !isDev,
    },
  };

  return {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          ...includeRoot,
          ...(gitSshPackages.length
            ? [new RegExp(`node_modules/(${gitSshPackages.join("|")})`)]
            : []),
        ],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: plugins.babelLoader,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: gitSshPackages.length
          ? [new RegExp(`node_modules/(${gitSshPackages.join("|")})`)]
          : [],
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: isReact17OrHigher ? "automatic" : "classic",
                  development: isDev,
                  refresh: isDev,
                },
              },
            },
          },
        },
      },
      ...(legacyCommonjsPackages.length
        ? [
            {
              test: /\.(js|jsx)$/,
              include: new RegExp(
                `node_modules/(${legacyCommonjsPackages.join("|")})`
              ),
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        modules: "commonjs",
                      },
                    ],
                    "@babel/preset-react",
                  ],
                  plugins: ["@babel/plugin-transform-runtime"],
                },
              },
            },
          ]
        : []),
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  runtime: isReact17OrHigher ? "automatic" : "classic", // JSX/TSX Transpilation
                  development: isDev,
                  refresh: isDev,
                },
              },
              experimental: {
                plugins: plugins.swcLoader,
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [styleLoader, cssLoader(), postCssLoader],
        type: "javascript/auto",
      },
      {
        test: /\.less$/,
        include: includeRoot,
        exclude: /node_modules/,
        use: [
          styleLoader,
          cssLoader(useStyleModules),
          postCssLoader,
          lessLoader,
        ],
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [styleLoader, cssLoader(), lessLoader],
      },
      {
        test: /\.scss$/,
        include: includeRoot,
        exclude: /node_modules/,
        use: [
          styleLoader,
          cssLoader(useStyleModules),
          postCssLoader,
          sassLoader,
        ],
      },
      {
        test: /\.scss$/,
        include: /node_modules/,
        use: [styleLoader, cssLoader(), sassLoader],
      },
      {
        test: new RegExp(`\\.(png|jpg|jpeg|bmp|ico|gif)$`),
        type: "asset",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
      },
      ...(useSVGR?.enabled
        ? [
            {
              test: /\.svg$/i,
              exclude: useSVGR?.excludePackages?.length
                ? new RegExp(
                    `node_modules/(${useSVGR.excludePackages.join("|")})`
                  )
                : undefined,
              issuer: /\.[jt]sx?$/,
              use: ["@svgr/webpack"],
            },
            ...(useSVGR?.excludePackages?.length
              ? [
                  {
                    test: /\.svg$/i,
                    include: new RegExp(
                      `node_modules/(${useSVGR.excludePackages.join("|")})`
                    ),
                    type: "asset",
                    generator: {
                      filename: "assets/images/[hash][ext][query]",
                    },
                  },
                ]
              : []),
          ]
        : [
            {
              test: /\.svg$/i,
              type: "asset",
              generator: {
                filename: "assets/images/[hash][ext][query]",
              },
            },
          ]),
      {
        test: /\.(webm|mp4|mov)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/videos/[hash][ext][query]",
        },
      },
      {
        test: /\.(mp3|wav|ogg|flac|aac)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/sounds/[hash][ext][query]",
        },
      },
      ...(extendStaticFileExtensions?.length
        ? [
            {
              test: new RegExp(`\\.(${extendStaticFileExtensions.join("|")})$`),
              type: "asset/resource",
              generator: {
                filename: "assets/static/[hash][ext][query]",
              },
            },
          ]
        : []),
      {
        test: /\.gql$/,
        exclude: /node_modules/,
        use: "graphql-tag/loader",
      },
      {
        test: /(?!index\b)\b\w+\.(html)$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
      },
      {
        test: /config\.json$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /locales.*\.json$/,
        type: "asset/resource",
        generator: {
          filename: "assets/locales/[hash][ext][query]",
        },
      },
    ],
  };
};
