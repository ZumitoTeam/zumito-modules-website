<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    const { error: signInError } = await authClient.signIn.email({ email, password });
    if (signInError) { error = signInError.message ?? 'Login failed'; return; }
    goto('/');
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">{error}</div>
  {/if}

  <div>
    <label for="email" class="block text-sm font-medium text-zinc-300">Email</label>
    <input id="email" type="email" bind:value={email} required class="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600" />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-zinc-300">Password</label>
    <input id="password" type="password" bind:value={password} required class="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600" />
  </div>

  <button type="submit" class="w-full rounded-full bg-zumito-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
    Sign in
  </button>
</form>
