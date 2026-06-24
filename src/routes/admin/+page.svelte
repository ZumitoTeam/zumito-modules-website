<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Admin Dashboard — Zumito Modules</title></svelte:head>

<h1 class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Dashboard</h1>

<div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
	<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
		<div class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{data.stats.moduleCount}</div>
		<div class="text-sm text-zinc-500">Total Modules</div>
	</div>
	<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
		<div class="text-2xl font-extrabold text-yellow-600">{data.stats.pendingModules}</div>
		<div class="text-sm text-zinc-500">Pending Approval</div>
	</div>
	<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
		<div class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{data.stats.userCount}</div>
		<div class="text-sm text-zinc-500">Total Users</div>
	</div>
	<div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
		<div class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{data.stats.installCount}</div>
		<div class="text-sm text-zinc-500">Total Installs</div>
	</div>
</div>
