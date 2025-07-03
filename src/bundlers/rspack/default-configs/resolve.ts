import { Configuration } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";

export default ({
  paths,
  cliConfig,
}: WebpackBlockProps): Configuration["resolve"] => ({
  extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
  mainFiles: ["index"],
  fallback: {
    "./locale": false,
  },
  modules: [
    "node_modules",
    paths.appSrc,
    paths.appDirectory,
    paths.packagesRoot,
    paths.appNodeModules,
  ].concat(paths.nodePaths),
  alias: {
    react: `${paths.appNodeModules}/react`,
    "react-dom": `${paths.appNodeModules}/react-dom`,
    "react-router": `${paths.appNodeModules}/react-router`,
    "react-router-dom": `${paths.appNodeModules}/react-router-dom`,
    memorystorage: `${paths.appNodeModules}/memorystorage`,
    ...cliConfig.relativeImports,
  },
});
