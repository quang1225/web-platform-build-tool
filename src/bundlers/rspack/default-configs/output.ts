import { Configuration } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";
import { DefaultFolderName } from "../../../utils/defaultPaths";

export default ({
  isDev,
  paths,
  cliConfig,
}: WebpackBlockProps): Configuration["output"] => {
  const { appOutput, microFE } = cliConfig;
  const { buildDir = paths.appBuild } = appOutput || {};

  return {
    path: buildDir || paths.appBuild,
    filename: isDev
      ? `[name].js`
      : `${DefaultFolderName.STATIC_DIR}/[name].[contenthash].js`,
    chunkFilename: isDev
      ? `[name].js`
      : `${DefaultFolderName.STATIC_DIR}/[name].[contenthash].js`,
    assetModuleFilename: isDev
      ? `[name].[ext]`
      : `${DefaultFolderName.STATIC_DIR}/media/[name].[hash][ext]`,
    publicPath: "auto",
    clean: true,
    uniqueName: microFE?.appName,
  };
};
