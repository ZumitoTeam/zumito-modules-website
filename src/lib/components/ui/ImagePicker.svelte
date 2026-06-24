<script lang="ts">
	import { scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';

	interface Props {
		name: string;
		label: string;
		description?: string;
		multiple?: boolean;
		accept?: string;
		maxFiles?: number;
		maxSize?: number;
		existingPreviews?: string[];
		onRemoveExisting?: (index: number) => void;
	}

	let {
		name,
		label: pickerLabel,
		description,
		multiple = false,
		accept = 'image/png,image/jpeg',
		maxFiles = multiple ? 6 : 1,
		maxSize = 5_000_000,
		existingPreviews = [],
		onRemoveExisting,
	}: Props = $props();

	let inputEl: HTMLInputElement;
	let dragging = $state(false);
	let selectedFiles = $state<{ file: File; url: string }[]>([]);
	let existingOrder = $state(structuredClone(existingPreviews));
	let removedExisting = $state<Set<number>>(new Set());
	let errors = $state<{ name: string; reason: string }[]>([]);

	onDestroy(() => { selectedFiles.forEach(f => URL.revokeObjectURL(f.url)); });

	const visibleExisting = $derived(existingOrder.filter((_, i) => !removedExisting.has(i)));
	const allItems = $derived([...visibleExisting.map((url) => ({ type: 'existing' as const, url })), ...selectedFiles.map((f, i) => ({ type: 'new' as const, url: f.url, idx: i }))]);
	const canAddMore = $derived(allItems.length < maxFiles);

	function error(msg: string, name: string) { errors = [...errors, { name, reason: msg }]; setTimeout(() => { errors = errors.filter(e => e.name !== name); }, 4000); }

	function handleFiles(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			const f = files[i];
			if (!f.type.startsWith('image/')) { error('Only images allowed', f.name); continue; }
			if (f.size > maxSize) { error(`Max ${Math.round(maxSize / 1_000_000)}MB`, f.name); continue; }
			if (allItems.length + 1 > maxFiles) { error(`Max ${maxFiles} files`, f.name); continue; }
			selectedFiles = [...selectedFiles, { file: f, url: URL.createObjectURL(f) }];
		}
	}

	function onInputChange() {
		if (inputEl?.files?.length) {
			handleFiles(inputEl.files);
			syncInput();
		}
	}

	// Sync real input with selectedFiles so FormData submission includes them
	function syncInput() {
		if (!inputEl) return;
		const dt = new DataTransfer();
		for (const f of selectedFiles) dt.items.add(f.file);
		inputEl.files = dt.files;
	}

	function addMore(e: Event) { e.stopPropagation(); inputEl?.click(); }

	function removeNew(idx: number) {
		URL.revokeObjectURL(selectedFiles[idx].url);
		selectedFiles = selectedFiles.filter((_, i) => i !== idx);
		syncInput();
	}
	function removeExisting(idx: number) { onRemoveExisting?.(idx); removedExisting = new Set([...removedExisting, idx]); }

	function moveNewUp(idx: number) { if (idx <= 0) return; const items = [...selectedFiles]; [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; selectedFiles = items; }
	function moveNewDown(idx: number) { if (idx >= selectedFiles.length - 1) return; const items = [...selectedFiles]; [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; selectedFiles = items; }
	function moveExistingUp(idx: number) { if (idx <= 0) return; const items = [...existingOrder]; [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; existingOrder = items; }
	function moveExistingDown(idx: number) { if (idx >= existingOrder.length - 1) return; const items = [...existingOrder]; [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; existingOrder = items; }

	function dropZoneDragOver(e: DragEvent) { e.preventDefault(); dragging = true; }
	function dropZoneDragLeave() { dragging = false; }
	function dropZoneDrop(e: DragEvent) {
		e.preventDefault(); dragging = false;
		if (!e.dataTransfer?.files.length) return;
		handleFiles(e.dataTransfer.files);
		syncInput();
	}
</script>

<div class="relative space-y-3">
	<input type="file" {name} {accept} {multiple}
		class={allItems.length === 0 ? 'absolute inset-0 z-10 cursor-pointer opacity-0' : 'absolute left-[-9999px] top-0 h-px w-px opacity-0'}
		bind:this={inputEl} onchange={onInputChange} />

	{#each existingOrder as url, i}
		{#if !removedExisting.has(i)}
			<input type="hidden" name="existing_order" value={url} />
		{/if}
	{/each}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200
		{dragging ? 'border-zumito-500 bg-zumito-50 scale-[1.01] dark:border-zumito-400 dark:bg-zumito-600/5' : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'}"
		ondragover={dropZoneDragOver} ondragleave={dropZoneDragLeave} ondrop={dropZoneDrop}
		role="button" tabindex={0}
		onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') inputEl?.click(); }}>
		{#if allItems.length > 0}
			<div class="grid gap-3 {multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}" onclick={(e: Event) => e.stopPropagation()} onkeydown={() => {}}>
				{#each allItems as item, idx}
					{@const isNew = item.type === 'new'}
					{@const newIdx = isNew ? (item as { idx: number }).idx : -1}
					{@const existingIdx = !isNew ? existingOrder.indexOf(item.url) : -1}
					{@const isFirst = idx === 0}
					{@const isLast = idx === allItems.length - 1}
					<div class="group/item relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800" transition:scale={{ start: 0.8, duration: 250, easing: expoOut }}>
						<img src={item.url} alt="" class="h-32 w-full object-cover" />
						<button type="button" onclick={(e: Event) => { e.stopPropagation(); isNew ? removeNew(newIdx) : removeExisting(existingIdx); }}
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
				{#if canAddMore && multiple}
					<button type="button" onclick={addMore}
						class="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 text-zinc-400 transition-colors hover:border-zumito-300 hover:text-zumito-500 dark:border-zinc-800 dark:hover:border-zumito-600">
						<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
					</button>
				{/if}
			</div>
		{:else}
			<div class="flex flex-col items-center gap-3" in:scale={{ start: 0.95, duration: 200 }}>
				<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 transition-transform group-hover:scale-105 dark:bg-zinc-800">
					<svg class="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM8.25 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
					</svg>
				</div>
				<div>
					<p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{pickerLabel}</p>
					{#if description}<p class="mt-1 text-xs text-zinc-400">{description}</p>{/if}
				</div>
				<p class="text-xs text-zinc-400">Drag & drop or click to browse</p>
			</div>
		{/if}
	</div>

	{#each errors as err}
		<div class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400" transition:scale={{ start: 0.9, duration: 150 }}>
			<svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
			<span class="truncate">{err.name}</span><span>&mdash; {err.reason}</span>
		</div>
	{/each}
	{#if selectedFiles.length > 0}
		<p class="text-xs text-zinc-500">{allItems.length} of {maxFiles} file{maxFiles !== 1 ? 's' : ''} selected</p>
	{/if}
</div>
