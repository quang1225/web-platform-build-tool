import { Configuration } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";

export default ({
  isDev,
}: WebpackBlockProps): Configuration["optimization"] => {
  return {
    splitChunks: {
      cacheGroups: {
        libs: {
          test: /[\\/]node_modules[\\/](react|moment|lodash|core-js)/,
          name: "libs",
          priority: 12,
          chunks: "all",
        },
        ui: {
          test: /[\\/]node_modules[\\/](antd|grab-ui|rc-)/,
          name: "ui",
          priority: 11,
          chunks: "all",
        },
      },
    },
    minimize: !isDev,
    runtimeChunk: false, // required for Module Federation
    moduleIds: isDev ? "named" : "deterministic",
    chunkIds: isDev ? "named" : "deterministic",
  };
};
