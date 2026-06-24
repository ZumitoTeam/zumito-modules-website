<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sileo';
	import type { LayoutData } from './$types';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href="/favicon.png" /></svelte:head>

{@render children()}
<Toaster position="top-center" />

