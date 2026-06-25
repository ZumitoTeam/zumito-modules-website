<script lang="ts">
	import { scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	type Item = { label: string; icon?: string; href?: string; onclick?: () => void; danger?: boolean };

	let { items }: { items: Item[] } = $props();

	let open = $state(false);

	function toggle(e: Event) {
		e.stopPropagation();
		open = !open;
	}
	function close() {
		open = false;
	}
	function handle(item: Item, e: Event) {
		e.stopPropagation();
		open = false;
		if (item.href) window.location.href = item.href;
		else if (item.onclick) item.onclick();
	}
</script>

<svelte:window onclick={close} />

<div class="relative inline-flex" onclick={(e: Event) => e.stopPropagation()}>
	<button onclick={toggle}
		class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 cursor-pointer dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
		<Icon icon="tabler:dots-vertical" class="h-4 w-4" />
	</button>

	{#if open}
		<div class="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
			transition:scale={{ start: 0.92, duration: 150, easing: expoOut }}>
			{#each items as item}
				<button onclick={(e: Event) => handle(item, e)}
					class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
					{item.danger ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
					{#if item.icon}
						<Icon icon={item.icon} class="h-4 w-4 shrink-0" />
					{:else}
						<span class="w-4 shrink-0" />
					{/if}
					{item.label}
				</button>
			{/each}
		</div>
	{/if}
</div>