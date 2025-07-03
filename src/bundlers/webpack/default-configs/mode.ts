import { Configuration } from "webpack";
import { WebpackBlockProps } from "../../../types";

export default ({ isDev }: WebpackBlockProps): Configuration["externals"] =>
  isDev ? "development" : "production";
