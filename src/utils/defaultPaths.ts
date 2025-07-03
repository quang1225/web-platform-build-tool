import { RootPaths } from "../types";

const path = require("path");
const fs = require("fs-extra");

const appDirectory = fs.realpathSync(process.cwd());
const overrideDir = "webpack-overrides";

const getOverridePath = (blockname: string): string => {
  return `${appDirectory}/${overrideDir}/${blockname}`;
};

const overrideExists = (blockname: string): string => {
  return fs.existsSync(`${getOverridePath(blockname)}.js`);
};

export const resolveApp = (relativePath: string): string => {
  return path.resolve(appDirectory, relativePath);
};

const nodePaths = (process.env.NODE_PATH || "")
  .split(process.platform === "win32" ? ";" : ":")
  .filter(Boolean)
  .filter((folder) => !path.isAbsolute(folder))
  .map(resolveApp);

const pathOverrides =
  overrideExists("paths") && process.env.NODE_ENV === "production"
    ? require(getOverridePath("paths"))
    : {};

export enum DefaultFolderName {
  BUILD_DIR = "build",
  STATIC_DIR = "static",
  PUBLIC_DIR = "public",
}

const defaultPaths: RootPaths = {
  appSrc: resolveApp("src"),
  appIndex: resolveApp("src/index"),
  appBuild: resolveApp(DefaultFolderName.BUILD_DIR),
  appDirectory,
  appPublic: resolveApp(DefaultFolderName.PUBLIC_DIR),
  appHtml: resolveApp(`${DefaultFolderName.PUBLIC_DIR}/index.html`),
  appNodeModules: resolveApp("node_modules"),
  appCache: resolveApp("node_modules/.cache"),
  appPackageJson: resolveApp("package.json"),
  nodePaths,
  packagesRoot: resolveApp(".."),
  publicPath: "/",
  publicUrl: "",
  ...pathOverrides,
};
export default defaultPaths;
