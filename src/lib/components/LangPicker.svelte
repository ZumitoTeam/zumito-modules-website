<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade, scale, fly } from 'svelte/transition';
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
	<!-- Compact pill (always visible) -->
	<button onclick={toggle}
		class="flex w-[56px] items-center justify-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 py-1 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
		{$page.data.locale === 'es' ? LABEL_ES : LABEL_EN}
		<svg class="h-3 w-3 transition-transform duration-300" class:rotate-180={open} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
	</button>

	<!-- Expanded options (absolute positioned, doesn't affect layout) -->
	{#if open}
		<div class="absolute left-0 top-full mt-1 flex gap-1 rounded-full border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
			transition:scale={{ start: 0.7, duration: 200, easing: expoOut }}
			onclick={(e: Event) => e.stopPropagation()}>
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
