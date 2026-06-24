<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sileo';
	import { browser } from '$app/environment';
	import { loadLocale } from 'wuchale/load-utils';
	import '../locales/main.loader.svelte.js';
	import type { LayoutData } from './$types';

	let { data, children } = $props();

	$effect(() => {
		if (browser) loadLocale(data.locale);
	});
</script>

<svelte:head><link rel="icon" href="/favicon.png" /></svelte:head>

{@render children()}
<Toaster position="top-center" />

