<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	let { children } = $props();
</script>

<Navbar />
<main class="min-h-[calc(100vh-8rem)]">
	{@render children()}
</main>
<Footer />
