<script lang="ts">
	import { page } from '$app/stores';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let open = $state(false);

	function switchTo(locale: string) {
		open = false;
		const url = new URL($page.url);
		url.searchParams.set('lang', locale);
		window.location.href = url.toString();
	}

	function toggle(e: Event) {
		e.stopPropagation();
		open = !open;
	}

	function handleClickOutside(e: MouseEvent) {
		if (open) open = false;
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="relative flex items-center">
	<div class="flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
		{#if open}
			<!-- Expanded: both options -->
			<button onclick={() => switchTo('en')}
				class="rounded-full px-3 py-1 text-xs font-semibold transition-all {!$page.url.searchParams.get('lang') || $page.url.searchParams.get('lang') === 'en' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
				transition:fly={{ x: -8, duration: 200, easing: quintOut }}>
				EN
			</button>
			<button onclick={() => switchTo('es')}
				class="rounded-full px-3 py-1 text-xs font-semibold transition-all {$page.url.searchParams.get('lang') === 'es' ? 'bg-zumito-600 text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
				transition:fly={{ x: 8, duration: 200, easing: quintOut }}>
				ES
			</button>
		{:else}
			<!-- Compact: current locale -->
			<button onclick={toggle}
				class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-zinc-500 transition-all hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
				{$page.url.searchParams.get('lang') === 'es' ? 'ES' : 'EN'}
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
			</button>
		{/if}
	</div>
</div>
