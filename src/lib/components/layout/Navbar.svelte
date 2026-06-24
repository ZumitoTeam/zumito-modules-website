<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LangPicker from '$lib/components/LangPicker.svelte';
	import Icon from '@iconify/svelte';
	import { fade, fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let menuOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	function closeMenu() {
		menuOpen = false;
	}

	async function handleLogout() {
		await authClient.signOut();
		menuOpen = false;
		goto('/login');
	}

	$effect(() => {
		$page.url.pathname;
		menuOpen = false;
	});

	$effect(() => {
		if (menuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	});
</script>

<nav class="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800/50 dark:bg-zinc-950/80">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
		<a href="/" class="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100" onclick={closeMenu}>
			<span class="text-zumito-600">Zumito</span> Modules
		</a>

		<!-- Desktop nav -->
		<div class="hidden items-center gap-6 md:flex">
			<a href="/modules" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Browse</a>
			<a href="/submit" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Submit</a>
			{#if $page.data.user}
				<a href="/user/profile" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Profile</a>
				<a href="/user/modules" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">My Modules</a>
				<button onclick={handleLogout} class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-100">Logout</button>
			{:else}
				<a href="/login" class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Sign in</a>
				<a href="/register" class="rounded-full bg-zumito-600 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-zumito-700 active:scale-[0.98]">Register</a>
			{/if}
			<LangPicker />
		</div>

		<!-- Mobile: LangPicker + Hamburger -->
		<div class="flex items-center gap-3 md:hidden">
			<LangPicker />
			<button onclick={toggleMenu} class="relative flex h-8 w-8 items-center justify-center cursor-pointer" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
				<span class="absolute block h-0.5 w-5 rounded bg-zinc-600 transition-all duration-300 dark:bg-zinc-400
					{menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5'}" />
				<span class="absolute block h-0.5 w-5 rounded bg-zinc-600 transition-all duration-300 dark:bg-zinc-400
					{menuOpen ? 'opacity-0' : ''}" />
				<span class="absolute block h-0.5 w-5 rounded bg-zinc-600 transition-all duration-300 dark:bg-zinc-400
					{menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'}" />
			</button>
		</div>
	</div>
</nav>

<!-- Mobile menu overlay (outside nav to escape backdrop-blur containing block) -->
{#if menuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-[60] bg-black/50 md:hidden cursor-pointer" onclick={closeMenu} transition:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute inset-y-0 right-0 w-full bg-white shadow-2xl dark:bg-zinc-950 sm:w-80" onclick={(e: Event) => e.stopPropagation()} transition:fly={{ x: 320, duration: 300, easing: quartOut }}>
			<div class="flex h-full flex-col px-5 py-6">
				<!-- Header -->
				<div class="flex items-center justify-between">
					<span class="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
						<span class="text-zumito-600">Zumito</span> Modules
					</span>
					<button onclick={closeMenu} class="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 cursor-pointer dark:hover:bg-zinc-800"
						aria-label="Close menu">
						<Icon icon="tabler:x" class="h-6 w-6" />
					</button>
				</div>

				<!-- Menu items -->
				<div class="mt-8 grid grid-cols-2 gap-3">
					<a href="/modules" onclick={closeMenu} class="group flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center transition-all hover:border-zumito-200 hover:bg-zumito-50 active:scale-[0.97] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zumito-600/30 dark:hover:bg-zumito-600/5"
						in:fly={{ y: 16, duration: 250, delay: 40, easing: quartOut }}>
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zumito-600/10 text-zumito-600 transition-colors group-hover:bg-zumito-600 group-hover:text-white">
							<Icon icon="tabler:compass" class="h-6 w-6" />
						</div>
						<span class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Browse</span>
					</a>
					<a href="/submit" onclick={closeMenu} class="group flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center transition-all hover:border-zumito-200 hover:bg-zumito-50 active:scale-[0.97] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zumito-600/30 dark:hover:bg-zumito-600/5"
						in:fly={{ y: 16, duration: 250, delay: 80, easing: quartOut }}>
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zumito-600/10 text-zumito-600 transition-colors group-hover:bg-zumito-600 group-hover:text-white">
							<Icon icon="tabler:upload" class="h-6 w-6" />
						</div>
						<span class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Submit</span>
					</a>
					{#if $page.data.user}
						<a href="/user/profile" onclick={closeMenu} class="group flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center transition-all hover:border-zumito-200 hover:bg-zumito-50 active:scale-[0.97] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zumito-600/30 dark:hover:bg-zumito-600/5"
							in:fly={{ y: 16, duration: 250, delay: 120, easing: quartOut }}>
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zumito-600/10 text-zumito-600 transition-colors group-hover:bg-zumito-600 group-hover:text-white">
								<Icon icon="tabler:user" class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Profile</span>
						</a>
						<a href="/user/modules" onclick={closeMenu} class="group flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center transition-all hover:border-zumito-200 hover:bg-zumito-50 active:scale-[0.97] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zumito-600/30 dark:hover:bg-zumito-600/5"
							in:fly={{ y: 16, duration: 250, delay: 160, easing: quartOut }}>
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zumito-600/10 text-zumito-600 transition-colors group-hover:bg-zumito-600 group-hover:text-white">
								<Icon icon="tabler:package" class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">My Modules</span>
						</a>
					{:else}
						<a href="/login" onclick={closeMenu} class="group flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center transition-all hover:border-zumito-200 hover:bg-zumito-50 active:scale-[0.97] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zumito-600/30 dark:hover:bg-zumito-600/5"
							in:fly={{ y: 16, duration: 250, delay: 120, easing: quartOut }}>
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-zumito-600/10 text-zumito-600 transition-colors group-hover:bg-zumito-600 group-hover:text-white">
								<Icon icon="tabler:login-2" class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Sign in</span>
						</a>
						<a href="/register" onclick={closeMenu} class="group flex flex-col items-center gap-2 rounded-2xl border border-zumito-200 bg-zumito-600 p-4 text-center transition-all hover:bg-zumito-700 active:scale-[0.97] dark:border-zumito-600/30"
							in:fly={{ y: 16, duration: 250, delay: 160, easing: quartOut }}>
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
								<Icon icon="tabler:user-plus" class="h-6 w-6" />
							</div>
							<span class="text-sm font-semibold text-white">Register</span>
						</a>
					{/if}
				</div>

				<!-- Spacer -->
				<div class="flex-1" />

				<!-- Logout / LangPicker footer -->
				<div class="border-t border-zinc-200 pt-4 dark:border-zinc-800">
					{#if $page.data.user}
						<button onclick={handleLogout} class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-[0.98] dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 cursor-pointer"
							in:fly={{ y: 16, duration: 250, delay: 200, easing: quartOut }}>
							<Icon icon="tabler:logout" class="h-5 w-5" />
							Logout
						</button>
					{/if}
					<div class="mt-3 flex justify-center" in:fly={{ y: 16, duration: 250, delay: 240, easing: quartOut }}>
						<LangPicker />
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

