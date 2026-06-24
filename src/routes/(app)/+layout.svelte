<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	let { children } = $props();
</script>

<div class="min-h-screen bg-white dark:bg-zinc-950">
	<Navbar />
	<main class="min-h-[calc(100vh-8rem)] overflow-x-hidden">
		{@render children()}
	</main>
	<Footer />
</div>
