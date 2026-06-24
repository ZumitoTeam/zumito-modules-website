<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function fmt(n: number): string {
		return n >= 1000 ? `${Math.floor(n / 1000)}k` : String(n);
	}
</script>

<svelte:head>
	<title>Zumito Modules — Discord Bot Marketplace</title>
</svelte:head>

<!-- ═══════════ HERO — Asymmetric Left-Aligned ═══════════ -->
<section class="relative flex min-h-[90dvh] items-center overflow-hidden px-6 lg:px-20">
	<!-- Ambient radial glow behind hero -->
	<div class="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-zumito-600/10 blur-[120px]" />

	<div class="relative z-10 max-w-3xl">
		<!-- Eyebrow -->
		<div class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
			<span class="h-1.5 w-1.5 rounded-full bg-zumito-600" />
			<span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Marketplace</span>
		</div>

		<h1 class="mt-8 max-w-2xl text-5xl font-extrabold tracking-tight text-zinc-100 lg:text-7xl">
			<span class="text-zumito-600">Zumito</span> Modules
		</h1>

		<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
			The curated marketplace for Discord bot modules built on the Zumito Framework.
			Discover tools, commands, and automation crafted by the community.
		</p>

		<div class="mt-10 flex flex-wrap gap-4">
			<a href="/modules"
				class="group inline-flex items-center gap-3 rounded-full bg-zumito-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zumito-700 active:scale-[0.98]">
				Browse Modules
				<span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-1">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
				</span>
			</a>
			<a href="/submit"
				class="group inline-flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-950 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all duration-500 hover:border-zumito-600/40 hover:text-white active:scale-[0.98]">
				Submit a Module
				<span class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-transform duration-500 group-hover:translate-x-1">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
				</span>
			</a>
		</div>
	</div>

	<!-- Right-side accent element: abstract shapes -->
	<div class="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
		<div class="relative h-[400px] w-[400px]">
			<div class="absolute inset-0 rounded-full border border-zumito-600/20" />
			<div class="absolute inset-8 rounded-full border border-zumito-600/15" />
			<div class="absolute inset-16 rounded-full border border-zumito-600/10" />
			<div class="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zumito-600/30 bg-zumito-600/5" />
		</div>
	</div>
</section>

<!-- ═══════════ STATS — Asymmetric Bento Row ═══════════ -->
<section class="border-t border-zinc-800/50 px-6 py-20 lg:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
			<span class="h-1.5 w-1.5 rounded-full bg-zumito-600" />
			<span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">By the Numbers</span>
		</div>

		<div class="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-zinc-800/50 bg-zinc-800/50 md:grid-cols-4">
			<article class="bg-zinc-950 p-8">
				<div class="text-4xl font-extrabold tabular-nums text-zumito-600">{fmt(data.stats.modules)}</div>
				<div class="mt-2 text-sm font-medium tracking-wide text-zinc-400 uppercase">Modules</div>
			</article>
			<article class="bg-zinc-950 p-8">
				<div class="text-4xl font-extrabold tabular-nums text-zinc-100">{fmt(data.stats.installs)}</div>
				<div class="mt-2 text-sm font-medium tracking-wide text-zinc-400 uppercase">Installs</div>
			</article>
			<article class="bg-zinc-950 p-8">
				<div class="text-4xl font-extrabold tabular-nums text-zinc-100">{fmt(data.stats.developers)}</div>
				<div class="mt-2 text-sm font-medium tracking-wide text-zinc-400 uppercase">Creators</div>
			</article>
			<article class="bg-zinc-950 p-8">
				<div class="text-4xl font-extrabold tabular-nums text-zinc-100">{fmt(data.stats.features)}</div>
				<div class="mt-2 text-sm font-medium tracking-wide text-zinc-400 uppercase">Features</div>
			</article>
		</div>
	</div>
</section>

<!-- ═══════════ FEATURES — Bento Chip Grid ═══════════ -->
<section class="border-t border-zinc-800/50 px-6 py-20 lg:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
			<span class="h-1.5 w-1.5 rounded-full bg-zumito-600" />
			<span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Popular Features</span>
		</div>

		<h2 class="mt-8 max-w-xl text-3xl font-extrabold tracking-tight text-zinc-100 lg:text-4xl">
			Find modules by <span class="text-zumito-600">capability</span>
		</h2>

		<div class="mt-10 flex flex-wrap gap-3">
			{#each data.popularFeatures as f}
				<a href="/modules?feature={f.name}"
					class="group flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 transition-all duration-300 hover:border-zumito-600/30 hover:bg-zumito-600/5 hover:text-zinc-100">
					<span class="text-base">{f.emoji}</span>
					<span class="font-medium">{f.name}</span>
					<span class="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] tabular-nums text-zinc-500">{f._count.modules}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════ LATEST MODULES — Asymmetric Card Stack ═══════════ -->
<section class="border-t border-zinc-800/50 px-6 py-20 lg:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="flex items-end justify-between">
			<div>
				<div class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
					<span class="h-1.5 w-1.5 rounded-full bg-zumito-600" />
					<span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Popular Now</span>
				</div>
				<h2 class="mt-8 max-w-xl text-3xl font-extrabold tracking-tight text-zinc-100 lg:text-4xl">
					Most installed <span class="text-zumito-600">modules</span>
				</h2>
			</div>
			<a href="/modules" class="hidden text-sm font-medium text-zumito-600 transition-colors hover:text-zumito-500 sm:inline-flex items-center gap-1.5">
				View all <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
			</a>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.latestModules as mod, i}
				<a href="/module/{mod.slug}" class="group block">
					<article
						class="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition-all duration-500 hover:border-zumito-600/30 hover:bg-zinc-900">
						<!-- Accent top bar -->
						<div
							class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-zumito-600 via-zumito-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

						<div class="flex items-start gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors duration-500 group-hover:border-zumito-600/20">
								{#if mod.icon}
									<img src={mod.icon} alt="" class="h-full w-full rounded-xl object-cover" />
								{:else}
									<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></svg>
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<h3 class="font-semibold text-zinc-100 truncate">{mod.name}</h3>
								<p class="mt-1 text-xs text-zinc-500">by {mod.author.username}</p>
							</div>
						</div>

						<p class="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">
							{mod.shortDescription ?? mod.description}
						</p>

						<div class="mt-4 flex items-center justify-between">
							<div class="flex flex-wrap gap-1.5">
								{#each mod.features.slice(0, 3) as f}
									<span class="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-500">{f.emoji} {f.name}</span>
								{/each}
							</div>
							<span class="shrink-0 text-xs tabular-nums text-zinc-600">{mod._count.installs} installs</span>
						</div>
					</article>
				</a>
			{/each}
		</div>

		<!-- Empty state -->
		{#if data.latestModules.length === 0}
			<div class="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-800 p-16 text-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950">
					<svg class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
				</div>
				<h3 class="text-lg font-semibold text-zinc-400">No modules yet</h3>
				<p class="text-sm text-zinc-600">Be the first to share a module with the community.</p>
			</div>
		{/if}
	</div>
</section>

<!-- ═══════════ CTA — Massive Contrast Section ═══════════ -->
<section class="border-t border-zinc-800/50 px-6 py-32 lg:px-20">
	<div class="mx-auto max-w-4xl text-center">
		<h2 class="text-4xl font-extrabold tracking-tight text-zinc-100 lg:text-6xl">
			Ready to <span class="text-zumito-600">share</span> your work?
		</h2>
		<p class="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
			Submit your Zumito Framework module and reach Discord bot developers worldwide.
		</p>
		<div class="mt-10 flex items-center justify-center gap-4">
			<a href="/submit"
				class="group inline-flex items-center gap-3 rounded-full bg-zumito-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zumito-700 active:scale-[0.98]">
				Submit Module
				<span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-1">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
				</span>
			</a>
			<a href="/modules"
				class="group inline-flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-950 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all duration-500 hover:border-zumito-600/40 active:scale-[0.98]">
				Explore
			</a>
		</div>
	</div>
</section>
