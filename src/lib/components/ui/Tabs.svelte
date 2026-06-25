<script lang="ts">
	import { scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	type Tab = { label: string; icon?: string };
	let { tabs, active = $bindable(0) }: { tabs: (string | Tab)[]; active?: number } = $props();

	function label(t: string | Tab) { return typeof t === 'string' ? t : t.label; }
	function icon(t: string | Tab) { return typeof t === 'string' ? undefined : t.icon; }

	let dropdownOpen = $state(false);

	function prev() {
		active = (active - 1 + tabs.length) % tabs.length;
	}
	function next() {
		active = (active + 1) % tabs.length;
	}
	function select(i: number) {
		active = i;
		dropdownOpen = false;
	}
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
	function closeDropdown() {
		dropdownOpen = false;
	}
</script>

<svelte:window onclick={closeDropdown} />

<!-- Desktop: full tabs row -->
<div class="hidden sm:flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
	{#each tabs as tab, i}
		<button type="button" onclick={() => active = i}
			class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer
			{i === active ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}">
			{#if icon(tab)}<Icon icon={icon(tab)!} class="h-4 w-4 shrink-0" />{/if}
			{label(tab)}
		</button>
	{/each}
</div>

<!-- Mobile: arrows + active tab + dropdown -->
<div class="relative sm:hidden" onclick={(e: Event) => e.stopPropagation()}>
	<div class="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
		<button type="button" onclick={prev}
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white hover:text-zinc-700 cursor-pointer dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
			<Icon icon="tabler:chevron-left" class="h-5 w-5" />
		</button>
		<button type="button" onclick={toggleDropdown}
			class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-zinc-900 transition-colors cursor-pointer dark:text-zinc-100">
			{#if icon(tabs[active])}<Icon icon={icon(tabs[active])!} class="h-4 w-4 shrink-0" />{/if}
			{label(tabs[active])}
			<Icon icon="tabler:chevron-down" class="ml-0.5 h-4 w-4 text-zinc-400 transition-transform {dropdownOpen ? 'rotate-180' : ''}" />
		</button>
		<button type="button" onclick={next}
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white hover:text-zinc-700 cursor-pointer dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
			<Icon icon="tabler:chevron-right" class="h-5 w-5" />
		</button>
	</div>

	{#if dropdownOpen}
		<div class="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
			transition:scale={{ start: 0.92, duration: 180, easing: expoOut }}>
			{#each tabs as tab, i}
				<button type="button" onclick={() => select(i)}
					class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer
					{i === active ? 'bg-zumito-50 text-zumito-600 dark:bg-zumito-600/10 dark:text-zumito-400' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
					{#if icon(tab)}
						<Icon icon={icon(tab)!} class="h-4 w-4 shrink-0" />
					{:else}
						<span class="w-4 shrink-0" />
					{/if}
					{label(tab)}
				</button>
			{/each}
		</div>
	{/if}
</div>
