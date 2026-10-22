/** API paths must end with `/` when `trailingSlash: true` is enabled. */
export function apiPath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/api/") && !normalized.endsWith("/")) return `${normalized}/`;
  return normalized;
}
