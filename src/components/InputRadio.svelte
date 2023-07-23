<script lang="ts">
    import { createEventDispatcher, type SvelteComponent } from "svelte";
    import { nanoid } from "nanoid";
    interface Option {
        value: any;
        render: string | typeof SvelteComponent;
        disable?: boolean;
    }
    export let value: any;
    export let options: Option[];
    const group = nanoid();
    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="options space-x">
    {#each options as option, i (option.value)}
        {@const id = nanoid()}
        <div
            class="option"
            class:selected={option.value == value}
            class:disable={option.disable}
        >
            <input
                type="radio"
                {id}
                name={group}
                value={option.value}
                checked={option.value == value}
                on:click={() => {
                    value = option.value;
                    dispatch("change", value);
                }}
            />
            <div>
                {#if typeof option.render == "string"}
                    {option.render}
                {:else}
                    <svelte:component this={option.render} />
                {/if}
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .options {
        display: flex;
        font-size: 14px;
        margin: 1em 0;
        .option {
            cursor: pointer;
            position: relative;
            padding: 2px 12px;
            border-radius: 15px;
            color: #ffffff81;
            transition: 0.25s;
            // border: 1px #ffffff81 solid;
            background-color: #52585a26;
            &:has(input:checked) {
                // color: #4ac6ff;
                // border-color: #4ac6ff;
                // background-color: #00b8ff26;
                color: #ffffff;
                // border-color: #a1a9ad;
                background-color: #545dfef6;
            }
            &.disable {
                cursor: not-allowed;
                color: #ffffff81 !important;
                // border: 1px #ffffff81 solid !important;
                background-color: #52585a26 !important;
                opacity: 0.5;

                * {
                    pointer-events: none;
                }
            }
            input {
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                margin: 0;
            }
        }
    }
</style>
