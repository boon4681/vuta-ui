<script lang="ts">
    import ChevonL from "../components/icons/ChevonL.svelte";
    import InputRadio from "../components/InputRadio.svelte";
    import { fade, fly } from "svelte/transition";
    import {
        page,
        sort,
        query,
        all_page,
        error,
        playingHIT,
        channel,
    } from "../libs/store";
    import { onMount } from "svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    import { useMedia, type SearchResult } from "../libs/utils";
    import CommentCard from "../components/CommentCard.svelte";
    import { AudioPlayer } from "../libs/player";
    import CommentSearchCard from "../components/CommentSearchCard.svelte";
    import ArtistCard from "../components/ArtistCard.svelte";
    import X from "../components/icons/X.svelte";
    const location = useLocation();
    const navigate = useNavigate();

    export let result: SearchResult;

    let disable_artist_search = false;

    const check = (e) => {
        if (e["name"]) {
            disable_artist_search = true;
            sort.set(1);
            query.set("");
            // channel.set({});
        } else {
            disable_artist_search = false;
        }
    };

    onMount(() => {
        check($channel);
        const unsub = channel.subscribe(check);
        return () => {
            unsub();
        };
    });

    const on_scroll = (
        e: UIEvent & {
            currentTarget: EventTarget & HTMLDivElement;
        }
    ) => {
        if (!$sizeLg) return;
        const box = e.currentTarget.getBoundingClientRect();
        const top = e.currentTarget.scrollTop;
        const height = e.currentTarget.scrollHeight - box.height;
        e.currentTarget.style.top = -210 * (top / height) + "px";
    };

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="search" class:pad={$channel["name"]}>
    <div
        class="ico"
        on:click={() => {
            navigate("/", {
                replace: true,
            });
        }}
    >
        <ChevonL />
    </div>
    <input
        type="text"
        placeholder="Search..."
        bind:value={$query}
        on:input={() => {
            document.dispatchEvent(new Event("vuta.search"));
        }}
        autocomplete="off"
        autocorrect="false"
    />
    {#if $channel["name"]}
        <div class="tag">
            <span>ch:</span>
            {$channel["name"]}
            <div class="x" on:click={() => channel.set({})}>
                <X size={12} />
            </div>
        </div>
    {/if}
</div>
<div class="search-tags">
    <InputRadio
        value={$sort}
        options={[
            {
                value: 2,
                render: "Artist",
                disable: disable_artist_search,
            },
            { value: 1, render: "Newest" },
            { value: 0, render: "Relevance" },
            { value: -1, render: "Oldest" },
        ]}
        on:change={(e) => {
            if (e.detail == 2 && $query == "") {
                result = {
                    type: 0,
                    took: 0,
                    total: 0,
                    hits: [],
                };
            }
            sort.set(e.detail);
            document.dispatchEvent(new Event("vuta.search"));
        }}
    />
</div>
<div class="container" class:sm={!$sizeLg}>
    {#if result}
        {#if result.total > 0}
            <div class="wrap scroll" on:scroll={on_scroll}>
                <div class="inner">
                    {#if $sort == 2}
                        {#each result.hits as data}
                            <ArtistCard {data} />
                        {/each}
                    {/if}
                    {#if $sort != 2 && result.type == 0}
                        {#each result.hits as data}
                            <CommentSearchCard
                                {data}
                                on:click={() => {
                                    if ($playingHIT != data) {
                                        $playingHIT = data;
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
                                }}
                            />
                        {/each}
                    {/if}
                </div>
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    .wrap {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
        min-height: 100%;
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        --scroll-bar-bg: transparent;
        &.sm {
            height: calc(100% - 185px);
        }
    }
    .search {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 100000;

        .ico {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
            padding: 10px;
            color: rgb(122, 122, 122);
            transition: 0.2s;
            cursor: pointer;
            &:hover {
                color: rgb(167, 167, 167);
            }
        }
        input {
            width: 100%;
            background-color: #222426;
            padding: 20px;
            padding-left: 60px;
            color: rgb(189, 189, 189);
            font-size: 1rem;
        }
        &.pad {
            input {
                padding-left: 160px;
            }
        }
        &:has(:focus) {
            color: white;
            .ico {
                color: rgb(167, 167, 167);
            }
        }
    }
    .search-tags {
        position: relative;
        display: flex;
        background-color: #17181a;
        padding: 0 20px;
        z-index: 100000;
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .inner {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding-bottom: 50px;
        padding-top: 10px;
        > :global(*) {
            margin-bottom: 20px;
        }
        // transition: 0.2s all;
        // padding-bottom: 120px;
    }
    div.tag {
        position: absolute;
        margin-left: 48px;
        width: 100px;
        padding: 2px 8px;
        padding-right: 20px;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        border-radius: 15px;
        transition: 0.25s;
        border: 1px #dbdbdb81 solid;
        .x {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            top: 4px;
            right: 4px;
            width: 14px;
            height: 14px;
            color: #242424;
            background-color: #dee5e9;
            cursor: pointer;
            transition: 0.1 ease-in-out;
            &:hover {
                color: #242424;
                background-color: #abd2e9;
            }
        }
    }
</style>
