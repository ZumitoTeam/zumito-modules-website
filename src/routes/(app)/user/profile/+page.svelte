<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data, form }: { data: PageData; form?: any } = $props();
</script>

<svelte:head><title>Profile — Zumito Modules</title></svelte:head>

<div class="mx-auto max-w-lg px-4 py-16">
	<h1 class="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">Profile</h1>

	<form method="POST" use:enhance class="mt-8 space-y-5">
		{#if form?.success}
			<div class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/5 dark:text-green-400">Profile updated.</div>
		{/if}

		<div>
			<label for="username" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
			<input id="username" name="username" required value={data.user.username} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		</div>

		<div>
			<label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
			<div class="mt-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">{data.user.email}</div>
		</div>

		<button type="submit" class="rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Save</button>
	</form>
</div>
