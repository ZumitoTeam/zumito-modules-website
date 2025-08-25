<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Background from '$lib/components/structure/background.svelte';
    import Container from '$lib/components/structure/container.svelte';
    import { Prisma } from '@prisma/client'
    import { PUBLIC_MINIO_URL } from '$env/static/public';

    const placeholderImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EAC4QAQACAQIEBAQGAwAAAAAAAAABAgMEEQUhMVESEyJBUmFxkSNCgaHB0TIzkv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APoIDo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM+G3wz9gYAAAAAAAAAAAAAAAAAAAAB202nvqL+GnKI627A548d8t4pjrNrT7QstPwusbTntvPw16fdM0+DHp6eHHH1n3l1ZtakaY8OPF/rx1r9IdN2BFa3pTJG16Vt9Y3Rc3DcF+dN8c/LnH2TAFFqNFmwbzMeKnxVR3pULV8Ppl3ti2pft7S1KzYpx0vgy0tNbY7bx8mFRoAAAAREzMREbzPtAt+F6etMUZpje9uk9oKRAjRamY38mdvnMOF6Wpaa3rNZj2mHpEfW6euowzy9dY3rP8M61iiAaZAAAZpW17xSkb2mdogHTTYL6jLFKfrPaF7hxUw44pSNoj92mk09dNiisc7TztPeXZm1qQARQAAAAAAAHmgG2AABe8PvF9Jj2/LHhn9FE7abU5NNfenOJ61npKVYv2uW8Y8dr26VjdBjiuPbnivE9o2Q9XrL6n07eGkflj+UxdRgGmQABbcM0vl0868eu0emO0InDtN5+XxWj8OnX5z2XSWtSADKgAAAAAAAAAKu3Cr/lzVn612Rs2iz4udqbx3rzXoupjzQvdRo8OfeZr4b/FVVanSZdPO9o8VPa0LqYjgKgAAAA2x0tlyVpSN7WnaGq34ZpvLx+bePXaOXyhKsSsGKuDFXHXpHWe8ugMtAAAAAAAAAAAAAABMRMbTG8ACs1nDtt76ePrT+la9Kh63Q1z73x7VyftZZUsUwzatqWmtomLR1iWGmQEjR6W2pv2pH+VgdOHaXzr+ZePw6z/ANSuWKUrjpFKRtWOkMsWtyAAAAAAAAAAAAAAAAAAAAI+r0mPUxz9N46WhXW4bqInaPDaO8SuRdTFZg4XO++e0bfDX+1lSlcdYrSsVrHSIZE1cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=';

    let modules: Prisma.ModuleSelect[] = $page.data.modules;
    let allFeatures: Prisma.FeatureSelect[] = $page.data.allFeatures;
    let stats = $page.data.stats; // Usar las estadísticas del backend
    let featuredFeatures = $page.data.featuredFeatures; // Features populares del backend
    let searchQuery = '';
    let selectedFeatures: string[] = [];

    // Initialize selectedFeatures from URL if present
    $: {
        if ($page.url.searchParams.has('features')) {
            selectedFeatures = $page.url.searchParams.get('features')!.split(',');
        } else {
            selectedFeatures = [];
        }
    }

    function updateUrl() {
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        }
        if (selectedFeatures.length > 0) {
            params.set('features', selectedFeatures.join(','));
        }
        goto(`/?${params.toString()}`);
    }

    function handleSearch() {
        // Redirect to modules page with search query
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        }
        if (selectedFeatures.length > 0) {
            params.set('features', selectedFeatures.join(','));
        }
        goto(`/modules?${params.toString()}`);
    }

    function handleFeatureChange(event) {
        const featureName = event.target.value;
        if (event.target.checked) {
            selectedFeatures = [...selectedFeatures, featureName];
        } else {
            selectedFeatures = selectedFeatures.filter(f => f !== featureName);
        }
        updateUrl();
    }
</script>

<style>
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .group:hover .floating-element {
        animation: float 2s ease-in-out infinite;
    }
</style>

<svelte:head>
    <title>Zumito Modules</title>
    <meta name="description" content="Discover powerful modules to enhance your projects. From APIs to UI components, find everything you need to build amazing applications." />

    <meta property="og:title" content="Zumito Modules" />
    <meta property="og:description" content="Discover powerful modules to enhance your projects. From APIs to UI components, find everything you need to build amazing applications." />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Zumito Modules" />
    <meta name="twitter:description" content="Discover powerful modules to enhance your projects. From APIs to UI components, find everything you need to build amazing applications." />

    <link rel="canonical" href="https://modules.zumito.dev" />
</svelte:head>

<Background>
    <!-- Hero Section -->
    <Container class="pb-12 pt-8">
        <div class="mb-12 text-center">
            <h1 class="mb-4 text-5xl font-bold text-gray-800 dark:text-white">
                Zumito Modules
            </h1>
            <p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                Discover powerful modules to enhance your projects. From APIs to UI components, find everything you need to build amazing applications.
            </p>
            <div class="mb-8 flex justify-center gap-4">
                <a href="/modules" class="rounded-lg bg-pink-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700">
                    Explore Modules
                </a>
                <a href="/submit" class="rounded-lg border border-pink-600 px-8 py-3 font-semibold text-pink-600 transition-colors hover:bg-pink-50 dark:border-pink-500 dark:text-pink-400 dark:hover:bg-pink-900/20">
                    Submit Module
                </a>
            </div>
        </div>
        
        <!-- Stats Section -->
        <div class="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {#each stats as stat}
                <div class="rounded-xl border bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div class="mb-2 text-3xl">{stat.icon}</div>
                    <div class="mb-1 text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                    <div class="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
            {/each}
        </div>
    </Container>

    <!-- Popular Features -->
    <Container class="mb-16">
        <div class="mb-8 text-center">
            <h2 class="mb-4 text-3xl font-bold text-gray-800 dark:text-white">Popular Features</h2>
            <p class="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">Explore modules by their most popular features and capabilities</p>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {#each featuredFeatures as feature}
                <a href="/modules?features={feature.name}" 
                   class="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 text-center transition-all duration-300 hover:scale-105 hover:border-pink-200 hover:from-pink-50 hover:to-white hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-pink-600 dark:hover:from-pink-900/20 dark:hover:to-gray-800">
                    <div class="relative z-10">
                        <div class="mb-3 text-3xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                            {feature.icon}
                        </div>
                        <div class="mb-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-pink-700 dark:text-gray-200 dark:group-hover:text-pink-400">
                            {feature.name}
                        </div>
                        <div class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-all group-hover:bg-pink-100 group-hover:text-pink-700 dark:bg-gray-700 dark:text-gray-300 dark:group-hover:bg-pink-800 dark:group-hover:text-pink-300">
                            {feature.count} modules
                        </div>
                    </div>
                    
                    <!-- Hover effect overlay -->
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-pink-400/10 dark:to-purple-400/10"></div>
                    
                    <!-- Decorative elements -->
                    <div class="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-pink-100 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 dark:bg-pink-800"></div>
                    <div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-purple-100 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-purple-800"></div>
                </a>
            {/each}
        </div>
        
        <!-- View all features button -->
        <div class="mt-8 text-center">
            <a href="/modules" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-pink-500 dark:hover:bg-pink-900/20 dark:hover:text-pink-400">
                <span>View All Features</span>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    </Container>

    <!-- Search Bar -->
    <Container class="mb-12">
        <div class="mx-auto max-w-4xl">
            <div class="mb-6 text-center">
                <h2 class="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Find Your Perfect Module</h2>
                <p class="text-gray-600 dark:text-gray-300">Search through our collection of powerful modules</p>
            </div>
            
            <form on:submit|preventDefault={() => handleSearch()}>
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                        <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        bind:value={searchQuery}
                        placeholder="Search modules by name, category, or functionality..."
                        class="w-full rounded-xl border-2 border-gray-200 bg-white py-4 pl-14 pr-32 text-lg shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500 dark:focus:border-pink-500 dark:focus:ring-pink-800"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <button 
                            type="submit"
                            class="flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-200 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
                            <span class="hidden sm:inline">Search</span>
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
            
            <!-- Quick search suggestions -->
            <div class="mt-4 flex flex-wrap justify-center gap-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Popular searches:</span>
                {#each ['API', 'Database', 'UI Components', 'Auth', 'Analytics'] as suggestion}
                    <button 
                        on:click={() => { searchQuery = suggestion; handleSearch(); }}
                        class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-pink-100 hover:text-pink-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-pink-800 dark:hover:text-pink-300">
                        {suggestion}
                    </button>
                {/each}
            </div>
        </div>
    </Container>

    <!-- Latest Modules -->
    <Container class="pb-16">
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Latest Modules</h2>
                <p class="mt-2 text-gray-600 dark:text-gray-300">Discover the newest additions to our module collection</p>
            </div>
            <a href="/modules" class="flex items-center gap-2 rounded-lg bg-pink-50 px-4 py-2 font-semibold text-pink-600 transition-colors hover:bg-pink-100 hover:text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-800/30 dark:hover:text-pink-300">
                View All 
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
        
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each modules as module}
                <article class="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-pink-600">
                    <a href="/module/{module.name}" class="block relative">
                        {#if module.adult}
                            <span class="absolute top-2 right-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">+18</span>
                        {/if}
                        <!-- Header with icon and basic info -->
                        <div class="p-6 pb-4">
                            <div class="mb-4 flex items-start gap-4">
                                <div class="relative">
                                    <img src="{(module.icon && (PUBLIC_MINIO_URL + module.icon)) || placeholderImage}" 
                                         alt="{module.name} icon" 
                                         class="h-16 w-16 rounded-xl border border-gray-200 object-cover shadow-sm transition-transform group-hover:scale-105 dark:border-gray-600">
                                    <div class="absolute -bottom-1 -right-1 rounded-full bg-green-100 p-1 dark:bg-green-800">
                                        <div class="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3 class="truncate text-lg font-bold text-gray-900 transition-colors group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400">
                                        {module.name}
                                    </h3>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        by <span class="font-medium">{module.author?.username}</span>
                                    </p>
                                    <div class="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                        {@html module.shortDescription || module.description}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Features Tags -->
                            {#if module.features && module.features.length > 0}
                                <div class="mb-4 flex flex-wrap gap-1">
                                    {#each module.features.slice(0, 3) as feature}
                                        <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-colors group-hover:bg-pink-50 group-hover:text-pink-700 dark:bg-gray-700 dark:text-gray-300 dark:group-hover:bg-pink-800 dark:group-hover:text-pink-300">
                                            {feature.name}
                                        </span>
                                    {/each}
                                    {#if module.features.length > 3}
                                        <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                            +{module.features.length - 3} more
                                        </span>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                        
                        <!-- Footer with stats and price -->
                        <div class="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div class="flex items-center gap-1.5">
                                        <svg class="h-4 w-4 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                        </svg>
                                        <span class="font-medium">{module._count?.installs || 0}</span>
                                        <span class="text-gray-500 dark:text-gray-400">installs</span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <svg class="h-4 w-4 text-pink-500 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="font-medium">⭐</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-800 dark:text-green-200">
                                        Free
                                    </span>
                                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-200 dark:bg-pink-800 dark:text-pink-300 dark:group-hover:bg-pink-700">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </article>
            {/each}
        </div>
        
        <!-- Call to Action -->
        <div class="mt-12 text-center">
            <p class="mb-6 text-gray-600 dark:text-gray-300">Can't find what you're looking for?</p>
            <div class="flex justify-center gap-4">
                <a href="/modules" class="rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700">
                    Browse All Modules
                </a>
                <a href="/submit" class="rounded-lg border border-pink-600 px-6 py-3 font-semibold text-pink-600 transition-colors hover:bg-pink-50 dark:border-pink-500 dark:text-pink-400 dark:hover:bg-pink-900/20">
                    Submit Your Module
                </a>
            </div>
        </div>
    </Container>

</Background>
