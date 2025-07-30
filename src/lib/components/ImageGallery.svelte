<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';

  export let images: { id: string, url: string, relativePath?: string, file?: File }[] = [];
  export let removedImages: string[] = [];

  const dispatch = createEventDispatcher();

  let fileInput: HTMLInputElement;

  function handleFilesSelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    for (const file of files) {
      const url = URL.createObjectURL(file);
      images = [...images, { id: crypto.randomUUID(), url, file }]; // Sin relativePath para archivos nuevos
    }
    dispatch('change', { images, removedImages });
    fileInput.value = '';
  }

  function removeImage(idx: number) {
    const img = images[idx];
    if (img.file) {
      URL.revokeObjectURL(img.url);
    } else if (img.relativePath) {
      // Para imágenes existentes, agregar la ruta relativa a removedImages
      removedImages = [...removedImages, img.relativePath];
    } else {
      // Fallback: si no hay relativePath, usar la URL (aunque debería evitarse)
      removedImages = [...removedImages, img.url];
    }
    images = images.filter((_, i) => i !== idx);
    dispatch('change', { images, removedImages });
  }

  function handleDnd({ detail }) {
    images = detail.items;
    dispatch('change', { images, removedImages });
  }
</script>

<div class="flex flex-col gap-4">
  <input type="file" multiple accept="image/*" bind:this={fileInput} on:change={handleFilesSelected} class="mb-2" />
  <div use:dndzone={{ items: images, flipDurationMs: 150 }} on:consider={handleDnd} on:finalize={handleDnd} class="flex flex-wrap gap-4">
    {#each images as img, idx (img.id)}
      <div class="relative group border rounded p-2 bg-gray-50 shadow hover:shadow-lg transition-all flex flex-col items-center">
        <img src={img.url} alt="preview" class="w-32 h-32 object-cover rounded mb-2" />
        <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100" on:click={() => removeImage(idx)} title="Remove">
          &times;
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .dndDragging {
    opacity: 0.5;
  }
  .dndPlaceholder {
    border: 2px dashed #e5e7eb;
    background: #f3f4f6;
  }
</style>
