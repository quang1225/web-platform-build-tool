#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import {
  ActionEnum,
  ACTIONS,
  BundlerEnum,
  SUPPORTED_BUNDLERS,
  WebPlatformCommandProps,
} from "./types";
import getConfig from "./utils/getConfig";

const DEFAULT_BUNDLER = BundlerEnum.RSPACK;
const program = new Command();
const args = process.argv.slice(2);
let isActionExecuted = false;

async function executeCommand({
  bundler,
  action,
  dumpConfig,
}: WebPlatformCommandProps) {
  try {
    const bundlerModule = (await import(`./bundlers/${bundler}/commands.js`))
      .default;

    if (isActionExecuted) {
      return;
    }

    if (typeof bundlerModule[action] === "function") {
      isActionExecuted = true;
      return bundlerModule[action]({ dumpConfig });
    }

    console.error(
      chalk.red(`Action '${action}' not found in bundler '${bundler}'`)
    );
    process.exit(1);
  } catch (error) {
    console.error(chalk.red(`Error executing bundler: ${bundler}`), error);
    process.exit(1);
  }
}

function showSupportedOptions() {
  console.log(chalk.cyan("\nUsage:"));
  console.log(
    `  ${chalk.green("web-platform-build-tool")} ${chalk.red(
      "<action>"
    )} ${chalk.yellow("[options]")}`
  );

  console.log(chalk.cyan("\nSupported bundlers:"));
  Object.keys(SUPPORTED_BUNDLERS).forEach((bundler) => {
    console.log(chalk.green(`  * ${bundler}`));
  });

  console.log(chalk.cyan("\nSupported commands:"));
  Object.keys(ACTIONS).forEach((command) => {
    console.log(
      `${chalk.green(`  * ${command}: `)} ${
        ACTIONS[command as ActionEnum].description
      }`
    );
  });

  console.log(chalk.cyan("\nOptions:"));
  console.log(
    `${chalk.green("  --dump-config")}: Dump the configuration being used`
  );

  console.log(chalk.cyan("\nExamples:"));
  console.log(chalk.yellow("  $ web-platform-build-tool start"));
  console.log(
    chalk.yellow("  $ web-platform-build-tool test -c custom-test-config.js")
  );
  console.log(chalk.yellow("  $ web-platform-build-tool build --dump-config"));
}

program
  .arguments("<action>")
  // .option("-c, --cliConfig <char>", "Custom path to CLI's configuration file")
  .option("--dump-config", "Dump the configuration being used")
  .action((action: ActionEnum, options) => {
    const { bundler = DEFAULT_BUNDLER } =
      getConfig(action !== ActionEnum.BUILD) || {};

    if (!SUPPORTED_BUNDLERS[bundler as BundlerEnum]) {
      console.error(chalk.red(`\nUnsupported bundler: ${bundler}`));
      showSupportedOptions();
      process.exit(1);
    }

    if (!ACTIONS[action]) {
      console.error(chalk.red(`\nUnknown actions: ${action}`));
      showSupportedOptions();
      process.exit(1);
    }

    executeCommand({
      bundler: bundler as BundlerEnum,
      action,
      dumpConfig: !!options.dumpConfig,
    });
  });

if (args.length < 1) {
  console.error(chalk.red("\nNo command provided"));
  showSupportedOptions();

  process.exit(1);
}

program.parse(process.argv);
