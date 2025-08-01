<script lang="ts">
    import { enhance } from '$app/forms';
    
    export let data;
    export let form;
    
    let loading = false;
    let showPassword = false;
    let showNewPassword = false;
    let showConfirmPassword = false;
</script>

<svelte:head>
    <title>Mi Perfil - Zumito Modules</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Gestiona tu información personal y configuración de cuenta</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
        <!-- Información del usuario -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Información Personal</h2>
            
            <div class="space-y-4">
                <div>
                    <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario</span>
                    <p class="mt-1 text-lg text-gray-900 dark:text-white">{data.user.username}</p>
                </div>
                
                <div>
                    <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                    <p class="mt-1 text-lg text-gray-900 dark:text-white">{data.user.email}</p>
                </div>
            </div>
        </div>

        <!-- Cambiar contraseña -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Cambiar Contraseña</h2>
            
            {#if form?.success}
                <div class="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-800/20 dark:text-green-400">
                    ✅ {form.message}
                </div>
            {/if}

            {#if form?.error}
                <div class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-800/20 dark:text-red-400">
                    ❌ {form.error}
                </div>
            {/if}

            <form 
                method="POST" 
                action="?/changePassword"
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        loading = false;
                        await update();
                    };
                }}
            >
                <div class="space-y-4">
                    <div>
                        <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contraseña Actual
                        </label>
                        <div class="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="currentPassword"
                                name="currentPassword"
                                required
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                                placeholder="Ingresa tu contraseña actual"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3"
                                on:click={() => showPassword = !showPassword}
                            >
                                {#if showPassword}
                                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                {:else}
                                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nueva Contraseña
                        </label>
                        <div class="relative mt-1">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="newPassword"
                                name="newPassword"
                                required
                                minlength="6"
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                                placeholder="Ingresa tu nueva contraseña"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3"
                                on:click={() => showNewPassword = !showNewPassword}
                            >
                                {#if showNewPassword}
                                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                {:else}
                                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Mínimo 6 caracteres</p>
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirmar Nueva Contraseña
                        </label>
                        <div class="relative mt-1">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                minlength="6"
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                                placeholder="Confirma tu nueva contraseña"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3"
                                on:click={() => showConfirmPassword = !showConfirmPassword}
                            >
                                {#if showConfirmPassword}
                                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                {:else}
                                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        class="w-full rounded-lg bg-pink-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                    >
                        {#if loading}
                            <div class="flex items-center justify-center">
                                <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Actualizando...
                            </div>
                        {:else}
                            Cambiar Contraseña
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
