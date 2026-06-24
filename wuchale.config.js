// @ts-check
import { adapter as svelte } from '@wuchale/svelte';
import { defineConfig } from 'wuchale';

const OPENCODE_API_KEY = process.env.OPENCODE_API_KEY || 'sk-kLdp8gUgaHTE7AgOOEdc0ItSyPZ0h7CUBNMtbmJhPBB7lml9vDLYOTR0W4W0Ucpe';
const OPENCODE_BASE_URL = 'https://opencode.ai/zen/go/v1';
const MODEL = 'deepseek-v4-flash';

export default defineConfig({
  locales: ['en', 'es'],
  sourceLocale: 'en',
  adapters: {
    main: svelte({
      loader: 'sveltekit'
    })
  },
  ai: {
    name: 'DeepSeek V4 Flash (OpenCode Go)',
    batchSize: 40,
    parallel: 5,
    group: {},
    translate: async (content, instruction) => {
      const response = await fetch(`${OPENCODE_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENCODE_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: instruction },
            { role: 'user', content }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenCode API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  }
});
