<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-white dark:bg-zinc-950">
	{@render children()}
</div>
