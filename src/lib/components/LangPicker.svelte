<script lang="ts">
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto, invalidateAll } from '$app/navigation';

	let open = $state(false);
	/* @wc-ignore */
	const LABEL_EN = 'EN';
	/* @wc-ignore */
	const LABEL_ES = 'ES';

	async function switchTo(locale: string) {
		open = false;
		const url = new URL($page.url);
		url.searchParams.set('lang', locale);
		await goto(url.toString(), { replaceState: true, invalidateAll: true });
	}

	function toggle(e: Event) {
		e.stopPropagation();
		open = !open;
	}
</script>

<svelte:window onclick={() => { if (open) open = false; }} />

<div class="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-zinc-800 dark:bg-zinc-900">
	{#if open}
		<button onclick={() => switchTo('en')}
			class="w-[38px] rounded-full py-1 text-center text-xs font-semibold transition-all {$page.data.locale !== 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
			transition:scale={{ start: 0.85, duration: 200, easing: quintOut }}>{LABEL_EN}</button>
		<button onclick={() => switchTo('es')}
			class="w-[38px] rounded-full py-1 text-center text-xs font-semibold transition-all {$page.data.locale === 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
			transition:scale={{ start: 0.85, duration: 200, easing: quintOut }}>{LABEL_ES}</button>
	{:else}
		<button onclick={toggle}
			class="flex w-[56px] items-center justify-center gap-0.5 rounded-full py-1 text-xs font-semibold text-zinc-500 transition-all hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
			{$page.data.locale === 'es' ? LABEL_ES : LABEL_EN}
			<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
		</button>
	{/if}
</div>
