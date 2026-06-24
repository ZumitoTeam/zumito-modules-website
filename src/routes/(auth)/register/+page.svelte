<script lang="ts">
  import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
</script>

<div class="flex min-h-screen items-center justify-center px-4">
  <div class="w-full max-w-sm space-y-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
    <div class="text-center">
      <h1 class="text-2xl font-extrabold text-zinc-100">Create account</h1>
      <p class="mt-1 text-sm text-zinc-500">Join the <span class="text-zumito-600">Zumito</span> community</p>
    </div>
    <RegisterForm />
    <p class="text-center text-sm text-zinc-500">
      Already have an account?
      <a href="/login" class="font-medium text-zumito-600 transition-colors hover:text-zumito-500">Sign in</a>
    </p>
  </div>
</div>
