<script lang="ts">
  import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="w-full max-w-sm space-y-6 rounded-xl border border-zinc-200 p-8 dark:border-zinc-800">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Create account</h1>
      <p class="mt-1 text-sm text-zinc-500">Join the Zumito Modules community</p>
    </div>
    <RegisterForm />
    <p class="text-center text-sm text-zinc-500">
      Already have an account?
      <a href="/login" class="font-medium text-zinc-900 underline dark:text-zinc-100">Sign in</a>
    </p>
  </div>
</div>
