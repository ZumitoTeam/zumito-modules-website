<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

<section class="bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xl px-4 py-8 lg:grid lg:grid-cols-12 lg:gap-20 lg:py-16">
        <div class="col-span-6 mr-auto hidden flex-col justify-between lg:flex xl:mb-0">
            <div>
                <a href="/" class="mb-6 inline-flex items-center text-2xl font-semibold text-gray-900 lg:mb-10 dark:text-white">
                    <img class="mr-2 h-8 w-8" src="https://docs.zumito.dev/_astro/zumito-hi.CVPMU07h_16SD6a.webp" alt="logo">
                    Zumito Modules
                </a>
                <div class="flex">
                    <svg class="mr-2 h-5 w-5 shrink-0 text-pink-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <h3 class="mb-2 text-xl font-bold leading-none text-gray-900 dark:text-white">Get started quickly</h3>
                        <p class="mb-2 font-light text-gray-500 dark:text-gray-400">Integrate with developer-friendly APIs or choose low-code.</p>
                    </div>
                </div>
                <div class="flex pt-8">
                    <svg class="mr-2 h-5 w-5 shrink-0 text-pink-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <h3 class="mb-2 text-xl font-bold leading-none text-gray-900 dark:text-white">Support any business model</h3>
                        <p class="mb-2 font-light text-gray-500 dark:text-gray-400">Host code that you don't want to share with the world in private.</p>
                    </div>
                </div>
                <div class="flex pt-8">
                    <svg class="mr-2 h-5 w-5 shrink-0 text-pink-600" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <h3 class="mb-2 text-xl font-bold leading-none text-gray-900 dark:text-white">Join millions of businesses</h3>
                        <p class="mb-2 font-light text-gray-500 dark:text-gray-400">Flowbite is trusted by ambitious startups and enterprises of every size.</p>
                    </div>
                </div>
            </div>
            <nav>
                <ul class="flex space-x-4">
                    <li>
                        <a href="#" class="text-sm text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-sm text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                            Term & Conditions
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-sm text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="mb-6 text-center lg:hidden">
            <a href="/" class="inline-flex items-center text-2xl font-semibold text-gray-900 lg:hidden dark:text-white">
                <img class="mr-2 h-8 w-8" src="https://docs.zumito.dev/_astro/zumito-hi.CVPMU07h_16SD6a.webp" alt="logo">
                Zumito Modules
            </a>
        </div>
        <div class="col-span-6 mx-auto w-full rounded-lg bg-white shadow sm:max-w-lg md:mt-0 xl:p-0 dark:bg-gray-800">
            <div class="space-y-4 p-6 sm:p-8 lg:space-y-6">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                    Welcome back
                </h1>
                
                {#if form?.error}
                    <div class="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <div class="flex items-center">
                            <svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {form.error}
                        </div>
                    </div>
                {/if}
                
                <form method="post" action="?/login" class="space-y-4 lg:space-y-6" use:enhance={({ formElement, formData, action, cancel, submitter }) => {
                    return async ({ result, update }) => {
                        if (result.type === 'success' && result.data?.success && result.data?.redirectTo) {
                            // Redirigir cuando el login es exitoso
                            goto(result.data.redirectTo);
                        } else {
                            // Para errores y otros resultados, actualizar normalmente
                            await update();
                        }
                    };
                }}>
                    <div>
                        <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input type="email" name="email" id="email"
                            value={form?.email || ''}
                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-pink-600 focus:ring-pink-600 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Enter your email" required="">
                    </div>
                    <div>
                        <label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Password
                        </label>
                        <input type="password" name="password" id="password" placeholder="••••••••"
                            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-pink-600 focus:ring-pink-600 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            required=""
                        >
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-start">
                            <div class="flex h-5 items-center">
                                <input id="remember" aria-describedby="remember" type="checkbox"
                                    class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-pink-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-pink-600"
                                >
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                        </div>
                        <a href="#" class="text-sm font-medium text-pink-600 hover:underline dark:text-pink-500">
                            Forgot password?
                        </a>
                    </div>
                    <button type="submit" formaction="?/login" class="w-full rounded-lg bg-pink-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
                        Sign in to your account
                    </button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? <a href="/register" class="font-medium text-pink-600 hover:underline dark:text-pink-500">Sign up here</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</section>