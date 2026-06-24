<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Container from '$lib/components/layout/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Browse Modules — Zumito Modules</title>
</svelte:head>

<Container class="py-12">
	<h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">All Modules</h1>

	<form method="GET" class="mt-8 space-y-4">
		<div class="flex flex-wrap gap-3">
			<input type="search" name="search" value={data.search} placeholder="Search modules..."
				class="min-w-[200px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600" />
			<select name="sort" class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
				<option value="installs" selected={data.sort === 'installs'}>Most Installed</option>
				<option value="recent" selected={data.sort === 'recent'}>Most Recent</option>
			</select>
			<button type="submit" class="rounded-full bg-zumito-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Apply</button>
			<a href="/modules" class="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zumito-600/40">Clear</a>
		</div>

		<div class="flex flex-wrap gap-2">
			{#each data.allFeatures as f}
				<a href="?search={data.search}&sort={data.sort}&feature={f.name}"
					class="rounded-full border px-3 py-1.5 text-xs transition-all {data.selectedFeature === f.name ? 'border-zumito-600 bg-zumito-50 text-zumito-600 dark:bg-zumito-600/10 dark:text-zumito-400' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'}">
					{f.emoji} {f.name}
				</a>
			{/each}
		</div>
	</form>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.modules as mod}
			<a href="/module/{mod.slug}" class="group block">
				<article class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
					<div class="absolute inset-x-0 top-0 h-0.5 bg-zumito-600 opacity-0 transition-opacity group-hover:opacity-100" />

					<div class="flex items-start gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
							{#if mod.icon}
								<img src={mod.icon} alt="" class="h-full w-full rounded-xl object-cover" />
							{:else}
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="font-semibold text-zinc-900 truncate dark:text-zinc-100">{mod.name}</h3>
							<p class="text-xs text-zinc-500">by {mod.author.username}</p>
						</div>
					</div>

					<p class="mt-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{mod.shortDescription ?? ''}</p>

					<div class="mt-3 flex items-center justify-between">
						<div class="flex flex-wrap gap-1">
							{#each mod.features.slice(0, 2) as f}
								<span class="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">{f.emoji} {f.name}</span>
							{/each}
						</div>
						<span class="text-xs tabular-nums text-zinc-400 dark:text-zinc-600">{mod._count.installs} installs</span>
					</div>
				</article>
			</a>
		{/each}
	</div>

	{#if data.modules.length === 0}
		<div class="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-300 p-16 text-center dark:border-zinc-800">
			<svg class="h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
			<h3 class="text-lg font-semibold text-zinc-500 dark:text-zinc-400">No modules found</h3>
			<p class="text-sm text-zinc-400 dark:text-zinc-600">Try adjusting your search or filters.</p>
		</div>
	{/if}

	<div class="mt-8">
		<Pagination currentPage={data.page} totalPages={data.totalPages} baseUrl="/modules?search={data.search}&sort={data.sort}&feature={data.selectedFeature}" />
	</div>
</Container>
