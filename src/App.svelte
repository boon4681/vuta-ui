<script lang="ts">
    import { onMount } from "svelte";
    import CommentCard from "./components/CommentCard.svelte";
    import Nav from "./components/Nav.svelte";
    import Player from "./components/Player/Player.svelte";
    import Queue from "./components/Player/Queue.svelte";
    import Window from "./components/Window.svelte";
    import { AudioPlayer } from "./libs/player";
    import { page, sort, query, all_page, error } from "./libs/store";
    import { search, type Hit, type SearchResult } from "./libs/utils";
    import ArtistCard from "./components/ArtistCard.svelte";
    import Pager from "./components/Pager.svelte";
    // p.set("channelId", "UC7cZJOAJZD1W4aOfqnRgWiA");
    let result: SearchResult;
    let playingHIT: Hit;
    let open_queue = false;
    let searching: Promise<SearchResult> = search();
    let not_found = "";
    const fetch = async () => {
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
            playingHIT = window["playingHIT"];
            AudioPlayer.data.set(playingHIT);
        }
        document.addEventListener("vuta.search", fetch);
        return () => {
            document.removeEventListener("vuta.search", fetch);
        };
    });
    $: {
        if (playingHIT) {
            window["playingHIT"] = playingHIT;
        }
    }
</script>

<Nav
    on:click={() => {
        fetch();
    }}
/>
<div class="container" class:play={playingHIT}>
    <div class="inner space-y">
        {#await searching}
            Loading...
        {:then result}
            <!-- <Card data={result.hits[0]} /> -->
            <!-- <div style="width: 100%;position:sticky;top:0px;padding: 10px 0;background-color: #242424;z-index:30000">
                <Pager />
            </div> -->
            {#if result.total > 0}
                {#if result.type == 0}
                    <div class="title box">Comments</div>
                    {#each result.hits as data}
                        <CommentCard
                            {data}
                            on:click={() => {
                                if (playingHIT != data) {
                                    playingHIT = data;
                                    console.log("HIT");
                                    error.set("");
                                    console.log(data);
                                    AudioPlayer.getMusic(data)
                                        .then(() => {
                                            console.log("PLAY");
                                            AudioPlayer.play();
                                        })
                                        .catch((e) => {
                                            error.set(e.message);
                                        });
                                }
                                open_queue = true;
                            }}
                        />
                    {/each}
                {:else if result.type == 1}
                    <div class="title box">Artists</div>
                    {#each result.hits as data}
                        <ArtistCard {data} />
                    {/each}
                {/if}
            {:else}
                <div
                    style="display: flex;flex-direction:column;align-items: center;user-select:none;"
                >
                    <div style="font-weight:600;font-size:30px">No Result</div>
                    <img
                        style="width: 100%;max-width:200px"
                        src="yomi-cry.png"
                        alt=""
                    />
                    <div style="font-weight:600;font-size:20px;max-width:250px">
                        Not found this query:
                    </div>
                    <div style="font-weight:600;font-size:20px;">
                        "{not_found}"
                    </div>
                </div>
            {/if}
        {/await}
    </div>
</div>
<footer>
    {#if result && playingHIT}
        <Player bind:queue={open_queue} data={playingHIT} />
    {/if}
</footer>

<!-- <div>
    {#if result}
        <Player data={result.hits[0]} />
    {/if}
    {#if result}
        <Window>
            <Player data={result.hits[0]} />
        </Window>
    {/if}
</div> -->

<style lang="scss">
    .container.play {
        margin-bottom: 80px;
    }
    .container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding-top: 20px;
        padding-bottom: 50px;
        > .inner {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            > .title {
                width: 100%;
                font-size: 30px;
                font-weight: 600;
            }
        }
    }
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 10000;
    }
</style>
