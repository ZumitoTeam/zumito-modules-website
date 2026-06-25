<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';

	let { open = $bindable(false), title = '', size = 'md', children }: { open?: boolean; title?: string; size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; children: import('svelte').Snippet } = $props();

	const sizeMap: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-[calc(100vw-2rem)]',
	};

	function close() { open = false; }
	function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') close(); }

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', onKeydown);
		}
		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKeydown);
		};
	});

	$effect(() => {
		if (!open) return;
		const currentFocus = document.activeElement as HTMLElement;
		return () => {
			if (currentFocus) currentFocus.focus();
		};
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4" onclick={close} transition:fade={{ duration: 150 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="relative max-h-[calc(100vh-2rem)] w-full {sizeMap[size]} overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" onclick={(e: Event) => e.stopPropagation()} transition:fade={{ duration: 150 }}>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
				<button onclick={close} class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 cursor-pointer dark:hover:bg-zinc-800 dark:text-zinc-400">
					<Icon icon="tabler:x" class="h-5 w-5" />
				</button>
			</div>
			<!-- Body -->
			<div class="p-5">
				{#if children}{@render children()}{/if}
			</div>
		</div>
	</div>
{/if}