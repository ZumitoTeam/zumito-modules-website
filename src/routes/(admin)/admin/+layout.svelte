<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	let { children, data } = $props();

	let menuOpen = $state(false);

	const nav = [
		{ href: '/admin', label: 'Dashboard', icon: 'tabler:dashboard' },
		{ href: '/admin/users', label: 'Users', icon: 'tabler:users' },
		{ href: '/admin/modules', label: 'Modules', icon: 'tabler:package' },
		{ href: '/admin/features', label: 'Features', icon: 'tabler:tags' },
	];

	function isActive(href: string) {
		if (href === '/admin') return $page.url.pathname === '/admin';
		return $page.url.pathname.startsWith(href);
	}

	async function handleLogout() {
		await goto('/api/auth/signout');
	}

	$effect(() => {
		$page.url.pathname;
		menuOpen = false;
	});

	$effect(() => {
		if (menuOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return () => { document.body.style.overflow = ''; };
	});
</script>

<div class="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
	<!-- Top header -->
	<header class="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
		<div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 lg:px-6">
			<!-- Logo -->
			<a href="/admin" class="flex items-center gap-2.5 shrink-0">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zumito-600 text-sm font-extrabold text-white">Z</div>
				<span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Zumito Admin</span>
			</a>

			<!-- Desktop nav links -->
			<nav class="hidden lg:flex items-center ml-8">
				{#each nav as item}
					<a href={item.href}
						class="relative px-3 py-4 text-sm font-medium transition-colors
						{isActive(item.href) ? 'text-zumito-600 before:absolute before:inset-x-3 before:bottom-0 before:h-0.5 before:rounded-full before:bg-zumito-600' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}">
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="flex-1" />

			<!-- User -->
			<div class="flex items-center gap-4">
				<a href="/" class="hidden text-sm text-zinc-500 transition-colors hover:text-zinc-700 sm:flex items-center gap-1 dark:text-zinc-400 dark:hover:text-zinc-200">
					<Icon icon="tabler:arrow-left" class="h-4 w-4" />
					Back to site
				</a>
				{#if data.user}
					<div class="flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-zumito-600/10 text-xs font-bold text-zumito-600">
							{data.user.username?.[0]?.toUpperCase()}
						</div>
						<span class="hidden text-sm font-medium text-zinc-700 sm:block dark:text-zinc-300">{data.user.username}</span>
					</div>
				{/if}

				<!-- Mobile menu toggle -->
				<button onclick={() => menuOpen = !menuOpen}
					class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 lg:hidden cursor-pointer dark:hover:bg-zinc-800">
					<Icon icon={menuOpen ? 'tabler:x' : 'tabler:menu-2'} class="h-5 w-5" />
				</button>
			</div>
		</div>

		<!-- Mobile nav dropdown -->
		{#if menuOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div class="fixed inset-0 top-14 z-40 bg-black/50 lg:hidden" onclick={() => menuOpen = false} transition:slide={{ duration: 200 }}>
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<nav class="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950" onclick={(e: Event) => e.stopPropagation()}>
					<div class="flex flex-col gap-1">
						{#each nav as item}
							<a href={item.href} onclick={() => menuOpen = false}
								class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
								{isActive(item.href) ? 'bg-zumito-50 text-zumito-600 dark:bg-zumito-600/10 dark:text-zumito-400' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
								<Icon icon={item.icon} class="h-5 w-5 shrink-0" />
								{item.label}
							</a>
						{/each}
					</div>
				</nav>
			</div>
		{/if}
	</header>

	<!-- Content -->
	<main class="flex-1">
		<div class="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
			{@render children()}
		</div>
	</main>
</div>
