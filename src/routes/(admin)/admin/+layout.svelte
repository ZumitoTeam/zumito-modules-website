<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let { children, data } = $props();

	let sidebarOpen = $state(false);

	const nav = [
		{ href: '/admin', label: 'Dashboard', icon: 'tabler:dashboard' },
		{ href: '/admin/users', label: 'Users', icon: 'tabler:users' },
		{ href: '/admin/modules', label: 'Modules', icon: 'tabler:package' },
		{ href: '/admin/features', label: 'Features', icon: 'tabler:tags' },
	];

	const bottomNav = [
		{ href: '/', label: 'Back to site', icon: 'tabler:arrow-left' },
	];

	function isActive(href: string) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	$effect(() => {
		$page.url.pathname;
		sidebarOpen = false;
	});

	$effect(() => {
		if (sidebarOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return () => { document.body.style.overflow = ''; };
	});
</script>

<div class="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<!-- Sidebar backdrop mobile -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-40 bg-black/50 lg:hidden" onclick={closeSidebar} transition:slide={{ duration: 200 }} />
	{/if}

	<!-- Sidebar -->
	<aside class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-900 transition-transform lg:static lg:w-60 lg:translate-x-0 dark:bg-zinc-900 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
		<!-- Logo -->
		<a href="/admin" class="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4" onclick={closeSidebar}>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zumito-600 text-sm font-extrabold text-white">Z</div>
			<span class="text-sm font-bold text-white">Zumito Admin</span>
		</a>

		<!-- Nav links -->
		<nav class="flex-1 overflow-y-auto px-3 py-4">
			<div class="space-y-1">
				{#each nav as item}
					<a {href} onclick={closeSidebar}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
						{isActive(item.href) ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}">
						<Icon icon={item.icon} class="h-5 w-5 shrink-0" />
						{item.label}
					</a>
				{/each}
			</div>

			<div class="mt-6 border-t border-white/10 pt-4">
				{#each bottomNav as item}
					<a {href} onclick={closeSidebar}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300">
						<Icon icon={item.icon} class="h-5 w-5 shrink-0" />
						{item.label}
					</a>
				{/each}
			</div>
		</nav>
	</aside>

	<!-- Main -->
	<div class="flex flex-1 flex-col min-w-0">
		<!-- Top bar -->
		<header class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white/80 backdrop-blur px-4 dark:border-zinc-800 dark:bg-zinc-950/80 lg:px-6">
			<!-- Mobile hamburger -->
			<button onclick={() => sidebarOpen = !sidebarOpen}
				class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800 cursor-pointer">
				<Icon icon="tabler:menu-2" class="h-5 w-5" />
			</button>

			<div class="flex-1" />

			<!-- User -->
			{#if data.user}
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
						{data.user.username?.[0]?.toUpperCase() ?? '?'}
					</div>
					<span class="hidden text-sm font-medium text-zinc-700 sm:block dark:text-zinc-300">{data.user.username}</span>
				</div>
			{/if}
		</header>

		<!-- Content -->
		<main class="flex-1 p-4 lg:p-6">
			{@render children()}
		</main>
	</div>
</div>
