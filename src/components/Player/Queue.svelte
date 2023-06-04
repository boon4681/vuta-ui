<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import {
        useMedia,
        type Hit,
        format,
        comments,
        getTime,
    } from "../../libs/utils";
    import Play from "../icons/Play.svelte";
    import { AudioPlayer, playerRequest } from "../../libs/player";
    import { text } from "svelte/internal";
    import { Stretch } from "svelte-loading-spinners";
    import MiniStretch from "./MiniStretch.svelte";
    import Pause from "../icons/Pause.svelte";
    import Player from "./Player.svelte";
    import ChevonD from "../icons/ChevonD.svelte";
    import SkBack from "../icons/SKBack.svelte";
    import PlayButton from "./PlayButton.svelte";
    import SkNext from "../icons/SKNext.svelte";
    import ProcessBar from "./ProcessBar.svelte";
    import { error } from "../../libs/store";
    const { currentTime, is_load, playing,active } = AudioPlayer;

    export let data: Hit;
    export let open: boolean;
    const { videoId, highlightedText } = data;
    const COMMENTS = comments(videoId, highlightedText, "queue");
    const ctx = document.createElement("canvas").getContext("2d");
    let selected = -1;
    let sizeMd;
    let sizeSm;
    let sizeLg;
    let ref: HTMLElement;

    let musicOrderWidth = calcFont(COMMENTS.length + "").width + 50;
    let musicTimeWidth =
        COMMENTS.map((a) => calcFont(a[0].text).width).sort(
            (a, b) => b - a
        )[0] +
        40 +
        20;

    let musicNameWidth = 0;

    function calcFont(text: string) {
        ctx.font = "16px";
        return ctx.measureText(text);
    }

    const resize = () => {
        musicNameWidth =
            ref.getBoundingClientRect().width -
            musicOrderWidth -
            musicTimeWidth;
    };

    onMount(() => {
        const [unsub, sm, md, lg] = useMedia(document.body);
        sizeSm = sm;
        sizeMd = md;
        sizeLg = lg;
        musicNameWidth =
            ref.getBoundingClientRect().width -
            musicOrderWidth -
            musicTimeWidth;

        window.addEventListener("resize", resize);
        return () => {
            unsub();
            window.removeEventListener("resize", resize);
        };
    });
</script>

{#if $error}
    <div class="queue" class:sm={!$sizeLg}>
        <button
            style="width: 50px;height:50px;margin-left:-10px;margin-top:10px"
            on:click={() => {
                open = false
            }}
        >
            <ChevonD size={50} />
        </button>
        <div
            style="display: flex;flex-direction:column;align-items: center;user-select:none;margin-top:20px;"
        >
            <div style="font-weight:600;font-size:30px">There is a tea pot</div>
            <img
                style="width: 100%;max-width:200px"
                src="yomi-kettle.png"
                alt=""
            />
            <div style="font-weight:600;font-size:20px;max-width:250px">
                Error:
            </div>
            <div style="font-weight:600;font-size:20px;">
                {$error}
            </div>
        </div>
    </div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="queue" class:sm={!$sizeLg} class:hidden={$error}>
    {#if !$sizeLg}
        <div class="player">
            <button
                style="width: 50px;height:50px;margin-left:-10px;margin-top:10px"
                on:click={() => (open = !open)}
            >
                <ChevonD size={50} />
            </button>
            <div class="banner">
                <div
                    class="thumbnail"
                    style="background-image: url(//vuta-music.boon4681.com/image/{data.videoId}.jpg);"
                />
            </div>
            <div>
                <div class="music-label">
                    <div>
                        <span>
                            {data.videoTitle}
                        </span>
                    </div>
                    <div class="channel">
                        <span>
                            {data.channelTitle}
                        </span>
                    </div>
                </div>
            </div>
            <div class="control">
                <ProcessBar />
                <div class="btn-group">
                    <button> -10s </button>
                    <button>
                        <SkBack />
                    </button>
                    <PlayButton big={true} {data} />
                    <button>
                        <SkNext />
                    </button>
                    <button> +10s </button>
                </div>
            </div>
        </div>
    {/if}
    <h1 class="title">
        <img style="width: 50px;" src="/yomi-full.png" alt="logo" /> Queue
        <div style="width: 100%;" />
        {#if $sizeLg}
            <button style="width: 50px;" on:click={() => (open = !open)}>
                <ChevonD size={50} />
            </button>
        {/if}
    </h1>
    <div class="backdrop" bind:this={ref}>
        <img
            src="//vuta-music.boon4681.com/image/{data.videoId}.jpg"
            class="bg"
            alt=""
        />
        <table
            class="list"
            style="--td1:{musicOrderWidth}px;--td2:{musicNameWidth}px;--td3:{musicTimeWidth}px;"
        >
            <tbody>
                {#each COMMENTS as ele, i (i)}
                    <tr
                        class:active={i == $active}
                        class:unactive={i < $active}
                        class:selected={selected == i}
                        on:click|capture={() => {
                            selected = selected == i ? -1 : i;
                        }}
                    >
                        <td class="music-order">
                            <div
                                class="play"
                                on:click|capture={() => {
                                    AudioPlayer.getMusic(data)
                                        .then(async (url) => {
                                            if ($active != i)
                                                AudioPlayer.updateTime(
                                                    getTime(ele[0].text)
                                                );
                                        })
                                        .catch();
                                }}
                            >
                                {#if $active == i && $playing}
                                    <div
                                        on:click|capture={() => {
                                            AudioPlayer.getMusic(data)
                                                .then(async (url) => {
                                                    AudioPlayer.pause();
                                                })
                                                .catch();
                                        }}
                                    >
                                        <Pause size={16} />
                                    </div>
                                {:else}
                                    <div
                                        on:click|capture={() => {
                                            AudioPlayer.getMusic(data)
                                                .then(async (url) => {
                                                    if (!$playing)
                                                        AudioPlayer.play();
                                                })
                                                .catch();
                                        }}
                                    >
                                        <Play size={16} />
                                    </div>
                                {/if}
                            </div>
                            {#if $active == i && $playing}
                                <div class="text">
                                    <MiniStretch />
                                </div>
                            {:else}
                                <div class="text">
                                    {i + 1}
                                </div>
                            {/if}
                        </td>
                        <td class="music-name">
                            {ele[1].text}
                        </td>
                        <td>
                            <!-- {getTime(ele[0].text)} -->
                            {ele[0].text}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style lang="scss">
    .hidden {
        pointer-events: none;
        opacity: 0;
    }
    .control {
        margin-top: 20px;
        padding: 0 20px;
        .btn-group {
            margin-top: 20px;
        }
    }
    .music-label {
        width: 100%;
        margin-right: auto;
        padding: 0 10px;
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        color: white;
        font-size: 16px;
        font-weight: 600;
        > div {
            display: flex;
            width: 100%;
            overflow: hidden;
        }

        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: inherit;
            line-height: 1.55;
        }

        .channel {
            font-weight: 400;
            flex-basis: auto;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.658);
            margin-bottom: 5px;
        }
    }
    .backdrop {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        > .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: brightness(0.6) contrast(3) brightness(1.2) blur(200px);
            z-index: -1;
        }
        > .list {
            border-radius: 8px;
        }
    }
    .banner {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        margin-top: 10px;
        > .thumbnail {
            border-radius: 6px;
            // border-radius: 6px 6px 0 0;
            width: 250px;
            aspect-ratio: 1;
            background-position: center;
            background-size: cover;
            box-shadow: 0px 4px 16px #0000004d;
        }
    }
    .title {
        display: flex;
        align-items: center;
        img {
            margin-left: 5px;
            margin-right: 10px;
        }
    }
    .queue {
        height: calc(100% - 80px);
    }
    .queue.sm {
        height: 100%;
        z-index: 99999;
    }
    .queue {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        background-color: #36393f;
        width: 100%;
        overflow: auto;
        padding-bottom: 50px;
        .list {
            table-layout: fixed;
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            tr {
                height: 50px;
                &.active {
                    color: #31d179;
                }
                &.unactive {
                    color: #ffffff6b;
                }
                &.selected {
                    td {
                        background-color: #24252783 !important;
                        // background-color: #242527 !important;
                        &.music-order {
                            .play {
                                display: block;
                            }
                            .text {
                                display: none;
                            }
                        }
                    }
                }
                td {
                    &:first-child {
                        user-select: none;
                        border-radius: 6px 0 0 6px;
                        padding-left: 15px;
                    }
                    &:last-child {
                        border-radius: 0 6px 6px 0;
                        padding-left: 15px;
                        padding-right: 15px;
                        width: var(--td3);
                    }
                }
                &:hover {
                    td {
                        background-color: #2a2c2e57;
                        &.music-order {
                            .play {
                                display: block;
                            }
                            .text {
                                display: none;
                            }
                        }
                    }
                }
                td.music-order {
                    width: var(--td1);
                    text-align: end;
                    padding-right: 20px;
                    .play {
                        display: none;
                    }
                    .text {
                        display: block;
                    }
                }
                td.music-name {
                    width: var(--td2);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        padding: 8px;
        color: #ffffff81;
        transition: 0.25s;
        aspect-ratio: 1;
        width: 40px;
        &:hover {
            color: white;
        }
    }
</style>
