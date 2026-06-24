<script lang="ts">
	import { scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';

	interface Props {
		name: string;
		label: string;
		description?: string;
		multiple?: boolean;
		maxFiles?: number;
		maxSize?: number;
		existingPreviews?: string[];
	}

	let {
		name,
		label: pickerLabel,
		description,
		multiple = false,
		maxFiles = multiple ? 6 : 1,
		maxSize = 5_000_000,
		existingPreviews = [],
	}: Props = $props();

	let inputEl: HTMLInputElement;
	let selectedFiles = $state<{ file: File; url: string }[]>([]);
	let existingOrder = $state(structuredClone(existingPreviews));
	let removedExisting = $state<Set<number>>(new Set());
	let errors = $state<{ name: string; reason: string }[]>([]);

	onDestroy(() => { selectedFiles.forEach(f => URL.revokeObjectURL(f.url)); });

	const visibleExisting = $derived(existingOrder.filter((_, i) => !removedExisting.has(i)));
	const allItems = $derived([...visibleExisting.map((url) => ({ type: 'existing' as const, url })), ...selectedFiles.map((f, i) => ({ type: 'new' as const, url: f.url, idx: i }))]);
	const canAddMore = $derived(allItems.length < maxFiles);

	function error(msg: string, name: string) { errors = [...errors, { name, reason: msg }]; setTimeout(() => { errors = errors.filter(e => e.name !== name); }, 4000); }

	function onInputChange() {
		if (!inputEl?.files?.length) return;
		for (let i = 0; i < inputEl.files.length; i++) {
			const f = inputEl.files[i];
			if (!f.type.startsWith('image/')) { error('Only images allowed', f.name); continue; }
			if (f.size > maxSize) { error(`Max ${Math.round(maxSize / 1_000_000)}MB`, f.name); continue; }
			if (allItems.length + 1 > maxFiles) { error(`Max ${maxFiles} files`, f.name); continue; }
			selectedFiles = [...selectedFiles, { file: f, url: URL.createObjectURL(f) }];
		}
	}

	function removeNew(idx: number) { URL.revokeObjectURL(selectedFiles[idx].url); selectedFiles = selectedFiles.filter((_, i) => i !== idx); }
	function removeExisting(idx: number) { removedExisting = new Set([...removedExisting, idx]); }

	function moveNewUp(idx: number) { if (idx <= 0) return; const items = [...selectedFiles]; [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; selectedFiles = items; }
	function moveNewDown(idx: number) { if (idx >= selectedFiles.length - 1) return; const items = [...selectedFiles]; [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; selectedFiles = items; }
	function moveExistingUp(idx: number) { if (idx <= 0) return; const items = [...existingOrder]; [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; existingOrder = items; }
	function moveExistingDown(idx: number) { if (idx >= existingOrder.length - 1) return; const items = [...existingOrder]; [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; existingOrder = items; }
</script>

<div class="space-y-3">
	<!-- Visible file input (native, always works) -->
	<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{pickerLabel}</label>
	{#if description}<p class="text-xs text-zinc-400">{description}</p>{/if}
	{#if canAddMore}
		<input type="file" {name} accept="image/png,image/jpeg" {multiple} bind:this={inputEl} onchange={onInputChange}
			class="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-zumito-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:transition-all hover:file:bg-zumito-700 dark:text-zinc-400 dark:file:bg-zumito-600 dark:hover:file:bg-zumito-700" />
	{/if}

	<!-- Hidden inputs for existing images -->
	{#each existingOrder as url, i}
		{#if !removedExisting.has(i)}
			<input type="hidden" name="existing_order" value={url} />
		{/if}
	{/each}

	<!-- Previews -->
	{#if allItems.length > 0}
		<div class="mt-4 grid gap-3 {multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}">
			{#each allItems as item, idx}
				{@const isNew = item.type === 'new'}
				{@const newIdx = isNew ? (item as { idx: number }).idx : -1}
				{@const existingIdx = !isNew ? existingOrder.indexOf(item.url) : -1}
				{@const isFirst = idx === 0}
				{@const isLast = idx === allItems.length - 1}
				<div class="group/item relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800" transition:scale={{ start: 0.8, duration: 250, easing: expoOut }}>
					<img src={item.url} alt="" class="h-32 w-full object-cover" />
					<button type="button" onclick={() => isNew ? removeNew(newIdx) : removeExisting(existingIdx)}
						class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-all group-hover/item:opacity-100 hover:bg-black/70">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
					{#if multiple}
						<div class="absolute bottom-2 left-2 flex gap-1 opacity-0 transition-all group-hover/item:opacity-100">
							<button type="button" onclick={(e: Event) => { e.stopPropagation(); isNew ? moveNewUp(newIdx) : moveExistingUp(existingIdx); }} disabled={isFirst}
								class="flex h-5 w-5 items-center justify-center rounded bg-black/50 text-white backdrop-blur hover:bg-black/70 disabled:opacity-30">
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg>
							</button>
							<button type="button" onclick={(e: Event) => { e.stopPropagation(); isNew ? moveNewDown(newIdx) : moveExistingDown(existingIdx); }} disabled={isLast}
								class="flex h-5 w-5 items-center justify-center rounded bg-black/50 text-white backdrop-blur hover:bg-black/70 disabled:opacity-30">
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<p class="text-xs text-zinc-500">{allItems.length} of {maxFiles} file{maxFiles !== 1 ? 's' : ''} selected</p>
	{/if}

	{#each errors as err}
		<div class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400" transition:scale={{ start: 0.9, duration: 150 }}>
			<svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
			<span class="truncate">{err.name}</span><span>&mdash; {err.reason}</span>
		</div>
	{/each}
</div>
