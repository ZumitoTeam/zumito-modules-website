<script lang="ts">
	import { marked } from 'marked';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';

	let { data, form }: { data: PageData; form?: any } = $props();
	$effect(() => { if (form) data = { ...data, ...form }; });

	let showImageModal = $state(false);
	let selectedImageIndex = $state(0);

	function openImage(index: number) { selectedImageIndex = index; showImageModal = true; }
	function closeImage() { showImageModal = false; }
	function nextImage() { if (selectedImageIndex < (data.mod.images?.length || 0) - 1) selectedImageIndex++; }
	function prevImage() { if (selectedImageIndex > 0) selectedImageIndex--; }
	function handleKey(e: KeyboardEvent) {
		if (!showImageModal) return;
		if (e.key === 'Escape') closeImage();
		if (e.key === 'ArrowRight') nextImage();
		if (e.key === 'ArrowLeft') prevImage();
	}
	function scrollTo(id: string) {
		const d = document.getElementById(id + '-d');
		const m = document.getElementById(id + '-m');
		const el = (d?.offsetParent ? d : null) ?? (m?.offsetParent ? m : null) ?? document.getElementById(id);
		el?.scrollIntoView({ behavior: 'smooth' });
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
		{JSON.stringify({ "@context": "https://schema.org", "@type": "Product", "name": data.mod.name, "offers": { "@type": "Offer", "priceCurrency": "USD", "price": Number(data.mod.price), "availability": "https://schema.org/InStock" } })}
	</script>
</svelte:head>

<!-- Header -->
<div class="mx-auto max-w-screen-xl px-4 pt-12">
	<div class="flex items-center gap-4">
		{#if data.mod.icon}
			<img src={data.mod.icon} alt="" class="h-16 w-16 shrink-0 rounded-xl border border-zinc-200 object-cover shadow-lg lg:h-20 lg:w-20 dark:border-zinc-700" />
		{/if}
		<div class="min-w-0 flex-1">
			<h1 class="text-4xl font-extrabold tracking-tight text-zinc-900 lg:text-5xl dark:text-zinc-100">{data.mod.name}</h1>
			{#if data.mod.shortDescription}
				<p class="mt-2 hidden text-lg text-zinc-500 sm:block dark:text-zinc-400">{data.mod.shortDescription}</p>
			{/if}
			<div class="mt-2 flex flex-wrap gap-2">
				{#each data.mod.features as f}
					<span class="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">{f.emoji} {f.name}</span>
				{/each}
			</div>
			</div>
		</div>
</div>

<!-- Image Gallery -->
{#if data.mod.images?.length > 0}
	<div class="mx-auto mt-6 max-w-screen-xl px-4">
		<div class="flex snap-x gap-4 overflow-x-auto pb-2">
			{#each data.mod.images as img, i}
				<button onclick={() => openImage(i)} class="group relative shrink-0 cursor-pointer">
					<img src={img.url} alt={img.altText ?? ''} class="h-[300px] w-auto min-w-[200px] snap-center rounded-xl border border-zinc-200 object-cover shadow-lg transition-transform group-hover:scale-[1.02] dark:border-zinc-700" />
					<div class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-all group-hover:bg-black/10">
						<svg class="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}

<!-- Content + Sidebar -->
<div class="mx-auto flex max-w-screen-xl flex-col-reverse gap-12 px-4 py-12 lg:flex-row">
	<!-- Main content (left, 2/3) -->
	<div class="w-full lg:w-4/6">
		<div class="mb-4 text-2xl font-semibold text-zinc-900 dark:text-white">
			Description
		</div>
		<Card variant="shadow" padding="md" class="prose prose-lg min-w-full max-w-none dark:prose-invert">
			{@html marked.parse(data.mod.description)}
		</Card>

		{#if data.mod.instructions}
			<div class="mb-4 mt-12 text-2xl font-semibold text-zinc-900 dark:text-white">
				Installation
			</div>
			<Card variant="shadow" padding="md" class="prose prose-lg min-w-full max-w-none dark:prose-invert mb-12 mt-4">
			{@html marked.parse(data.mod.instructions)}
		</Card>
		{/if}

		{#if data.mod.faqs?.length > 0}
			<div id="faq-section" class="mb-4 mt-12 scroll-mt-20 text-2xl font-semibold text-zinc-900 dark:text-white">
				FAQ
			</div>
		<Card variant="shadow" padding="md" class="flex flex-col gap-5">
			{#each data.mod.faqs as faq}
				<details class="group border-b border-zinc-200 pb-4 last:border-0 last:pb-0 dark:border-zinc-800">
					<summary class="flex cursor-pointer items-center justify-between font-semibold text-zinc-800 dark:text-zinc-200">
						{faq.question}
						<svg class="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
					</summary>
					<div class="prose prose-sm mt-3 text-zinc-600 dark:prose-invert dark:text-zinc-400">{@html marked.parse(faq.answer)}</div>
				</details>
			{/each}
		</Card>
	{/if}

		<div id="comments-section" class="mb-4 mt-12 scroll-mt-20 text-2xl font-semibold text-zinc-900 dark:text-white">
			Comments ({data.mod._count.comments})
		</div>
		<Card variant="shadow" padding="md">
			{#each data.mod.comments as comment}
				<div class="border-b border-zinc-200 py-4 first:pt-0 last:border-0 last:pb-0 dark:border-zinc-800">
					<div class="flex items-center gap-2 text-sm text-zinc-500">
						<span class="font-semibold text-zinc-700 dark:text-zinc-300">{comment.author.username}</span>
						<span>&middot;</span>
						<span>{new Date(comment.createdAt).toLocaleDateString()}</span>
					</div>
					<div class="prose prose-sm mt-2 dark:prose-invert">{@html marked.parse(comment.content)}</div>
				</div>
			{/each}
			<form method="POST" action="?/comment" use:enhance class="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
				<input type="hidden" name="moduleId" value={data.mod.id} />
				<textarea name="content" rows={3} required placeholder="Write a comment..." class="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"></textarea>
				<button type="submit" class="mt-3 rounded-full bg-zumito-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Post Comment</button>
			</form>
		</Card>

		<!-- Mobile: Deps / Addons / Addon-for below comments -->
		<div class="mt-8 flex flex-col gap-5 lg:hidden">
			{#if data.mod.dependencies?.length > 0}
				<Card variant="shadow" padding="md" id="deps-section-m" class="scroll-mt-20">
					<div class="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
						<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M6.857 4.5h10.286c.955 0 1.857.536 2.329 1.401l1.143 2.057c.388.697.388 1.543 0 2.24l-1.143 2.057a2.571 2.571 0 01-2.329 1.401H6.857a2.571 2.571 0 01-2.329-1.401L3.385 10.2a2.571 2.571 0 010-2.24l1.143-2.057A2.571 2.571 0 016.857 4.5z"/></svg>
						Dependencies
					</div>
					<div class="flex flex-col gap-3">
						{#each data.mod.dependencies as dep}
							<a href="/module/{dep.dependency.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition hover:border-zumito-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zumito-600">
								{#if dep.dependency.icon}
									<img src={dep.dependency.icon} alt="" class="h-10 w-10 rounded border border-zinc-200 object-cover dark:border-zinc-800" />
								{/if}
								<div>
									<div class="text-sm font-semibold text-zinc-900 dark:text-white">{dep.dependency.name}</div>
								</div>
							</a>
						{/each}
					</div>
				</Card>
			{/if}
			{#if data.mod.addons?.length > 0}
				<Card variant="shadow" padding="md" id="addons-section-m" class="scroll-mt-20">
					<div class="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
						<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/></svg>
						Addons
					</div>
					<div class="flex flex-col gap-3">
						{#each data.mod.addons as a}
							<a href="/module/{a.addonModule.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition hover:border-zumito-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zumito-600">
								{#if a.addonModule.icon}
									<img src={a.addonModule.icon} alt="" class="h-10 w-10 rounded border border-zinc-200 object-cover dark:border-zinc-800" />
								{/if}
								<div>
									<div class="text-sm font-semibold text-zinc-900 dark:text-white">{a.addonModule.name}</div>
								</div>
							</a>
						{/each}
					</div>
				</Card>
			{/if}
			{#if data.mod.addonTargets?.length > 0}
				<Card variant="shadow" padding="md" id="addonfor-section-m" class="scroll-mt-20">
					<div class="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
						<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
						Addon for
					</div>
					<div class="flex flex-col gap-3">
						{#each data.mod.addonTargets as a}
							<a href="/module/{a.baseModule.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition hover:border-zumito-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zumito-600">
								{#if a.baseModule.icon}
									<img src={a.baseModule.icon} alt="" class="h-10 w-10 rounded border border-zinc-200 object-cover dark:border-zinc-800" />
								{/if}
								<div>
									<div class="text-sm font-semibold text-zinc-900 dark:text-white">{a.baseModule.name}</div>
								</div>
							</a>
						{/each}
					</div>
				</Card>
			{/if}
		</div>
	</div>

	<!-- Sidebar (right, 1/3) -->
	<div class="flex h-fit w-full flex-col gap-5 lg:sticky lg:top-[10px] lg:w-2/6">
		<!-- Install button -->
		{#if data.userHasInstalled}
			<span class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white">Installed</span>
		{:else}
			<button onclick={() => { (window as any).zumito?.installModule?.(data.mod.npm); }}
				class="w-full rounded-lg bg-zumito-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zumito-700 focus:outline-none focus:ring-4 focus:ring-zumito-300 active:scale-[0.98] dark:focus:ring-zumito-800">
				Install with Zumito
			</button>
		{/if}

		<!-- Stats list -->
		<Card variant="shadow" padding="sm" class="overflow-hidden !p-0">
			<div class="flex items-center gap-3 border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
				<svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M14.8 9a2 2 0 00-1.8-1h-2a2 2 0 100 4h2a2 2 0 110 4h-2a2 2 0 01-1.8-1"/><path d="M12 7v10"/></svg>
				<span class="flex-1 text-sm text-zinc-600 dark:text-zinc-400">Price</span>
				<span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{Number(data.mod.price) === 0 ? 'Free' : `$${data.mod.price}`}</span>
			</div>
			<div class="flex items-center gap-3 px-5 py-3">
				<svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M19 18a3.5 3.5 0 000-7h-1a5 4.5 0 00-11-2 4.6 4.4 0 00-2.1 8.4"/><path d="M12 13v9"/><path d="M9 19l3 3 3-3"/></svg>
				<span class="flex-1 text-sm text-zinc-600 dark:text-zinc-400">Installs</span>
				<span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{data.mod._count.installs}</span>
			</div>
			</Card>

		<!-- Dependencies -->
		{#if data.mod.dependencies?.length > 0}
			<Card variant="shadow" padding="md" class="hidden lg:block scroll-mt-20" id="deps-section-d">
				<div class="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
					<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M6.857 4.5h10.286c.955 0 1.857.536 2.329 1.401l1.143 2.057c.388.697.388 1.543 0 2.24l-1.143 2.057a2.571 2.571 0 01-2.329 1.401H6.857a2.571 2.571 0 01-2.329-1.401L3.385 10.2a2.571 2.571 0 010-2.24l1.143-2.057A2.571 2.571 0 016.857 4.5z"/></svg>
					Dependencies
				</div>
				<div class="flex flex-col gap-3">
					{#each data.mod.dependencies as dep}
						<a href="/module/{dep.dependency.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition hover:border-zumito-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zumito-600">
							{#if dep.dependency.icon}
								<img src={dep.dependency.icon} alt="" class="h-10 w-10 rounded border border-zinc-200 object-cover dark:border-zinc-800" />
							{/if}
							<div>
								<div class="text-sm font-semibold text-zinc-900 dark:text-white">{dep.dependency.name}</div>
							</div>
						</a>
					{/each}
				</div>
			</Card>
		{/if}

		<!-- Addons (modules that extend this one) -->
		{#if data.mod.addons?.length > 0}
			<Card variant="shadow" padding="md" class="hidden lg:block scroll-mt-20" id="addons-section-d">
				<div class="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
					<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/></svg>
					Addons
				</div>
				<div class="flex flex-col gap-3">
					{#each data.mod.addons as a}
						<a href="/module/{a.addonModule.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition hover:border-zumito-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zumito-600">
							{#if a.addonModule.icon}
								<img src={a.addonModule.icon} alt="" class="h-10 w-10 rounded border border-zinc-200 object-cover dark:border-zinc-800" />
							{/if}
							<div>
								<div class="text-sm font-semibold text-zinc-900 dark:text-white">{a.addonModule.name}</div>
							</div>
						</a>
					{/each}
				</div>
			</Card>
		{/if}

		<!-- Addon for (this module extends these) -->
		{#if data.mod.addonTargets?.length > 0}
			<Card variant="shadow" padding="md" class="hidden lg:block scroll-mt-20" id="addonfor-section-d">
				<div class="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
					<svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
					Addon for
				</div>
				<div class="flex flex-col gap-3">
					{#each data.mod.addonTargets as a}
						<a href="/module/{a.baseModule.slug}" class="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition hover:border-zumito-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zumito-600">
							{#if a.baseModule.icon}
								<img src={a.baseModule.icon} alt="" class="h-10 w-10 rounded border border-zinc-200 object-cover dark:border-zinc-800" />
							{/if}
							<div>
								<div class="text-sm font-semibold text-zinc-900 dark:text-white">{a.baseModule.name}</div>
							</div>
						</a>
					{/each}
				</div>
			</Card>
		{/if}

		<!-- Sidebar links -->
		<Card variant="shadow" padding="sm" class="overflow-hidden !p-0">
			<button onclick={() => scrollTo('comments-section')} class="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-zinc-600 transition-colors hover:text-zinc-900 cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-100">
				<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M3 20l1.3-3.9c-2.324-3.437-1.426-7.872 2.1-10.374 3.526-2.501 8.59-2.296 11.845.48 3.255 2.777 3.695 7.266 1.029 10.501-2.666 3.235-7.615 4.215-11.574 2.293L3 20z"/></svg>
				<span class="flex-1">Comments</span>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
			</button>
			{#if data.mod.faqs?.length > 0}
				<button onclick={() => scrollTo('faq-section')} class="flex w-full items-center gap-3 border-t border-zinc-200 px-5 py-3 text-left text-sm text-zinc-600 transition-colors hover:text-zinc-900 cursor-pointer dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100">
					<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M20.975 11.33a9 9 0 10-5.673 9.043"/><path d="M3.6 9h16.8"/><path d="M3.6 15h9.9"/><path d="M11.5 3a17 17 0 000 18"/><path d="M12.5 3a16.988 16.988 0 012.57 9.518"/></svg>
					<span class="flex-1">FAQ</span>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
				</button>
			{/if}
			{#if data.mod.dependencies?.length > 0}
				<button onclick={() => scrollTo('deps-section')} class="flex w-full items-center gap-3 border-t border-zinc-200 px-5 py-3 text-left text-sm text-zinc-600 transition-colors hover:text-zinc-900 cursor-pointer dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100">
					<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M6.857 4.5h10.286c.955 0 1.857.536 2.329 1.401l1.143 2.057c.388.697.388 1.543 0 2.24l-1.143 2.057a2.571 2.571 0 01-2.329 1.401H6.857a2.571 2.571 0 01-2.329-1.401L3.385 10.2a2.571 2.571 0 010-2.24l1.143-2.057A2.571 2.571 0 016.857 4.5z"/></svg>
					<span class="flex-1">Dependencies</span>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
				</button>
			{/if}
			{#if data.mod.addons?.length > 0}
				<button onclick={() => scrollTo('addons-section')} class="flex w-full items-center gap-3 border-t border-zinc-200 px-5 py-3 text-left text-sm text-zinc-600 transition-colors hover:text-zinc-900 cursor-pointer dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100">
					<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/></svg>
					<span class="flex-1">Addons</span>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
				</button>
			{/if}
			{#if data.mod.addonTargets?.length > 0}
				<button onclick={() => scrollTo('addonfor-section')} class="flex w-full items-center gap-3 border-t border-zinc-200 px-5 py-3 text-left text-sm text-zinc-600 transition-colors hover:text-zinc-900 cursor-pointer dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100">
					<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
					<span class="flex-1">Addon for</span>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
				</button>
			{/if}
		</Card>

		{#if data.mod.sourceCode}
			<a href={data.mod.sourceCode} target="_blank" rel="noopener noreferrer" class="block w-full">
				<Card variant="shadow" padding="sm" class="text-center !font-medium text-zinc-600 transition-colors hover:!text-zumito-600 dark:text-zinc-400 dark:hover:!text-zumito-400">
					View Source Code
				</Card>
			</a>
		{/if}
	</div>
</div>

<!-- Image Modal -->
{#if showImageModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onclick={closeImage} role="dialog" aria-modal="true">
		<button onclick={closeImage} class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-800 shadow-lg transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700" aria-label="Close">
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
		</button>
		{#if selectedImageIndex > 0}
			<button onclick={(e: Event) => { e.stopPropagation(); prevImage(); }} class="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 shadow-lg transition-colors hover:bg-white dark:bg-zinc-800/80 dark:text-white" aria-label="Previous"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg></button>
		{/if}
		{#if selectedImageIndex < (data.mod.images?.length || 0) - 1}
			<button onclick={(e: Event) => { e.stopPropagation(); nextImage(); }} class="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 shadow-lg transition-colors hover:bg-white dark:bg-zinc-800/80 dark:text-white" aria-label="Next"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg></button>
		{/if}
		<img src={data.mod.images[selectedImageIndex].url} alt={data.mod.images[selectedImageIndex].altText ?? ''} class="max-h-[85vh] max-w-full rounded-xl object-contain" onclick={(e: Event) => e.stopPropagation()} />
		{#if (data.mod.images?.length || 0) > 1}
			<div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
				{#each data.mod.images as _, i}
					<button onclick={(e: Event) => { e.stopPropagation(); selectedImageIndex = i; }} class="h-2.5 w-2.5 rounded-full {i === selectedImageIndex ? 'bg-white' : 'bg-white/40'}" aria-label="Image {i + 1}" />
				{/each}
			</div>
		{/if}
	</div>
{/if}
