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

<div class="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-zinc-800 dark:bg-zinc-900" onclick={(e) => e.stopPropagation()}>
	{#if open}
		<div class="flex items-center">
			<button onclick={(e) => switchTo(e, 'en')}
				class="w-[38px] rounded-full py-1 text-center text-xs font-semibold {$page.data.locale !== 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
				in:scale={{ start: 0.3, duration: 250, delay: 40, easing: expoOut }}
				out:scale={{ duration: 120, easing: expoOut }}>
				{LABEL_EN}
			</button>
			<button onclick={(e) => switchTo(e, 'es')}
				class="w-[38px] rounded-full py-1 text-center text-xs font-semibold {$page.data.locale === 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
				in:scale={{ start: 0.3, duration: 250, delay: 80, easing: expoOut }}
				out:scale={{ duration: 120, delay: 30, easing: expoOut }}>
				{LABEL_ES}
			</button>
		</div>
	{:else}
		<button onclick={toggle}
			class="flex w-[56px] items-center justify-center gap-1 rounded-full py-1 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
			in:scale={{ start: 0.5, duration: 200, delay: 100, easing: expoOut }}>
			{$page.data.locale === 'es' ? LABEL_ES : LABEL_EN}
			<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
		</button>
	{/if}
</div>
