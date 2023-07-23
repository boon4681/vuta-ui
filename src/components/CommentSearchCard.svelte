<script lang="ts">
    import { onMount } from "svelte";
    import {
        format,
        format_time,
        useMedia,
        type Hit,
        comments,
    } from "../libs/utils";
    import Comment from "./Comment.svelte";
    import Play from "./icons/Play.svelte";

    export let data: Hit;

    let sizeMd;
    let sizeSm;
    let sizeLg;
    const ytlink = `https://youtube.com/watch?v=${data.videoId}`;
    const chlink = `https://youtube.com/channel/${data.channelId}`;

    onMount(() => {
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
<div class="card">
    <img
        class="bg"
        src="https://vuta-music.boon4681.com/image/low/{data.videoId}.jpg"
        alt=""
    />
    <div class="header">
        <div
            class="thumbnail"
            style="background-image: url(//vuta-music.boon4681.com/image/{data.videoId}.jpg);"
        >
            <div class="overlay" on:click>
                <div class="inner">
                    <button id="play" class="initial">
                        <Play />
                    </button>
                </div>
            </div>
        </div>
        <div class="date">
            <div>
                {new Date(data.videoPublishDate).toLocaleDateString()}
            </div>
            <div>
                {format_time(new Date(data.videoPublishDate).getTime() / 1000)}
            </div>
        </div>
        <div class="title">
            <div>
                <a
                    class="channel"
                    href={chlink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {data.channelTitle}
                </a>
            </div>
            <div>
                <a href={ytlink} target="_blank" rel="noopener noreferrer">
                    {data.videoTitle}
                </a>
            </div>
        </div>
    </div>
    <!-- <div>
        {#each comments(data.videoId, data.highlightedText) as ele}
            {#if ele["link"]}
                <a href={ele["link"]} target="_blank" rel="noopener noreferrer">
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
    </div> -->
</div>

<style lang="scss">
    .card {
        position: relative;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        // border: 1px solid white;
        border-radius: 21px;
        padding: 0.7rem;
        // padding-top: 1.5rem;
        padding-bottom: 0.5rem;
        // box-shadow: 0 16px 24px 2px rgba(29, 17, 51, 0.04),
        //     0 6px 32px 4px rgba(9, 32, 77, 0.12),
        //     0 8px 12px -5px rgba(29, 17, 51, 0.12);
        font-size: 14px;
        // max-width: var(--w);
        border-radius: 21px;
        // background: #202224;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12);
        &:before {
            z-index: -3;
            content: "";
            position: absolute;
            width: 0%;
            height: 100%;
            top: 0;
            left: 0;
            box-shadow: 0px 0px 100vw 100px black, 0px 0px 100vw 0px black;
            transition: 0.2s cubic-bezier(0.4, 0, 0.6, 1);
        }
        &:hover {
            &:before {
                box-shadow: 0px 0px 100vw 100px black, 0px 0px 100vw 100px black;
            }
        }
        .date {
            position: absolute;
            bottom: 0.5rem;
            right: 1rem;
            display: flex;
            font-weight: 600;
            font-size: 12px;
            z-index: 10;
            padding: 2px 10px;
            border-radius: 6px;
            background: #202224;

            // background-color: #1cae6a;
            color: white;
            > :first-child {
                opacity: 0.6;
                margin-right: 6px;
            }
            > :last-child {
                opacity: 0.6;
                color: #68f28b;
            }
        }

        > .header {
            display: flex;
            color: #5bb3ff;
            width: 100%;
            flex-direction: row;
            .thumbnail {
                position: relative;
                border-radius: 17px;
                aspect-ratio: 1;
                max-width: 120px;
                width: 100%;
                // padding-bottom: 60.52%;
                background-position: center;
                background-size: cover;
                box-shadow: 0px 4px 16px #0000004d;

                .overlay {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                    transition: 0.2s;
                    opacity: 0;
                    &:hover {
                        opacity: 1;
                        background-color: #36393f52;
                    }

                    > .inner {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50px;
                        height: 40px;
                        width: 60px;
                        background-color: #292a2ba8;

                        button {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #ffffff81;
                            transition: 0.25s;
                            * {
                                pointer-events: none;
                            }

                            &:hover {
                                color: white;
                            }
                        }
                    }
                }
            }
            .title {
                width: 100%;
                margin-left: 15px !important;
                display: flex;
                overflow: hidden;
                flex-direction: column !important;
                div {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: inherit;
                    line-height: 1.55;
                }

                .channel {
                    flex-basis: auto;
                    font-size: 14px;
                    color: white;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
            }
        }
        .bg {
            z-index: 0;
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            // filter: brightness(0.7) contrast(4) brightness(3) blur(100px);
            // filter: saturate(5) hue-rotate(323deg) blur(100px) brightness(0.7) contrast(4);
            filter: saturate(4) hue-rotate(323deg) contrast(4) brightness(3) contrast(0.7)
                blur(100px);
        }
    }
</style>
