<script lang="ts">
    export let title: string;
</script>

<div 
    class="{$$restProps.class || ''}" 
    id={$$restProps.id || title.replaceAll(' ', '-').toLowerCase()} 
    {...Object.entries($$restProps).filter(([key, prop]) => !['class', 'id'].includes(key))}
>
    {title}
</div>

<div class="mt-3 w-full">
    <slot />
</div>