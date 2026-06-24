<script lang="ts">
	import { scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';

	interface Props {
		name: string;
		multiple?: boolean;
		accept?: string;
		label: string;
		description?: string;
		existingPreviews?: string[];
		onremoveExisting?: (index: number) => void;
	}

	let {
		name,
		multiple = false,
		accept = 'image/png,image/jpeg',
		label: pickerLabel,
		description,
		existingPreviews = [],
		onremoveExisting,
	}: Props = $props();

	const pickerId = `picker-${name}`;
	let inputEl: HTMLInputElement;
	let dragging = $state(false);
	let dragIndex = $state<number | null>(null);
	let dropIndex = $state<number | null>(null);
	let selectedFiles = $state<{ file: File; url: string }[]>([]);

	onDestroy(() => {
		for (const f of selectedFiles) URL.revokeObjectURL(f.url);
	});

	function addFiles(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!file.type.startsWith('image/')) continue;
			const url = URL.createObjectURL(file);
			selectedFiles = [...selectedFiles, { file, url }];
		}
	}

	function handleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			addFiles(input.files);
			input.value = '';
		}
	}

	function addMore(e: Event) {
		e.stopPropagation();
		inputEl?.click();
	}

	function remove(i: number) {
		URL.revokeObjectURL(selectedFiles[i].url);
		selectedFiles = selectedFiles.filter((_, idx) => idx !== i);
	}

	function handleDragStart(i: number) {
		dragIndex = i;
	}
	function handleDragOverReorder(e: DragEvent, i: number) {
		e.preventDefault();
		if (dragIndex === null) return;
		dropIndex = i;
	}
	function handleDropReorder() {
		if (dragIndex === null || dropIndex === null || dragIndex === dropIndex) {
			dragIndex = null; dropIndex = null;
			return;
		}
		const items = [...selectedFiles];
		const [moved] = items.splice(dragIndex, 1);
		items.splice(dropIndex, 0, moved);
		selectedFiles = items;
		dragIndex = null;
		dropIndex = null;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
	}
	function handleDragLeave() { dragging = false; }
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (e.dataTransfer?.files) {
			// Transfer files to the real input so form submission includes them
			const dt = new DataTransfer();
			for (let i = 0; i < e.dataTransfer.files.length; i++) dt.items.add(e.dataTransfer.files[i]);
			inputEl.files = dt.files;
			// Also add to selected for preview
			addFiles(e.dataTransfer.files);
		}
	}

	const allPreviews = [...existingPreviews, ...selectedFiles.map(f => f.url)];
</script>

<!-- Label wraps everything; click anywhere → opens file picker natively -->
<label for={pickerId} class="block cursor-pointer">
	<input
		id={pickerId}
		type="file"
		{name}
		{accept}
		{multiple}
		class="sr-only"
		bind:this={inputEl}
		onchange={handleChange}
	/>

	<!-- Hidden inputs for server-side existing images -->
	{#each existingPreviews as url}
		<input type="hidden" name="existing_images" value={url} />
	{/each}

	<div
		class="rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200
			{dragging ? 'border-zumito-500 bg-zumito-50 scale-[1.01] dark:border-zumito-400 dark:bg-zumito-600/5' : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'}"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
	>
		{#if allPreviews.length > 0}
			<!-- Preview grid: stopPropagation so clicks here don't bubble to label -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="grid gap-3 {multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}" onclick={(e: Event) => e.stopPropagation()} onkeydown={() => {}}>
				{#each allPreviews as url, i}
					{@const isExisting = i < existingPreviews.length}
					{@const isSelected = !isExisting}
					<div
						class="group/item relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 {dropIndex === i ? 'border-zumito-500' : ''}"
						class:draggable={isSelected && multiple}
						class:opacity-50={dragIndex === i}
						draggable={isSelected && multiple}
						ondragstart={() => handleDragStart(i - existingPreviews.length)}
						ondragover={(e: DragEvent) => isSelected && multiple && handleDragOverReorder(e, i - existingPreviews.length)}
						ondragend={handleDropReorder}
						ondrop={handleDropReorder}
						transition:scale={{ start: 0.8, duration: 250, easing: expoOut }}>
						<img src={url} alt="" class="h-32 w-full object-cover" />
						<button type="button" onclick={(e: Event) => { e.stopPropagation(); isExisting ? onremoveExisting?.(i) : remove(i - existingPreviews.length); }}
							class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-all group-hover/item:opacity-100 hover:bg-black/70">
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
						</button>
					</div>
				{/each}
				{#if multiple}
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
</label>

{#if selectedFiles.length > 0}
	<p class="mt-2 text-xs text-zinc-500">{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected</p>
{/if}
