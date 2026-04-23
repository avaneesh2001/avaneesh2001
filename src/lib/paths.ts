const DEPLOY_BASE_PATH = "/avaneesh2001";

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

export function withoutBase(pathname: string): string {
  if (!pathname) return "/";
  return normalizeInternalPath(pathname);
}
