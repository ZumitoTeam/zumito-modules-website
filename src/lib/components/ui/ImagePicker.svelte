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
		label,
		description,
		existingPreviews = [],
		onremoveExisting,
	}: Props = $props();

	let dragging = $state(false);
	let inputEl: HTMLInputElement;
	let selectedFiles = $state<{ file: File; url: string }[]>([]);

	// Clean up object URLs on destroy
	onDestroy(() => {
		for (const f of selectedFiles) URL.revokeObjectURL(f.url);
	});

	function handleFiles(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!file.type.startsWith('image/')) continue;
			const url = URL.createObjectURL(file);
			selectedFiles = [...selectedFiles, { file, url }];
		}
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) handleFiles(input.files);
		input.value = ''; // Reset so re-selecting same file works
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
	}
	function handleDragLeave() {
		dragging = false;
	}
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
	}
	function handleClick() {
		inputEl?.click();
	}
	function removeFile(i: number) {
		URL.revokeObjectURL(selectedFiles[i].url);
		selectedFiles = selectedFiles.filter((_, idx) => idx !== i);
	}

	const allPreviews = [...existingPreviews, ...selectedFiles.map(f => f.url)];
</script>

<!-- Drop zone -->
<div
	class="group relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200
		{dragging ? 'border-zumito-500 bg-zumito-50 scale-[1.01] dark:border-zumito-400 dark:bg-zumito-600/5' : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'}"
	onclick={handleClick}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="button"
	tabindex={0}
	onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
>
	<!-- Hidden input. For the form to work, we use a hidden input with the same name + DataTransfer trick is too complex.
         Instead, the component handles file selection and the form reads from the DataTransfer-built FileList.
         Actually the simplest: just render the input as a normal hidden input that submits its files. -->
	<input type="file" {name} {accept} {multiple} class="hidden" bind:this={inputEl} onchange={handleInputChange} />

	<!-- Hidden inputs for existing previews (so server knows which ones to keep) -->
	{#each existingPreviews as url}
		<input type="hidden" name="existing_images" value={url} />
	{/each}

	{#if allPreviews.length > 0}
		<div class="grid gap-3 {multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}">
			{#each allPreviews as url, i}
				{@const isExisting = i < existingPreviews.length}
				<div class="group/item relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
					transition:scale={{ start: 0.8, duration: 250, easing: expoOut }}>
					<img src={url} alt="" class="h-32 w-full object-cover" />
					<button type="button" onclick={(e: Event) => { e.stopPropagation(); isExisting ? onremoveExisting?.(i) : removeFile(i - existingPreviews.length); }}
						class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-all group-hover/item:opacity-100 hover:bg-black/70">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
				</div>
			{/each}
			{#if multiple}
				<button type="button" onclick={(e: Event) => { e.stopPropagation(); handleClick(); }}
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
				<p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{label}</p>
				{#if description}
					<p class="mt-1 text-xs text-zinc-400">{description}</p>
				{/if}
			</div>
			<p class="text-xs text-zinc-400">Drag & drop or click to browse</p>
		</div>
	{/if}
</div>
