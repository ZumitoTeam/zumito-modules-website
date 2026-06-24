<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Admin Dashboard — Zumito Modules</title></svelte:head>

<h1 class="text-2xl font-bold">Dashboard</h1>

<div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
	<Card><div class="text-2xl font-bold">{data.stats.moduleCount}</div><div class="text-sm text-zinc-500">Total Modules</div></Card>
	<Card><div class="text-2xl font-bold text-yellow-600">{data.stats.pendingModules}</div><div class="text-sm text-zinc-500">Pending Approval</div></Card>
	<Card><div class="text-2xl font-bold">{data.stats.userCount}</div><div class="text-sm text-zinc-500">Total Users</div></Card>
	<Card><div class="text-2xl font-bold">{data.stats.installCount}</div><div class="text-sm text-zinc-500">Total Installs</div></Card>
</div>
