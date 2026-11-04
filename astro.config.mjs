// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sfg-studio.de',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
