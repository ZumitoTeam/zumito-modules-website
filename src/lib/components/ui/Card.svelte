<script lang="ts">
	type Variant = 'border' | 'shadow';
	type Padding = 'sm' | 'md' | 'lg';

	let {
		children,
		variant = 'border' as Variant,
		padding = 'md' as Padding,
		class: className = '',
	}: {
		children: any;
		variant?: Variant;
		padding?: Padding;
		class?: string;
	} = $props();

	const pad = { sm: 'p-3 sm:p-4', md: 'p-4 sm:p-6', lg: 'p-5 sm:p-8' };
	const base = 'rounded-2xl';
	const styles: Record<Variant, string> = {
		border: `${base} border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950`,
		shadow: `${base} bg-white shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800`,
	};
</script>

<div class="{styles[variant]} {pad[padding]} {className}">
	{@render children()}
</div>
