import { ServerOptions } from "https";
import { ClientEnvironment } from "./utils/getClientEnvironment";
import { Configuration as WebpackConfig } from "webpack";
import { Configuration as RspackConfig } from "@rspack/core";

export enum OverrideType {
  APPEND = "append",
  OVERWRITE = "overwrite",
}

export type OverrideWebpackBlock<
  T extends keyof (RspackConfig & WebpackConfig)
> =
  | ({
      overrideType: OverrideType | string;
      pluginArray?: any[];
    } & Partial<(RspackConfig & WebpackConfig)[T]>)
  | undefined;

export type OverrideWebpackConfig = {
  [K in keyof (RspackConfig & WebpackConfig)]: OverrideWebpackBlock<K> | string;
};

export type PluginObjectConfig = Record<string, any>;
export type PluginArrayConfig = (string | (string | {})[])[];

export type Plugins = Partial<{
  postcssLoader: PluginObjectConfig;
  babelLoader: PluginArrayConfig;
  swcLoader: PluginArrayConfig;
  tsLoader: PluginArrayConfig;
}>;

export type WebPlatformBuildToolConfig = Partial<{
  bundler: BundlerEnum | string;
  profile: string;
  webAppType: string;
  devSSL: DevSSL;
  lessVars: Record<string, string>;
  useStyleModules: boolean;
  relativeImports: Record<string, string>;
  legacyCommonjsPackages: string[];
  extendStaticFileExtensions: string[];
  microFE: MicroFrontendConfig;
  enableServiceWorker: boolean;
  appInput: AppInputConfig;
  appOutput: AppOutputConfig;
  overrideWebpack: OverrideWebpackConfig;
  plugins: Plugins;
  useSVGR: UseSVGR;
}>;

export type UseSVGR = {
  enabled: boolean;
  excludePackages?: string[];
};

export type DevSSL = {
  hostname: string;
  options: ServerOptions;
};

export type AppInputConfig = Partial<{
  publicDir: string;
  appHtml: string;
  appIndex: string;
}>;

export type AppOutputConfig = Partial<{
  buildDir: string;
  publicPath: string;
  indexHtml: IndexHtmlConfig;
}>;

export type IndexHtmlConfig = Partial<{
  publicUrl: string;
}>;

export type MicroFrontendExpose = {
  entryFileName?: string;
  components: Record<string, string>;
};

export type MicroFrontendConsume = {
  appName: string;
  devURL: string;
  stgURL: string;
  prdURL: string;
  entryFileName?: string;
  importAlias?: string;
};

export type MicroFrontendSharedDependency = "auto" | Record<string, any>;

export type MicroFrontendConfig = Partial<{
  appName: string;
  expose?: MicroFrontendExpose;
  consume?: MicroFrontendConsume[];
  sharedDependency?: MicroFrontendSharedDependency;
}>;

export type WebpackBlockProps = {
  cliConfig: WebPlatformBuildToolConfig;
} & CliConfigProps;

export type WebpackBlockConfigFunction = (props: WebpackBlockProps) => any;

export type CliConfigProps = {
  env: ClientEnvironment;
  isDev: boolean;
  paths: RootPaths;
};

export type BuildToolConfig = (props: CliConfigProps) => WebPlatformConfig;

export type WebPlatformConfig = Partial<{
  buildToolConfig: WebPlatformBuildToolConfig;
}>;

export type WebPlatformBuildToolOptions = {
  cliConfig: string;
};

export type WebPlatformBuildToolProps = {
  bundler: BundlerEnum;
  action: ActionEnum;
  options: WebPlatformBuildToolOptions;
};

export type WebPlatformCommandProps = {
  bundler: BundlerEnum;
  action: ActionEnum;
  dumpConfig?: boolean;
};

export enum BundlerEnum {
  WEBPACK = "webpack",
  RSPACK = "rspack",
}

export type BundlerConfig = {
  name: string;
};

export const SUPPORTED_BUNDLERS: Record<BundlerEnum, BundlerConfig> = {
  [BundlerEnum.WEBPACK]: {
    name: BundlerEnum.WEBPACK,
  },
  [BundlerEnum.RSPACK]: {
    name: BundlerEnum.RSPACK,
  },
};

export enum ActionEnum {
  START = "start",
  BUILD = "build",
  SERVE = "serve",
  TEST = "test",
}

export type CommandOptions = {
  dumpConfig?: boolean;
};

export type CommandsInterface = {
  [ActionEnum.START]: (options?: CommandOptions) => void;
  [ActionEnum.BUILD]: (options?: CommandOptions) => void;
  [ActionEnum.SERVE]: (options?: CommandOptions) => void;
};

export type Action = {
  description: string;
  name: ActionEnum;
};

export const ACTIONS: Record<ActionEnum, Action> = {
  [ActionEnum.START]: {
    description: "Starts the ReactJS app in developer mode",
    name: ActionEnum.START,
  },
  [ActionEnum.BUILD]: {
    description: "Builds the ReactJS app for production",
    name: ActionEnum.BUILD,
  },
  [ActionEnum.SERVE]: {
    description: "Starts the the ReactJS app using build folder",
    name: ActionEnum.SERVE,
  },
  [ActionEnum.TEST]: {
    description: "Runs unit and integration tests",
    name: ActionEnum.TEST,
  },
};

export type RootPaths = {
  appSrc: string;
  appIndex: string;
  appBuild: string;
  appDirectory: string;
  appPublic: string;
  appHtml: string;
  appNodeModules: string;
  appCache: string;
  appPackageJson: string;
  nodePaths: string[];
  packagesRoot: string;
  publicPath: string;
  publicUrl: string;
};

export enum CIEnvironmentEnum {
  DEV = "dev",
  STG = "stg",
  PRD = "prd",
}
