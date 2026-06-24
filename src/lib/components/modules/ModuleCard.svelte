<script lang="ts">
	interface Props {
		slug: string;
		name: string;
		shortDescription?: string | null;
		icon?: string | null;
		author?: { username: string } | null;
		features?: { name: string; emoji: string }[];
		installCount?: number;
		badge?: { text: string; variant: 'default' | 'success' | 'warning' | 'danger' } | null;
		editLink?: boolean;
	}

	let {
		slug, name, shortDescription, icon, author, features = [], installCount,
		badge = null, editLink = false,
	}: Props = $props();
</script>

<a href="/module/{slug}" class="group block">
	<article class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zumito-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zumito-600/30">
		<div class="absolute inset-x-0 top-0 h-0.5 bg-zumito-600 opacity-0 transition-opacity group-hover:opacity-100" />

		<div class="flex items-start gap-4">
			<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
				{#if icon}
					<img src={icon} alt="" class="h-full w-full rounded-xl object-cover" />
				{:else}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /></svg>
				{/if}
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<h3 class="font-semibold text-zinc-900 truncate dark:text-zinc-100">{name}</h3>
					{#if badge}
						<span class="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium
							{badge.variant === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400' : ''}
							{badge.variant === 'warning' ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400' : ''}
							{badge.variant === 'danger' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400' : ''}
							{badge.variant === 'default' ? 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400' : ''}">
							{badge.text}
						</span>
					{/if}
					{#if editLink}
						<a href="/module/{slug}/edit" class="shrink-0 text-xs text-zinc-400 transition-colors hover:text-zumito-600" onclick={(e: Event) => e.stopPropagation()}>Edit</a>
					{/if}
				</div>
				{#if author}
					<p class="mt-1 text-xs text-zinc-500">by {author.username}</p>
				{/if}
			</div>
		</div>

		{#if shortDescription}
			<p class="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{shortDescription}</p>
		{/if}

		<div class="mt-4 flex items-center justify-between">
			<div class="flex flex-wrap gap-1.5">
				{#each features.slice(0, 3) as f}
					<span class="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">{f.emoji} {f.name}</span>
				{/each}
			</div>
			{#if installCount !== undefined}
				<span class="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-600">{installCount} installs</span>
			{/if}
		</div>
	</article>
</a>
