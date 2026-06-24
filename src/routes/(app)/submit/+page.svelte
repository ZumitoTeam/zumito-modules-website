<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Container from '$lib/components/layout/Container.svelte';
	import { sileo } from 'svelte-sileo';
	import { marked } from 'marked';

	let { data, form }: { data: PageData; form?: any } = $props();

	let nameValue = $state('');
	let slugValue = $state('');
	let npmValue = $state('');
	let descriptionValue = $state('');
	let instructionsValue = $state('');
	let descriptionLocked = $state(false);
	let loadingReadme = $state(false);
	let sourceCodeValue = $state('');

	function generateSlug() {
		slugValue = nameValue
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function onSlugInput(e: Event) {
		const input = e.target as HTMLInputElement;
		input.value = input.value.replace(/\s+/g, '-').toLowerCase();
		slugValue = input.value;
	}

	async function loadReadme() {
		if (!npmValue.trim()) return;
		loadingReadme = true;

		sileo.promise(
			fetch('/api/npm/readme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ package: npmValue.trim() }),
			}).then(async (r) => {
				const data = await r.json();
				if (!data.ok) throw new Error(data.error);
				return data;
			}),
			{
				loading: { title: 'Fetching README...', description: `Loading from ${npmValue.trim()}`, fill: '#fafafa', styles: { title: 'text-zinc-900', description: 'text-zinc-500' } },
				success: (data: any) => {
					descriptionValue = data.readme;
					descriptionLocked = true;
					if (data.repository) sourceCodeValue = data.repository;
					return { title: 'README loaded', description: `${npmValue.trim()} description imported.`, fill: '#f0fdf4', styles: { title: 'text-green-800', description: 'text-green-600' } };
				},
				error: { title: 'Could not load README', description: 'Package not found or has no README.', fill: '#fef2f2', styles: { title: 'text-red-800', description: 'text-red-600' } },
			}
		).finally(() => { loadingReadme = false; });
	}
</script>

<svelte:head>
	<title>Submit Module — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4">
	{#if !data.user}
		<!-- ═══════════ NOT LOGGED IN — Bento Landing ═══════════ -->
		<div class="py-12 text-center">
			<h1 class="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-5xl">
				Share your <span class="text-zumito-600">module</span> with the world
			</h1>
			<p class="mx-auto mt-4 max-w-lg text-lg text-zinc-500 dark:text-zinc-400">
				Publish your Zumito Framework module and reach thousands of Discord bot developers.
			</p>
			<div class="mt-8 flex items-center justify-center gap-4">
				<a href="/login" class="rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Sign In to Submit</a>
				<a href="/register" class="rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">Create Account</a>
			</div>
		</div>

		<!-- (bento process grid + requirements — unchanged, same as before) -->
		<div class="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
			<article class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zumito-200 lg:col-span-2 lg:row-span-2 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
				<div class="absolute inset-x-0 top-0 h-0.5 bg-zumito-600" />
				<div class="flex h-12 w-12 items-center justify-center rounded-xl border border-zumito-200 bg-zumito-50 text-zumito-600 dark:border-zumito-600/30 dark:bg-zumito-600/10">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M12 22.08V12" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /></svg>
				</div>
				<h3 class="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">What can you submit?</h3>
				<div class="mt-4 grid gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:grid-cols-2">
					<div class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg><span>Commands &mdash; slash and prefix bot commands</span></div>
					<div class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg><span>Events &mdash; Discord and framework event handlers</span></div>
					<div class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg><span>Modules &mdash; complete feature packages</span></div>
					<div class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg><span>Database models, routes, embeds, and more</span></div>
				</div>
			</article>
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">1</div><h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Create your module</h3><p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Build it with the Zumito Framework. Use the CLI to scaffold commands, events, and models.</p></article>
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">2</div><h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Publish to npm</h3><p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Release your package on the npm registry with a version tag.</p></article>
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">3</div><h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Submit here</h3><p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Fill in the details, add screenshots, choose features. We review quickly.</p></article>
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">4</div><h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Get discovered</h3><p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Once approved, your module appears in the marketplace. Developers install via Zumito Studio.</p></article>
		</div>

		<div class="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
				<svg class="h-8 w-8 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M10.75 2.45c.7-.59 1.83-.59 2.51 0l5.66 4.82c.68.58 1.08 1.43 1.08 2.33v6.8c0 .9-.4 1.75-1.08 2.33l-5.66 4.82c-.7.59-1.83.59-2.51 0l-5.66-4.82C4.4 18.53 4 17.68 4 16.78v-6.8c0-.9.4-1.75 1.08-2.33l5.66-4.82z"/></svg>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Requirements</h3>
				<ul class="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Published npm package</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Built with Zumito Framework</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Clear description and instructions</li>
				</ul>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
				<svg class="h-8 w-8 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z"/></svg>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Review Process</h3>
				<ul class="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Quick manual review</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Usually within 24h</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Feedback if needed</li>
				</ul>
			</div>
			<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
				<svg class="h-8 w-8 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">After Publishing</h3>
				<ul class="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Track installs & comments</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Push updates via npm</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Edit listing anytime</li>
				</ul>
			</div>
		</div>
	{:else}
		<!-- ═══════════ LOGGED IN — Submit Form ═══════════ -->
		<Container class="py-12">
			<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Submit a Module</h1>
			<p class="mt-2 text-zinc-500 dark:text-zinc-400">Fill in the details below to publish your module to the marketplace. All fields marked with <span class="text-zumito-600">*</span> are required.</p>

			<section class="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
				<form method="POST" use:enhance class="space-y-8">
				{#if form?.error}
					<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">
						<div class="flex items-center gap-2 font-semibold">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
							There was a problem with your submission
						</div>
						<p class="mt-1">{form.error}</p>
					</div>
				{/if}

				<!-- Row: Name + Slug -->
				<div class="grid gap-6 sm:grid-cols-2">
					<div>
						<div class="min-h-[4rem]">
							<label for="name" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
								Module Name <span class="text-zumito-600">*</span>
							</label>
							<p class="mt-1 text-xs leading-relaxed text-zinc-400">The display name shown in the marketplace.</p>
						</div>
						<input id="name" name="name" required placeholder="My Awesome Command Module"
							bind:value={nameValue} oninput={generateSlug}
							class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
					</div>
					<div>
						<div class="min-h-[4rem]">
							<label for="slug" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
								URL Slug <span class="text-zumito-600">*</span>
							</label>
							<p class="mt-1 text-xs leading-relaxed text-zinc-400">Auto-generated from name. Use lowercase letters and dashes.</p>
						</div>
						<input id="slug" name="slug" required placeholder="my-awesome-command-module" value={slugValue} oninput={onSlugInput}
							class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
					</div>
				</div>

				<!-- Short Description -->
				<div>
					<label for="shortDescription" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Short Description</label>
					<p class="mt-1 text-xs text-zinc-400">A one-line summary shown in module cards. Max ~120 characters.</p>
					<input id="shortDescription" name="shortDescription" placeholder="Adds a powerful music queue system with Spotify and YouTube support"
						class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
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
						<p class="mt-1 text-xs text-zinc-400">
							Full description in Markdown. Explain what the module does, its features, and how to use it.
						</p>
						<textarea id="description" name="description" rows={10} required bind:value={descriptionValue}
							placeholder={`## My Awesome Module

A powerful Discord bot module that adds music queue functionality.

### Features
- Spotify and YouTube support
- Queue management with skip, shuffle, and loop
- Volume control per guild

### Usage
After installation, use \`/music play <query>\` to start playing music.`}
							class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-mono text-zinc-900 leading-relaxed placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
						<div class="mt-1 text-right text-xs text-zinc-400">{descriptionValue.length} characters</div>
					{/if}
				</div>

				<!-- Instructions -->
				<div>
					<label for="instructions" class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Installation Instructions</label>
					<p class="mt-1 text-xs text-zinc-400">Step-by-step guide in Markdown. Include npm install command, setup steps, and configuration.</p>
					<textarea id="instructions" name="instructions" rows={5} bind:value={instructionsValue}
						placeholder={`## Installation

1. Install the module:
\`\`\`bash
npm install @zumito-modules/my-module
\`\`\`
2. Add to your \`zumito.config.ts\` bundles array.
3. Restart your bot.`}
						class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-mono text-zinc-900 leading-relaxed placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
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
						<input id="npm" name="npm" required placeholder="@zumito-modules/music-queue" bind:value={npmValue}
							class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
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
						<input id="sourceCode" name="sourceCode" placeholder="https://github.com/username/my-module" bind:value={sourceCodeValue}
							class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
					</div>
				</div>

				<!-- Row: Pricing + Features -->
				<div class="grid gap-6 sm:grid-cols-2">
					<div>
						<div class="min-h-[4rem]">
							<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Pricing</label>
						</div>
						<div class="mt-2 flex rounded-xl border border-zinc-300 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
							<button type="button" onclick={() => {}}
								class="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">Free</button>
							<button type="button" disabled
								class="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 line-through transition-all dark:text-zinc-600">Paid</button>
						</div>
						<p class="mt-2 text-xs text-zinc-400">Paid modules will be available soon. All modules are free for now.</p>
						<input type="hidden" name="price" value="0" />
					</div>
					<div>
						<div class="min-h-[4rem]">
							<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Features</label>
							<p class="mt-1 text-xs leading-relaxed text-zinc-400">Existing tags to categorize your module. You can add new ones.</p>
						</div>
						<div class="mt-2 flex flex-wrap gap-1.5">
							{#each data.features as f}
								<label class="cursor-pointer rounded-full border border-zinc-200 px-3 py-1.5 text-xs transition-all has-[:checked]:border-zumito-600 has-[:checked]:bg-zumito-50 has-[:checked]:text-zumito-700 dark:border-zinc-800 dark:has-[:checked]:border-zumito-600 dark:has-[:checked]:bg-zumito-600/10 dark:has-[:checked]:text-zumito-400">
									<input type="checkbox" name="features" value={f.name} class="sr-only" />
									{f.emoji} {f.name}
								</label>
							{/each}
						</div>
						<input name="features" placeholder="Or type a new feature name and press Enter..." onkeydown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
							class="mt-2 block w-full rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:placeholder:text-zinc-600" />
					</div>
				</div>

				<!-- Dependencies -->
				{#if data.modules.length > 0}
					<div>
						<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Dependencies</label>
						<p class="mt-1 text-xs text-zinc-400">Other modules yours depends on. Hold Ctrl/Cmd to select multiple.</p>
						<select name="dependencies" multiple class="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" size={6}>
							{#each data.modules as m}
								<option value={m.id}>{m.name}</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Submit -->
				<div class="flex items-center gap-4 pt-4">
					<button type="submit" class="rounded-full bg-zumito-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
						Publish Module
					</button>
					<span class="text-xs text-zinc-400">Your module will be reviewed before appearing in the marketplace.</span>
				</div>

				<!-- Coming soon -->
				<div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
					<div class="flex items-start gap-4">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zumito-50 text-zumito-600 dark:bg-zumito-600/10">
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
						</div>
						<div>
							<h4 class="font-semibold text-zinc-700 dark:text-zinc-300">More options coming soon</h4>
							<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
								You&apos;ll be able to add screenshots, an icon, FAQ entries, and manage module dependencies after publishing. For now, submit the basics and edit later.
							</p>
						</div>
					</div>
				</div>
			</form>
			</section>
		</Container>
	{/if}
</div>
