import fs from "fs-extra";
import path from "path";
import defaultPaths from "../../utils/defaultPaths";
import getClientEnvironment from "../../utils/getClientEnvironment";
import { Configuration } from "webpack";
import getConfig from "../../utils/getConfig";
import { OverrideType, WebpackBlockConfigFunction } from "../../types";

const IS_DEV = process.env.NODE_ENV !== "production";
const ENV = getClientEnvironment();

const loadConfig = async () => {
  const cliConfig = getConfig();
  const { overrideWebpack } = cliConfig;
  const defaultConfigsPath = path.join(__dirname, "default-configs");

  const webpackConfigKeys = await fs
    .readdir(defaultConfigsPath)
    .then((files) =>
      files.map((filename) => path.parse(filename).name as keyof Configuration)
    );

  const webpackConfig = webpackConfigKeys.reduce((config, blockname) => {
    const defaultBlockConfigFunc: WebpackBlockConfigFunction =
      require(`./default-configs/${blockname}`).default;

    const defaultBlockConfig = defaultBlockConfigFunc({
      env: ENV,
      isDev: IS_DEV,
      paths: defaultPaths,
      cliConfig,
    });

    const webpackOverrideBlockConfig = overrideWebpack?.[blockname];

    if (
      !webpackOverrideBlockConfig ||
      (typeof webpackOverrideBlockConfig !== "object" &&
        typeof webpackOverrideBlockConfig !== "string")
    ) {
      config[blockname] = defaultBlockConfig;
      return config;
    }

    if (typeof webpackOverrideBlockConfig === "string") {
      config[blockname] = webpackOverrideBlockConfig as any;
      return config;
    }

    const {
      overrideType = OverrideType.APPEND,
      pluginArray,
      ...overrideBlockConfig
    } = webpackOverrideBlockConfig;

    const isArrayBlock = Array.isArray(defaultBlockConfig);

    if (overrideType === OverrideType.OVERWRITE) {
      config[blockname] =
        isArrayBlock && pluginArray
          ? pluginArray
          : (webpackOverrideBlockConfig as any);
      return config;
    }

    if (isArrayBlock && pluginArray) {
      config[blockname] = defaultBlockConfig.concat(
        pluginArray.map((pluginFunc) => pluginFunc())
      ) as any;
      return config;
    }

    config[blockname] = { ...defaultBlockConfig, ...overrideBlockConfig };
    return config;
  }, {} as Configuration);

  return {
    bail: true,
    recordsPath: `${defaultPaths.appDirectory}/records.json`,
    ...webpackConfig,
  } as Configuration;
};

export default loadConfig();
