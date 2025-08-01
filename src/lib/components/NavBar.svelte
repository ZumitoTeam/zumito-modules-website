<script lang="ts">
    import { page } from "$app/stores";
    import { logoImageUrl } from '$lib/globalVars';

    export let isLoggedIn: boolean;
    export let user;
    export let activePage = 'home';
    let openDropdown = false;
    let openMobileMenu = false;
    let dropdownElement: HTMLDivElement;

    function handleClickOutside(event: MouseEvent) {
        if (openDropdown && dropdownElement && !dropdownElement.contains(event.target as Node)) {
            openDropdown = false;
        }
    }

    const links = [{
        title: "Home",
        link: '/'
    }, {
        title: "Framework",
        link: "https://framework.zumito.dev"
    }, {
        title: "Submit Module",
        link: "/submit"
    }]
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="border-gray-200 bg-white dark:bg-gray-900">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">

        <a href="/" class="flex w-3/12 items-center space-x-3 rtl:space-x-reverse">
            <img src={logoImageUrl} class="h-8" alt="Zumtio Logo" />
            <span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Zumito Modules</span>
        </a>

        <div class="relative flex w-3/12 items-center justify-end space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
            {#if isLoggedIn}
                <div bind:this={dropdownElement}>
                    <button on:click={() => openDropdown = !openDropdown} type="button" class="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                        <span class="sr-only">Open user menu</span>
                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name={user?.username}" alt="user photo">
                    </button>
                    <!-- Dropdown menu -->
                    <div class:hidden={!openDropdown} class="absolute -bottom-6 right-0 z-50 my-4 min-w-[200px] translate-y-full list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700" id="user-dropdown">
                        <div class="px-4 py-3">
                            <span class="block text-sm text-gray-900 dark:text-white">{user?.username}</span>
                            <span class="block truncate text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
                        </div>
                        <ul class="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <a href="/user/profile" on:click={() => openDropdown = false} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Mi perfil</a>
                            </li>
                            <li>
                                <a href="/user/modules" on:click={() => openDropdown = false} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">My modules</a>
                            </li>
                            <li>
                                <a href="/logout" on:click={() => openDropdown = false} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            {:else}
            <div class="relative hidden w-3/12 items-center justify-end space-x-3 whitespace-nowrap md:order-2 md:space-x-0 lg:flex rtl:space-x-reverse">
                <a href="/login" class="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-pink-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    Sign in
                </a>
                <a href="/register" class="mb-2 me-2 rounded-lg bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
                    Sign up
                </a>
            </div>
            <div class="relative flex lg:hidden">
                <a href="/login" type="button" class="flex aspect-square h-8 w-8 items-center justify-end rounded-full text-sm text-gray-500 focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-circle" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                    </svg>
                </a>
            </div>
            {/if}
            <button on:click={() => openMobileMenu = !openMobileMenu} data-collapse-toggle="navbar-user" type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
        </div>

        <div class="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto" id="navbar-user">
            <ul class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
                
                {#each links as link}
                    <li>
                        <a href={link.link} class:text-pink-700={$page.url.pathname.endsWith(link.link)} class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-pink-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-pink-500" aria-current="page">
                            {link.title}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>

    </div>
</nav>

<div class:hidden={!openMobileMenu} class:animate-blink={openMobileMenu} class="fixed bottom-0 left-0 right-0 top-0 z-50 mt-16 h-full w-full list-none divide-y divide-gray-100 rounded-lg bg-white py-4 text-base shadow dark:divide-gray-600 dark:bg-gray-700" id="menu-dropdown">
    <ul class="py-2" aria-labelledby="user-menu-button">
        {#each links as link}
            <li>
                <a  href={link.link} on:click={() => openMobileMenu = false}
                    class:text-pink-700={$page.url.pathname.endsWith(link.link)}
                    class="block px-4 py-2 text-xl font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    {link.title}
                </a>
            </li>
        {/each}
    </ul>
</div>