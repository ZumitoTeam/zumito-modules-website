<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    const { error: signUpError } = await authClient.signUp.email({ email, password, name: username });
    if (signUpError) { error = signUpError.message ?? 'Registration failed'; return; }
    goto('/');
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">{error}</div>
  {/if}

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

  <button type="submit" class="w-full rounded-full bg-zumito-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
    Create account
  </button>
</form>
