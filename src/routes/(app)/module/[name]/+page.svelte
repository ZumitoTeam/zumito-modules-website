<script lang="ts">
    import { page } from '$app/stores';
    import { Prisma, type Module } from '@prisma/client'
    import Tiptap from '$lib/components/Tiptap.svelte';
    import TimeAgo from 'javascript-time-ago';
    import en from 'javascript-time-ago/locale/en'
    import FaqItem from '$lib/components/FaqItem.svelte';
    import { Swiper } from "svelte-swiper-matrix";
    import { marked } from 'marked';
    import { PUBLIC_MINIO_URL } from '$env/static/public';

    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-US')

    let module: Module = $page.data.module;
</script>

<div class="bg-gray-50">

    <div class="mx-auto max-w-screen-xl p-4">
        <h1 class="text-4xl">
            {module.name}
        </h1>

        <div class="mb-4 mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto">
            {#each module.images as image}
                <img src={PUBLIC_MINIO_URL + image.url} class="flex h-[300px] flex-shrink-0 snap-center items-center justify-center rounded-xl bg-red-500 text-white">
            {/each}
        </div>
    </div>


    <div class="mx-auto flex max-w-screen-xl flex-col-reverse gap-12 p-4 lg:flex-row">

        <div class="flex w-full flex-col lg:w-4/6">
               
            <div class="mb-2 text-2xl">
                Description
            </div>
            <div class="prose rounded-2xl bg-white p-5 shadow-sm">
                {@html marked(module.description)}
            </div>
    
            {#if module?.faqs && module?.faqs.length > 0}
                <div class="mb-2 mt-10 text-2xl">
                    Frequent Asked Questions
                </div>
                <div class="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm">
                    {#each module?.faqs as faq}
                        <FaqItem question={faq.question} answer={faq.answer}></FaqItem>
                    {/each}
                </div>
            {/if}

            <div class="mb-2 mt-10 text-2xl">
                Comments
            </div>
            <div class="rounded-2xl bg-white p-5 shadow-sm">
                {#each module.comments as comment}
                    <div class="flex p-4 text-left text-gray-600">
                        <img class="mr-5 block h-8 w-8 max-w-full rounded-xl text-left align-middle sm:h-16 sm:w-16" src="https://ui-avatars.com/api/?name={comment.author.username}" alt="{comment.author.username} Profile Picture" />
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

        <div class="sticky top-0 flex h-fit w-full flex-col gap-5 lg:w-2/6">

            <button type="button" class="mb-2 me-2 w-full rounded-lg bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">Install</button>
            
            <ul class="flex flex-col justify-end -space-y-px text-start">
                <li class="flex items-center gap-x-2 border bg-white p-3 text-sm text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  <div class="flex w-full justify-between truncate">
                    <span class="me-3 flex w-0 flex-1 items-center gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
                            <path d="M12 7v10" />
                        </svg>
                        Price
                    </span>
                    <div class="flex items-center gap-x-2 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                      {module.price == 0 ? 'Free' : module.price}
                    </div>
                  </div>
                </li>
                <li class="flex items-center gap-x-2 border bg-white p-3 text-sm text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                    <div class="flex w-full justify-between truncate">
                      <span class="me-3 flex w-0 flex-1 items-center gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" />
                            <path d="M12 13l0 9" />
                            <path d="M9 19l3 3l3 -3" />
                        </svg>
                          Installs
                      </span>
                      <div class="flex items-center gap-x-2 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                        {module._count.installs}
                      </div>
                    </div>
                  </li>
            </ul>
            
            <ul class="flex flex-col justify-end -space-y-px text-start">
                <li class="flex items-center gap-x-2 border bg-white p-3 text-sm text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  <div class="flex w-full justify-between truncate">
                    <span class="me-3 flex w-0 flex-1 items-center gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
                    <button type="button" class="flex items-center gap-x-2 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 6l6 6l-6 6" />
                      </svg>
                    </button>
                  </div>
                </li>
                <li class="flex items-center gap-x-2 border bg-white p-3 text-sm text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                    <div class="flex w-full justify-between truncate">
                      <span class="me-3 flex w-0 flex-1 items-center gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" />
                        </svg>
                        Comments
                      </span>
                      <button type="button" class="flex items-center gap-x-2 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
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