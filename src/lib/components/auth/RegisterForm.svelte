<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { sileo } from 'svelte-sileo';

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;

    sileo.promise(
      authClient.signUp.email({ email, password, name: username, username }),
      {
        loading: { title: 'Creating account...', description: 'Please wait' },
        success: (result) => {
          if (result.error) throw result.error;
          setTimeout(() => goto('/'), 600);
          return { title: 'Account created!', description: 'Welcome to Zumito Modules.' };
        },
        error: { title: 'Registration failed', description: 'Please try again.' },
      }
    ).finally(() => { loading = false; });
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <div>
    <label for="username" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
    <input id="username" type="text" bind:value={username} required class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
    <input id="email" type="email" bind:value={email} required class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
    <input id="password" type="password" bind:value={password} required class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
  </div>

  <button type="submit" disabled={loading} class="flex w-full items-center justify-center gap-2 rounded-full bg-zumito-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98] disabled:opacity-70">
    {#if loading}
      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
    {/if}
    {loading ? 'Creating account...' : 'Create account'}
  </button>
</form>
