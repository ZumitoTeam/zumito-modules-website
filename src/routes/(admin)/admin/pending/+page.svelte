<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let searchValue = $state(data.search ?? '');
</script>

<svelte:head><title>Pending Approval — Admin</title></svelte:head>

<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Pending Approval</h1>

<form method="GET" class="mt-4">
	<div class="relative">
		<Icon icon="tabler:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
		<input type="search" name="search" value={searchValue} placeholder="Search pending modules..."
			class="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zumito-500 focus:ring-1 focus:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
	</div>
</form>

<div class="mt-4 space-y-3">
	{#each data.modules as mod}
		<div class="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zumito-200 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
			<div class="flex items-start gap-3 min-w-0">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
					{#if mod.icon}
						<img src={mod.icon} alt="" class="h-full w-full rounded-xl object-cover" />
					{:else}
						<Icon icon="tabler:package" class="h-5 w-5" />
					{/if}
				</div>
				<div class="min-w-0">
					<div class="truncate font-semibold text-zinc-900 dark:text-zinc-100">{mod.name}</div>
					<div class="truncate text-sm text-zinc-500">by {mod.author?.username} &middot; {mod._count.installs} installs</div>
					{#if mod.shortDescription}
						<div class="mt-0.5 line-clamp-1 text-sm text-zinc-400">{mod.shortDescription}</div>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-2 shrink-0">
				<form method="POST" action="?/approve" use:enhance>
					<input type="hidden" name="id" value={mod.id} />
					<button class="flex items-center gap-1.5 rounded-full bg-zumito-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98] cursor-pointer">
						<Icon icon="tabler:check" class="h-4 w-4" />
						Approve
					</button>
				</form>
				<form method="POST" action="?/reject" use:enhance>
					<input type="hidden" name="id" value={mod.id} />
					<button class="flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98] cursor-pointer dark:border-red-800 dark:hover:bg-red-950">
						<Icon icon="tabler:x" class="h-4 w-4" />
						Reject
					</button>
				</form>
				<ContextMenu
					items={[
						{ label: 'View', icon: 'tabler:eye', href: `/module/${mod.slug}` },
						{ label: 'Edit', icon: 'tabler:edit', href: `/module/${mod.slug}/edit` },
					]}
				/>
			</div>
		</div>
	{/each}

	{#if data.modules.length === 0}
		<div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
			<Icon icon="tabler:clock-check" class="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
			<p class="text-sm font-medium text-zinc-500">No pending modules</p>
			<p class="text-xs text-zinc-400">All modules have been reviewed.</p>
		</div>
	{/if}
</div>

{#if data.totalPages > 1}
	<div class="mt-6 flex items-center justify-between">
		<span class="text-sm text-zinc-500">{data.total ?? 0} pending</span>
		<div class="flex gap-1">
			{#each Array(data.totalPages) as _, i}
				<a href="?search={data.search}&page={i + 1}"
					class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors
					{data.page === i + 1 ? 'bg-zumito-600 text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
					{i + 1}
				</a>
			{/each}
		</div>
	</div>
{/if}