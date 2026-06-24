<script lang="ts">
	import type { PageData } from './$types';
	import NumberFlow from '@number-flow/svelte';

	let { data }: { data: PageData } = $props();

	function fmt(n: number): string {
		return n >= 1000 ? `${Math.floor(n / 1000)}k` : String(n);
	}
</script>

<svelte:head>
	<title>Zumito Modules — Discord Bot Marketplace</title>
</svelte:head>

<!-- ═══════════ HERO ═══════════ -->
	<section class="relative flex min-h-[90dvh] items-center px-6 py-24 lg:px-16">
		<div class="relative z-10 mx-auto max-w-6xl w-full">
			<h1 class="max-w-3xl text-5xl font-extrabold tracking-tight text-zinc-900 lg:text-7xl dark:text-zinc-100">
				Discord bot modules for the <span class="text-zumito-600">Zumito</span> Framework
			</h1>

			<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
				Discover commands, events, and automations crafted by the community.
				Install them directly from the IDE.
			</p>

			<div class="mt-10 flex flex-wrap gap-4">
				<a href="/modules"
					class="group inline-flex items-center gap-3 rounded-full bg-zumito-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-zumito-700 active:scale-[0.98]">
					Browse Modules
					<span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
					</span>
				</a>
				<a href="/submit"
					class="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 hover:text-zumito-600 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zumito-600/40">
					Submit a Module
				</a>
			</div>
		</div>

		<!-- Decorative accent -->
		<div class="pointer-events-none absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full bg-zumito-600/5 blur-[120px] dark:bg-zumito-600/10" />
	</section>

	<!-- ═══════════ STATS ═══════════ -->
	<section class="border-t border-zinc-200 px-6 py-20 lg:px-16 dark:border-zinc-800/50">
		<div class="mx-auto max-w-6xl">
			<h2 class="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">By the numbers</h2>

			<div class="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 md:grid-cols-4">
				<article class="bg-zinc-50 p-8 dark:bg-zinc-950">
					<div class="text-4xl font-extrabold tabular-nums text-zumito-600"><NumberFlow value={data.stats.modules} /></div>
					<div class="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Modules</div>
				</article>
				<article class="bg-zinc-50 p-8 dark:bg-zinc-950">
					<div class="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100"><NumberFlow value={data.stats.installs} /></div>
					<div class="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Installs</div>
				</article>
				<article class="bg-zinc-50 p-8 dark:bg-zinc-950">
					<div class="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100"><NumberFlow value={data.stats.developers} /></div>
					<div class="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Creators</div>
				</article>
				<article class="bg-zinc-50 p-8 dark:bg-zinc-950">
					<div class="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100"><NumberFlow value={data.stats.features} /></div>
					<div class="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Features</div>
				</article>
			</div>
		</div>
	</section>

	<!-- ═══════════ FEATURES ═══════════ -->
	<section class="border-t border-zinc-200 px-6 py-20 lg:px-16 dark:border-zinc-800/50">
		<div class="mx-auto max-w-6xl">
			<h2 class="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
				Find modules by <span class="text-zumito-600">capability</span>
			</h2>

			<div class="mt-10 flex flex-wrap gap-3">
				{#each data.popularFeatures as f}
					<a href="/modules?feature={f.name}"
						class="group flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-600 transition-all hover:border-zumito-300 hover:text-zumito-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zumito-600/30 dark:hover:text-zinc-200">
						<span class="text-base">{f.emoji}</span>
						<span class="font-medium">{f.name}</span>
						<span class="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] tabular-nums text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">{f._count.modules}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════ LATEST MODULES ═══════════ -->
	<section class="border-t border-zinc-200 px-6 py-20 lg:px-16 dark:border-zinc-800/50">
		<div class="mx-auto max-w-6xl">
			<div class="flex items-end justify-between">
				<h2 class="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
					Most installed modules
				</h2>
				<a href="/modules" class="hidden text-sm font-semibold text-zumito-600 transition-colors hover:text-zumito-700 sm:inline">
					View all &rarr;
				</a>
			</div>

			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.latestModules as mod}
					<a href="/module/{mod.slug}" class="group block">
						<article class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zumito-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
							<div class="absolute inset-x-0 top-0 h-0.5 bg-zumito-600 opacity-0 transition-opacity group-hover:opacity-100" />

							<div class="flex items-start gap-4">
								<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
									{#if mod.icon}
										<img src={mod.icon} alt="" class="h-full w-full rounded-xl object-cover" />
									{:else}
										<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<h3 class="font-semibold text-zinc-900 truncate dark:text-zinc-100">{mod.name}</h3>
									<p class="mt-1 text-xs text-zinc-500">by {mod.author.username}</p>
								</div>
							</div>

							<p class="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
								{mod.shortDescription ?? mod.description}
							</p>

							<div class="mt-4 flex items-center justify-between">
								<div class="flex flex-wrap gap-1.5">
									{#each mod.features.slice(0, 3) as f}
										<span class="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">{f.emoji} {f.name}</span>
									{/each}
								</div>
								<span class="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-600">{mod._count.installs} installs</span>
							</div>
						</article>
					</a>
				{/each}
			</div>

			{#if data.latestModules.length === 0}
				<div class="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-300 p-16 text-center dark:border-zinc-800">
					<svg class="h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
					<h3 class="text-lg font-semibold text-zinc-500 dark:text-zinc-400">No modules yet</h3>
					<p class="text-sm text-zinc-400 dark:text-zinc-600">Be the first to share a module with the community.</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════════ CTA ═══════════ -->
	<section class="py-32 text-center">
		<div class="mx-auto max-w-2xl px-6">
			<h2 class="text-4xl font-extrabold tracking-tight text-zinc-900 lg:text-5xl dark:text-zinc-100">
				Ready to share your work?
			</h2>
			<p class="mx-auto mt-4 max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
				Submit your module and reach Discord bot developers worldwide.
			</p>
			<div class="mt-10 flex items-center justify-center gap-4">
				<a href="/submit"
					class="group inline-flex items-center gap-3 rounded-full bg-zumito-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">
					Submit Module
					<span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
					</span>
				</a>
				<a href="/modules"
					class="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zumito-300 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
					Explore
				</a>
			</div>
		</div>
	</section>

