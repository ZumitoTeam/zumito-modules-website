<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { WuchaleProvider } from 'wuchale/svelte';
	import type { LayoutData } from './$types';

	let { data, children } = $props();
</script>

<WuchaleProvider locale={data.locale} loaders={{ en: () => import('../../messages/en.json'), es: () => import('../../messages/es.json') }}>
	<svelte:head><link rel="icon" href={favicon} /></svelte:head>
	{@render children()}
</WuchaleProvider>
