<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>My Modules — Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16">
	<h1 class="text-3xl font-bold">My Modules</h1>

	<div class="mt-8 space-y-4">
		{#each data.modules as mod}
			<a href="/module/{mod.slug}" class="block">
				<Card class="transition hover:border-zinc-400 dark:hover:border-zinc-600">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							{#if mod.icon}
								<img src={mod.icon} alt="" class="h-10 w-10 rounded-lg object-cover" />
							{:else}
								<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg dark:bg-zinc-800">📦</div>
							{/if}
							<div>
								<h3 class="font-semibold">{mod.name}</h3>
								<p class="text-sm text-zinc-500">{mod.shortDescription ?? ''}</p>
							</div>
						</div>
						<div class="flex items-center gap-3 text-sm">
							<span class="text-zinc-500">{mod._count.installs} installs</span>
							{#if !mod.approved}
								<Badge text="Pending" variant="warning" />
							{:else if !mod.published}
								<Badge text="Draft" variant="default" />
							{:else}
								<Badge text="Live" variant="success" />
							{/if}
						</div>
					</div>
				</Card>
			</a>
		{:else}
			<p class="text-zinc-500">You haven&apos;t submitted any modules yet.</p>
		{/each}
	</div>
</div>
