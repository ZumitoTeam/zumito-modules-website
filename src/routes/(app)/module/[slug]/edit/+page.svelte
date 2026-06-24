<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Container from '$lib/components/layout/Container.svelte';
	let { data, form }: { data: PageData; form?: any } = $props();
</script>

<svelte:head><title>Edit {data.mod.name} — Zumito Modules</title></svelte:head>

<Container class="py-12">
	<h1 class="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">Edit: {data.mod.name}</h1>

	<form method="POST" use:enhance class="mt-8 space-y-5">
		{#if form?.error}
			<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">{form.error}</div>
		{/if}

		<div>
			<label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name <span class="text-zumito-600">*</span></label>
			<input id="name" name="name" required value={data.mod.name} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		</div>

		<div>
			<label for="shortDescription" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Short Description</label>
			<input id="shortDescription" name="shortDescription" value={data.mod.shortDescription ?? ''} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		</div>

		<div>
			<label for="description" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description (Markdown) <span class="text-zumito-600">*</span></label>
			<textarea id="description" name="description" rows={8} required class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">{data.mod.description}</textarea>
		</div>

		<div>
			<label for="instructions" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Installation Instructions</label>
			<textarea id="instructions" name="instructions" rows={4} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">{data.mod.instructions}</textarea>
		</div>

		<div>
			<label for="npm" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">NPM Package Name <span class="text-zumito-600">*</span></label>
			<input id="npm" name="npm" required value={data.mod.npm} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		</div>

		<div>
			<label for="sourceCode" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Source Code URL</label>
			<input id="sourceCode" name="sourceCode" value={data.mod.sourceCode ?? ''} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		</div>

		<div>
			<label for="price" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (USD)</label>
			<input id="price" name="price" type="number" min="0" step="0.01" value={data.mod.price.toString()} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		</div>

		<button type="submit" class="rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Save Changes</button>
	</form>
</Container>
