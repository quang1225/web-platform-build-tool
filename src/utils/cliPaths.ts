const path = require("path");
const fs = require("fs-extra");

const BUILD_TOOL_ROOT_PATH = path.resolve(__dirname, "../..");

const resolveBuilTool = (relativePath: string) => {
  return path.resolve(BUILD_TOOL_ROOT_PATH, relativePath);
};

export default {
  cliRoot: BUILD_TOOL_ROOT_PATH,
  cliSrc: resolveBuilTool("src"),
  cliBundlers: resolveBuilTool("src/bundlers"),
  cliNodeModules: resolveBuilTool("node_modules"),
  cliNodeModulesBin: resolveBuilTool("node_modules/.bin"),
  cliDist: resolveBuilTool("dist"),
  cliDistBundlers: resolveBuilTool("dist/bundlers"),
};
