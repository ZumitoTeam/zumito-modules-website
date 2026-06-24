<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	/* @wc-ignore */
	const LABEL_EN = 'EN';
	/* @wc-ignore */
	const LABEL_ES = 'ES';

	let open = $state(false);

	function toggle(e: Event) {
		e.stopPropagation();
		open = !open;
	}

	async function switchTo(e: Event, locale: string) {
		e.stopPropagation();
		open = false;
		await new Promise(r => setTimeout(r, 200));
		await goto(`?lang=${locale}`, { replaceState: true, invalidateAll: true });
	}
</script>

<svelte:window onclick={() => { if (open) open = false; }} />

<div class="relative inline-flex items-center" onclick={(e) => e.stopPropagation()}>
	<!-- Compact pill -->
	<button onclick={toggle}
		class="flex items-center justify-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
		class:invisible={open}>
		{$page.data.locale === 'es' ? LABEL_ES : LABEL_EN}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
	</button>

	<!-- Expanded floating panel -->
	{#if open}
		<div class="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 gap-1 rounded-full border border-zinc-200 bg-white p-0.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
			transition:scale={{ start: 0.7, duration: 250, easing: expoOut }}>
			<button onclick={(e: Event) => switchTo(e, 'en')}
				class="w-[38px] rounded-full py-1.5 text-center text-xs font-semibold transition-all {$page.data.locale !== 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}">
				{LABEL_EN}
			</button>
			<button onclick={(e: Event) => switchTo(e, 'es')}
				class="w-[38px] rounded-full py-1.5 text-center text-xs font-semibold transition-all {$page.data.locale === 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}">
				{LABEL_ES}
			</button>
		</div>
	{/if}
</div>
