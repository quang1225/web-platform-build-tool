import { Configuration } from "webpack";
import { WebpackBlockProps } from "../../../types";

export default ({ isDev }: WebpackBlockProps): Configuration["devtool"] => {
  return isDev ? "eval-cheap-module-source-map" : "source-map";
};
