<script lang="ts">
    import { onMount } from "svelte";
    import { comments, limit, useMedia } from "../libs/utils";
    import Maximize from "./icons/Maximize.svelte";
    import { slide } from "svelte/transition";
    import Minimize from "./icons/Minimize.svelte";
    export let videoId: string;
    export let comment: string;
    let sizeMd;
    let sizeSm;
    let sizeLg;
    let span: boolean = false;
    const click = () => {
        if (dim.height > 90) {
            span = !span;
        }
    };
    let ref: HTMLElement;
    let dim: DOMRect = new DOMRect();
    onMount(() => {
        dim = ref.querySelector("span").getBoundingClientRect();
        dim.height += 20;
        const [unsub, sm, md, lg] = useMedia(document.body);
        sizeSm = sm;
        sizeMd = md;
        sizeLg = lg;
        return () => {
            unsub();
        };
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="comments">
    <!-- <div class="title">Comment</div> -->
    <div
        bind:this={ref}
        class="comment scroll"
        class:overflow={!span && $sizeLg}
        style="height: {span
            ? dim.height > 90
                ? dim.height + 20
                : 90
            : 90}px;transition-duration:{limit(
            (dim.height / 500 - 0.5) * 0.5,
            0.3,
            0.5
        )}s"
    >
        <button style="position: sticky;width:100%;top:0;">
            <div class="maximize" on:click={click}>
                {#if span}
                    <Minimize />
                {:else}
                    <Maximize />
                {/if}
            </div>
        </button>
        <span>
            {#each comments(videoId, comment) as ele}
                {#if ele["link"]}
                    <a
                        href={ele["link"]}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {ele["text"]}
                    </a>
                {:else if ele["glow"]}
                    <span class="glow">{ele["text"]}</span>
                {:else if ele["text"] == "\n"}
                    <br />
                {:else}
                    <span>{ele["text"]}</span>
                {/if}
            {/each}
        </span>
        <div class="shadow" />
    </div>
</div>

<style lang="scss">
    .comments {
        position: relative;
        margin-top: 10px;
        .title {
            font-size: 14px;
            padding-bottom: 5px;
            border-bottom: 1px solid #f5f5f536;
        }
        button {
            color: #ffffffde;
        }
        .comment {
            position: relative;
            margin-top: 10px;
            transition: 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-property: height;
            overflow-y: hidden;
            overflow-x: hidden;
            // padding-right: 8px;
            overflow: hidden;

            &.overflow {
                padding-right: 0px;
                overflow-y: hidden;
            }

            span {
                white-space: pre-line;
                padding-bottom: 20px;
                &.glow {
                    font-weight: 600;
                    color: #3dd456;
                }
                a {
                    color: #5bb3ff;
                }
            }
            .maximize {
                opacity: 0.8;
                position: absolute;
                top: 10px;
                right: 5px;
                background-color: #37383a;
                border-radius: 8px;
                width: 38px;
                height: 38px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #f5f5f536;
                transition: 0.2s;
                cursor: pointer;
                &:hover {
                    opacity: 1;
                    color: white;
                    border: 1px solid white;
                }
            }
            .shadow {
                position: sticky;
                bottom: 0px;
                width: 100%;
                z-index: 2;
                height: 40px;
                background: linear-gradient(
                    0deg,
                    #202224 20%,
                    rgba(32, 34, 36, 0) 100%
                );
            }
        }
    }
</style>
