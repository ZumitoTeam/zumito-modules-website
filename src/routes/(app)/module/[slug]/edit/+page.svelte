<script lang="ts">
	import { enhance } from '$app/forms';
	import { sileo } from 'svelte-sileo';
	import { marked } from 'marked';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Container from '$lib/components/layout/Container.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	let { data, form }: { data: PageData; form?: any } = $props();

	let loading = $state(false);
	let descriptionLocked = $state(false);
	let loadingReadme = $state(false);
	let descriptionValue = structuredClone(data.mod.description ?? '') as string;
	let npmValue = structuredClone(data.mod.npm ?? '') as string;
	let sourceCodeValue = structuredClone(data.mod.sourceCode ?? '') as string;

	async function loadReadme() {
		const pkg = npmValue;
		if (!pkg?.trim()) return;
		loadingReadme = true;
		sileo.promise(
			fetch('/api/npm/readme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ package: pkg.trim() }),
			}).then(async (r) => {
				const d = await r.json();
				if (!d.ok) throw new Error(d.error);
				return d;
			}),
			{
				loading: { title: 'Fetching README...', description: `Loading from ${pkg.trim()}`, fill: '#fafafa', styles: { title: 'text-zinc-900', description: 'text-zinc-500' } },
				success: (d: any) => {
					descriptionValue = d.readme;
					descriptionLocked = true;
					if (d.repository) sourceCodeValue = d.repository;
					return { title: 'README loaded', description: `${pkg.trim()} description updated.`, fill: '#f0fdf4', styles: { title: 'text-green-800', description: 'text-green-600' } };
				},
				error: { title: 'Could not load README', description: 'Package not found or has no README.', fill: '#fef2f2', styles: { title: 'text-red-800', description: 'text-red-600' } },
			}
		).finally(() => { loadingReadme = false; });
	}

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
			if (result.type === 'success' || result.type === 'redirect') resolve();
			else reject(new Error(result.data?.error || 'Update failed'));
		};
	};
</script>

<svelte:head><title>Edit {data.mod.name} — Zumito Modules</title></svelte:head>

<Container class="py-12">
	<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Edit: {data.mod.name}</h1>
	<p class="mt-2 text-zinc-500 dark:text-zinc-400">Update your module details. All fields marked with <span class="text-zumito-600">*</span> are required.</p>

	<Card variant="border" padding="lg" class="mt-8">
		<form method="POST" use:enhance={onUpdate} class="space-y-8">
			<!-- Row: Name + Slug -->
			<div class="grid gap-6 sm:grid-cols-2">
				<div>
					<div class="min-h-[4rem]">
						<label for="name" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
							Module Name <span class="text-zumito-600">*</span>
						</label>
						<p class="mt-1 text-xs leading-relaxed text-zinc-400">The display name shown in the marketplace.</p>
					</div>
					<input id="name" name="name" required value={data.mod.name} class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
				</div>
				<div>
					<div class="min-h-[4rem]">
						<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">URL Slug</label>
						<p class="mt-1 text-xs leading-relaxed text-zinc-400">Cannot be changed after creation.</p>
					</div>
					<div class="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">{data.mod.slug}</div>
				</div>
			</div>

			<!-- Short Description -->
			<div>
				<label for="shortDescription" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Short Description</label>
				<p class="mt-1 text-xs text-zinc-400">A one-line summary shown in module cards. Max ~120 characters.</p>
				<input id="shortDescription" name="shortDescription" value={data.mod.shortDescription ?? ''} placeholder="Adds a powerful music queue system with Spotify and YouTube support" class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<!-- Description -->
			<div>
				<label for="description" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
					Description <span class="text-zumito-600">*</span>
				</label>
				{#if descriptionLocked}
					<div class="mt-2 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
						<div class="flex items-center justify-between mb-2">
							<span class="text-xs font-medium text-green-700 dark:text-green-400">Loaded from npm README</span>
							<button type="button" onclick={() => descriptionLocked = false} class="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Unlock to edit</button>
						</div>
						<div class="prose prose-sm max-w-none text-zinc-600 dark:text-zinc-400 line-clamp-6">{@html marked.parse(descriptionValue)}</div>
					</div>
					<textarea name="description" class="hidden">{descriptionValue}</textarea>
				{:else}
					<p class="mt-1 text-xs text-zinc-400">Full description in Markdown. Explain what the module does, its features, and how to use it.</p>
					<textarea id="description" name="description" rows={10} required class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-mono leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" bind:value={descriptionValue}></textarea>
				{/if}
			</div>

			<!-- Instructions -->
			<div>
				<label for="instructions" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Installation Instructions</label>
				<p class="mt-1 text-xs text-zinc-400">Step-by-step guide in Markdown. Include npm install command, setup steps, and configuration.</p>
				<textarea id="instructions" name="instructions" rows={5} class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-mono leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600">{data.mod.instructions}</textarea>
			</div>

			<!-- Row: NPM + Source -->
			<div class="grid gap-6 sm:grid-cols-2">
				<div>
					<div class="min-h-[4rem]">
						<label for="npm" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
							NPM Package Name <span class="text-zumito-600">*</span>
						</label>
						<p class="mt-1 text-xs leading-relaxed text-zinc-400">The exact name used in <code class="rounded bg-zinc-100 px-1 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">npm publish</code>.</p>
					</div>
					<input id="npm" name="npm" required bind:value={npmValue} class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
					<button type="button" onclick={loadReadme} disabled={loadingReadme || !npmValue.trim()}
						class="mt-2 flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-zumito-300 hover:text-zumito-600 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zumito-600/40">
						{#if loadingReadme}
							<svg class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
						{:else}
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 18a3.5 3.5 0 000-7h-1a5 4.5 0 00-11-2 4.6 4.4 0 00-2.1 8.4"/><path d="M12 13v9"/><path d="M9 19l3 3 3-3"/></svg>
						{/if}
						Load from npm
					</button>
				</div>
				<div>
					<div class="min-h-[4rem]">
						<label for="sourceCode" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Source Code URL</label>
						<p class="mt-1 text-xs leading-relaxed text-zinc-400">Link to the GitHub repository or source code.</p>
					</div>
					<input id="sourceCode" name="sourceCode" bind:value={sourceCodeValue} placeholder="https://github.com/username/my-module" class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
				</div>
			</div>

			<!-- Row: Pricing + Features -->
			<div class="grid gap-6 sm:grid-cols-2">
				<div>
					<div class="min-h-[4rem]">
						<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Pricing</label>
					</div>
					<div class="mt-2 flex rounded-xl border border-zinc-300 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
						<button type="button" class="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">Free</button>
						<button type="button" disabled class="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 line-through dark:text-zinc-600">Paid</button>
					</div>
					<p class="mt-2 text-xs text-zinc-400">Paid modules will be available soon. All modules are free for now.</p>
					<input type="hidden" name="price" value={String(data.mod.price)} />
				</div>
				<div>
					<div class="min-h-[4rem]">
						<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Features</label>
						<p class="mt-1 text-xs leading-relaxed text-zinc-400">Existing tags to categorize your module. You can add new ones.</p>
					</div>
					<div class="mt-2 flex flex-wrap gap-1.5">
						{#each data.features as f}
							<label class="cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-all has-[:checked]:border-zumito-600 has-[:checked]:bg-zumito-50 has-[:checked]:text-zumito-700 dark:border-zinc-800 dark:has-[:checked]:border-zumito-600 dark:has-[:checked]:bg-zumito-600/10 dark:has-[:checked]:text-zumito-400"
								class:border-zumito-600={data.mod.features?.some((mf: any) => mf.name === f.name)}
								class:bg-zumito-50={data.mod.features?.some((mf: any) => mf.name === f.name)}
								class:text-zumito-700={data.mod.features?.some((mf: any) => mf.name === f.name)}>
								<input type="checkbox" name="features" value={f.name} checked={data.mod.features?.some((mf: any) => mf.name === f.name)} class="sr-only" />
								{f.emoji} {f.name}
							</label>
						{/each}
					</div>
					<input name="features" placeholder="Or type a new feature and press Enter..." onkeydown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} class="mt-2 block w-full rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:placeholder:text-zinc-600" />
				</div>
			</div>

			<!-- Dependencies -->
			{#if data.modules.length > 0}
				<div>
					<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Dependencies</label>
					<p class="mt-1 text-xs text-zinc-400">Other modules yours depends on. Hold Ctrl/Cmd to select multiple.</p>
					<select name="dependencies" multiple class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" size={6}>
						{#each data.modules as m}
							<option value={m.id} selected={data.mod.dependencies?.some((d: any) => d.dependencyId === m.id)}>{m.name}</option>
						{/each}
					</select>
				</div>
			{/if}

			<!-- Submit -->
			<div class="flex items-center gap-4 pt-4">
				<button type="submit" disabled={loading} class="flex items-center gap-2 rounded-full bg-zumito-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98] disabled:opacity-70">
					{#if loading}<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{/if}
					{loading ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	</Card>
</Container>
