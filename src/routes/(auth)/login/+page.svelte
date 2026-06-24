<script lang="ts">
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
</script>

<div class="flex min-h-screen items-center justify-center px-4">
  <div class="w-full max-w-sm space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
    <div class="text-center">
      <h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Sign in</h1>
      <p class="mt-1 text-sm text-zinc-500">Welcome back to <span class="text-zumito-600">Zumito</span> Modules</p>
    </div>
    <LoginForm />
    <p class="text-center text-sm text-zinc-500">
      No account?
      <a href="/register" class="font-medium text-zumito-600 transition-colors hover:text-zumito-700">Register</a>
    </p>
  </div>
</div>
