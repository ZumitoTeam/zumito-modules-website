<script lang="ts">
	let { children, class: className = '' }: { children: any; class?: string } = $props();
</script>

<button class="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 {className}" {...$$restProps}>
	{@render children()}
</button>
