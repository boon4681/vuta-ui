<script lang="ts">
    import { format, format_time, type Hit } from "../libs/utils";
    import Comment from "./Comment.svelte";
    import Play from "./icons/Play.svelte";

    export let data: Hit;

    const ytlink = `https://youtube.com/watch?v=${data.videoId}`;
    const chlink = `https://youtube.com/channel/${data.channelId}`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card">
    <div class="date">
        <div>
            {new Date(data.videoPublishDate).toLocaleDateString()}
        </div>
        <div>
            {format_time(new Date(data.videoPublishDate).getTime() / 1000)}
        </div>
    </div>
    <div class="header">
        <div>
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
    <div>
        <Comment videoId={data.videoId} comment={data.highlightedText} />
    </div>
</div>

<style lang="scss">
    .card {
        position: relative;
        border-radius: 8px;
        // border: 1px solid white;
        background-color: #36393f;
        width: 100%;
        box-shadow: 0px 4px 32px #0000004d;
        padding: 1rem;
        padding-top: 1.5rem;
        // box-shadow: 0 16px 24px 2px rgba(29, 17, 51, 0.04),
        //     0 6px 32px 4px rgba(9, 32, 77, 0.12),
        //     0 8px 12px -5px rgba(29, 17, 51, 0.12);

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
            .thumbnail {
                position: relative;
                border-radius: 8px;
                aspect-ratio: 320/180;
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
