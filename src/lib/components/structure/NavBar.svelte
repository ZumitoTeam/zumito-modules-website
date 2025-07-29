<script lang="ts">
    import { page } from "$app/stores";
    import { logoImageUrl } from '$lib/globalVars';

    export let isLoggedIn: boolean;
    export let activePage = 'home';
    let openDropdown = false;

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

<nav class="border-gray-200 bg-white dark:bg-gray-900">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">

        <a href="/" class="flex w-3/12 items-center space-x-3 rtl:space-x-reverse">
            <img src={logoImageUrl} class="h-8" alt="Zumtio Modules Logo" />
            <span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Zumito Modules</span>
        </a>

        <div class="relative flex w-3/12 items-center justify-end space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
            {#if isLoggedIn}
                <button on:click={() => openDropdown = !openDropdown} type="button" class="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <span class="sr-only">Open user menu</span>
                    <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=Zumito" alt="user photo">
                </button>
                <!-- Dropdown menu -->
                <div class:hidden={!openDropdown} class="absolute -bottom-6 right-0 z-50 my-4 translate-y-full list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700" id="user-dropdown">
                    <div class="px-4 py-3">
                        <span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                        <span class="block truncate text-sm text-gray-500 dark:text-gray-400">name@flowbite.com</span>
                    </div>
                    <ul class="py-2" aria-labelledby="user-menu-button">
                        <li>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                        </li>
                    </ul>
                </div>
            {:else}
                <a href="/login" class="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-pink-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    Sign in
                </a>
                <a href="/register" class="mb-2 me-2 rounded-lg bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
                    Sign up
                </a>
            {/if}
            <button data-collapse-toggle="navbar-user" type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
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