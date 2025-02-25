<script lang="ts">
    import { Crepe } from '@milkdown/crepe';
    import "@milkdown/crepe/theme/common/style.css";

    // We have some themes for you to choose
    // available themes: frame, classic, nord, frame-dark, classic-dark, nord-dark
    import "@milkdown/crepe/theme/frame.css";
    import { onDestroy, onMount } from 'svelte';
    import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';

    let crepe: any;
    export let value: string;

    onMount(() => {
        
        crepe = new Crepe({
            root: document.getElementById('app'),
            defaultValue: value,
        });

        crepe.editor.config((ctx) => {
            const listener = ctx.get(listenerCtx);

            listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
                if (markdown !== prevMarkdown) {
                    value = markdown;
                }
            })

        })
        .use(listener)

        crepe.create().then(() => {
            console.log('Editor created');
        });

       
    });

    onDestroy(() => {
        crepe?.destroy();
    });
</script>

<div id="app"></div>

<style>
    :global(.milkdown .ProseMirror) {
        padding: 2px;
        padding-left: 60px;
    }

    :global(.milkdown milkdown-slash-menu) {
        z-index: 1000;
    }
</style>