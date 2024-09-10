<script lang="ts">
    import { page } from '$app/stores';
    import { Prisma, type Module } from '@prisma/client'
    import Tiptap from '$lib/components/Tiptap.svelte';
    import TimeAgo from 'javascript-time-ago';
    import en from 'javascript-time-ago/locale/en'
    import FaqItem from '$lib/components/FaqItem.svelte';
    import { Swiper } from "svelte-swiper-matrix";

    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-US')

    let module: Module = $page.data.module;
</script>

<div class="bg-gray-50">

    <div class="max-w-screen-xl mx-auto p-4">
        <h1 class="text-4xl">
            {module.name}
        </h1>

        <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-4 mt-2">
          <img src="https://placehold.co/600x350" class="rounded-xl snap-center flex-shrink-0 bg-red-500 text-white flex items-center justify-center h-[300px]">
          <img src="https://placehold.co/600x350" class="rounded-xl snap-center flex-shrink-0 bg-red-500 text-white flex items-center justify-center h-[300px]">
          <img src="https://placehold.co/600x350" class="rounded-xl snap-center flex-shrink-0 bg-red-500 text-white flex items-center justify-center h-[300px]">
        </div>
    </div>


    <div class="max-w-screen-xl mx-auto p-4 flex gap-12">

        <div class="flex flex-col w-4/6">
               
            <div class="text-2xl mb-2">
                Description
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm">
                {@html module.description}
            </div>
    
            {#if module?.faqs && module?.faqs.length > 0}
                <div class="text-2xl mb-2 mt-10">
                    Frequent Asked Questions
                </div>
                <div class="bg-white p-5 rounded-2xl shadow-sm flex flex-col gap-5">
                    {#each module?.faqs as faq}
                        <FaqItem question={faq.question} answer={faq.answer}></FaqItem>
                    {/each}
                </div>
            {/if}

            <div class="text-2xl mb-2 mt-10">
                Comments
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm">
                {#each module.comments as comment}
                    <div class="flex p-4 text-left text-gray-600">
                        <img class="mr-5 block h-8 w-8 max-w-full text-left align-middle sm:h-16 sm:w-16 rounded-xl" src="https://ui-avatars.com/api/?name={comment.author.username}" alt="{comment.author.username} Profile Picture" />
                        <div class="w-full text-left">
                            <div class="mb-2 flex flex-col justify-between text-gray-600 sm:flex-row">
                                <h3 class="font-medium">{comment.author.username}</h3>
                                <time class="text-xs" datetime="2022-11-13T20:00Z">{timeAgo.format(new Date(comment.createdAt))}</time>
                            </div>
                            <p class="text-sm">{comment.content}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="w-2/6 sticky top-0 h-fit flex flex-col gap-5">

            <button type="button" class="w-full text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-pink-600 dark:hover:bg-pink-700 focus:outline-none dark:focus:ring-pink-800">Install</button>
            
            <ul class="flex flex-col justify-end text-start -space-y-px">
                <li class="flex items-center gap-x-2 p-3 text-sm bg-white border text-gray-800 first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                  <div class="w-full flex justify-between truncate">
                    <span class="me-3 flex-1 w-0 truncate flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
                            <path d="M12 7v10" />
                        </svg>
                        Price
                    </span>
                    <div class="flex items-center gap-x-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 whitespace-nowrap dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                      {module.price == 0 ? 'Free' : module.price}
                    </div>
                  </div>
                </li>
                <li class="flex items-center gap-x-2 p-3 text-sm bg-white border text-gray-800 first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                    <div class="w-full flex justify-between truncate">
                      <span class="me-3 flex-1 w-0 truncate flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" />
                            <path d="M12 13l0 9" />
                            <path d="M9 19l3 3l3 -3" />
                        </svg>
                          Installs
                      </span>
                      <div class="flex items-center gap-x-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 whitespace-nowrap dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                        {module._count.installs}
                      </div>
                    </div>
                  </li>
            </ul>
            
            <ul class="flex flex-col justify-end text-start -space-y-px">
                <li class="flex items-center gap-x-2 p-3 text-sm bg-white border text-gray-800 first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                  <div class="w-full flex justify-between truncate">
                    <span class="me-3 flex-1 w-0 truncate flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M20.975 11.33a9 9 0 1 0 -5.673 9.043" />
                            <path d="M3.6 9h16.8" />
                            <path d="M3.6 15h9.9" />
                            <path d="M11.5 3a17 17 0 0 0 0 18" />
                            <path d="M12.5 3a16.988 16.988 0 0 1 2.57 9.518m-1.056 5.403a17 17 0 0 1 -1.514 3.079" />
                            <path d="M19 22v.01" />
                            <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
                        </svg>
                        Frequent Asked Questions
                    </span>
                    <button type="button" class="flex items-center gap-x-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 whitespace-nowrap dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 6l6 6l-6 6" />
                      </svg>
                    </button>
                  </div>
                </li>
                <li class="flex items-center gap-x-2 p-3 text-sm bg-white border text-gray-800 first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                    <div class="w-full flex justify-between truncate">
                      <span class="me-3 flex-1 w-0 truncate flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" />
                        </svg>
                        Comments
                      </span>
                      <button type="button" class="flex items-center gap-x-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 whitespace-nowrap dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M9 6l6 6l-6 6" />
                        </svg>
                      </button>
                    </div>
                </li>
            </ul>
        </div>


    </div>
</div>    

<svelte:head>
    <script type="application/ld+json">
        {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": module.name,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": module.price,
                "availability": "https://schema.org/InStock"
            }
        }
    </script>
</svelte:head>

<style>
    .embla {
      overflow: hidden;
    }
    .embla__container {
      display: flex;
    }
    .embla__slide {
      width: 100%;
      text-align: center;
    }
</style>