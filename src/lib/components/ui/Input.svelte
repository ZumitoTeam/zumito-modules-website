<script lang="ts">
	let { id, label, class: className = '', ...rest }: { id?: string; label: string; class?: string; [key: string]: any } = $props();
</script>

<div>
	{#if label}
		<label for={id} class="block text-sm font-medium mb-1">{label}</label>
	{/if}
	<input {id} class="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 {className}" {...rest} />
</div>
