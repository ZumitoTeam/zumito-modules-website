<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Features — Admin</title></svelte:head>

<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Features</h1>

<form method="POST" action="?/create" use:enhance class="mt-6 flex gap-2">
	<input name="name" placeholder="Feature name" required class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
	<input name="emoji" placeholder="🔧" maxlength={2} class="w-20 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
	<button type="submit" class="rounded-full bg-zumito-600 px-4 py-2 text-sm font-semibold text-white hover:bg-zumito-700">Add</button>
</form>

<div class="mt-6 space-y-2">
	{#each data.features as f}
		<div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
			<div class="flex items-center gap-3">
				<span>{f.emoji}</span>
				<span class="font-medium text-zinc-900 dark:text-zinc-100">{f.name}</span>
				<span class="text-sm text-zinc-500">{f._count.modules} modules</span>
			</div>
			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={f.id} />
				<button type="submit" class="text-sm font-medium text-red-500 transition-colors hover:text-red-700">Delete</button>
			</form>
		</div>
	{/each}
</div>
