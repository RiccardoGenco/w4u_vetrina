export const prerender = true;
export function GET({ site }: { site?: URL }) {
  const base = site ?? new URL('http://localhost:4321');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', base).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
