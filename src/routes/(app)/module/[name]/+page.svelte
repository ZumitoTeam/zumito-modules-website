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
    import Background from '$lib/components/structure/background.svelte';
    import { onMount } from 'svelte';

    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-US')

    // Extend Window interface for disqus
    declare global {
        interface Window {
            disqus: {
                pageUrl: string;
                pageIdentifier: string;
            };
        }
    }

    let module: any = $page.data.module; // Using any type to avoid complex type issues
    let showImageModal = false;
    let selectedImage = '';
    let selectedImageIndex = 0;

    function openImageModal(imageUrl: string, index: number) {
        selectedImage = imageUrl;
        selectedImageIndex = index;
        showImageModal = true;
    }

    function closeImageModal() {
        showImageModal = false;
        selectedImage = '';
    }

    function nextImage() {
        if (selectedImageIndex < (module.images?.length || 0) - 1) {
            selectedImageIndex++;
            selectedImage = PUBLIC_MINIO_URL + (module.images?.[selectedImageIndex]?.url || '');
        }
    }

    function prevImage() {
        if (selectedImageIndex > 0) {
            selectedImageIndex--;
            selectedImage = PUBLIC_MINIO_URL + (module.images?.[selectedImageIndex]?.url || '');
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (showImageModal) {
            if (event.key === 'Escape') {
                closeImageModal();
            } else if (event.key === 'ArrowRight') {
                nextImage();
            } else if (event.key === 'ArrowLeft') {
                prevImage();
            }
        }
    }

    function scrollToComments() {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    onMount(() => {
        if (!module.giscusEnabled) {
            window.disqus = {
                pageUrl: window.location.href,
                pageIdentifier: $page.params.name
            };
        }
    }); 
</script>

<svelte:window on:keydown={handleKeydown} />

<Background>

    <div class="mx-auto max-w-screen-xl p-4">
        <div class="mb-6">
            <div class="flex items-center gap-4">
                {#if module.icon}
                    <img src={PUBLIC_MINIO_URL + module.icon} alt="{module.name} icon" class="h-16 w-16 rounded-xl border border-gray-200 object-cover shadow-lg lg:h-20 lg:w-20 dark:border-gray-700">
                {/if}
                <div class="flex-1">
                    <div class="flex items-center gap-3">
                        <h1 class="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                            {module.name}
                        </h1>
                        {#if module.adult}
                            <span class="rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white">+18</span>
                        {/if}
                    </div>
                    {#if module.shortDescription}
                        <p class="mt-3 hidden text-lg text-gray-600 sm:block dark:text-gray-300">{module.shortDescription}</p>
                    {/if}
                </div>
            </div>
        </div>

        {#if module.images && module.images.length > 0}
            <div class="mb-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                {#each module.images as image, index}
                    <button 
                        on:click={() => openImageModal(PUBLIC_MINIO_URL + image.url, index)}
                        class="group relative flex-shrink-0"
                    >
                        <img 
                            src={PUBLIC_MINIO_URL + image.url} 
                            alt="Module screenshot {index + 1}"
                            class="h-[300px] w-auto min-w-[200px] cursor-pointer snap-center rounded-xl border border-gray-200 object-cover shadow-lg transition-transform group-hover:scale-105 dark:border-gray-700"
                        />
                        <!-- Overlay indicando que es clickeable -->
                        <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20">
                            <svg class="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </button>
                {/each}
            </div>
        {/if}
    </div>


    <div class="mx-auto flex max-w-screen-xl flex-col-reverse gap-12 p-4 lg:flex-row">

        <div class="flex w-full flex-col lg:w-4/6">
               
            <div class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                📝 Description
            </div>
            <div class="prose prose-lg min-w-full max-w-none rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 dark:prose-invert dark:bg-gray-800 dark:ring-gray-700">
                {@html marked(module.description)}
            </div>
    
            {#if module?.faqs && module?.faqs.length > 0}
                <div class="mb-4 mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
                    ❓ Frequent Asked Questions
                </div>
                <div class="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                    {#each module?.faqs as faq}
                        <FaqItem question={faq.question} answer={faq.answer}></FaqItem>
                    {/each}
                </div>
            {/if}

            <div class="mb-4 mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
                💬 Comments
            </div>
            <div id="comments-section" class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                {#if module.giscusEnabled}
                    <script src="https://giscus.app/client.js"
                            data-repo="ZumitoTeam/zumito-modules"
                            data-repo-id="R_kgDOMjaz4A"
                            data-category="[NOMBRE CATEGORÍA]"
                            data-category-id="[ID CATEGORÍA]"
                            data-mapping="pathname"
                            data-strict="0"
                            data-reactions-enabled="1"
                            data-emit-metadata="0"
                            data-input-position="bottom"
                            data-theme="preferred_color_scheme"
                            data-lang="es"
                            data-loading="lazy"
                            crossorigin="anonymous"
                            async>
                    </script>
                {:else if (typeof window !== 'undefined' && window.disqus)}
                    <div id="disqus_thread"></div>
                    <script>
                        var disqus_config = function () {
                            this.page.url = window.disqus.pageUrl;
                            this.page.identifier = window.disqus.pageIdentifier;
                        };
                        (function() { // DON'T EDIT BELOW THIS LINE
                        var d = document, s = d.createElement('script');
                        s.src = 'https://zumito-modules.disqus.com/embed.js';
                        s.setAttribute('data-timestamp', +new Date());
                        (d.head || d.body).appendChild(s);
                        })();
                    </script>
                {/if}
            </div>
        </div>

        <div class="flex h-fit w-full flex-col gap-5 lg:sticky lg:top-[10px] lg:w-2/6">

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
                      {Number(module.price) === 0 ? 'Free' : module.price}
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
                {#if module?.faqs && module?.faqs.length > 0}
                    <button class="flex items-center gap-x-2 border bg-white p-3 text-sm text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
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
                            <span class="flex items-center gap-x-2 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M9 6l6 6l-6 6" />
                                </svg>
                            </span>
                        </div>
                    </button>
                {/if}
                <button on:click={scrollToComments} class="flex items-center gap-x-2 border bg-white p-3 text-sm text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                    <div class="flex w-full justify-between truncate">
                        <span class="me-3 flex w-0 flex-1 items-center gap-2 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" />
                            </svg>
                            Comments
                        </span>
                        <span class="flex items-center gap-x-2 whitespace-nowrap text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M9 6l6 6l-6 6" />
                            </svg>
                        </span>
                    </div>
                </button>
            </ul>
        </div>


    </div>

    <!-- Modal de imagen -->
    {#if showImageModal}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div 
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            on:click={closeImageModal}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
        >
            <div class="relative max-h-full max-w-full">
                <!-- Botón cerrar -->
                <button 
                    on:click={closeImageModal}
                    class="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    aria-label="Close image"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Navegación anterior -->
                {#if selectedImageIndex > 0}
                    <button 
                        on:click|stopPropagation={prevImage}
                        class="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white bg-opacity-80 text-gray-800 shadow-lg transition-colors hover:bg-opacity-100 dark:bg-gray-800 dark:bg-opacity-80 dark:text-white dark:hover:bg-opacity-100"
                        aria-label="Previous image"
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                {/if}

                <!-- Navegación siguiente -->
                {#if selectedImageIndex < (module.images?.length || 0) - 1}
                    <button 
                        on:click|stopPropagation={nextImage}
                        class="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white bg-opacity-80 text-gray-800 shadow-lg transition-colors hover:bg-opacity-100 dark:bg-gray-800 dark:bg-opacity-80 dark:text-white dark:hover:bg-opacity-100"
                        aria-label="Next image"
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                {/if}

                <!-- Imagen principal -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img 
                    src={selectedImage} 
                    alt="Module screenshot {selectedImageIndex + 1}"
                    class="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
                    on:click|stopPropagation
                />

                <!-- Indicador de posición -->
                {#if (module.images?.length || 0) > 1}
                    <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                        {#each (module.images || []) as _, index}
                            <button
                                on:click|stopPropagation={() => openImageModal(PUBLIC_MINIO_URL + (module.images?.[index]?.url || ''), index)}
                                class="h-3 w-3 rounded-full transition-colors {index === selectedImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}"
                                aria-label="Go to image {index + 1}"
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}

</Background>    

<svelte:head>
    <title>{module.name} - Zumito Modules</title>
    <meta name="description" content={module.shortDescription || 'Discover the module ' + module.name + ' on Zumito Modules.'} />
    
    <meta property="og:title" content={module.name + ' - Zumito Modules'} />
    <meta property="og:description" content={module.shortDescription || 'Discover the module ' + module.name + ' on Zumito Modules.'} />
    <meta property="og:image" content={PUBLIC_MINIO_URL + module.images[0].url} />
    <meta property="og:url" content="https://zumito.dev/module/{module.name}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={module.name + ' - Zumito Modules'} />
    <meta name="twitter:description" content={module.shortDescription || 'Discover the module ' + module.name + ' on Zumito Modules.'} />
    <meta name="twitter:image" content={PUBLIC_MINIO_URL + module.images[0].url} />
    <meta name="twitter:url" content="https://zumito.dev/module/{module.name}" />

    <link rel="canonical" href="https://zumito.dev/module/{module.name}" />

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