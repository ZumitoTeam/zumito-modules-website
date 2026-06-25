<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Modules — Admin</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Modules</h1>
	<div class="flex gap-2">
		<a href="?filter=all" class="rounded-full px-3 py-1.5 text-sm font-medium transition-all {data.filter === 'all' ? 'bg-zumito-600 text-white' : 'border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400'}">All</a>
		<a href="?filter=pending" class="rounded-full px-3 py-1.5 text-sm font-medium transition-all {data.filter === 'pending' ? 'bg-zumito-600 text-white' : 'border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400'}">Pending</a>
		<a href="?filter=approved" class="rounded-full px-3 py-1.5 text-sm font-medium transition-all {data.filter === 'approved' ? 'bg-zumito-600 text-white' : 'border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400'}">Approved</a>
	</div>
</div>

<div class="mt-6 space-y-3">
	{#each data.modules as mod}
		<div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
			<div>
				<div class="font-medium text-zinc-900 dark:text-zinc-100">{mod.name}</div>
				<div class="text-sm text-zinc-500">by {mod.author.username} &middot; {mod._count.installs} installs</div>
			</div>
			<div class="flex items-center gap-2">
				{#if !mod.approved}
					<form method="POST" action="?/approve" use:enhance>
						<input type="hidden" name="id" value={mod.id} />
						<button class="rounded-full bg-zumito-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-zumito-700">Approve</button>
					</form>
					<form method="POST" action="?/reject" use:enhance>
						<input type="hidden" name="id" value={mod.id} />
						<button class="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950">Reject</button>
					</form>
				{:else}
					<a href="/module/{mod.slug}" class="text-sm text-zinc-500 transition-colors hover:text-zumito-600">View</a>
				{/if}
			</div>
		</div>
	{/each}
</div>

<div class="mt-6"><Pagination currentPage={data.page} totalPages={data.totalPages} baseUrl="/admin/modules?filter={data.filter}" /></div>
