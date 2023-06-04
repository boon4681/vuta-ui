<script lang="ts">
    import { channel } from "../libs/store";
    import { numberFormat, type ArtistHit } from "../libs/utils";
    import ExternalLink from "./icons/ExternalLink.svelte";

    export let data: ArtistHit;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card">
    <img class="bg" src={data.thumbnail} alt="" />
    <img class="thumbnail" src={data.thumbnail} alt="" />
    <div class="info">
        <div
            class="bold underline"
            on:click={() => {
                channel.set({ name: data.title, id: data.id });
                document.dispatchEvent(new Event("vuta.search"))
            }}
        >
            {data.title}
        </div>
        <div class="sm">
            {numberFormat(data.subscriberCount)} subscribers
            <span>/</span>
            {data.videoCount} videos
        </div>
    </div>
    <a
        class="external"
        href="https://youtube.com/channel/{data.id}"
        target="_blank"
        rel="noopener noreferrer"
    >
        <ExternalLink />
    </a>
</div>

<style lang="scss">
    .card {
        position: relative;
        width: 100%;
        display: flex;
        overflow: hidden;
        padding: 10px 20px;
        border-radius: 15px;
        user-select: none;
        .external {
            display: flex;
            position: absolute;
            right: 12px;
            top: 7px;
            padding: 4px;
            height: fit-content;
            cursor: pointer;
            color: #ffffff4d;
            transition: 0.2s;
            &:hover {
                color: white;
            }
        }
        &:before {
            z-index: -3;
            content: "";
            position: absolute;
            width: 0%;
            height: 100%;
            top: 0;
            left: 0;
            box-shadow: 0px 0px 100vw 100px white, 0px 0px 100vw 0px white;
            transition: 0.2s cubic-bezier(0.4, 0, 0.6, 1);
        }
        &:hover {
            &:before {
                box-shadow: 0px 0px 100vw 100px white, 0px 0px 100vw 100px white;
            }
        }
        .info {
            display: flex;
            flex-direction: column;
            margin: auto 0;
            .underline {
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
            .bold {
                font-weight: 500;
            }
            .sm {
                font-size: 14px;
            }
        }
        .thumbnail {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            margin-right: 20px;
            box-shadow: 0px 0px 20px 0px #0000004d;
        }
        .bg {
            z-index: -1;
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            // filter: brightness(0.7) contrast(4) brightness(3) blur(100px);
            // filter: saturate(5) hue-rotate(323deg) blur(100px) brightness(0.7) contrast(4);
            filter: saturate(4) hue-rotate(323deg) contrast(4) brightness(3)
                blur(100px);
        }
    }
</style>
