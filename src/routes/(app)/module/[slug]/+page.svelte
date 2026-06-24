<script lang="ts">
	import { marked } from 'marked';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();

	$effect(() => {
		if (form) {
			data = { ...data, ...form };
		}
	});
</script>

<svelte:head>
	<title>{data.mod.name} — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-16">
	<!-- Header -->
	<div class="flex items-start gap-6">
		<div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
			{#if data.mod.icon}
				<img src={data.mod.icon} alt="" class="h-full w-full rounded-2xl object-cover" />
			{:else}
				<span class="text-3xl">📦</span>
			{/if}
		</div>
		<div class="min-w-0 flex-1">
			<h1 class="text-3xl font-bold">{data.mod.name}</h1>
			<p class="mt-1 text-zinc-500">by {data.mod.author.username}</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each data.mod.features as f}
					<Badge text="{f.emoji} {f.name}" />
				{/each}
			</div>
			<div class="mt-3 flex items-center gap-4 text-sm text-zinc-500">
				<span>{data.mod._count.installs} installs</span>
				<span>{data.mod._count.comments} comments</span>
				<span>{new Date(data.mod.createdAt).toLocaleDateString()}</span>
			</div>
		</div>
		<div class="shrink-0">
			{#if data.mod.price > 0}
				<div class="text-2xl font-bold">${data.mod.price}</div>
			{/if}
			{#if data.userHasInstalled}
				<span class="inline-block rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">Installed</span>
			{:else}
				<div class="space-y-2">
					<button
						onclick={() => { (window as any).zumito?.installModule?.(data.mod.npm); }}
						class="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
					>
						Install with Zumito
					</button>
					<form method="POST" action="?/install" use:enhance>
						<input type="hidden" name="moduleId" value={data.mod.id} />
						<button type="submit" class="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
							Mark as Installed
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
		<!-- Main content -->
		<div class="min-w-0 space-y-10">
			<!-- Images -->
			{#if data.mod.images.length > 0}
				<section>
					<h2 class="text-lg font-semibold">Gallery</h2>
					<div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
						{#each data.mod.images as img}
							<img src={img.url} alt={img.altText ?? ''} class="rounded-lg border border-zinc-200 object-cover dark:border-zinc-800" />
						{/each}
					</div>
				</section>
			{/if}

			<!-- Description -->
			<section>
				<h2 class="text-lg font-semibold">Description</h2>
				<div class="prose prose-zinc mt-3 dark:prose-invert max-w-none">
					{@html marked.parse(data.mod.description)}
				</div>
			</section>

			<!-- Instructions -->
			{#if data.mod.instructions}
				<section>
					<h2 class="text-lg font-semibold">Installation</h2>
					<div class="prose prose-zinc mt-3 dark:prose-invert max-w-none">
						{@html marked.parse(data.mod.instructions)}
					</div>
				</section>
			{/if}

			<!-- FAQ -->
			{#if data.mod.faqs.length > 0}
				<section>
					<h2 class="text-lg font-semibold">FAQ</h2>
					<div class="mt-3 space-y-3">
						{#each data.mod.faqs as faq}
							<Card>
								<div class="font-medium">{faq.question}</div>
								<div class="prose prose-zinc mt-2 text-sm dark:prose-invert">{@html marked.parse(faq.answer)}</div>
							</Card>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Comments -->
			<section>
				<h2 class="text-lg font-semibold">Comments ({data.mod._count.comments})</h2>
				<div class="mt-3 space-y-4">
					{#each data.mod.comments as comment}
						<Card>
							<div class="flex items-center gap-2 text-sm text-zinc-500">
								<span class="font-medium text-zinc-900 dark:text-zinc-100">{comment.author.username}</span>
								<span>{new Date(comment.createdAt).toLocaleDateString()}</span>
							</div>
							<div class="prose prose-zinc mt-2 text-sm dark:prose-invert">{@html marked.parse(comment.content)}</div>
						</Card>
					{/each}
				</div>
				<form method="POST" action="?/comment" use:enhance class="mt-4">
					<input type="hidden" name="moduleId" value={data.mod.id} />
					<textarea
						name="content"
						rows={3}
						required
						placeholder="Write a comment..."
						class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
					></textarea>
					<button type="submit" class="mt-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
						Post Comment
					</button>
				</form>
			</section>
		</div>

		<!-- Sidebar -->
		<aside class="space-y-6">
			{#if data.mod.dependencies.length > 0}
				<Card>
					<h3 class="font-semibold text-sm">Dependencies</h3>
					<div class="mt-2 space-y-2">
						{#each data.mod.dependencies as dep}
							<a href="/module/{dep.dependency.slug}" class="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
								{dep.dependency.icon ? dep.dependency.icon : '📦'} {dep.dependency.name}
							</a>
						{/each}
					</div>
				</Card>
			{/if}

			{#if data.mod.requiredBy.length > 0}
				<Card>
					<h3 class="font-semibold text-sm">Required By</h3>
					<div class="mt-2 space-y-2">
						{#each data.mod.requiredBy as dep}
							<a href="/module/{dep.module.slug}" class="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
								{dep.module.icon ? dep.module.icon : '📦'} {dep.module.name}
							</a>
						{/each}
					</div>
				</Card>
			{/if}

			{#if data.mod.sourceCode}
				<Card>
					<h3 class="font-semibold text-sm">Source Code</h3>
					<a href={data.mod.sourceCode} target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
						View on GitHub →
					</a>
				</Card>
			{/if}
		</aside>
	</div>
</div>
