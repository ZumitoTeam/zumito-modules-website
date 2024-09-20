<script lang="ts">
    import { Prisma } from '@prisma/client'
    
    export let module: Prisma.ModuleSelect;
</script>


<li class="p-3 flex justify-between items-center user-card">
    <div class="flex items-center">
        <img class="w-10 h-10 rounded-full" src={module.icon} alt="{module.name} zumito module icon">
        <span class="ml-3 font-medium">{module.name}</span>
    </div>
    <div class="flex gap-3">
        <a href="/module/{module.name}" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-400 hover:text-pink-600" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
            </svg>
        </a>
        <a href="/user/modules/{module.id}" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-400 hover:text-pink-600" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                <path d="M13.5 6.5l4 4" />
            </svg>
        </a>
    </div>
</li>