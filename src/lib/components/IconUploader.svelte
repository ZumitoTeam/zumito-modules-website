<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let iconUrl: string | null = null;
  export let iconFile: File | null = null;

  const dispatch = createEventDispatcher();

  let previewUrl: string | null = null;

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      iconFile = input.files[0];
      previewUrl = URL.createObjectURL(iconFile);
      dispatch('change', { iconFile, iconUrl: null });
    }
  }

  function removeIcon() {
    iconFile = null;
    previewUrl = null;
    iconUrl = null;
    dispatch('change', { iconFile: null, iconUrl: null });
  }

  $: if (!iconFile && iconUrl) {
    previewUrl = iconUrl;
  } else if (!iconFile && !iconUrl) {
    previewUrl = null;
  }
</script>

<div class="flex flex-col gap-2 items-start">
  <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Module Icon</label>
  {#if previewUrl}
    <div class="relative group">
      <img src={previewUrl} alt="icon preview" class="w-20 h-20 object-contain rounded border" />
      <button type="button" class="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-red-700" on:click={removeIcon} title="Remove icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  {/if}
  <input type="file" accept="image/*" class="block mt-2" on:change={handleFileChange} />
</div>
