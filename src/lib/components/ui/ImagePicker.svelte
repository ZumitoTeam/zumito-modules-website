<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		name: string;
		label: string;
		description?: string;
		multiple?: boolean;
		accept?: string;
	}

	let {
		name,
		label: pickerLabel,
		description,
		multiple = false,
		accept = 'image/png,image/jpeg',
	}: Props = $props();

	let previews = $state<{ url: string }[]>([]);

	onDestroy(() => previews.forEach(p => URL.revokeObjectURL(p.url)));

	function onchange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		const newPreviews: { url: string }[] = [];
		for (const file of input.files) {
			if (!file.type.startsWith('image/')) continue;
			newPreviews.push({ url: URL.createObjectURL(file) });
		}
		previews = [...previews, ...newPreviews];
		input.value = '';
	}

	function remove(i: number) {
		URL.revokeObjectURL(previews[i].url);
		previews = previews.filter((_, idx) => idx !== i);
	}
</script>

<div class="space-y-4">
	<div>
		<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{pickerLabel}</label>
		{#if description}
			<p class="mt-1 text-xs text-zinc-400">{description}</p>
		{/if}
		<input type="file" {name} {accept} {multiple} onchange={onchange}
			class="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-zumito-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:transition-all hover:file:bg-zumito-700 dark:text-zinc-400 dark:file:bg-zumito-600 dark:hover:file:bg-zumito-700" />
	</div>

	{#if previews.length > 0}
		<div class="grid gap-3 {multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}">
			{#each previews as p, i}
				<div class="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800" transition:scale={{ start: 0.8, duration: 250 }}>
					<img src={p.url} alt="" class="h-32 w-full object-cover" />
					<button type="button" onclick={() => remove(i)}
						class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-black/70">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
