<script lang="ts">
	let { tabs, active = $bindable(0) }: { tabs: string[]; active?: number } = $props();
</script>

<div class="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
	{#each tabs as tab, i}
		<button type="button" onclick={() => active = i}
			class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
			{i === active ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}">
			{tab}
		</button>
	{/each}
</div>
