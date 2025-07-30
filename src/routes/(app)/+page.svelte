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
        updateUrl();
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

<Background>
    <!-- Hero Section -->
    <Container class="pb-12 pt-8">
        <div class="mb-12 text-center">
            <h1 class="mb-4 text-5xl font-bold text-gray-800">
                Zumito Modules
            </h1>
            <p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
                Discover powerful modules to enhance your projects. From APIs to UI components, find everything you need to build amazing applications.
            </p>
            <div class="mb-8 flex justify-center gap-4">
                <button class="rounded-lg bg-pink-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-pink-700">
                    Explore Modules
                </button>
                <button class="rounded-lg border border-pink-600 px-8 py-3 font-semibold text-pink-600 transition-colors hover:bg-pink-50">
                    Submit Module
                </button>
            </div>
        </div>
        
        <!-- Stats Section -->
        <div class="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {#each stats as stat}
                <div class="rounded-xl border bg-white p-6 text-center shadow-sm">
                    <div class="mb-2 text-3xl">{stat.icon}</div>
                    <div class="mb-1 text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div class="text-gray-600">{stat.label}</div>
                </div>
            {/each}
        </div>
    </Container>

    <!-- Popular Features -->
    <Container class="mb-16">
        <h2 class="mb-8 text-center text-3xl font-bold text-gray-800">Popular Features</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {#each featuredFeatures as feature}
                <a href="/?features={feature.name}" 
                   class="group rounded-xl border bg-white p-4 text-center transition-all duration-200 hover:scale-105 hover:shadow-md">
                    <div class="mb-2 text-3xl transition-transform group-hover:scale-110">{feature.icon}</div>
                    <div class="mb-1 text-sm font-semibold text-gray-800">{feature.name}</div>
                    <div class="text-xs text-gray-500">{feature.count} modules</div>
                </a>
            {/each}
        </div>
    </Container>

    <!-- Search Bar -->
    <Container class="mb-12">
        <div class="mx-auto max-w-2xl">
            <form on:submit|preventDefault={() => handleSearch()}>
                <div class="relative">
                    <input 
                        type="text" 
                        bind:value={searchQuery}
                        placeholder="Search modules by name, category, or functionality..."
                        class="w-full rounded-xl border-2 border-gray-200 px-6 py-4 text-lg focus:border-pink-500 focus:outline-none"
                    />
                    <button 
                        type="submit"
                        class="absolute right-2 top-2 rounded-lg bg-pink-600 p-2 text-white transition-colors hover:bg-pink-700">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </Container>

    <!-- Feature Filter -->
    <Container class="mb-12">
        <h2 class="mb-4 text-2xl font-bold text-gray-800">Filter by Features</h2>
        <div class="flex flex-wrap gap-3">
            {#each allFeatures as feature}
                <div class="flex items-center">
                    <input 
                        type="checkbox" 
                        id="filter-feature-{feature.id}" 
                        value={feature.name} 
                        on:change={handleFeatureChange}
                        class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-pink-600 focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-pink-600"
                    />
                    <label for="filter-feature-{feature.id}" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{feature.name}</label>
                </div>
            {/each}
        </div>
    </Container>

    <!-- Latest Modules -->
    <Container class="pb-16">
        <div class="mb-8 flex items-center justify-between">
            <h2 class="text-3xl font-bold text-gray-800">Latest Modules</h2>
            <a href="/modules" class="font-semibold text-pink-600 hover:text-pink-700">View All →</a>
        </div>
        
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each modules as module}
                <a href="/module/{module.name}" 
                   class="group rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    <div class="mb-4 flex items-start gap-4">
                        <img src="{(module.icon && (PUBLIC_MINIO_URL + module.icon)) || placeholderImage}" alt="" class="h-16 w-16 rounded-lg border object-cover">
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-800 transition-colors group-hover:text-pink-600">
                                {module.name}
                            </h3>
                            <div class="line-clamp-2 text-sm text-gray-600">
                                {@html module.shortDescription}
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm">
                        <span class="rounded-full bg-green-100 px-3 py-1 font-medium text-green-800">
                            Free
                        </span>
                        <div class="flex items-center gap-4 text-gray-500">
                            <div class="flex items-center gap-1">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span>1.2k</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                                </svg>
                                <span>45</span>
                            </div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </Container>
</Background>    
