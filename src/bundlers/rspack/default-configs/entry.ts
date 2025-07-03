import { Configuration } from "@rspack/core";
import { WebpackBlockProps } from "../../../types";

export default ({
  paths,
  cliConfig,
}: WebpackBlockProps): Configuration["entry"] => {
  const { appInput } = cliConfig;
  const { appIndex = paths.appIndex } = appInput || {};

  return {
    index: appIndex,
  };
};
