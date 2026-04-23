import path from "node:path";

const DEPLOY_BASE_PATH = "/avaneesh2001";

const hasProtocol = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);

const stripDeployBase = (value: string): string => {
  if (value === DEPLOY_BASE_PATH || value === `${DEPLOY_BASE_PATH}/`) return "/";
  if (value.startsWith(`${DEPLOY_BASE_PATH}/`)) return value.slice(DEPLOY_BASE_PATH.length);
  return value;
};

const normalizeInternalPath = (value: string): string => {
  const strippedValue = stripDeployBase(value);
  if (!strippedValue.startsWith("/")) return `/${strippedValue}`;
  return strippedValue;
};

export function toRelativeUrl(currentPath: string, targetPath: string): string {
  if (!targetPath) return targetPath;
  if (hasProtocol(targetPath) || targetPath.startsWith("#") || targetPath.startsWith("?")) return targetPath;

  const normalizedCurrentPath = normalizeInternalPath(currentPath);
  const normalizedTargetPath = normalizeInternalPath(targetPath);

  const currentDirectory = normalizedCurrentPath === "/"
    ? ""
    : normalizedCurrentPath.replace(/^\/|\/$/g, "");
  const targetValue = normalizedTargetPath === "/"
    ? ""
    : normalizedTargetPath.replace(/^\/|\/$/g, "");

  const relativePath = path.posix.relative(currentDirectory, targetValue || ".");

  if (normalizedTargetPath === "/") return relativePath ? `${relativePath}/` : "./";
  if (targetPath.endsWith("/")) return relativePath ? `${relativePath}/` : "./";

  return relativePath || "./";
}

export function withoutBase(pathname: string): string {
  if (!pathname) return "/";
  return normalizeInternalPath(pathname);
}
