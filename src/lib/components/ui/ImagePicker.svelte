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
	let dragSrcIdx = $state<number | null>(null);
	let dragDstIdx = $state<number | null>(null);
	let selectedFiles = $state<{ file: File; url: string }[]>([]);
	let existingOrder = $state([...existingPreviews]);
	let errors = $state<{ name: string; reason: string }[]>([]);

	onDestroy(() => {
		selectedFiles.forEach(f => URL.revokeObjectURL(f.url));
	});

	const allItems = $derived([...existingOrder.map((url, i) => ({ type: 'existing' as const, url, origIdx: i })), ...selectedFiles.map((f, i) => ({ type: 'new' as const, url: f.url, idx: i }))]);
	const canAddMore = $derived(allItems.length < maxFiles);

	function error(msg: string, name: string) {
		errors = [...errors, { name, reason: msg }];
		setTimeout(() => { errors = errors.filter(e => e.name !== name); }, 4000);
	}

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
			inputEl.value = '';
		}
	}

	function addMore(e: Event) {
		e.stopPropagation();
		inputEl?.click();
	}

	function removeNew(idx: number) {
		URL.revokeObjectURL(selectedFiles[idx].url);
		selectedFiles = selectedFiles.filter((_, i) => i !== idx);
	}

	function removeExisting(origIdx: number) {
		onRemoveExisting?.(origIdx);
		existingOrder = existingOrder.filter((_, i) => i !== origIdx);
	}

	// OS drag-drop
	function dropZoneDragOver(e: DragEvent) { e.preventDefault(); dragging = true; }
	function dropZoneDragLeave() { dragging = false; }
	function dropZoneDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (!e.dataTransfer?.files.length) return;
		const dt = new DataTransfer();
		for (let i = 0; i < e.dataTransfer.files.length; i++) dt.items.add(e.dataTransfer.files[i]);
		if (dt.files.length > 0) {
			handleFiles(dt.files);
			// Also set the real input files so form submission includes them
			if (inputEl) {
				const combined = new DataTransfer();
				selectedFiles.forEach(f => combined.items.add(f.file));
				inputEl.files = combined.files;
			}
		}
	}

	// Internal reorder (new files only)
	function dragStartNew(idx: number, e: DragEvent) {
		dragSrcIdx = idx;
		e.dataTransfer!.effectAllowed = 'move';
	}
	function dragOverNew(idx: number, e: DragEvent) {
		e.preventDefault();
		dragDstIdx = idx;
	}
	function dragEndNew() {
		if (dragSrcIdx !== null && dragDstIdx !== null && dragSrcIdx !== dragDstIdx) {
			const items = [...selectedFiles];
			const [moved] = items.splice(dragSrcIdx, 1);
			items.splice(dragDstIdx, 0, moved);
			selectedFiles = items;
		}
		dragSrcIdx = null; dragDstIdx = null;
	}

	// Internal reorder (existing files)
	function dragStartExisting(origIdx: number, e: DragEvent) {
		// Track by the actual array index within existingOrder
		const arrIdx = existingOrder.findIndex((_, i) => i === origIdx);
		dragSrcIdx = arrIdx;
		e.dataTransfer!.effectAllowed = 'move';
	}
	function dragOverExisting(origIdx: number, e: DragEvent) {
		e.preventDefault();
		const arrIdx = existingOrder.findIndex((_, i) => i === origIdx);
		dragDstIdx = arrIdx;
	}
	function dragEndExisting() {
		if (dragSrcIdx !== null && dragDstIdx !== null && dragSrcIdx !== dragDstIdx) {
			const items = [...existingOrder];
			const [moved] = items.splice(dragSrcIdx, 1);
			items.splice(dragDstIdx, 0, moved);
			existingOrder = items;
		}
		dragSrcIdx = null; dragDstIdx = null;
	}
</script>

<div class="relative space-y-3">
	<!-- File input:
	     - When NO previews: overlay on drop zone, transparent but clickable (native clicks)
	     - When HAS previews: off-screen, clickable only via JS (addMore button)
	-->
	<input
		type="file"
		{name}
		{accept}
		{multiple}
		class={allItems.length === 0
			? 'absolute inset-0 z-10 cursor-pointer opacity-0'
			: 'absolute left-[-9999px] top-0 h-px w-px opacity-0'}
		bind:this={inputEl}
		onchange={onInputChange}
	/>

	{#each existingOrder as url, i}
		<input type="hidden" name="existing_order" value={url} />
	{/each}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200
			{dragging ? 'border-zumito-500 bg-zumito-50 scale-[1.01] dark:border-zumito-400 dark:bg-zumito-600/5' : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'}"
		ondragover={dropZoneDragOver}
		ondragleave={dropZoneDragLeave}
		ondrop={dropZoneDrop}
		role="button"
		tabindex={0}
		onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') inputEl?.click(); }}
	>
		{#if allItems.length > 0}
			<div class="grid gap-3 {multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}" onclick={(e: Event) => e.stopPropagation()} onkeydown={() => {}}>
				{#each allItems as item, idx}
					{@const isNew = item.type === 'new'}
					{@const newIdx = isNew ? (item as { idx: number }).idx : -1}
					{@const origIdx = !isNew ? (item as { origIdx: number }).origIdx : -1}

					<div
						class="group/item relative overflow-hidden rounded-xl border border-zinc-200 transition-all dark:border-zinc-800
							{dragDstIdx !== null && isNew && dragDstIdx === newIdx ? 'border-zumito-500' : ''}
							{dragSrcIdx !== null && isNew && dragSrcIdx === newIdx ? 'opacity-30' : ''}
							{!isNew && dragDstIdx !== null && dragDstIdx === origIdx ? 'border-zumito-500' : ''}
							{!isNew && dragSrcIdx !== null && dragSrcIdx === origIdx ? 'opacity-30' : ''}"
						class:cursor-grab={multiple}
						draggable={multiple}
						ondragstart={(e: DragEvent) => isNew ? dragStartNew(newIdx, e) : dragStartExisting(origIdx, e)}
						ondragover={(e: DragEvent) => isNew ? dragOverNew(newIdx, e) : dragOverExisting(origIdx, e)}
						ondragend={() => isNew ? dragEndNew() : dragEndExisting()}
						ondrop={() => isNew ? dragEndNew() : dragEndExisting()}
						transition:scale={{ start: 0.8, duration: 250, easing: expoOut }}>
						<img src={item.url} alt="" class="h-32 w-full object-cover" />
						<button type="button" onclick={(e: Event) => { e.stopPropagation(); isNew ? removeNew(newIdx) : removeExisting(origIdx); }}
							class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-all group-hover/item:opacity-100 hover:bg-black/70">
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
						</button>
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
					{#if description}
						<p class="mt-1 text-xs text-zinc-400">{description}</p>
					{/if}
				</div>
				<p class="text-xs text-zinc-400">Drag & drop or click to browse</p>
			</div>
		{/if}
	</div>

	<!-- Errors -->
	{#each errors as err}
		<div class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400" transition:scale={{ start: 0.9, duration: 150 }}>
			<svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
			<span class="truncate">{err.name}</span>
			<span>&mdash; {err.reason}</span>
		</div>
	{/each}

	{#if selectedFiles.length > 0}
		<p class="text-xs text-zinc-500">{allItems.length} of {maxFiles} file{maxFiles !== 1 ? 's' : ''} selected</p>
	{/if}
</div>
