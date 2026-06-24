<script lang="ts">
  import { authClient } from 'better-auth/svelte';
  import { goto } from '$app/navigation';
  
  let username = $state('');
  let email = $state('');
  let password = $state('');
  let error = $state('');
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: username,
    });
    
    if (signUpError) {
      error = signUpError.message ?? 'Registration failed';
      return;
    }
    
    goto('/');
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
      {error}
    </div>
  {/if}

  <div>
    <label for="username" class="block text-sm font-medium">Username</label>
    <input
      id="username"
      type="text"
      bind:value={username}
      required
      class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium">Email</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium">Password</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      required
      class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    />
  </div>

  <button
    type="submit"
    class="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
  >
    Create account
  </button>
</form>
