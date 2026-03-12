// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  site: 'https://labhari1218-gif.github.io',
  base: '/Panchangam.github.io',
});
