<script lang="ts">
    import NavBar from "$lib/components/NavBar.svelte";
    import type { LayoutData } from "../$types";
    import "../../app.css";

    export let data: LayoutData;
</script>

<svelte:head>
    <title>Zumito Modules</title>
</svelte:head>

<NavBar 
    isLoggedIn={data.isLoggedIn}
/>

<slot></slot>
