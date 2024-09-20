<script lang="ts">
    import { Prisma } from '@prisma/client'
    import ModulesListItem from './modulesListItem.svelte';
    
    export let modules: Prisma.ModuleSelect[];
</script>

<ul class="w-full divide-y divide-gray-200 bg-white rounded-md">
    {#each modules as module}
        <ModulesListItem module={module}></ModulesListItem>
    {/each}
</ul>