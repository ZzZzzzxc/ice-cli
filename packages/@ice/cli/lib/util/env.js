const { execSync } = require("child_process");

const ENV_CACHE = {
  _hasYarn: null,
  _hasCnpm: null,
  _hasGit: null,
};

function has(name) {
  const envKey = `_has${name[0].toUpperCase()}${name.slice(1)}`;

  if (ENV_CACHE[envKey] !== null) {
    return ENV_CACHE[envKey];
  }

  try {
    execSync(`${name} --version`, { stdio: "ignore" });
    return (ENV_CACHE[envKey] = true);
  } catch (e) {
    return (ENV_CACHE[envKey] = false);
  }
}

function hasYarn() {
  return has("yarn");
}

function hasCnpm() {
  return has("cnpm");
}

function hasGit() {
  return has("git");
}

module.exports = { hasYarn, hasCnpm, hasGit };
