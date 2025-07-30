<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import Background from '$lib/components/structure/background.svelte';
    import Container from '$lib/components/structure/container.svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    let searchQuery = data.searchQuery;
    let selectedCategory = data.category;
    let selectedSort = data.sortBy;
    let selectedPrice = data.priceFilter;
    let showMobileFilters = false;

    const placeholderImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EAC4QAQACAQIEBAQGAwAAAAAAAAABAgMEEQUhMVESEyJBUmFxkSNCgaHB0TIzkv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APoIDo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM+G3wz9gYAAAAAAAAAAAAAAAAAAAAB202nvqL+GnKI627A548d8t4pjrNrT7QstPwusbTntvPw16fdM0+DHp6eHHH1n3l1ZtakaY8OPF/rx1r9IdN2BFa3pTJG16Vt9Y3Rc3DcF+dN8c/LnH2TAFFqNFmwbzMeKnxVR3pULV8Ppl3ti2pft7S1KzYpx0vgy0tNbY7bx8mFRoAAAAREzMREbzPtAt+F6etMUZpje9uk9oKRAjRamY38mdvnMOF6Wpaa3rNZj2mHpEfW6euowzy9dY3rP8M61iiAaZAAAZpW17xSkb2mdogHTTYL6jLFKfrPaF7hxUw44pSNoj92mk09dNiisc7TztPeXZm1qQARQAAAAAAAHmgG2AABe8PvF9Jj2/LHhn9FE7abU5NNfenOJ61npKVYv2uW8Y8dr26VjdBjiuPbnivE9o2Q9XrL6n07eGkflj+UxdRgGmQABbcM0vl0868eu0emO0InDtN5+XxWj8OnX5z2XSWtSADKgAAAAAAAAAKu3Cr/lzVn612Rs2iz4udqbx3rzXoupjzQvdRo8OfeZr4b/FVVanSZdPO9o8VPa0LqYjgKgAAAA2x0tlyVpSN7WnaGq34ZpvLx+bePXaOXyhKsSsGKuDFXHXpHWe8ugMtAAAAAAAAAAAAAABMRMbTG8ACs1nDtt76ePrT+la9Kh63Q1z73x7VyftZZUsUwzatqWmtomLR1iWGmQEjR6W2pv2pH+VgdOHaXzr+ZePw6z/ANSuWKUrjpFKRtWOkMsWtyAAAAAAAAAAAAAAAAAAAAI+r0mPUxz9N46WhXW4bqInaPDaO8SuRdTFZg4XO++e0bfDX+1lSlcdYrSsVrHSIZE1cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=';

    const categories = [
        { id: 'web-development', name: 'Web Development', icon: '🌐' },
        { id: 'api-integration', name: 'API Integration', icon: '🔗' },
        { id: 'data-processing', name: 'Data Processing', icon: '📊' },
        { id: 'authentication', name: 'Authentication', icon: '🔐' },
        { id: 'ui-components', name: 'UI Components', icon: '🎨' },
        { id: 'utilities', name: 'Utilities', icon: '🛠️' },
        { id: 'database', name: 'Database', icon: '🗄️' },
        { id: 'analytics', name: 'Analytics', icon: '📈' },
        { id: 'payment', name: 'Payment', icon: '💳' },
        { id: 'email', name: 'Email', icon: '📧' }
    ];

    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'name', label: 'Name A-Z' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' }
    ];

    function updateFilters() {
        if (!browser) return;
        
        const params = new URLSearchParams();
        
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedSort !== 'latest') params.set('sort', selectedSort);
        if (selectedPrice !== 'all') params.set('price', selectedPrice);
        
        const newUrl = params.toString() ? `/modules?${params.toString()}` : '/modules';
        goto(newUrl, { replaceState: true });
    }

    function clearFilters() {
        searchQuery = '';
        selectedCategory = '';
        selectedSort = 'latest';
        selectedPrice = 'all';
        updateFilters();
    }

    function handleSearch() {
        updateFilters();
    }

    function goToPage(pageNum: number) {
        if (!browser) return;
        
        const params = new URLSearchParams($page.url.searchParams);
        params.set('page', pageNum.toString());
        goto(`/modules?${params.toString()}`);
    }

    // Generate pagination array
    function getPaginationPages() {
        const current = data.currentPage;
        const total = data.totalPages;
        const pages: (number | string)[] = [];
        
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (current > 3) {
                pages.push('...');
            }
            
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (current < total - 2) {
                pages.push('...');
            }
            
            pages.push(total);
        }
        
        return pages;
    }
</script>

<svelte:head>
    <title>Modules - Zumito</title>
    <meta name="description" content="Browse and discover modules for your projects. Find APIs, UI components, utilities and more.">
</svelte:head>

<Background>
    <Container class="py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="mb-4 text-4xl font-bold text-gray-800">Browse Modules</h1>
            <p class="text-lg text-gray-600">Discover {data.totalCount} modules to enhance your projects</p>
        </div>

        <div class="flex flex-col gap-8 lg:flex-row">
            <!-- Mobile Filter Toggle -->
            <div class="lg:hidden">
                <button 
                    on:click={() => showMobileFilters = !showMobileFilters}
                    class="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm"
                >
                    <span class="font-medium">Filters</span>
                    <svg class="w-5 h-5 transition-transform {showMobileFilters ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>

            <!-- Sidebar Filters -->
            <aside class="w-full lg:w-80 {showMobileFilters ? 'block' : 'hidden lg:block'}">
                <div class="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                    <!-- Search -->
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">Search</label>
                        <form on:submit|preventDefault={handleSearch}>
                            <div class="relative">
                                <input 
                                    type="text" 
                                    bind:value={searchQuery}
                                    placeholder="Search modules..."
                                    class="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
                                />
                                <button type="submit" class="absolute right-2 top-2 bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition-colors">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Sort -->
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">Sort by</label>
                        <select 
                            bind:value={selectedSort}
                            on:change={updateFilters}
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
                        >
                            {#each sortOptions as option}
                                <option value={option.value}>{option.label}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Price Filter -->
                    <div>
                        <label class="mb-3 block text-sm font-medium text-gray-700">Price</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input 
                                    type="radio" 
                                    bind:group={selectedPrice} 
                                    value="all"
                                    on:change={updateFilters}
                                    class="text-pink-600 focus:ring-pink-500"
                                />
                                <span class="ml-2 text-sm">All</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="radio" 
                                    bind:group={selectedPrice} 
                                    value="free"
                                    on:change={updateFilters}
                                    class="text-pink-600 focus:ring-pink-500"
                                />
                                <span class="ml-2 text-sm">Free</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="radio" 
                                    bind:group={selectedPrice} 
                                    value="paid"
                                    on:change={updateFilters}
                                    class="text-pink-600 focus:ring-pink-500"
                                />
                                <span class="ml-2 text-sm">Paid</span>
                            </label>
                        </div>
                    </div>

                    <!-- Categories -->
                    <div>
                        <label class="mb-3 block text-sm font-medium text-gray-700">Categories</label>
                        <div class="max-h-64 space-y-1 overflow-y-auto">
                            <button 
                                on:click={() => { selectedCategory = ''; updateFilters(); }}
                                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {selectedCategory === '' ? 'bg-pink-100 text-pink-800' : 'hover:bg-gray-100'}"
                            >
                                All Categories
                            </button>
                            {#each categories as category}
                                <button 
                                    on:click={() => { selectedCategory = category.id; updateFilters(); }}
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between {selectedCategory === category.id ? 'bg-pink-100 text-pink-800' : 'hover:bg-gray-100'}"
                                >
                                    <span class="flex items-center gap-2">
                                        <span>{category.icon}</span>
                                        <span>{category.name}</span>
                                    </span>
                                    <span class="text-xs text-gray-500">
                                        {Object.prototype.hasOwnProperty.call(data.categoryStats, category.id) ? data.categoryStats[category.id] : 0}
                                    </span>
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Clear Filters -->
                    <button 
                        on:click={clearFilters}
                        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                    >
                        Clear All Filters
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1">
                <!-- Results Header -->
                <div class="mb-6 flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                        Showing {(data.currentPage - 1) * 12 + 1}-{Math.min(data.currentPage * 12, data.totalCount)} of {data.totalCount} results
                        {#if searchQuery}
                            for "<strong>{searchQuery}</strong>"
                        {/if}
                    </div>
                </div>

                <!-- Modules Grid -->
                {#if data.modules.length > 0}
                    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {#each data.modules as module}
                            <a href="/module/{module.name}" 
                               class="group rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg">
                                <div class="mb-4 flex items-start gap-4">
                                    <img src="{placeholderImage}" alt="" class="h-16 w-16 rounded-lg border object-cover">
                                    <div class="min-w-0 flex-1">
                                        <h3 class="truncate text-lg font-bold text-gray-800 transition-colors group-hover:text-pink-600">
                                            {module.name}
                                        </h3>
                                        <p class="mb-2 text-sm text-gray-600">
                                            by {module.author?.username || 'Anonymous'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div class="mb-4 line-clamp-3 text-sm text-gray-600">
                                    {@html module.shortDescription || 'No description available'}
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                        {Number(module.price) > 0 ? `$${module.price}` : 'Free'}
                                    </span>
                                    <div class="flex items-center gap-4 text-sm text-gray-500">
                                        <div class="flex items-center gap-1">
                                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                            </svg>
                                            <span>{module._count?.installs || 0}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span>{module._count?.comments || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <div class="py-16 text-center">
                        <div class="mb-4 text-6xl">🔍</div>
                        <h3 class="mb-2 text-xl font-semibold text-gray-800">No modules found</h3>
                        <p class="mb-6 text-gray-600">Try adjusting your search criteria or browse all modules.</p>
                        <button 
                            on:click={clearFilters}
                            class="rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                {/if}

                <!-- Pagination -->
                {#if data.totalPages > 1}
                    <nav class="flex justify-center" aria-label="Pagination">
                        <div class="flex items-center space-x-2">
                            <!-- Previous button -->
                            <button 
                                on:click={() => goToPage(data.currentPage - 1)}
                                disabled={data.currentPage === 1}
                                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <!-- Page numbers -->
                            {#each getPaginationPages() as pageItem}
                                {#if pageItem === '...'}
                                    <span class="px-3 py-2 text-sm font-medium text-gray-700">...</span>
                                {:else}
                                    <button 
                                        on:click={() => goToPage(Number(pageItem))}
                                        class="px-3 py-2 text-sm font-medium rounded-lg transition-colors {data.currentPage === pageItem ? 'bg-pink-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}"
                                    >
                                        {pageItem}
                                    </button>
                                {/if}
                            {/each}

                            <!-- Next button -->
                            <button 
                                on:click={() => goToPage(data.currentPage + 1)}
                                disabled={data.currentPage === data.totalPages}
                                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </nav>
                {/if}
            </main>
        </div>
    </Container>
</Background>

<style>
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
