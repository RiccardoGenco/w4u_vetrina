// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'always',
  integrations: [react(), sitemap({ filter: (page) => !['/404.html', '/privacy/', '/cookie/', '/termini/'].some((path) => page.endsWith(path)) })],

  vite: {
    plugins: [tailwindcss()]
  }
});
