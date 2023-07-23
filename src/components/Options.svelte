<script lang="ts">
    import {
        onMount,
        type SvelteComponent,
        createEventDispatcher,
    } from "svelte";
    import { fly } from "svelte/transition";
    import ChevonD from "./icons/ChevonD.svelte";
    import { useMedia } from "../libs/utils";
    interface Option {
        value: any;
        render: string | typeof SvelteComponent;
    }
    export let value: any;
    export let options: Option[];
    const dispatch = createEventDispatcher();
    let viewref: HTMLElement;
    let render_value = (options.find((a) => a.value === value) ?? {}).render;

    $: {
        render_value = (options.find((a) => a.value === value) ?? {}).render;
    }

    $: if (viewref) {
        viewref.scrollIntoView({ behavior: "smooth" });
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#each options as option, i (option.value)}
    {#if option.value == value}
        <div bind:this={viewref} />
    {/if}
    <div
        class="option"
        class:selected={option.value == value}
        on:click={() => {
            value = option.value;
            dispatch("change", option.value);
        }}
    >
        {#if typeof option.render == "string"}
            {option.render}
        {:else}
            <svelte:component this={option.render} />
        {/if}
    </div>
{/each}

<style lang="scss">
    .option {
        cursor: pointer;
        margin: 0 0.7rem;
        padding: 0.25rem 0.8rem;
        border-radius: 6px;
        color: #ffffff4f;
        // backdrop-filter: blur(2px);

        &:hover {
            background: rgba(77, 80, 82, 0.13);
            color: #dededec9;
        }
        &.selected {
            color: #dededec9;
            background: rgba(91, 95, 99, 0.13);
        }
    }
</style>
