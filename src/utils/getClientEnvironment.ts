import getAppVersion from "./getAppVersion";
import defaultPaths from "./defaultPaths";
import getConfig from "./getConfig";

const WEB_APP = /^WEB_APP_/i;

type EnvironmentVariables = Record<string, any>;

type StringifiedEnv = Record<string, any>;

export type ClientEnvironment = {
  raw: EnvironmentVariables;
  stringified: StringifiedEnv;
};

const config = getConfig?.();
const { appOutput } = config || {};
const { publicPath = defaultPaths.publicPath, indexHtml } = appOutput || {};
const { publicUrl = defaultPaths.publicUrl } = indexHtml || {};

function getClientEnvironment(): {
  raw: EnvironmentVariables;
  stringified: StringifiedEnv;
} {
  const raw: EnvironmentVariables = Object.keys(process.env)
    .filter((key) => WEB_APP.test(key))
    .reduce(
      (env, key) => {
        return {
          ...env,
          [key]: process.env[key],
        };
      },
      {
        NODE_ENV: process.env.NODE_ENV || "development",
        PUBLIC_URL: publicUrl + (publicPath === "/" ? "" : publicPath),
        WEB_APP_HOST: "0.0.0.0",
        WEB_APP_PORT: "443",
        APP_VERSION:
          process.env.NODE_ENV === "development" ? "dev" : getAppVersion(),
      }
    );

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified: StringifiedEnv = {
    "process.env": Object.keys(raw).reduce(
      (env, key) => ({
        ...env,
        [key]: JSON.stringify(raw[key]),
      }),
      {}
    ),
  };

  return { raw, stringified };
}

export default getClientEnvironment;
