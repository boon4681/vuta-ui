<script lang="ts">
    import { onMount } from "svelte";
    import { format, format_time, useMedia, type Hit } from "../libs/utils";
    import Comment from "./Comment.svelte";
    import Play from "./icons/Play.svelte";

    export let data: Hit;

    let sizeMd;
    let sizeSm;
    let sizeLg;
    const ytlink = `https://youtube.com/watch?v=${data.videoId}`;
    const chlink = `https://youtube.com/channel/${data.channelId}`;

    let width = window.innerWidth;
    let wow = (width - 400)/4;

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
    <!-- <div class="date">
        <div>
            {new Date(data.videoPublishDate).toLocaleDateString()}
        </div>
        <div>
            {format_time(new Date(data.videoPublishDate).getTime() / 1000)}
        </div>
    </div> -->
    <div class="header">
        <div class="w-full" class:full={!$sizeLg}>
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
        </div>
        <div class="title">
            <div>
                <a href={ytlink} target="_blank" rel="noopener noreferrer">
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
    </div>
    <div>
        <Comment videoId={data.videoId} comment={data.highlightedText} />
    </div>
</div>

<style lang="scss">
    .card {
        position: relative;
        border-radius: 8px;
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
        background: #202224;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12);
        > .date {
            position: absolute;
            top: 2px;
            right: 1rem;
            display: flex;
            font-weight: 500;
            font-size: 14px;
            > :first-child {
                margin-right: 6px;
            }
            > :last-child {
                color: #43b581;
            }
        }

        > .header {
            display: flex;
            color: #5bb3ff;
            width: 100%;
            div:has(.thumbnail) {
                // max-width: 300px;
                &.full {
                    max-width: 100%;
                }
            }
            .thumbnail {
                position: relative;
                border-radius: 19px;
                // aspect-ratio: 320/180;
                width: 100%;
                // padding-bottom: 60.52%;
                padding-bottom: 47%;
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
                    &:hover {
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
                margin-left: 15px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
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
    }
</style>
