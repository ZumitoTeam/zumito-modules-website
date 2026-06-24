<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Browse Modules — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-16">
	<h1 class="text-3xl font-bold">Browse Modules</h1>

	<!-- Filters -->
	<form method="GET" class="mt-6 space-y-4">
		<div class="flex flex-wrap gap-3">
			<input
				type="search"
				name="search"
				value={data.search}
				placeholder="Search modules..."
				class="min-w-[200px] rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
			/>
			<select name="sort" class="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
				<option value="installs" selected={data.sort === 'installs'}>Most Installed</option>
				<option value="recent" selected={data.sort === 'recent'}>Most Recent</option>
			</select>
			<button type="submit" class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
				Apply
			</button>
			<a href="/modules" class="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
				Clear
			</a>
		</div>

		<!-- Feature chips -->
		<div class="flex flex-wrap gap-2">
			{#each data.allFeatures as f}
				<a href="?search={data.search}&sort={data.sort}&feature={f.name}" class="rounded-full border px-3 py-1 text-xs transition {data.selectedFeature === f.name ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' : 'border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900'}">
					{f.emoji} {f.name}
				</a>
			{/each}
		</div>
	</form>

	<!-- Results -->
	<div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.modules as mod}
			<a href="/module/{mod.slug}" class="block">
				<Card class="h-full transition hover:border-zinc-400 dark:hover:border-zinc-600">
					<div class="flex items-start gap-3">
						{#if mod.icon}
							<img src={mod.icon} alt="" class="h-10 w-10 rounded-lg object-cover" />
						{:else}
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg dark:bg-zinc-800">📦</div>
						{/if}
						<div class="min-w-0 flex-1">
							<h3 class="font-semibold truncate">{mod.name}</h3>
							<p class="text-xs text-zinc-500">by {mod.author.username}</p>
						</div>
					</div>
					<p class="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
						{mod.shortDescription ?? ''}
					</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each mod.features as f}
							<Badge text="{f.emoji} {f.name}" />
						{/each}
					</div>
					<div class="mt-3 text-xs text-zinc-500">
						{mod._count.installs} installs
					</div>
				</Card>
			</a>
		{/each}
	</div>

	{#if data.modules.length === 0}
		<p class="mt-12 text-center text-zinc-500">No modules found.</p>
	{/if}

	<div class="mt-8">
		<Pagination currentPage={data.page} totalPages={data.totalPages} baseUrl="/modules?search={data.search}&sort={data.sort}&feature={data.selectedFeature}" />
	</div>
</div>
