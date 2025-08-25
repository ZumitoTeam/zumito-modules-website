<script lang="ts">
    import Editor from '@tinymce/tinymce-svelte';
    import { PUBLIC_MINIO_URL } from '$env/static/public';

import ImageGallery from '$lib/components/ImageGallery.svelte';
import IconUploader from '$lib/components/IconUploader.svelte';
    import { enhance } from '$app/forms';
    import Milkdown from '$lib/components/Milkdown.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data;
    export let form;

    let name = data.module.name;
    let shortDescription = data.module.shortDescription || '';
    let description = data.module.description || '';
    let npm = data.module.npm || '';
    let isAdult = data.module.adult || false;

// Aplicar la corrección a las URLs
let iconUrl: string | null = data.module.icon ? PUBLIC_MINIO_URL + data.module.icon : null;
let originalIconUrl: string | null = data.module.icon; // Mantener la ruta relativa original
let iconFile: File | null = null;

// Al seleccionar un nuevo icono, actualiza iconFile y iconUrl (para el preview), pero mantiene originalIconUrl
function handleIconChange(e: CustomEvent) {
    iconFile = e.detail.iconFile;
    if (iconFile) {
        // Si hay un nuevo archivo, iconUrl se actualiza para el preview pero originalIconUrl se mantiene
        iconUrl = e.detail.iconUrl || URL.createObjectURL(iconFile);
    } else {
        // Si se remueve el archivo, volver a la URL original
        iconUrl = e.detail.iconUrl || (originalIconUrl ? PUBLIC_MINIO_URL + originalIconUrl : null);
    }
}

// Para las imágenes, mantener tanto las URLs completas (para display) como las rutas relativas (para el backend)
let images: { id: string, url: string, relativePath?: string, file?: File }[] = data.module.images.map((img: any) => ({ 
    id: crypto.randomUUID(), 
    url: PUBLIC_MINIO_URL + img.url,
    relativePath: img.url // Guardar la ruta relativa original
}));
    let removedImages: string[] = [];

    function handleGalleryChange(e: CustomEvent) {
        images = e.detail.images;
        removedImages = e.detail.removedImages;
    }

    

    let conf = {
        height: 500,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
    }


    function formatName(e: any) {
        e.currentTarget.value = e.currentTarget.value.replace(' ', '-').replaceAll('--', '-').toLowerCase();
    }

    $: if (form?.status === 200 && (form as any)?.module) {
        goto(`/module/${(form as any).module.name}`);
    }

    function handleSubmit(e: Event) {
        const form = document.getElementById('editModuleForm') as HTMLFormElement;
        const formData = new FormData(form);
        
        // Si hay iconFile, agregarlo al formData y eliminar iconUrl
        if (iconFile) {
            formData.set('iconFile', iconFile);
            formData.delete('iconUrl');
        } else {
            // Si NO hay iconFile y NO hay originalIconUrl, eliminar iconUrl para no sobreescribir
            if (!originalIconUrl) {
                formData.delete('iconUrl');
            }
        }

        // Agregar las imágenes nuevas (archivos)
        images.forEach((img, index) => {
            if (img.file) {
                formData.append('images', img.file);
            }
        });

        fetch(form.action, {
            method: 'POST',
            body: formData
        }).then(async (res) => {
            if (res.redirected) {
                window.location.href = res.url;
            } else {
                window.location.reload();
            }
        });
    }
</script>

<form id="editModuleForm" action="?/editModule" method="POST" enctype="multipart/form-data" class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4" on:submit|preventDefault={handleSubmit}>
    <div class="flex w-full flex-col gap-9">

        <!-- errors -->
        {#if form?.status === 400 || form?.status === 403 || form?.status === 404 || form?.status === 500}
            <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            {form?.error}
                        </p>
                    </div>
                </div>
            </div>
        {/if} 

        <div class="max-w-2xl">
            <label for="name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Module name</label>
            <input type="text" id="name" name="name" on:keyup={formatName} class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-pink-500 dark:focus:ring-pink-500" placeholder="zumito-framework" required bind:value={name} />
        </div>

        <div>
            <label for="short_description" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Short Description</label>
            <textarea id="short_description" name="shortDescription" rows="3" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-pink-500 dark:focus:ring-pink-500" placeholder="A short and concise description of your module" required bind:value={shortDescription}></textarea>
        </div>

        <div>
            <label for="description" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <input type="hidden" name="description" value={description} />
            <div class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-[40px] text-sm text-gray-900 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-pink-500 dark:focus:ring-pink-500">
            <Milkdown bind:value={description} />
            </div>
        </div>


        <div>
            <IconUploader bind:iconUrl bind:iconFile on:change={handleIconChange} />
            {#if originalIconUrl && !iconFile}
                <input type="hidden" name="iconUrl" value={originalIconUrl} />
            {/if}
            <!-- Si iconFile existe, se agrega en el submit JS -->
        </div>

        <div>
            <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Module Images</label>
            <ImageGallery bind:images bind:removedImages on:change={handleGalleryChange} />
            {#each images as img}
                {#if !img.file && img.relativePath}
                    <input type="hidden" name="imageUrls" value={img.relativePath} />
                {/if}
            {/each}
            {#each removedImages as url}
                <!-- Convertir URL completa a ruta relativa si es necesario -->
                <input type="hidden" name="removedImages" value={url.startsWith(PUBLIC_MINIO_URL) ? url.replace(PUBLIC_MINIO_URL, '') : url} />
            {/each}
            {#each images as img}
                {#if img.file}
                    <!-- Para nuevas imágenes, se pueden manejar en el submit JS o backend -->
                {/if}
            {/each}
        </div>

        <div>
            <label for="website-admin" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">NPM package name</label>
            <div class="flex">
                <span class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                npm install
                </span>
                <input type="text" name="npm" id="website-admin" class="block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="zumito-framework" bind:value={npm}>
            </div>
        </div>

        <div>
            <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Features</label>
            <div class="flex flex-wrap gap-3">
                {#each data.allFeatures as feature}
                    <div class="flex items-center">
                        <input type="checkbox" id="feature-{feature.id}" name="features" value={feature.name} class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-pink-600 focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-pink-600"
                        checked={data.module.features.some(f => f.name === feature.name)} />
                        <label for="feature-{feature.id}" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{feature.name}</label>
                    </div>
                {/each}
            </div>
        </div>

        <div class="flex items-center gap-2">
            <input type="checkbox" id="adult" name="adult" bind:checked={isAdult} class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-pink-600 focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-pink-600">
            <label for="adult" class="text-sm font-medium text-gray-900 dark:text-gray-300">Contains +18 content</label>
        </div>

        <div>
            <label for="first_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Price
            </label>
            <div class="flex gap-5">
                <div class="relative w-full">
                    <input class="peer hidden" id="radio_1" type="radio" name="priceType" checked />
                    <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
                    <label class="flex w-full cursor-pointer flex-col rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-600" for="radio_1">
                    <span class="text-xl font-bold">Free</span>
                    </label>
                </div>
                <div class="relative w-full">
                    <input class="peer hidden" id="radio_2" type="radio" name="priceType" disabled />
                    <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
            
                    <label class="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-600" for="radio_2">
                    <span class="text-xl font-bold">Paid</span>
                    <span class="text-sm">(Cooming soon)</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="hidden">
            <label for="first_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Tax
            </label>
            <div class="flex gap-5">
                <div class="relative w-full">
                    <input class="peer hidden" id="radio_1" type="radio" name="radio" checked />
                    <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
                    <label class="flex w-full cursor-pointer flex-col rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-700" for="radio_1">
                        <span class="mt-2 text-xl font-bold">Deduct from the price</span>
                        <ul class="mt-2 text-sm">
                            <li>User pay: 10$</li>
                            <li>You get: 9$</li>
                        </ul>
                    </label>
                </div>
                <div class="relative w-full">
                    <input class="peer hidden" id="radio_2" type="radio" name="radio" />
                    <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
            
                    <label class="flex w-full cursor-pointer flex-col rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-700" for="radio_2">
                        <span class="mt-2 text-xl font-bold">Append to the price</span>
                        <ul class="mt-2 text-sm">
                            <li>User pay: 11$</li>
                            <li>You get: 10$</li>
                        </ul>
                    </label>
                </div>
            </div>
            
        </div>

        <div class="flex w-full items-center justify-end">
            <button type="submit" class="w-full rounded bg-pink-600 px-4 py-2 font-bold text-white hover:bg-pink-700">Save Changes</button>
        </div>
  </form>