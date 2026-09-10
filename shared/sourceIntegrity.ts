export function normalizeSourceUrl(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:" || !parsed.hostname) return null;
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

export function hasVerifiableSource(url?: string) {
  return Boolean(normalizeSourceUrl(url));
}
