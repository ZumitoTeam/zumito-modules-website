<script lang="ts">
	import { enhance } from '$app/forms';
	import { sileo } from 'svelte-sileo';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Container from '$lib/components/layout/Container.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	let { data, form }: { data: PageData; form?: any } = $props();

	let loading = $state(false);

	const onUpdate: SubmitFunction = () => {
		loading = true;
		const { promise, resolve, reject } = Promise.withResolvers<void>();
		sileo.promise(promise, {
			loading: { title: 'Saving...', description: 'Updating your module', fill: '#fafafa', styles: { title: 'text-zinc-900', description: 'text-zinc-500' } },
			success: { title: 'Module updated', description: 'Changes saved successfully.', fill: '#f0fdf4', styles: { title: 'text-green-800', description: 'text-green-600' } },
			error: { title: 'Update failed', description: 'Please try again.', fill: '#fef2f2', styles: { title: 'text-red-800', description: 'text-red-600' } },
		});
		return async ({ result }) => {
			loading = false;
			if (result.type === 'success') resolve();
			else reject(new Error(result.data?.error));
		};
	};
</script>

<svelte:head><title>Edit {data.mod.name} — Zumito Modules</title></svelte:head>

<Container class="py-12">
	<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Edit: {data.mod.name}</h1>
	<p class="mt-2 text-zinc-500">Update your module details. All fields marked with <span class="text-zumito-600">*</span> are required.</p>

	<Card variant="border" padding="lg" class="mt-8">
		<form method="POST" use:enhance={onUpdate} class="space-y-6">
			<div class="grid gap-6 sm:grid-cols-2">
				<div>
					<label for="name" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name <span class="text-zumito-600">*</span></label>
					<p class="mt-1 text-xs text-zinc-400">The display name shown in the marketplace.</p>
					<input id="name" name="name" required value={data.mod.name} class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>
				<div>
					<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Slug</label>
					<p class="mt-1 text-xs text-zinc-400">Cannot be changed after creation.</p>
					<div class="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">{data.mod.slug}</div>
				</div>
			</div>

			<div>
				<label for="shortDescription" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Short Description</label>
				<p class="mt-1 text-xs text-zinc-400">A one-line summary shown in module cards.</p>
				<input id="shortDescription" name="shortDescription" value={data.mod.shortDescription ?? ''} placeholder="Adds a powerful music queue system with Spotify and YouTube support" class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label for="description" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description (Markdown) <span class="text-zumito-600">*</span></label>
				<p class="mt-1 text-xs text-zinc-400">Full description in Markdown. Explain features and usage.</p>
				<textarea id="description" name="description" rows={10} required class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-mono leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600">{data.mod.description}</textarea>
			</div>

			<div>
				<label for="instructions" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Installation Instructions</label>
				<p class="mt-1 text-xs text-zinc-400">Step-by-step guide in Markdown. Include npm install command.</p>
				<textarea id="instructions" name="instructions" rows={5} class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-mono leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600">{data.mod.instructions}</textarea>
			</div>

			<div class="grid gap-6 sm:grid-cols-2">
				<div>
					<label for="npm" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">NPM Package Name <span class="text-zumito-600">*</span></label>
					<p class="mt-1 text-xs text-zinc-400">The exact name used in <code class="rounded bg-zinc-100 px-1 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">npm publish</code>.</p>
					<input id="npm" name="npm" required value={data.mod.npm} class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>
				<div>
					<label for="sourceCode" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Source Code URL</label>
					<p class="mt-1 text-xs text-zinc-400">Link to the GitHub repository.</p>
					<input id="sourceCode" name="sourceCode" value={data.mod.sourceCode ?? ''} placeholder="https://github.com/username/my-module" class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
				</div>
			</div>

			<div class="flex items-center gap-4 pt-2">
				<button type="submit" disabled={loading} class="flex items-center gap-2 rounded-full bg-zumito-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98] disabled:opacity-70">
					{#if loading}<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{/if}
					{loading ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	</Card>
</Container>
