<script lang="ts">
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Users — Admin</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Users</h1>
	<form method="GET" class="flex gap-2">
		<input name="search" value={data.search} placeholder="Search..." class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
		<button type="submit" class="rounded-full bg-zumito-600 px-3 py-2 text-sm font-semibold text-white hover:bg-zumito-700">Search</button>
	</form>
</div>

<div class="mt-6 space-y-3">
	{#each data.users as user}
		<div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
			<div>
				<div class="font-medium text-zinc-900 dark:text-zinc-100">{user.username}</div>
				<div class="text-sm text-zinc-500">{user.email}</div>
			</div>
			<div class="flex items-center gap-3">
				<span class="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">{user.role}</span>
				{#if user.banned}
					<span class="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">Banned</span>
				{/if}
				<form method="POST" action="?/toggleAdmin" use:enhance>
					<input type="hidden" name="userId" value={user.id} />
					<button type="submit" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">{user.role === 'admin' ? 'Demote' : 'Make Admin'}</button>
				</form>
				<form method="POST" action="?/toggleBan" use:enhance>
					<input type="hidden" name="userId" value={user.id} />
					<button type="submit" class="text-sm font-medium text-zinc-500 transition-colors hover:text-red-600">{user.banned ? 'Unban' : 'Ban'}</button>
				</form>
			</div>
		</div>
	{/each}
</div>

<div class="mt-6"><Pagination currentPage={data.page} totalPages={data.totalPages} baseUrl="/admin/users?search={data.search}" /></div>
