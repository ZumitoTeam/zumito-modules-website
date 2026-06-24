<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	async function handleLogout() {
		await authClient.signOut();
		goto('/login');
	}
</script>

<nav class="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<a href="/" class="text-lg font-bold tracking-tight">Zumito Modules</a>
		<div class="flex items-center gap-4">
			<a href="/modules" class="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Browse</a>
			{#if $page.data.user}
				<a href="/submit" class="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Submit</a>
				<a href="/user/profile" class="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Profile</a>
				<button onclick={handleLogout} class="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Logout</button>
			{:else}
				<a href="/login" class="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Sign in</a>
				<a href="/register" class="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">Register</a>
			{/if}
		</div>
	</div>
</nav>
