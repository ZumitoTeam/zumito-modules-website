<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import Icon from '@iconify/svelte';

	type ModuleOption = { id: string; name: string; slug: string };

	let {
		available = [],
		selected = $bindable([] as ModuleOption[]),
		name = 'dependencies',
		label = 'Dependencies',
	}: {
		available: ModuleOption[];
		selected?: ModuleOption[];
		name?: string;
		label?: string;
	} = $props();

	let search = $state('');
	let open = $state(false);

	const filtered = $derived(
		available.filter(m =>
			!selected.some(s => s.id === m.id) &&
			m.name.toLowerCase().includes(search.toLowerCase())
		)
	);

	function add(mod: ModuleOption) {
		selected = [...selected, mod];
		search = '';
	}
	function remove(id: string) {
		selected = selected.filter(s => s.id !== id);
	}
	function toggleDropdown(e: Event) {
		e.stopPropagation();
		open = !open;
	}
	function onFocus() { open = true; }
</script>

<svelte:window onclick={() => open = false} />

<div class="relative" onclick={(e: Event) => e.stopPropagation()}>
	<label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
	<p class="mt-1 text-xs text-zinc-400">Search modules to add as dependencies. Hold Ctrl/Cmd to select multiple.</p>

	<div class="mt-2 rounded-xl border border-zinc-300 bg-white transition-colors focus-within:border-zumito-500 focus-within:ring-1 focus-within:ring-zumito-500 dark:border-zinc-800 dark:bg-zinc-950">
		<!-- Selected chips -->
		{#if selected.length > 0}
			<div class="flex flex-wrap gap-1.5 p-2" use:autoAnimate>
				{#each selected as mod (mod.id)}
					<span class="inline-flex items-center gap-1 rounded-lg bg-zumito-50 px-2.5 py-1 text-xs font-medium text-zumito-600 dark:bg-zumito-600/10 dark:text-zumito-400">
						{mod.name}
						<button onclick={() => remove(mod.id)} class="flex h-4 w-4 items-center justify-center rounded-full text-zumito-400 transition-colors hover:bg-zumito-200 hover:text-zumito-600 cursor-pointer dark:hover:bg-zumito-600/30">
							<Icon icon="tabler:x" class="h-3 w-3" />
						</button>
					</span>
				{/each}
			</div>
		{/if}

		<!-- Search input -->
		<div class="flex items-center {selected.length > 0 ? 'border-t border-zinc-200 dark:border-zinc-800' : ''}">
			<Icon icon="tabler:search" class="ml-3 h-4 w-4 text-zinc-400 shrink-0" />
			<input
				type="text"
				bind:value={search}
				onfocus={onFocus}
				placeholder={selected.length > 0 ? 'Add more...' : 'Search modules...'}
				class="flex-1 bg-transparent px-2.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none dark:text-zinc-100 dark:placeholder:text-zinc-600"
			/>
		</div>
	</div>

	<!-- Dropdown -->
	{#if open && filtered.length > 0}
		<div class="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950" use:autoAnimate>
			{#each filtered as mod (mod.id)}
				<button onclick={() => add(mod)}
					class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer">
					<Icon icon="tabler:plus" class="h-4 w-4 shrink-0 text-zinc-400" />
					{mod.name}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Hidden inputs for form submission -->
	{#each selected as mod (mod.id)}
		<input type="hidden" name={name} value={mod.id} />
	{/each}
</div>