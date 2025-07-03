import { Configuration } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";

export default (props: WebpackBlockProps): Configuration["stats"] => ({
  assets: false,
  modules: false,
  children: false,
  chunks: false,
  chunkModules: false,
  colors: true,
  entrypoints: false,
  hash: false,
  version: false,
  builtAt: false,
  errorDetails: true,
});
