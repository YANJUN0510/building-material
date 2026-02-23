const PROD_API_FALLBACK = 'https://bmw-backend-production.up.railway.app';

export function getApiBaseUrl() {
  const isDev = Boolean(import.meta.env.DEV);
  const envBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const fallback = isDev ? 'http://localhost:3001' : window.location.origin;
  const candidate = envBase || fallback;

  try {
    const parsed = new URL(candidate, window.location.origin);
    const host = parsed.hostname.toLowerCase();

    // Protect production builds from accidental localhost env values.
    if (!isDev && (host === 'localhost' || host === '127.0.0.1')) {
      return PROD_API_FALLBACK;
    }

    return parsed.origin;
  } catch {
    return isDev ? 'http://localhost:3001' : PROD_API_FALLBACK;
  }
}
