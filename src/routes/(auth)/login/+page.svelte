<script lang="ts">
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="w-full max-w-sm space-y-6 rounded-xl border border-zinc-200 p-8 dark:border-zinc-800">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Sign in</h1>
      <p class="mt-1 text-sm text-zinc-500">Welcome back to Zumito Modules</p>
    </div>
    <LoginForm />
    <p class="text-center text-sm text-zinc-500">
      Don't have an account?
      <a href="/register" class="font-medium text-zinc-900 underline dark:text-zinc-100">Register</a>
    </p>
  </div>
</div>
