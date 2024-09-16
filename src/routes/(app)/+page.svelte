<script lang="ts">
    import { page } from '$app/stores';
    import { Prisma } from '@prisma/client'

    let modules: Prisma.ModuleSelect[] = $page.data.modules;
</script>

<div class="bg-gray-50">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div class="columns-2 md:columns-3 lg:columns-4 p-4">
            {#each modules as module}
                <a href="/module/{module.name}" class="block mb-4 p-4 bg-white rounded-xl break-inside-avoid-column">
                    <img src="{module.icon}" alt="" class="w-full">
                    <div>
                        {module.name}
                    </div>
                    <div>
                        {@html module.description}
                    </div>
                    {#if module.tags && module.tags.length}
                        {#each module.tags as tag}
                            <div class="">{tag.id}</div>
                        {/each}
                    {/if}
                    <div>Free</div>
                </a>
            {/each}
        </div>
    </div>

</div>    
