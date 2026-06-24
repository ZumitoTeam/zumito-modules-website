<script lang="ts">
  import { createAuthClient } from 'better-auth/svelte';
  import type { auth } from '$lib/server/auth';
  
  export const authClient = createAuthClient();
</script>

{#snippet children()}
  {@render children?.()}
{/snippet}
