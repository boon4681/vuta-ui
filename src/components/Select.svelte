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
    let sizeMd;
    let sizeSm;
    let sizeLg;
    const dispatch = createEventDispatcher();
    let ref: HTMLElement;
    let viewref: HTMLElement;
    let active = false;
    const clickOutside = (e: MouseEvent) => {
        if (!ref.contains(e.target as HTMLElement)) {
            active = false;
        }
    };
    onMount(() => {
        const [unsub, sm, md, lg] = useMedia(document.body);
        sizeSm = sm;
        sizeMd = md;
        sizeLg = lg;
        document.addEventListener("click", clickOutside);
        return () => {
            unsub();
            document.removeEventListener("click", clickOutside);
        };
    });

    let render_value = (options.find((a) => a.value === value) ?? {}).render;

    $: {
        render_value = (options.find((a) => a.value === value) ?? {}).render;
    }

    $: if (viewref) {
        viewref.scrollIntoView();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    bind:this={ref}
    class="select"
    class:active
    on:click={() => {
        if (options.length) active = !active;
    }}
>
    <div class="display">
        <div class="value">{render_value ?? ""}</div>
        <button class="ico">
            <ChevonD size={18} />
        </button>
    </div>
    <div class="screen-wrap" class:mobile={!$sizeLg} class:open={active}>
        <div class="options-wrap">
            <div class="options scroll">
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
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .select {
        height: 36px;
        min-height: 36px;
        --scroll-bar-bg: #242424;
        width: 100%;
        max-width: 250px;
        &.active {
            .ico {
                transform: rotate(180deg);
            }
        }

        &:hover {
            color: white;
        }

        .display {
            cursor: pointer;
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 16px;
            padding-right: 10px;
            border-radius: 8px;
            color: #ffffff81;
            transition: 0.25s;
            border: 1px #ffffff81 solid;
            background: transparent;
            .value {
                margin-right: auto;
            }
        }

        .screen-wrap {
            position: relative;
            width: 100%;
            top: 0px;
            left: 0;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transform: translateY(-10px);
            transition: 0.2s;
            &.open {
                opacity: 1;
                pointer-events: auto;
                transform: translateY(0px);
            }
            &.mobile {
                position: fixed;
                z-index: 20000;
                height: 100vh;
                background-color: #242424a4;

                .options-wrap {
                    max-width: 360px;
                    margin: 0 auto;
                    margin-top: 50px;
                }
                .options {
                    max-height: 80vh;
                }
            }
        }

        .options-wrap {
            position: relative;
            top: 10px;
            left: 0;
            z-index: 10000;
            // border-radius: 8px 0 0 8px;
            border-radius: 8px;
            border: 1px #ffffff81 solid;
            width: 100%;
            color: #ffffff81;
            background-color: #242424;
            padding: 4px;
            padding-right: 0;
        }

        .options {
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: 4px;
            .option {
                cursor: pointer;
                width: 100%;
                padding: 5px 20px;
                padding-left: 12px;
                border-radius: 4px;

                &:hover {
                    background-color: #323233;
                    color: white;
                }
                &.selected {
                    background-color: #3b3c3f;
                }
            }
        }

        .ico {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: 8px;
            color: #ffffff81;
            padding: 0;
            transition: 0.2s;
            &:hover {
                color: white;
            }
        }
    }
</style>
