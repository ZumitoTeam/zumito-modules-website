<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Browse Modules — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-16">
	<div class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
		<span class="h-1.5 w-1.5 rounded-full bg-zumito-600" />
		<span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Browse</span>
	</div>
	<h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-100">All Modules</h1>

	<form method="GET" class="mt-8 space-y-4">
		<div class="flex flex-wrap gap-3">
			<input
				type="search"
				name="search"
				value={data.search}
				placeholder="Search modules..."
				class="min-w-[200px] rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
			/>
			<select name="sort" class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100">
				<option value="installs" selected={data.sort === 'installs'}>Most Installed</option>
				<option value="recent" selected={data.sort === 'recent'}>Most Recent</option>
			</select>
			<button type="submit" class="rounded-full bg-zumito-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
				Apply
			</button>
			<a href="/modules" class="rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition-all hover:border-zumito-600/40 active:scale-[0.98]">
				Clear
			</a>
		</div>

		<div class="flex flex-wrap gap-2">
			{#each data.allFeatures as f}
				<a href="?search={data.search}&sort={data.sort}&feature={f.name}"
					class="rounded-full border px-3 py-1.5 text-xs transition-all {data.selectedFeature === f.name ? 'border-zumito-600 bg-zumito-600/10 text-zumito-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}">
					{f.emoji} {f.name}
				</a>
			{/each}
		</div>
	</form>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.modules as mod}
			<a href="/module/{mod.slug}" class="group block">
				<article class="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition-all duration-500 hover:border-zumito-600/30">
					<div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-zumito-600 via-zumito-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

					<div class="flex items-start gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
							{#if mod.icon}
								<img src={mod.icon} alt="" class="h-full w-full rounded-xl object-cover" />
							{:else}
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="font-semibold text-zinc-100 truncate">{mod.name}</h3>
							<p class="text-xs text-zinc-500">by {mod.author.username}</p>
						</div>
					</div>

					<p class="mt-3 line-clamp-2 text-sm text-zinc-400">{mod.shortDescription ?? ''}</p>

					<div class="mt-3 flex items-center justify-between">
						<div class="flex flex-wrap gap-1">
							{#each mod.features.slice(0, 2) as f}
								<span class="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-500">{f.emoji} {f.name}</span>
							{/each}
						</div>
						<span class="text-xs tabular-nums text-zinc-600">{mod._count.installs} installs</span>
					</div>
				</article>
			</a>
		{/each}
	</div>

	{#if data.modules.length === 0}
		<div class="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-800 p-16 text-center">
			<svg class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
			<h3 class="text-lg font-semibold text-zinc-400">No modules found</h3>
			<p class="text-sm text-zinc-600">Try adjusting your search or filters.</p>
		</div>
	{/if}

	<div class="mt-8">
		<Pagination currentPage={data.page} totalPages={data.totalPages} baseUrl="/modules?search={data.search}&sort={data.sort}&feature={data.selectedFeature}" />
	</div>
</div>
