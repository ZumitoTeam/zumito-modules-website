<script lang="ts">
	let { currentPage, totalPages, baseUrl }: { currentPage: number; totalPages: number; baseUrl: string } = $props();
</script>

{#if totalPages > 1}
	<nav class="flex items-center justify-center gap-2">
		{#if currentPage > 1}
			<a href="{baseUrl}?page={currentPage - 1}" class="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">Previous</a>
		{/if}
		<span class="text-sm text-zinc-500">Page {currentPage} of {totalPages}</span>
		{#if currentPage < totalPages}
			<a href="{baseUrl}?page={currentPage + 1}" class="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">Next</a>
		{/if}
	</nav>
{/if}
