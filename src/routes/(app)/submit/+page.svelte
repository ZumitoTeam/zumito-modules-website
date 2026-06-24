<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();
</script>

<svelte:head>
	<title>Submit Module — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-16">
	{#if !data.user}
		<!-- ═══════════ NOT LOGGED IN — Bento Landing ═══════════ -->
		<div class="text-center">
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

		<!-- Bento process grid -->
		<div class="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
			<!-- Hero card: what you can submit -->
			<article class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zumito-200 lg:col-span-2 lg:row-span-2 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
				<div class="absolute inset-x-0 top-0 h-0.5 bg-zumito-600" />
				<div class="flex h-12 w-12 items-center justify-center rounded-xl border border-zumito-200 bg-zumito-50 text-zumito-600 dark:border-zumito-600/30 dark:bg-zumito-600/10">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M12 22.08V12" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /></svg>
				</div>
				<h3 class="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">What can you submit?</h3>
				<div class="mt-4 grid gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:grid-cols-2">
					<div class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
						<span>Commands &mdash; slash and prefix bot commands</span>
					</div>
					<div class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
						<span>Events &mdash; Discord and framework event handlers</span>
					</div>
					<div class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
						<span>Modules &mdash; complete feature packages</span>
					</div>
					<div class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
						<span>Database models, routes, embeds, and more</span>
					</div>
				</div>
			</article>

			<!-- Step 1 -->
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">1</div>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Create your module</h3>
				<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Build it with the Zumito Framework. Use the CLI to scaffold commands, events, and models.</p>
			</article>

			<!-- Step 2 -->
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">2</div>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Publish to npm</h3>
				<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Release your package on the npm registry with a version tag.</p>
			</article>

			<!-- Step 3 -->
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">3</div>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Submit here</h3>
				<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Fill in the details, add screenshots, choose features. We review quickly.</p>
			</article>

			<!-- Step 4 -->
			<article class="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-zumito-600 text-sm font-extrabold text-white">4</div>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">Get discovered</h3>
				<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Once approved, your module appears in the marketplace. Developers install via Zumito Studio.</p>
			</article>
		</div>

		<!-- Requirements section -->
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
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Quick manual review by team</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Usually approved within 24h</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Feedback if changes needed</li>
				</ul>
			</div>

			<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
				<svg class="h-8 w-8 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
				<h3 class="mt-4 font-bold text-zinc-900 dark:text-zinc-100">After Publishing</h3>
				<ul class="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Track installs and comments</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Push updates via npm</li>
					<li class="flex items-start gap-2"><svg class="mt-0.5 h-4 w-4 shrink-0 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Edit listing anytime</li>
				</ul>
			</div>
		</div>
	{:else}
		<!-- ═══════════ LOGGED IN — Submit Form ═══════════ -->
		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Submit a Module</h1>
		<p class="mt-2 text-zinc-500 dark:text-zinc-400">Share your Discord bot module with the community.</p>

		<form method="POST" use:enhance class="mt-8 space-y-5">
			{#if form?.error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">{form.error}</div>
			{/if}

			<div>
				<label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name <span class="text-zumito-600">*</span></label>
				<input id="name" name="name" required class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label for="slug" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug <span class="text-zumito-600">*</span></label>
				<input id="slug" name="slug" required placeholder="my-awesome-module" class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label for="shortDescription" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Short Description</label>
				<input id="shortDescription" name="shortDescription" class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description (Markdown) <span class="text-zumito-600">*</span></label>
				<textarea id="description" name="description" rows={8} required class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
			</div>

			<div>
				<label for="instructions" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Installation Instructions (Markdown)</label>
				<textarea id="instructions" name="instructions" rows={4} class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
			</div>

			<div>
				<label for="npm" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">NPM Package Name <span class="text-zumito-600">*</span></label>
				<input id="npm" name="npm" required placeholder="@scope/package-name" class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label for="sourceCode" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Source Code URL</label>
				<input id="sourceCode" name="sourceCode" placeholder="https://github.com/..." class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label for="price" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (USD)</label>
				<input id="price" name="price" type="number" min="0" step="0.01" value="0" class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
			</div>

			<div>
				<label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Features (comma separated)</label>
				<input name="features" placeholder="music, moderation, utility" class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			</div>

			<div>
				<label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dependencies</label>
				<select name="dependencies" multiple class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" size={5}>
					{#each data.modules as m}
						<option value={m.id}>{m.name}</option>
					{/each}
				</select>
			</div>

			<button type="submit" class="rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
				Submit Module
			</button>
		</form>
	{/if}
</div>
