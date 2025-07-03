import { Configuration } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";

export default ({ isDev }: WebpackBlockProps): Configuration["externals"] =>
  isDev ? "development" : "production";
