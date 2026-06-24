<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LangPicker from '$lib/components/LangPicker.svelte';

	async function handleLogout() {
		await authClient.signOut();
		goto('/login');
	}
</script>

<nav class="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800/50 dark:bg-zinc-950/80">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
		<a href="/" class="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
			<span class="text-zumito-600">Zumito</span> Modules
		</a>

		<div class="flex items-center gap-6">
			<a href="/modules" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Browse</a>
			<a href="/submit" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Submit</a>
			{#if $page.data.user}
				<a href="/user/profile" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Profile</a>
				<a href="/user/modules" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">My Modules</a>
				<button onclick={handleLogout} class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Logout</button>
			{:else}
				<a href="/login" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Sign in</a>
				<a href="/register" class="rounded-full bg-zumito-600 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Register</a>
			{/if}
			<LangPicker />
		</div>
	</div>
</nav>
