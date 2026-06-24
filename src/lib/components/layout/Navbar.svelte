<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LangPicker from '$lib/components/LangPicker.svelte';
	import { fade, fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let menuOpen = $state(false);
	let pushingState = $state(false);

	function openMenu() {
		menuOpen = true;
		pushingState = true;
		history.pushState({ menu: 1 }, '');
	}
	function closeMenu() {
		menuOpen = false;
		pushingState = false;
	}
	function closeMenuWithHistory() {
		menuOpen = false;
		if (pushingState) {
			pushingState = false;
			history.back();
		}
	}
	function toggleMenu() {
		if (menuOpen) closeMenuWithHistory(); else openMenu();
	}

	// Mobile back button closes the menu
	$effect(() => {
		function onPopState() {
			menuOpen = false;
			pushingState = false;
		}
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	});

	async function handleLogout() {
		closeMenu();
		await authClient.signOut();
		goto('/login');
	}

	// Close menu on route change (no history manipulation)
	$effect(() => {
		$page.url.pathname; // track
		menuOpen = false;
		pushingState = false;
	});

	// Lock body scroll when menu open
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
	<div class="fixed inset-0 z-[60] bg-black/50 md:hidden cursor-pointer" onclick={closeMenuWithHistory} transition:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute inset-y-0 right-0 w-full bg-white shadow-2xl dark:bg-zinc-950 sm:w-80" onclick={(e: Event) => e.stopPropagation()} transition:fly={{ x: 320, duration: 300, easing: quartOut }}>
			<div class="flex flex-col px-6 py-20">
				<button onclick={closeMenuWithHistory} class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 cursor-pointer dark:hover:bg-zinc-800"
					aria-label="Close menu">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
				<a href="/modules" onclick={closeMenu} class="py-3 text-lg font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
					in:fly={{ y: 12, duration: 250, delay: 40, easing: quartOut }}>Browse</a>
				<a href="/submit" onclick={closeMenu} class="py-3 text-lg font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
					in:fly={{ y: 12, duration: 250, delay: 80, easing: quartOut }}>Submit</a>
				{#if $page.data.user}
					<a href="/user/profile" onclick={closeMenu} class="py-3 text-lg font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
						in:fly={{ y: 12, duration: 250, delay: 120, easing: quartOut }}>Profile</a>
					<a href="/user/modules" onclick={closeMenu} class="py-3 text-lg font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
						in:fly={{ y: 12, duration: 250, delay: 160, easing: quartOut }}>My Modules</a>
					<div class="my-4 border-t border-zinc-200 dark:border-zinc-800" in:fly={{ y: 12, duration: 250, delay: 200, easing: quartOut }} />
					<button onclick={handleLogout} class="py-3 text-left text-lg font-medium text-zinc-500 transition-colors hover:text-red-600 cursor-pointer dark:text-zinc-400 dark:hover:text-red-400"
						in:fly={{ y: 12, duration: 250, delay: 240, easing: quartOut }}>Logout</button>
				{:else}
					<div class="my-4 border-t border-zinc-200 dark:border-zinc-800" in:fly={{ y: 12, duration: 250, delay: 120, easing: quartOut }} />
					<a href="/login" onclick={closeMenu} class="py-3 text-lg font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
						in:fly={{ y: 12, duration: 250, delay: 160, easing: quartOut }}>Sign in</a>
				{/if}
			</div>
		</div>
	</div>
{/if}

