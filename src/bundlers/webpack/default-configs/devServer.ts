import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { WebpackBlockProps } from "../../../types";
import { DefaultFolderName, resolveApp } from "../../../utils/defaultPaths";

const devServer = ({
  isDev,
  paths,
  cliConfig,
  env,
}: WebpackBlockProps): DevServerConfiguration | undefined => {
  if (!isDev) return undefined;

  const { microFE, devSSL, appInput, appOutput } = cliConfig;
  const { publicDir = DefaultFolderName.PUBLIC_DIR } = appInput || {};
  const { publicPath = paths.publicPath } = appOutput || {};

  return {
    hot: "only",
    liveReload: !!microFE,
    watchFiles: microFE ? [paths.appDirectory] : undefined,
    compress: true,
    port: env.raw.WEB_APP_PORT || (devSSL ? 443 : 3000),
    host: env.raw.WEB_APP_HOST || "0.0.0.0",
    allowedHosts: "all",
    historyApiFallback: {
      disableDotRule: true,
    },
    server: devSSL
      ? {
          type: "https",
          options: devSSL.options,
        }
      : undefined,
    static: {
      directory: resolveApp(publicDir),
      publicPath,
    },
    client: {
      overlay: false,
      logging: "none",
    },
  };
};

export default devServer;
