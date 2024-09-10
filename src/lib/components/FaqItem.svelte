<script lang="ts">
    export let question: string;
    export let answer: string;
</script>

<div class="flex gap-x-5">
    <svg class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>

    <div class="grow">
        <h3 class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200">
            {question}
        </h3>
        <p class="mt-1 text-gray-500 dark:text-neutral-500">
            {answer}
        </p>
    </div>
</div>