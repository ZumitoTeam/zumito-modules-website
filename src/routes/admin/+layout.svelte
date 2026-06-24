<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<aside class="w-56 shrink-0 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
		<nav class="space-y-1">
			<a href="/admin" class="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">Dashboard</a>
			<a href="/admin/users" class="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">Users</a>
			<a href="/admin/modules" class="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">Modules</a>
			<a href="/admin/features" class="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">Features</a>
		</nav>
	</aside>
	<main class="flex-1 p-8">
		{@render children()}
	</main>
</div>
