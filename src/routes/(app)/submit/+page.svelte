<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();
</script>

<svelte:head>
	<title>Submit Module — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-16">
	{#if !data.user}
		<div class="text-center">
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-zumito-200 bg-zumito-50 dark:border-zumito-600/20 dark:bg-zumito-600/5">
				<svg class="h-10 w-10 text-zumito-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M12 22.08V12" /></svg>
			</div>
			<h1 class="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Share Your Module</h1>
			<p class="mx-auto mt-4 max-w-md text-zinc-500 dark:text-zinc-400">
				Sign in to submit your Zumito Framework module to the marketplace and reach developers worldwide.
			</p>
			<div class="mt-8 flex items-center justify-center gap-4">
				<a href="/login" class="rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Sign In</a>
				<a href="/register" class="rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">Register</a>
			</div>
		</div>
	{:else}
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
