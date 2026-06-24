<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { WuchaleProvider } from 'wuchale/svelte';
	import type { LayoutData } from './$types';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<WuchaleProvider locale={data.locale} loaders={{ en: () => import('../../messages/en.json'), es: () => import('../../messages/es.json') }}>
	{@render children()}
</WuchaleProvider>
