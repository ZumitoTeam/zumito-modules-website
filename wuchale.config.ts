import { defineConfig } from 'wuchale/config';

export default defineConfig({
  input: ['src/**/*.{svelte,ts}'],
  output: 'src/locales/{locale}.json',
  locales: ['en', 'es'],
  adapter: 'sveltekit',
});
