<script lang="ts">
	let { text, variant = 'default' }: { text: string; variant?: 'default' | 'success' | 'warning' | 'danger' } = $props();

	const variants = {
		default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
		success: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
		warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
		danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
	};
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {variants[variant]}">{text}</span>
