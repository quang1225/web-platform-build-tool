import { spawnSync } from "child_process";

// Helper function to run a system command and get the stdout
// Raises the stdout if there is an error
const runCommand = (cmd: string, args: string[]): string => {
  const { stdout, stderr } = spawnSync(cmd, args);

  if (stderr.length !== 0) {
    throw new Error(stderr.toString().trim());
  }
  return stdout.toString().trim();
};

const getRef = (): string => {
  try {
    return runCommand("git", ["rev-parse", "--short", "HEAD"]);
  } catch (e) {
    return "dev";
  }
};

const getTag = (): string => {
  try {
    const gitlabTag = runCommand("printenv", ["CI_COMMIT_TAG"]);
    if (gitlabTag) return gitlabTag;
    const gitTag = runCommand("git", ["tag", "--points-at", "HEAD"]);
    if (gitTag) return gitTag;
    throw new Error("No valid tags");
  } catch (e) {
    return "dev";
  }
};

const getAppVersion = (): string => {
  try {
    return getTag();
  } catch (e) {
    return getRef();
  }
};

export default getAppVersion;
