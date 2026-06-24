<script lang="ts">
	import { marked } from 'marked';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form?: any } = $props();
	$effect(() => { if (form) data = { ...data, ...form }; });

	let showImageModal = $state(false);
	let selectedImageIndex = $state(0);

	function openImage(index: number) {
		selectedImageIndex = index;
		showImageModal = true;
	}
	function closeImage() { showImageModal = false; }
	function nextImage() {
		if (selectedImageIndex < (data.mod.images?.length || 0) - 1) selectedImageIndex++;
	}
	function prevImage() {
		if (selectedImageIndex > 0) selectedImageIndex--;
	}
	function handleKey(e: KeyboardEvent) {
		if (!showImageModal) return;
		if (e.key === 'Escape') closeImage();
		if (e.key === 'ArrowRight') nextImage();
		if (e.key === 'ArrowLeft') prevImage();
	}
</script>

<svelte:window onkeydown={handleKey} />

<svelte:head>
	<title>{data.mod.name} — Zumito Modules</title>
	<meta name="description" content={data.mod.shortDescription || `Discover ${data.mod.name} on Zumito Modules.`} />
	<meta property="og:title" content={`${data.mod.name} — Zumito Modules`} />
	<meta property="og:description" content={data.mod.shortDescription || `Discover ${data.mod.name} on Zumito Modules.`} />
	{#if data.mod.images?.[0]?.url}
		<meta property="og:image" content={data.mod.images[0].url} />
	{/if}
	<link rel="canonical" href="https://zumito.dev/module/{data.mod.slug}" />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Product",
			"name": data.mod.name,
			"offers": { "@type": "Offer", "priceCurrency": "USD", "price": Number(data.mod.price), "availability": "https://schema.org/InStock" }
		})}
	</script>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-12">
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
	</div>

	<!-- Image gallery -->
	{#if data.mod.images?.length > 0}
		<div class="mt-10 flex snap-x gap-4 overflow-x-auto pb-2">
			{#each data.mod.images as img, i}
				<button onclick={() => openImage(i)} class="group relative shrink-0 cursor-pointer">
					<img src={img.url} alt={img.altText ?? ''} class="h-[260px] w-auto rounded-xl border border-zinc-200 object-cover transition-transform group-hover:scale-[1.02] dark:border-zinc-800" />
					<div class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-all group-hover:bg-black/10">
						<svg class="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
					</div>
				</button>
			{/each}
		</div>
	{/if}

	<div class="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
		<!-- Main content -->
		<div class="min-w-0 space-y-10">
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
					<textarea name="content" rows={3} required placeholder="Write a comment..." class="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
					<button type="submit" class="mt-2 rounded-full bg-zumito-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Post Comment</button>
				</form>
			</section>
		</div>

		<!-- Sticky Sidebar -->
		<aside class="space-y-5 lg:sticky lg:top-20 lg:self-start">
			<!-- Install -->
			{#if data.userHasInstalled}
				<span class="flex w-full items-center justify-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Installed
				</span>
			{:else}
				<button onclick={() => { (window as any).zumito?.installModule?.(data.mod.npm); }}
					class="group flex w-full items-center justify-center gap-2 rounded-full bg-zumito-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
					Install with Zumito
					<span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
					</span>
				</button>
				<form method="POST" action="?/install" use:enhance>
					<input type="hidden" name="moduleId" value={data.mod.id} />
					<button type="submit" class="mt-2 w-full rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zumito-600/40">Mark as Installed</button>
				</form>
			{/if}

			<!-- Stats -->
			<div class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
				<div class="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
					<svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
					<span class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Price</span>
					<span class="ml-auto text-sm font-semibold text-zinc-900 dark:text-zinc-100">{Number(data.mod.price) === 0 ? 'Free' : `$${data.mod.price}`}</span>
				</div>
				<div class="flex items-center gap-3 bg-white px-5 py-3 dark:bg-zinc-950">
					<svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M19 18a3.5 3.5 0 0 0 0-7h-1a5 4.5 0 0 0-11-2 4.6 4.4 0 0 0-2.1 8.4"/><path d="M12 13v9"/><path d="M9 19l3 3 3-3"/></svg>
					<span class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Installs</span>
					<span class="ml-auto text-sm font-semibold text-zinc-900 dark:text-zinc-100">{data.mod._count.installs}</span>
				</div>
			</div>

			<!-- Dependencies -->
			{#if data.mod.dependencies.length > 0}
				<div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
					<h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Dependencies</h3>
					<div class="mt-3 space-y-2">
						{#each data.mod.dependencies as dep}
							<a href="/module/{dep.dependency.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:hover:border-zumito-600/30">
								{#if dep.dependency.icon}
									<img src={dep.dependency.icon} alt="" class="h-10 w-10 shrink-0 rounded-lg border border-zinc-200 object-cover dark:border-zinc-800" />
								{:else}
									<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
										<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dep.dependency.name}</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Required by -->
			{#if data.mod.requiredBy.length > 0}
				<div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
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
				<div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
					<a href={data.mod.sourceCode} target="_blank" rel="noopener noreferrer" class="flex items-center justify-between text-sm text-zinc-500 transition-colors hover:text-zumito-600 dark:text-zinc-400">
						View Source Code
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
					</a>
				</div>
			{/if}
		</aside>
	</div>
</div>

<!-- Image Modal -->
{#if showImageModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onclick={closeImage} role="dialog" aria-modal="true">
		<button onclick={closeImage} class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-800 shadow-lg transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700" aria-label="Close">
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
		</button>
		{#if selectedImageIndex > 0}
			<button onclick={(e: Event) => { e.stopPropagation(); prevImage(); }} class="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 shadow-lg transition-colors hover:bg-white dark:bg-zinc-800/80 dark:text-white" aria-label="Previous">
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg>
			</button>
		{/if}
		{#if selectedImageIndex < (data.mod.images?.length || 0) - 1}
			<button onclick={(e: Event) => { e.stopPropagation(); nextImage(); }} class="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 shadow-lg transition-colors hover:bg-white dark:bg-zinc-800/80 dark:text-white" aria-label="Next">
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
			</button>
		{/if}
		<img src={data.mod.images[selectedImageIndex].url} alt={data.mod.images[selectedImageIndex].altText ?? ''} class="max-h-[85vh] max-w-full rounded-xl object-contain" onclick={(e: Event) => e.stopPropagation()} />
		{#if (data.mod.images?.length || 0) > 1}
			<div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
				{#each data.mod.images as _, i}
					<button onclick={(e: Event) => { e.stopPropagation(); selectedImageIndex = i; }} class="h-2.5 w-2.5 rounded-full transition-colors {i === selectedImageIndex ? 'bg-white' : 'bg-white/40'}" aria-label="Image {i + 1}" />
				{/each}
			</div>
		{/if}
	</div>
{/if}
