<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import NumberFlow from '@number-flow/svelte';
	import autoAnimate from '@formkit/auto-animate';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let modulesContainer: HTMLDivElement;

	onMount(() => {
		if (modulesContainer) autoAnimate(modulesContainer);
	});

	const statIcons = ['🚀', '📦', '👨‍💻', '📋'];
</script>

<svelte:head>
	<title>Zumito Modules — Discord Bot Marketplace</title>
</svelte:head>

<!-- Hero -->
<section class="py-24 text-center">
	<h1 class="text-5xl font-bold tracking-tight">Zumito Modules</h1>
	<p class="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
		The marketplace for Zumito Framework modules. Discover, install, and share Discord bot modules.
	</p>
	<div class="mt-8 flex items-center justify-center gap-4">
		<a href="/modules" class="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
			Browse Modules
		</a>
		<a href="/submit" class="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
			Submit a Module
		</a>
	</div>
</section>

<!-- Stats -->
<section class="mx-auto max-w-4xl px-4 pb-16">
	<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
		{#each [data.stats.modules, data.stats.installs, data.stats.developers, data.stats.features] as value, i}
			<Card>
				<div class="text-center">
					<div class="text-2xl">{statIcons[i]}</div>
					<div class="mt-2 text-3xl font-bold tabular-nums">
						<NumberFlow {value} />
					</div>
					<div class="mt-1 text-sm text-zinc-500">
						{['Modules', 'Installs', 'Developers', 'Features'][i]}
					</div>
				</div>
			</Card>
		{/each}
	</div>
</section>

<!-- Popular Features -->
<section class="border-t border-zinc-200 py-16 dark:border-zinc-800">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="text-2xl font-bold">Popular Features</h2>
		<div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
			{#each data.popularFeatures as feature}
				<Card class="text-center">
					<Icon icon="twemoji:{feature.emoji}" class="mx-auto text-2xl" />
					<div class="mt-2 font-medium text-sm">{feature.name}</div>
					<div class="text-xs text-zinc-500">{feature._count.modules} modules</div>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Latest Modules -->
<section class="border-t border-zinc-200 py-16 dark:border-zinc-800">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="text-2xl font-bold">Popular Modules</h2>
		<div bind:this={modulesContainer} class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.latestModules as mod}
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
							{mod.shortDescription ?? mod.description}
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
	</div>
</section>
