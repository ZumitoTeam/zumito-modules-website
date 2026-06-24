<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sileo';
	import { browser } from '$app/environment';
	import { loadLocale } from 'wuchale/load-utils';
	import { onNavigate } from '$app/navigation';
	import '../locales/main.loader.svelte.js';
	import type { LayoutData } from './$types';

	let { data, children } = $props();

	$effect(() => {
		if (browser) loadLocale(data.locale);
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head><link rel="icon" href="/favicon.png" /></svelte:head>

{@render children()}
<Toaster position="top-center" />

