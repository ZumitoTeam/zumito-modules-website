<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen">
	<aside class="w-56 shrink-0 border-r border-zinc-200 p-4 dark:border-zinc-800">
		<nav class="space-y-1">
			<a href="/admin" class="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">Dashboard</a>
			<a href="/admin/users" class="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">Users</a>
			<a href="/admin/modules" class="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">Modules</a>
			<a href="/admin/features" class="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">Features</a>
		</nav>
	</aside>
	<main class="flex-1 p-8">
		{@render children()}
	</main>
</div>
