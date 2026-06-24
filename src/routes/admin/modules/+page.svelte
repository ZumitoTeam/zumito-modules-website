<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Modules — Admin</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold">Modules</h1>
	<div class="flex gap-2">
		<a href="?filter=all" class="rounded-lg px-3 py-1.5 text-sm {data.filter === 'all' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'border'}">All</a>
		<a href="?filter=pending" class="rounded-lg px-3 py-1.5 text-sm {data.filter === 'pending' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'border'}">Pending</a>
		<a href="?filter=approved" class="rounded-lg px-3 py-1.5 text-sm {data.filter === 'approved' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'border'}">Approved</a>
	</div>
</div>

<div class="mt-6 space-y-3">
	{#each data.modules as mod}
		<div class="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
			<div>
				<div class="font-medium">{mod.name}</div>
				<div class="text-sm text-zinc-500">by {mod.author.username} · {mod._count.installs} installs</div>
			</div>
			<div class="flex items-center gap-2">
				{#if !mod.approved}
					<form method="POST" action="?/approve" use:enhance>
						<input type="hidden" name="id" value={mod.id} />
						<button class="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white">Approve</button>
					</form>
					<form method="POST" action="?/reject" use:enhance>
						<input type="hidden" name="id" value={mod.id} />
						<button class="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white">Reject</button>
					</form>
				{:else}
					<a href="/module/{mod.slug}" class="text-sm text-zinc-500 hover:text-zinc-900">View</a>
				{/if}
			</div>
		</div>
	{/each}
</div>

<div class="mt-6"><Pagination currentPage={data.page} totalPages={data.totalPages} baseUrl="/admin/modules?filter={data.filter}" /></div>
