<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sileo';
	import { browser } from '$app/environment';
	import { loadLocale } from 'wuchale/load-utils';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import '../locales/main.loader.svelte.js';
	import type { LayoutData } from './$types';

	let { data, children } = $props();

	$effect(() => {
		if (browser) loadLocale(data.locale);
	});
</script>

<svelte:head><link rel="icon" href="/favicon.png" /></svelte:head>

{#key $page.url.pathname}
	<div in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
		{@render children()}
	</div>
{/key}

<Toaster position="top-center" />

