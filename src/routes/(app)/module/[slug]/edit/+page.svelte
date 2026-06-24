<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();
</script>

<svelte:head>
	<title>Edit {data.mod.name} — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-16">
	<h1 class="text-3xl font-bold">Edit: {data.mod.name}</h1>

	<form method="POST" use:enhance class="mt-8 space-y-5">
		{#if form?.error}
			<div class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">{form.error}</div>
		{/if}

		<div>
			<label for="name" class="block text-sm font-medium">Name *</label>
			<input id="name" name="name" required value={data.mod.name} class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
		</div>

		<div>
			<label for="shortDescription" class="block text-sm font-medium">Short Description</label>
			<input id="shortDescription" name="shortDescription" value={data.mod.shortDescription ?? ''} class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
		</div>

		<div>
			<label for="description" class="block text-sm font-medium">Description (Markdown) *</label>
			<textarea id="description" name="description" rows={8} required class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono dark:border-zinc-700 dark:bg-zinc-900">{data.mod.description}</textarea>
		</div>

		<div>
			<label for="instructions" class="block text-sm font-medium">Installation Instructions</label>
			<textarea id="instructions" name="instructions" rows={4} class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono dark:border-zinc-700 dark:bg-zinc-900">{data.mod.instructions}</textarea>
		</div>

		<div>
			<label for="npm" class="block text-sm font-medium">NPM Package Name *</label>
			<input id="npm" name="npm" required value={data.mod.npm} class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono dark:border-zinc-700 dark:bg-zinc-900" />
		</div>

		<div>
			<label for="sourceCode" class="block text-sm font-medium">Source Code URL</label>
			<input id="sourceCode" name="sourceCode" value={data.mod.sourceCode ?? ''} class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
		</div>

		<div>
			<label for="price" class="block text-sm font-medium">Price (USD)</label>
			<input id="price" name="price" type="number" min="0" step="0.01" value={data.mod.price.toString()} class="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
		</div>

		<button type="submit" class="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
			Save Changes
		</button>
	</form>
</div>
