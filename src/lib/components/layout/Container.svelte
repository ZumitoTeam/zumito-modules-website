<script lang="ts">
	let { children, class: className = '' }: { children: any; class?: string } = $props();
</script>

<div class="mx-auto w-full max-w-3xl px-4 {className}">
	{@render children()}
</div>
