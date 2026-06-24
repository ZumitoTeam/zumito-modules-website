<script lang="ts">
	import { marked } from 'marked';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();
	$effect(() => { if (form) data = { ...data, ...form }; });
</script>

<svelte:head>
	<title>{data.mod.name} — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-16">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-start">
		<div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
			{#if data.mod.icon}
				<img src={data.mod.icon} alt="" class="h-full w-full rounded-2xl object-cover" />
			{:else}
				<svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
			{/if}
		</div>

		<div class="min-w-0 flex-1">
			<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{data.mod.name}</h1>
			<p class="mt-1 text-zinc-500">by {data.mod.author.username}</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each data.mod.features as f}
					<span class="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">{f.emoji} {f.name}</span>
				{/each}
			</div>
			<div class="mt-3 flex items-center gap-4 text-sm text-zinc-500">
				<span>{data.mod._count.installs} installs</span>
				<span>{data.mod._count.comments} comments</span>
				<span>{new Date(data.mod.createdAt).toLocaleDateString()}</span>
			</div>
		</div>

		<div class="shrink-0 space-y-3 sm:text-right">
			{#if data.mod.price > 0}
				<div class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">${data.mod.price}</div>
			{/if}
			{#if data.userHasInstalled}
				<span class="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
					Installed
				</span>
			{:else}
				<button
					onclick={() => { (window as any).zumito?.installModule?.(data.mod.npm); }}
					class="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
					Install with Zumito
					<span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
					</span>
				</button>
				<form method="POST" action="?/install" use:enhance>
					<input type="hidden" name="moduleId" value={data.mod.id} />
					<button type="submit" class="mt-2 w-full rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zumito-600/40">
						Mark as Installed
					</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
		<div class="min-w-0 space-y-10">
			{#if data.mod.images.length > 0}
				<section>
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Gallery</h2>
					<div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
						{#each data.mod.images as img}
							<img src={img.url} alt={img.altText ?? ''} class="rounded-lg border border-zinc-200 object-cover dark:border-zinc-800" />
						{/each}
					</div>
				</section>
			{/if}

			<section>
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Description</h2>
				<div class="prose prose-zinc mt-3 max-w-none dark:prose-invert">{@html marked.parse(data.mod.description)}</div>
			</section>

			{#if data.mod.instructions}
				<section>
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Installation</h2>
					<div class="prose prose-zinc mt-3 max-w-none dark:prose-invert">{@html marked.parse(data.mod.instructions)}</div>
				</section>
			{/if}

			{#if data.mod.faqs.length > 0}
				<section>
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">FAQ</h2>
					<div class="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
						{#each data.mod.faqs as faq}
							<details class="group py-4">
								<summary class="flex cursor-pointer items-center justify-between font-medium text-zinc-700 dark:text-zinc-200">
									{faq.question}
									<svg class="h-5 w-5 text-zinc-400 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
								</summary>
								<div class="prose prose-zinc mt-3 text-sm dark:prose-invert">{@html marked.parse(faq.answer)}</div>
							</details>
						{/each}
					</div>
				</section>
			{/if}

			<section>
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Comments ({data.mod._count.comments})</h2>
				<div class="mt-3 space-y-4">
					{#each data.mod.comments as comment}
						<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
							<div class="flex items-center gap-2 text-sm text-zinc-500">
								<span class="font-semibold text-zinc-700 dark:text-zinc-300">{comment.author.username}</span>
								<span>&middot;</span>
								<span>{new Date(comment.createdAt).toLocaleDateString()}</span>
							</div>
							<div class="prose prose-zinc mt-2 text-sm dark:prose-invert">{@html marked.parse(comment.content)}</div>
						</div>
					{/each}
				</div>
				<form method="POST" action="?/comment" use:enhance class="mt-4">
					<input type="hidden" name="moduleId" value={data.mod.id} />
					<textarea name="content" rows={3} required placeholder="Write a comment..."
						class="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
					<button type="submit" class="mt-2 rounded-full bg-zumito-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Post Comment</button>
				</form>
			</section>
		</div>

		<aside class="space-y-6">
			{#if data.mod.dependencies.length > 0}
				<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
					<h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Dependencies</h3>
					<div class="mt-3 space-y-2">
						{#each data.mod.dependencies as dep}
							<a href="/module/{dep.dependency.slug}" class="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zumito-600 dark:text-zinc-400">
								<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
								{dep.dependency.name}
							</a>
						{/each}
					</div>
				</div>
			{/if}

			{#if data.mod.requiredBy.length > 0}
				<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
					<h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Required By</h3>
					<div class="mt-3 space-y-2">
						{#each data.mod.requiredBy as dep}
							<a href="/module/{dep.module.slug}" class="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zumito-600 dark:text-zinc-400">
								<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
								{dep.module.name}
							</a>
						{/each}
					</div>
				</div>
			{/if}

			{#if data.mod.sourceCode}
				<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
					<h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Source Code</h3>
					<a href={data.mod.sourceCode} target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zumito-600 dark:text-zinc-400">
						View on GitHub
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
					</a>
				</div>
			{/if}
		</aside>
	</div>
</div>
