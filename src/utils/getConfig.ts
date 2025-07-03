import chalk from "chalk";
import fs from "fs-extra";
import { CliConfigProps, WebPlatformBuildToolConfig } from "../types";
import path from "path";
import defaultPaths from "./defaultPaths";
import getClientEnvironment from "./getClientEnvironment";

export const BUILD_TOOL_CONFIG_KEY = "buildToolConfig";
export const CONFIG_FILE_NAME = "web-platform.config.ts";
export const CLI_CONFIG_KEY = "CLI_CONFIG";

const getConfig = (
  isDev = process.env.NODE_ENV !== "production"
): WebPlatformBuildToolConfig => {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE_NAME);

  let config: WebPlatformBuildToolConfig | undefined = undefined;

  const storedConfig = process.env[CLI_CONFIG_KEY];
  if (storedConfig) {
    config = JSON.parse(storedConfig) as WebPlatformBuildToolConfig;
    return config;
  }

  try {
    if (!fs.existsSync(configPath)) {
      throw new Error("Configuration file not found");
    }

    try {
      require.resolve("ts-node");
      require("ts-node").register({
        transpileOnly: true,
        compilerOptions: {
          module: "commonjs",
          target: "es2015",
          moduleResolution: "node",
        },
      });
    } catch (e) {
      throw new Error(
        "ts-node is not installed. Please install ts-node as a dev dependency: npm install -D ts-node"
      );
    }

    const configModule = require(configPath).default;

    if (typeof configModule !== "function") {
      throw new Error("Configuration file should export a function");
    }

    const env = getClientEnvironment();

    config = configModule({
      paths: defaultPaths,
      isDev,
      env,
    } as CliConfigProps)[BUILD_TOOL_CONFIG_KEY];

    if (!config) {
      throw new Error(
        `No ${BUILD_TOOL_CONFIG_KEY} configuration key found in the config file.`
      );
    }

    const { appOutput } = config;
    const { publicPath, indexHtml } = appOutput || {};
    const { publicUrl } = indexHtml || {};

    if (publicPath && publicPath !== "/" && publicPath.endsWith("/")) {
      console.error(
        chalk.red(
          'Error: publicPath should not end with "/". Received: ' + publicPath
        )
      );
      console.error(
        chalk.yellow(
          `Please update the ${chalk.cyan(
            "appOutput.publicPath"
          )} config in ${chalk.cyan(
            CONFIG_FILE_NAME
          )} to remove the last trailing slash`
        )
      );
      process.exit(1);
    }

    if (publicUrl && publicUrl.endsWith("/")) {
      console.error(
        chalk.red(
          'Error: publicUrl should not end with "/". Received: ' + publicUrl
        )
      );
      console.error(
        chalk.yellow(
          `Please update the ${chalk.cyan(
            "appOutput.indexHtml.publicUrl"
          )} config in ${chalk.cyan(
            CONFIG_FILE_NAME
          )} to remove the last trailing slash`
        )
      );
      process.exit(1);
    }
  } catch (err: any) {
    console.error(chalk.red(`Error: ${err.message}`));
    console.error(
      chalk.yellow(
        `Please ensure ${chalk.cyan(
          CONFIG_FILE_NAME
        )} file exists in the app's root directory and exports a function that returns an object with a ${chalk.cyan(
          BUILD_TOOL_CONFIG_KEY
        )} key.`
      )
    );
    process.exit(1);
  }

  process.env[CLI_CONFIG_KEY] = JSON.stringify(config);

  return config;
};

export default getConfig;
