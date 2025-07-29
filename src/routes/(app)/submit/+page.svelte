<script lang="ts">
    import Editor from '@tinymce/tinymce-svelte';

    import FilePond, { registerPlugin, supported } from 'svelte-filepond';

    import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
    import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
    import Submit from '$lib/components/marketing/submit.svelte';
    import { enhance } from '$app/forms';
    import Milkdown from '$lib/components/Milkdown.svelte';

    export let data;
    export let form;

    let description =  'Here goes a description for your module';

    // Register the plugins
    registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

    // a reference to the component, used to call FilePond methods
    let pond;

    // pond.getFiles() will return the active files

    // the name to use for the internal file input
    let name = 'filepond';

    // handle filepond events
    function handleInit() {
        console.log('FilePond has initialised');
    }

    function handleAddFile(err, fileItem) {
        console.log('A file has been added', fileItem);
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


    function formatName(e) {
        e.currentTarget.value = e.currentTarget.value.replace(' ', '-').replaceAll('--', '-').toLowerCase();
    }
</script>

{#if data.isLoggedIn}
  <form use:enhance action="?/createModule" method="POST" class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <div class="flex flex-col gap-5 w-full">

          <!-- errors -->
            {#if form?.status === 400}
                <div class="bg-red-50 p-4 rounded-md">
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
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Module name</label>
              <input type="text" id="first_name" name="name" on:keyup={formatName} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500" placeholder="zumito-framework" required />
          </div>
          <div>
              <label for="short_description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Short Description</label>
              <input type="text" id="short_description" name="shortDescription" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500" placeholder="A short and concise description" required />
          </div>
          <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
              <input type="hidden" name="description" value={description} />
              <div class="pl-[40px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500">
                <Milkdown bind:value={description} />
              </div>
          </div>


          <!--<div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Images</label>
              <FilePond bind:this={pond} {name}
              server="/api"
              allowMultiple={true}
              oninit={handleInit}
              onaddfile={handleAddFile}
              max-files={6}
              allowReorder={true}
              instantUpload={false}
              mul
              />
          </div>-->

          <div>
            <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NPM package name</label>
            <div class="flex">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                npm install
              </span>
              <input type="text" name="npm" id="website-admin" class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="zumito-framework">
            </div>
          </div>

          <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Price
              </label>
              <div class="flex gap-5">
                  <div class="relative w-full">
                      <input class="peer hidden" id="radio_1" type="radio" name="priceType" checked />
                      <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
                      <label class="w-full flex cursor-pointer flex-col rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-600" for="radio_1">
                        <span class="text-xl font-bold">Free</span>
                      </label>
                    </div>
                    <div class="relative w-full">
                      <input class="peer hidden" id="radio_2" type="radio" name="priceType" disabled />
                      <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
                
                      <label class="w-full flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-600" for="radio_2">
                        <span class="text-xl font-bold">Paid</span>
                        <span class="text-sm">(Cooming soon)</span>
                      </label>
                    </div>
              </div>
          </div>

          <div class="hidden">
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tax
              </label>
              <div class="flex gap-5">
                  <div class="relative w-full">
                      <input class="peer hidden" id="radio_1" type="radio" name="radio" checked />
                      <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-pink-500"></span>
                      <label class="w-full flex cursor-pointer flex-col rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-700" for="radio_1">
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
                
                      <label class="w-full flex cursor-pointer flex-col rounded-lg border border-gray-300 p-4 peer-checked:border-4 peer-checked:border-pink-700" for="radio_2">
                        <span class="mt-2 text-xl font-bold">Append to the price</span>
                        <ul class="mt-2 text-sm">
                          <li>User pay: 11$</li>
                          <li>You get: 10$</li>
                        </ul>
                      </label>
                    </div>
              </div>
          </div>

          <button type="submit" class="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">Submit</button>

      </div>
  </form>
{:else}
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Submit></Submit>
    </div>
{/if}
