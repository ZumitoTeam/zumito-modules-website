<script lang="ts">
	let { text, variant = 'default' }: { text: string; variant?: 'default' | 'success' | 'warning' | 'danger' } = $props();

	const variants = {
		default: 'border-zinc-800 bg-zinc-950 text-zinc-400',
		success: 'border-green-800 bg-green-950 text-green-400',
		warning: 'border-yellow-800 bg-yellow-950 text-yellow-400',
		danger: 'border-red-800 bg-red-950 text-red-400',
	};
</script>

<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {variants[variant]}">{text}</span>
