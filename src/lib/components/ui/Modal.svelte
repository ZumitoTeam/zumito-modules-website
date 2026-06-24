<script lang="ts">
	let { children, open = $bindable(false), class: className = '' }: { children: any; open?: boolean; class?: string } = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => open = false} onkeydown={(e) => e.key === 'Escape' && (open = false)} role="dialog">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 {className}" onclick={(e: Event) => e.stopPropagation()} onkeydown={() => {}}>
			{@render children()}
		</div>
	</div>
{/if}
