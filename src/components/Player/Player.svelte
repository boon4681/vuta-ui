<script lang="ts">
    import { onMount } from "svelte";
    import { fly, slide } from "svelte/transition";
    import {
        useMedia,
        type Hit,
        format,
        comments,
        getTime,
    } from "../../libs/utils";
    import Play from "../icons/Play.svelte";
    import Pause from "../icons/Pause.svelte";
    import { AudioPlayer, playerRequest } from "../../libs/player";
    import SkBack from "../icons/SKBack.svelte";
    import SkNext from "../icons/SKNext.svelte";
    import ChevonD from "../icons/ChevonD.svelte";
    import ChevonU from "../icons/ChevonU.svelte";
    import { Circle } from "svelte-loading-spinners";
    import ProcessBar from "./ProcessBar.svelte";
    import PlayButton from "./PlayButton.svelte";
    import List from "../icons/List.svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    import Slider from "../Slider.svelte";
    import Audio from "./Audio.svelte";
    import { playingHIT } from "../../libs/store";
    import { current_component } from "svelte/internal";
    const location = useLocation();
    const navigate = useNavigate();

    export let data: Hit;
    export let disable: boolean = false;
    export let bg: boolean = true;

    let { videoId, highlightedText, channelId } = data;
    let ytlink = `https://youtube.com/watch?v=${videoId}`;
    let chlink = `https://youtube.com/channel/${channelId}`;
    let thumbnail = `//vuta-api.illyaz.dev/image/square/${data.videoId}.jpg`;

    $: {
        videoId = data.videoId;
        highlightedText = data.highlightedText;
        channelId = data.channelId;
        ytlink = `https://youtube.com/watch?v=${videoId}`;
        chlink = `https://youtube.com/channel/${channelId}`;
        thumbnail = `//vuta-api.illyaz.dev/image/square/${data.videoId}.jpg`;
    }

    let ref: HTMLElement;
    let control: HTMLElement;
    let sizeMd;
    let sizeSm;
    let sizeLg;
    let big_banner = true;
    export let queue = false;

    const onQueue = () => {
        if ($location.pathname != "/queue") {
            navigate("/queue");
        } else {
            navigate(-1);
        }
    };

    $: {
        queue = $location.pathname == "/queue";
    }

    $: if (sizeLg && !$sizeLg) {
        big_banner = false;
    }

    onMount(() => {
        const [unsub, sm, md, lg] = useMedia(document.body);
        sizeSm = sm;
        sizeMd = md;
        sizeLg = lg;
        big_banner = false;
        return () => {
            unsub();
            AudioPlayer.destroy();
        };
    });
</script>

<!-- <Debug>
    <input type="checkbox" bind:checked={big_banner} />
</Debug> -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="header">
    {#if data["videoTitle"] && big_banner && $sizeLg}
        <div class="banner">
            <div
                transition:fly={{ y: 200, opacity: 1, duration: 150 }}
                class="thumbnail"
                style="background-image: url({thumbnail});"
                on:click|capture={() => (big_banner = false)}
            >
                <div class="overlay">
                    <div class="chevon-d">
                        <ChevonD size={32} />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="player" class:bg class:sm={!$sizeLg} bind:this={ref}>
    {#if $playingHIT.id}
        <div
            class="control"
            class:control-mobile={!$sizeLg}
            bind:this={control}
            on:click={(e) => {
                if (!$sizeLg && e.target == control) {
                    onQueue();
                }
            }}
        >
            <div class="control-group">
                <div class="music-label fixed">
                    {#if data["videoTitle"]}
                        <div class="image" class:show={!big_banner}>
                            {#if !big_banner}
                                <div
                                    transition:fly={{
                                        x: -50,
                                        opacity: 1,
                                        duration: 150,
                                    }}
                                    on:click|capture={() => (big_banner = true)}
                                    class="thumbnail"
                                    style="background-image: url({thumbnail});"
                                >
                                    <div class="overlay">
                                        <div class="chevon-u">
                                            <ChevonU size={24} />
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                        <div class="title">
                            <div>
                                <a
                                    href={ytlink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {data.videoTitle}
                                </a>
                            </div>
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
                        </div>
                    {/if}
                </div>
                {#if !$sizeLg}
                    <div class="mobile playbtn">
                        <PlayButton {data} />
                    </div>
                {/if}
                {#if $sizeLg}
                    <div class="main">
                        <div
                            class="btn-group space-x"
                            style="margin-bottom: 5px;"
                        >
                            <button
                                on:click|capture={() => {
                                    if (!disable) AudioPlayer.previous();
                                }}
                                class:disable
                            >
                                <SkBack />
                            </button>
                            <PlayButton
                                {data}
                                disable={!!!data["videoTitle"]}
                            />
                            <button
                                on:click|capture={() => {
                                    if (!disable) AudioPlayer.next();
                                }}
                                class:disable
                            >
                                <SkNext />
                            </button>
                        </div>
                        <ProcessBar disable />
                    </div>
                    <div class="mobile menu">
                        <div style="width: 120px;">
                            <Audio />
                        </div>
                        <button on:click|capture={onQueue}>
                            <List size={24} />
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .bg {
        background: linear-gradient(
            180deg,
            rgba(29, 30, 32, 0.77) 0%,
            #1d1e20 100%
        );
        box-shadow: 0px 12px 20px 20px rgb(0 0 0 / 21%);
        backdrop-filter: blur(3px);
    }
    .chevon-d,
    .chevon-u {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 46px;
        aspect-ratio: 1;
        padding: 2px;
        border-radius: 50%;
        background-color: #292a2b46;
    }
    .chevon-u {
        width: 36px;
    }
    .control-mobile {
        cursor: pointer;
        > * {
            pointer-events: none;
        }
        .mobile {
            > * {
                pointer-events: auto;
            }
        }
    }
    .header {
        position: absolute;
        top: 0;
    }
    .overlay {
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s;
        background-color: #292a2b46;
        opacity: 0;
        &:hover {
            opacity: 1;
        }
    }
    .player {
        position: relative;
        z-index: 1000;
        width: 100%;
        flex: 1;
        height: 100%;
        .control {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            bottom: 0;
            left: 0;
            height: 100%;
            width: 100%;
            padding-bottom: 15px;
            box-shadow: 0px 4px 32px #0000004d;
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
                * {
                    pointer-events: none;
                }

                &:hover {
                    color: white;
                }
            }
            > .control-group {
                position: relative;
                display: flex;
                width: 100%;
                margin: 10px 0 0 0;
                // padding: 0 20px;
                > div:not(.main) {
                    max-width: 380px;
                }
                > div.main {
                    > :global(*) {
                        max-width: 380px;
                        margin: 0 auto;
                    }
                }
                > div:not(.menu) {
                    display: flex;
                    flex-direction: column;
                    // justify-content: center;
                    align-items: center;
                    width: 100%;
                    // overflow: hidden;
                    &.fixed {
                        overflow: hidden;
                    }
                    &.music-label {
                        flex-direction: row;
                    }
                }

                .image {
                    position: relative;
                    width: 0px;
                    height: 50px;
                    overflow: hidden;
                    transition: 0.2s;
                    transition-property: width;
                    flex: none;
                    &.show {
                        width: 50px;
                        margin-left: 10px;
                    }
                    .thumbnail {
                        position: absolute;
                        bottom: 0;
                        border-radius: 6px;
                        width: 50px;
                        height: 50px;
                        aspect-ratio: 1;
                        background-position: center;
                        background-size: cover;
                        box-shadow: 0px 4px 16px #0000004d;
                    }
                }
            }
        }
        .title {
            width: 100%;
            overflow: hidden;
            margin-right: auto;
            padding: 0 10px;
            padding-right: 20px;
            display: flex;
            flex-direction: column;
            color: #5bb3ff;
            font-size: 14px;
            > div {
                display: flex;
                width: 100%;
                overflow: hidden;
            }
            a {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: inherit;
                line-height: 1.55;
            }

            .channel {
                flex-basis: auto;
                font-size: 12px;
                color: white;
                font-weight: 600;
                margin-bottom: 5px;
            }
        }
    }
    .sm {
        .control {
            padding-bottom: 10px;
        }
    }
    .banner {
        position: relative;
        display: flex;
        // justify-content: center;
        align-items: center;

        > .thumbnail {
            position: absolute;
            bottom: 0;
            left: 10px;
            // border-radius: 6px;
            border-radius: 6px 6px 0 0;
            width: 200px;
            height: 200px;
            aspect-ratio: 1;
            background-position: center;
            background-size: cover;
            box-shadow: 0px 4px 16px #0000004d;
        }
    }
    .disable {
        color: #b6b6b665 !important;
        &:hover {
            cursor: auto;
            color: #b6b6b665 !important;
        }
    }
    .menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 10px;
        width: calc(100% - 150px);
        > :last-child {
            margin-right: 15px;
        }
    }
    .playbtn {
        width: auto !important;
        margin-bottom: 0 !important;
        margin-right: 15px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: all;
    }
</style>
