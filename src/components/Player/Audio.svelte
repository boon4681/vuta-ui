<script lang="ts">
    import { onMount } from "svelte";
    import { AudioPlayer, load_volume } from "../../libs/player";
    import Slider from "../Slider.svelte";
    import Volume1 from "../icons/Volume1.svelte";
    import Volume2 from "../icons/Volume2.svelte";
    import VolumeX from "../icons/VolumeX.svelte";
    export let volume: number | undefined = undefined;

    $: if (volume != undefined) AudioPlayer.setVolume(volume / 10);
    onMount(() => {
        volume = load_volume() * 10;
        AudioPlayer.setVolume(volume / 10);
    });
</script>

<div class="audio">
    <div class="ico">
        {#if volume > 50}
            <Volume2 size={20} />
        {:else if volume > 0}
            <Volume1 size={20} />
        {:else}
            <VolumeX size={20} />
        {/if}
    </div>
    <Slider mode={"horizontal"} bind:value={volume} on:change max={10} />
    <!-- <div class="volume">
        <Slider mode={"vertical"} bind:value={volume} on:change />
    </div> -->
</div>

<style lang="scss">
    .audio {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .ico {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 5px;
        }
        // .volume {
        //     padding: 0.5rem;
        //     display: flex;
        //     flex-direction: column;
        //     position: absolute;
        //     height: 120px;
        //     width: 50px;
        //     background-color: #222324cc;
        //     bottom: 40px;
        //     backdrop-filter: blur(5px);
        //     border-radius: 8px;
        //     box-shadow: 0px 1px 8px 0px rgb(0 0 0 / 18%);
        // }
    }
</style>
