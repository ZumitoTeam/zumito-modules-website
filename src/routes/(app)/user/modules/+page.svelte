<script lang="ts">
	import type { PageData } from './$types';
	import Container from '$lib/components/layout/Container.svelte';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>My Modules — Zumito Modules</title></svelte:head>

<Container class="py-12">
	<h1 class="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">My Modules</h1>

	<div class="mt-8 space-y-4">
		{#each data.modules as mod}
			<a href="/module/{mod.slug}" class="block">
				<article class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zumito-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
							{#if mod.icon}<img src={mod.icon} alt="" class="h-full w-full rounded-xl object-cover" />{:else}<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>{/if}
						</div>
						<div>
							<h3 class="font-semibold text-zinc-900 dark:text-zinc-100">{mod.name}</h3>
							<p class="text-sm text-zinc-500">{mod.shortDescription ?? ''}</p>
						</div>
					</div>
					<div class="flex items-center gap-3 text-sm shrink-0">
						<span class="text-zinc-400 dark:text-zinc-600">{mod._count.installs} installs</span>
						{#if !mod.approved}
							<span class="rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400">Pending</span>
						{:else if !mod.published}
							<span class="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">Draft</span>
						{:else}
							<span class="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">Live</span>
						{/if}
					</div>
				</article>
			</a>
		{:else}
			<p class="text-zinc-500">You haven&apos;t submitted any modules yet.</p>
		{/each}
	</div>
</Container>
