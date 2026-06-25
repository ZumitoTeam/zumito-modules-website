<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let searchValue = $state(data.search ?? '');

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head><title>Modules — Admin</title></svelte:head>

<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Modules</h1>
	<div class="flex gap-2">
		<a href="?filter=all" class="rounded-full px-3 py-1.5 text-sm font-medium transition-all {data.filter === 'all' ? 'bg-zumito-600 text-white' : 'border border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'}">All</a>
		<a href="?filter=pending" class="rounded-full px-3 py-1.5 text-sm font-medium transition-all {data.filter === 'pending' ? 'bg-zumito-600 text-white' : 'border border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'}">Pending</a>
		<a href="?filter=approved" class="rounded-full px-3 py-1.5 text-sm font-medium transition-all {data.filter === 'approved' ? 'bg-zumito-600 text-white' : 'border border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'}">Approved</a>
	</div>
</div>

<!-- Search -->
<form method="GET" class="mt-4">
	<div class="relative">
		<Icon icon="tabler:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
		<input type="search" name="search" value={searchValue} placeholder="Search modules..."
			class="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		<input type="hidden" name="filter" value={data.filter} />
	</div>
</form>

<!-- Table -->
<div class="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
				<th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-400">Module</th>
				<th class="hidden px-4 py-3 text-left font-semibold text-zinc-600 sm:table-cell dark:text-zinc-400">Author</th>
				<th class="hidden px-4 py-3 text-left font-semibold text-zinc-600 md:table-cell dark:text-zinc-400">Installs</th>
				<th class="hidden px-4 py-3 text-left font-semibold text-zinc-600 lg:table-cell dark:text-zinc-400">Status</th>
				<th class="hidden px-4 py-3 text-left font-semibold text-zinc-600 lg:table-cell dark:text-zinc-400">Date</th>
				<th class="w-10 px-4 py-3" />
			</tr>
		</thead>
		<tbody>
			{#each data.modules as mod}
				<tr class="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50">
					<td class="px-4 py-3">
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
								{#if mod.icon}
									<img src={mod.icon} alt="" class="h-full w-full rounded-lg object-cover" />
								{:else}
									<Icon icon="tabler:package" class="h-4 w-4" />
								{/if}
							</div>
							<div class="min-w-0">
								<div class="truncate font-medium text-zinc-900 dark:text-zinc-100">{mod.name}</div>
								<div class="truncate text-xs text-zinc-500 sm:hidden">{mod.author?.username} &middot; {mod._count.installs} installs</div>
							</div>
						</div>
					</td>
					<td class="hidden px-4 py-3 text-zinc-600 sm:table-cell dark:text-zinc-400">{mod.author?.username}</td>
					<td class="hidden px-4 py-3 tabular-nums text-zinc-600 md:table-cell dark:text-zinc-400">{mod._count.installs}</td>
					<td class="hidden px-4 py-3 lg:table-cell">
						{#if !mod.approved}
							<span class="rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400">Pending</span>
						{:else if !mod.published}
							<span class="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">Draft</span>
						{:else}
							<span class="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">Live</span>
						{/if}
					</td>
					<td class="hidden whitespace-nowrap px-4 py-3 text-zinc-500 lg:table-cell dark:text-zinc-400">{formatDate(mod.createdAt)}</td>
					<td class="px-4 py-3 text-right">
						<ContextMenu
							items={[
								{ label: 'View', icon: 'tabler:eye', href: `/module/${mod.slug}` },
								{ label: 'Edit', icon: 'tabler:edit', href: `/module/${mod.slug}/edit` },
							]}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if data.modules.length === 0}
		<div class="flex flex-col items-center gap-2 py-16 text-center">
			<Icon icon="tabler:package-off" class="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
			<p class="text-sm text-zinc-500">No modules found</p>
		</div>
	{/if}
</div>

{#if data.totalPages > 1}
	<div class="mt-4 flex items-center justify-between">
		<span class="text-sm text-zinc-500">{data.total ?? 0} modules</span>
		<div class="flex gap-1">
			{#each Array(data.totalPages) as _, i}
				<a href="?filter={data.filter}&search={data.search}&page={i + 1}"
					class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors
					{data.page === i + 1 ? 'bg-zumito-600 text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
					{i + 1}
				</a>
			{/each}
		</div>
	</div>
{/if}
