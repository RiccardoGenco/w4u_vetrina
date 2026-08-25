export const APP_URL = import.meta.env.PUBLIC_APP_URL ?? 'http://localhost:5173';

export function appLink(path = '') {
  return `${APP_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

