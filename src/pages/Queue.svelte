<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import {
        useMedia,
        type Hit,
        format,
        comments,
        getTime,
    } from "../libs/utils";
    import Play from "../components/icons/Play.svelte";
    import { AudioPlayer, playerRequest } from "../libs/player";
    import { text } from "svelte/internal";
    import { Stretch } from "svelte-loading-spinners";
    import MiniStretch from "../components/Player/MiniStretch.svelte";
    import Pause from "../components/icons/Pause.svelte";
    import { channel, error } from "../libs/store";
    const { currentTime, is_load, playing, active } = AudioPlayer;
    import { useLocation, useNavigate } from "svelte-navigator";
    import ChevonD from "../components/icons/ChevonD.svelte";
    import ChevonL from "../components/icons/ChevonL.svelte";
    const location = useLocation();
    const navigate = useNavigate();

    export let data: Hit;
    if (data && !data.id) {
        navigate(-1);
    }
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

<!-- {#if $sizeLg}
    <div class="back-tab">
        <button
            style="width: 60px;"
            on:click={() => {
                navigate(-1);
            }}
        >
            <ChevonL size={20} />
        </button>
    </div>
{/if} -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<h1 class="title">
    <img style="width: 40px;" src="/yomi-full.png" alt="logo" />
    Queue
    <div style="width: 100%;" />
    <div
        class="pointer"
        on:click={() => {
            navigate(-1);
        }}
    >
        <ChevonD size={32} />
    </div>
</h1>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container" class:sm={!$sizeLg}>
    <div class="queue scroll" class:sm={!$sizeLg} class:hidden={$error}>
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
</div>

<style lang="scss">
    .pointer {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .back-tab {
        display: flex;
        align-items: center;
        background-color: #222426;
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        --scroll-bar-bg: transparent;
        &.sm{
            height: calc(100% - 180px);
        }
    }
    .hidden {
        pointer-events: none;
        opacity: 0;
    }
    .backdrop {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        color: #dcdcdcde;
        > .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            // filter: brightness(0.6) contrast(3) brightness(1.2) blur(200px);
            filter: saturate(4) hue-rotate(323deg) contrast(3) brightness(1.2)
                blur(200px) brightness(0.6);
            z-index: -1;
        }
        > .list {
            border-radius: 8px;
        }
    }
    .title {
        display: flex;
        align-items: center;
        padding: 0 20px;
        font-size: 1.5rem;
        img {
            margin-left: 5px;
            margin-right: 10px;
        }
    }
    .queue {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        height: calc(100% - 228px);
    }
    .queue.sm {
        height: 100%;
        z-index: 9999;
    }
    .queue {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        padding-bottom: 50px;
        --scroll-bar-bg: transparent;
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
                                display: flex;
                                justify-content: flex-end;
                                align-items: center;
                                div {
                                    display: flex;
                                }
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
                                display: flex;
                                justify-content: flex-end;
                                align-items: center;
                                div {
                                    display: flex;
                                }
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
