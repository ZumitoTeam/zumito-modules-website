<script lang="ts">
	let { children, class: className = '' }: { children: any; class?: string } = $props();
</script>

<div class="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800 {className}">
	{@render children()}
</div>
