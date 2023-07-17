<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { useMedia, type Hit } from "../../libs/utils";
    import Play from "../icons/Play.svelte";
    import Pause from "../icons/Pause.svelte";
    import { AudioPlayer, playerRequest } from "../../libs/player";
    import { Circle } from "svelte-loading-spinners";
    import { error } from "../../libs/store";
    const { duration, currentTime, is_load, playing } = AudioPlayer;
    export let data: Hit;
    export let big: boolean = false;
    export let disable: boolean = false;

    let sizeMd;
    let sizeSm;
    let sizeLg;

    // let src = playerRequest(videoId)

    onMount(() => {
        const [unsub, sm, md, lg] = useMedia(document.body);
        sizeSm = sm;
        sizeMd = md;
        sizeLg = lg;
        return () => {
            unsub();
            AudioPlayer.destroy();
        };
    });
</script>

{#if !$is_load && !$error}
    <button
        class="initial"
        class:play={!playing}
        class:pause={playing}
        class:big
        class:disable
        on:click|capture={() => {
            if (data["videoTitle"]) {
                AudioPlayer.getMusic(data).then(async (url) => {
                    playing.set(!$playing);
                    if ($playing) {
                        if (AudioPlayer.music != url) {
                            AudioPlayer.music = url;
                        }
                        AudioPlayer.play();
                    } else {
                        AudioPlayer.pause();
                    }
                });
            }
        }}
    >
        <div>
            {#if $playing}
                <Pause size={22} />
            {:else}
                <Play size={22} />
            {/if}
        </div>
    </button>
{:else}
    <Circle size={big ? 60 : 40} color="#FFFFFF" unit="px" duration="1s" />
{/if}

<style lang="scss">
    .big {
        width: 60px;
        margin: 0 10px;
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

        &.play,
        &.pause {
            position: relative;
            // background-color: #292a2ba8;
            background-color: white;
            color: #2a2c2e;
            * {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                transform: translateY(1px);
            }
            &:hover {
                background-color: #ffffffd2;
                color: #2a2c2e;
            }
        }
        &.disable {
            cursor: auto;
            background-color: #b6b6b665;
            &:hover {
                background-color: #b6b6b665;
            }
        }
        &.play {
            > * {
                transform: translateX(2px) translateY(1px);
            }
        }
        * {
            pointer-events: none;
        }

        &:hover {
            color: white;
        }
    }
</style>
