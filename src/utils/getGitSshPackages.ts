import path from "path";
import fs from "fs-extra";

export default function getGitSshPackages() {
  try {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      return [];
    }

    const packageJson = fs.readJsonSync(packageJsonPath);
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const gitSshPackages = [];

    // Find all dependencies with git+ssh URLs
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === "string" && version.includes("git+ssh")) {
        // Extract package name from the full name
        const packageName = name.split("/").pop();
        gitSshPackages.push(packageName);
      }
    }

    return gitSshPackages;
  } catch (error) {
    console.warn("Error finding git+ssh packages:", error);
    return [];
  }
}
