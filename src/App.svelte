<script lang="ts">
    import Desktop from "./Desktop.svelte";
    import { onMount } from "svelte";
    import { useMedia } from "./libs/utils";
    import Player from "./components/Player/Player.svelte";
    import { fade, fly } from "svelte/transition";
    import { Svroller } from "svrollbar";
    import { Router } from "svelte-navigator";
    import { AudioPlayer } from "./libs/player";
    import {
        page,
        sort,
        query,
        all_page,
        error,
        playingHIT,
        channel,
    } from "./libs/store";
    import {
        search,
        type Hit,
        type SearchResult,
        comments,
        limit,
    } from "./libs/utils";
    import Mobile from "./Mobile.svelte";
    import Home from "./components/icons/Home.svelte";
    import Search from "./components/icons/Search.svelte";
    import List from "./components/icons/List.svelte";
    const { currentTime, is_load, playing, active } = AudioPlayer;
    let result: SearchResult;
    let searching: Promise<SearchResult> = search();
    let not_found = "";
    let open_queue = false;

    const fetch = async () => {
        // if ($location.pathname == "/search" && $query == "" && !$channel["name"]) return;
        searching = search();
        result = await searching;
        if (result.total == 0) {
            not_found = $query;
        }
        all_page.set(Math.ceil((result.total ?? 1) / 50));
        return result;
    };
    onMount(() => {
        fetch();
        if (window["playingHIT"]) {
            playingHIT.set(window["playingHIT"]);
            AudioPlayer.data.set($playingHIT);
            AudioPlayer.queue.set(
                comments(
                    $playingHIT["videoId"],
                    $playingHIT["highlightedText"],
                    "queue"
                ) as any
            );
            AudioPlayer.redeem();
        }
        document.addEventListener("vuta.search", fetch);
        window.onfocus = () => {
            search().then(async (a) => {
                if (a) {
                    if (result != a) {
                        result = a;
                        if (result.total == 0) {
                            not_found = $query;
                        }
                        all_page.set(Math.ceil((result.total ?? 1) / 50));
                    }
                }
            });
        };
        return () => {
            document.removeEventListener("vuta.search", fetch);
        };
    });
    $: {
        if ($playingHIT) {
            window["playingHIT"] = $playingHIT;
        }
    }

    let sizeSm;
    let sizeMd;
    let sizeLg;
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

<Router>
    {#if $sizeLg}
        <Desktop {result} {searching} {not_found} />
    {:else}
        <Mobile {result} {searching} {not_found} />
    {/if}
    <nav
        class:mobile={!$sizeLg}
        class:playing={$playing || !!$playingHIT["id"]}
    >
        {#if !$sizeLg}
            <img
                class="bg"
                src="https://vuta-music.boon4681.com/image/{$playingHIT[
                    'videoId'
                ]}.jpg"
                alt=""
            />
        {/if}
        <Player
            bg={$sizeLg}
            data={$playingHIT}
            disable={!!!$playingHIT["channelId"]}
        />
    </nav>
</Router>

<style lang="scss">
    nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 97px;
        z-index: 10000;
    }
    nav.mobile {
        bottom: 80px;
        width: calc(100% - 20px);
        position: fixed;
        overflow: hidden;
        height: 70px;
        border-radius: 12px;
        background-color: rgba(10, 47, 114, 0.53);
        background: rgba(30, 30, 31, 0.913);
        backdrop-filter: blur(3px);
        margin: 0 10px;
        margin-bottom: 5px;

        opacity: 0;
        user-select: none;
        pointer-events: none;
        transform: translateY(100px);
        transition: 0.21s;

        .bg {
            z-index: 0;
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: saturate(4) blur(100px) hue-rotate(323deg) contrast(4)
                brightness(3) contrast(0.7);
        }
        &.playing {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0px);
        }
    }
</style>
