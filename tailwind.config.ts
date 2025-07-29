import type { Config } from "tailwindcss";
import animations from '@midudev/tailwind-animations'


export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {}
  },

  plugins: [require("@tailwindcss/typography"), animations]
} as Config;
