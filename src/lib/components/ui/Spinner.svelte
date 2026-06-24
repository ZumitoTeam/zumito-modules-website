<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<div class="flex items-center justify-center {className}">
	<div class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
</div>
