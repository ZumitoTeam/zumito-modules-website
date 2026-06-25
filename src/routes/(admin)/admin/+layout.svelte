<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { children, data } = $props();

	let menuOpen = $state(false);
	let openDropdown = $state<string | null>(null);

	const nav = [
		{ href: '/admin', label: 'Dashboard', icon: 'tabler:dashboard' },
		{
			label: 'Modules', icon: 'tabler:package',
			children: [
				{ href: '/admin/modules', label: 'All Modules', icon: 'tabler:list' },
				{ href: '/admin/pending', label: 'Pending Approval', icon: 'tabler:clock' },
			],
		},
		{ href: '/admin/users', label: 'Users', icon: 'tabler:users' },
		{ href: '/admin/features', label: 'Features', icon: 'tabler:tags' },
	];

	function isActive(item: { href?: string; children?: any[] }): boolean {
		if (item.href) {
			if (item.href === '/admin') return $page.url.pathname === '/admin';
			if (item.href === '/admin/modules?filter=pending') return $page.url.pathname === '/admin/modules' && $page.url.searchParams.get('filter') === 'pending';
			return $page.url.pathname.startsWith(item.href);
		}
		if (item.children) {
			return item.children.some((c: any) => isActive(c));
		}
		return false;
	}

	function toggleDropdown(label: string) {
		openDropdown = openDropdown === label ? null : label;
	}

	$effect(() => {
		$page.url.pathname;
		menuOpen = false;
		openDropdown = null;
	});
</script>

<div class="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
	<!-- Top navbar -->
	<header class="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
		<div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 lg:px-6">
			<!-- Mobile toggler -->
			<button onclick={() => menuOpen = !menuOpen}
				class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 lg:hidden cursor-pointer dark:hover:bg-zinc-800">
				<Icon icon={menuOpen ? 'tabler:x' : 'tabler:menu-2'} class="h-5 w-5" />
			</button>

			<!-- Logo -->
			<a href="/admin" class="flex items-center gap-2.5 shrink-0">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zumito-600 text-sm font-extrabold text-white">Z</div>
				<span class="hidden text-sm font-bold text-zinc-900 sm:block dark:text-zinc-100">Zumito Admin</span>
			</a>

			<div class="flex-1" />

			<!-- Right actions -->
			<div class="flex items-center gap-3">
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
			</div>
		</div>
	</header>

	<!-- Second navbar: horizontal nav -->
	<nav class="hidden lg:block border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
		<div class="mx-auto max-w-7xl px-4 lg:px-6">
			<div class="flex items-center">
				{#each nav as item}
					{#if item.children}
						<div class="relative">
							<button onclick={() => toggleDropdown(item.label)}
								class="relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
								{isActive(item) ? 'text-zumito-600 before:absolute before:inset-x-4 before:bottom-0 before:h-0.5 before:rounded-full before:bg-zumito-600' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}">
								<Icon icon={item.icon} class="h-4 w-4 shrink-0" />
								{item.label}
								<Icon icon="tabler:chevron-down" class="h-3.5 w-3.5 transition-transform {openDropdown === item.label ? 'rotate-180' : ''}" />
							</button>
							{#if openDropdown === item.label}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div class="absolute left-0 top-full z-20 mt-0 min-w-[180px] rounded-b-xl border border-t-0 border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
									{#each item.children as child}
										<a href={child.href}
											class="flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors
											{isActive(child) ? 'text-zumito-600 bg-zumito-50 dark:bg-zumito-600/10 dark:text-zumito-400' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'}">
											<Icon icon={child.icon} class="h-4 w-4 shrink-0" />
											{child.label}
										</a>
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<a href={item.href}
							class="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
							{isActive(item) ? 'text-zumito-600 before:absolute before:inset-x-4 before:bottom-0 before:h-0.5 before:rounded-full before:bg-zumito-600' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}">
							<Icon icon={item.icon!} class="h-4 w-4 shrink-0" />
							{item.label}
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</nav>

	<!-- Mobile nav dropdown -->
	{#if menuOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="fixed inset-0 top-14 z-40 bg-black/50 lg:hidden" onclick={() => menuOpen = false}>
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<nav class="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950" onclick={(e: Event) => e.stopPropagation()}>
				<div class="flex flex-col gap-1">
					{#each nav as item}
						{#if item.children}
							<div>
								<button onclick={() => toggleDropdown(item.label)}
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer
									{isActive(item) ? 'text-zumito-600 bg-zumito-50 dark:bg-zumito-600/10 dark:text-zumito-400' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
									<Icon icon={item.icon} class="h-5 w-5 shrink-0" />
									<span class="flex-1 text-left">{item.label}</span>
									<Icon icon="tabler:chevron-down" class="h-4 w-4 transition-transform {openDropdown === item.label ? 'rotate-180' : ''}" />
								</button>
								{#if openDropdown === item.label}
									<div class="ml-8 mt-1 flex flex-col gap-1">
										{#each item.children as child}
											<a href={child.href} onclick={() => menuOpen = false}
												class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
												{isActive(child) ? 'text-zumito-600 bg-zumito-50 dark:bg-zumito-600/10 dark:text-zumito-400' : 'text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
												<Icon icon={child.icon} class="h-4 w-4 shrink-0" />
												{child.label}
											</a>
										{/each}
									</div>
								{/if}
							</div>
						{:else}
							<a href={item.href} onclick={() => menuOpen = false}
								class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
								{isActive(item) ? 'bg-zumito-50 text-zumito-600 dark:bg-zumito-600/10 dark:text-zumito-400' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'}">
								<Icon icon={item.icon!} class="h-5 w-5 shrink-0" />
								{item.label}
							</a>
						{/if}
					{/each}
				</div>
			</nav>
		</div>
	{/if}

	<!-- Content -->
	<main class="flex-1">
		<div class="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
			{@render children()}
		</div>
	</main>
</div>
