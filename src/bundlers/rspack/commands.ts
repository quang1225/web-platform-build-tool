#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path";
import chalk from "chalk";
import cliPaths from "../../utils/cliPaths";
import getConfig from "../../utils/getConfig";
import { CommandOptions, CommandsInterface } from "../../types";
import defaultPaths from "../../utils/defaultPaths";
import fs from "fs-extra";

import loadWebpackConfig from "./rspack.config";

let webpackConfigPath = path.resolve(
  cliPaths.cliDistBundlers,
  "rspack/rspack.config.js"
);

const appName = path.basename(defaultPaths.appDirectory);
const config = getConfig();
const { devSSL, profile = "" } = config;

if (profile.endsWith(".js")) {
  webpackConfigPath = profile;
}

const runNodeCommand = (cmd: string) => {
  try {
    const childProcess = spawn(cmd, [], {
      stdio: "inherit",
      shell: true,
    });

    childProcess.on("error", (error: Error) => {
      console.error(chalk.red(`Error running command: ${error.message}`));
    });

    childProcess.on("close", (code: number) => {
      if (code !== 0) {
        console.error(chalk.red("Command exited with non-zero code:", code));
      }
    });
  } catch (error: any) {
    console.error(chalk.red(`Error running node script: ${error.message}`));
    process.exit(1);
  }
};

const dumpConfiguration = async () => {
  console.log(chalk.cyan("\nCurrent Configuration:"));
  console.log(JSON.stringify(config, null, 2));
  console.log(chalk.cyan("\nUsing config path:"), webpackConfigPath);

  // Load and log the webpack config result
  const configResult = await loadWebpackConfig;

  // Write the config to a file
  const dumpFilePath = path.resolve(
    defaultPaths.appDirectory,
    "./rspack.dump.config.js"
  );
  await fs.writeFile(
    dumpFilePath,
    `module.exports = ${JSON.stringify(configResult, null, 2)};`
  );

  console.log(chalk.green(`\nRspack configuration dumped to: ${dumpFilePath}`));
};

const start = async (options?: CommandOptions) => {
  if (options?.dumpConfig) {
    await dumpConfiguration();
  }

  runNodeCommand(
    `NODE_ENV=development && ${cliPaths.cliNodeModulesBin}/rspack serve --config=${webpackConfigPath} --mode=development`
  );
};

const build = async (options?: CommandOptions) => {
  if (options?.dumpConfig) {
    await dumpConfiguration();
  }

  runNodeCommand(
    `NODE_ENV=production && ${cliPaths.cliNodeModulesBin}/rspack build --config=${webpackConfigPath} --mode=production`
  );
};

const serve = async (options?: CommandOptions) => {
  if (options?.dumpConfig) {
    await dumpConfiguration();
  }

  if (devSSL) {
    const { hostname, options } = devSSL;

    runNodeCommand(
      `${cliPaths.cliNodeModulesBin}/serve -s -l 443${Object.entries(
        options
      ).reduce((prevStr, [key, value]) => {
        if (value) {
          return prevStr + ` --ssl-${key} ${value}`;
        }
        return prevStr;
      }, "")} build`
    );

    console.info(`
      \n"${chalk.green(appName)}" is running on "${chalk.cyan(
      `https://${hostname}`
    )}"...
    `);
  } else {
    runNodeCommand(`${cliPaths.cliNodeModulesBin}/serve -s build`);
  }
};

const commands: CommandsInterface = { start, build, serve };
export default commands;
