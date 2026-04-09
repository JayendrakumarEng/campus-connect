export const buildAppUrl = (path = "") => {
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
  const normalizedPath = path.replace(/^\/+/, "");

  return new URL(normalizedPath, baseUrl).toString();
};