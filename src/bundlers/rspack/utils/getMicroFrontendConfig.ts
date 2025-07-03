import { CIEnvironmentEnum, WebpackBlockProps } from "../../../types";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

const DEFAULT_ENTRY_FILENAME = "remoteEntry.js";
const DEFAULT_SHARED_DEPENDENCY_CONFIG = "auto";

const DEFAULT_SHARED_DEPENDENCY = {
  react: {
    singleton: true,
    eager: true,
  },
  "react-dom": {
    singleton: true,
    eager: true,
  },
  "react-router-dom": {
    singleton: true,
    eager: true,
  },
};

export default function getMicroFrontendConfig({
  isDev,
  cliConfig,
  env,
}: WebpackBlockProps) {
  const { microFE } = cliConfig;

  if (!microFE) return [];

  const {
    appName = "",
    expose,
    consume,
    sharedDependency = DEFAULT_SHARED_DEPENDENCY_CONFIG,
  } = microFE;

  const remotes = consume?.reduce<Record<string, string>>((prev, remoteApp) => {
    const remotePublicPath = isDev ? remoteApp.devURL : remoteApp.prdURL;

    const importAlias = remoteApp.importAlias || remoteApp.appName;

    return {
      ...prev,
      [importAlias]: `${remoteApp.appName}@${remotePublicPath}/${
        remoteApp.entryFileName || DEFAULT_ENTRY_FILENAME
      }`,
    };
  }, {});

  const shared =
    sharedDependency === DEFAULT_SHARED_DEPENDENCY_CONFIG
      ? DEFAULT_SHARED_DEPENDENCY
      : sharedDependency;

  return [
    new ModuleFederationPlugin({
      name: appName,
      filename: expose?.entryFileName || DEFAULT_ENTRY_FILENAME,
      exposes: expose?.components,
      remotes,
      shared,
      dts: false,
    }),
  ];
}
