<script lang="ts">
    import NavButton from "./components/NavButton.svelte";
    import Search from "./components/icons/Search.svelte";
    import Home from "./components/icons/Home.svelte";
    import NavBG from "./assets/nav-bg.png";
    import Github from "./components/icons/Github.svelte";
    import Logo from "./components/icons/Logo.svelte";
    import Pager from "./components/Pager.svelte";
    import CommentCard from "./components/CommentCard.svelte";
    import { Svroller } from "svrollbar";
    import { Router, Link, Route } from "svelte-navigator";
    import { onMount } from "svelte";
    import { AudioPlayer } from "./libs/player";
    import {
        page,
        sort,
        query,
        all_page,
        error,
        playingHIT,
    } from "./libs/store";
    import {
        search,
        type Hit,
        type SearchResult,
        comments,
        limit,
    } from "./libs/utils";
    import ArtistCard from "./components/ArtistCard.svelte";
    import ChevonL from "./components/icons/ChevonL.svelte";
    import ChevonR from "./components/icons/ChevonR.svelte";
    import Player from "./components/Player/Player.svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    import DesktopSearch from "./components/pages/DesktopSearch.svelte";
    const location = useLocation();
    const navigate = useNavigate();

    let result: SearchResult;
    let searching: Promise<SearchResult> = search();
    let not_found = "";
    let open_queue = false;

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
                if (result != a) {
                    result = a;
                    if (result.total == 0) {
                        not_found = $query;
                    }
                    all_page.set(Math.ceil((result.total ?? 1) / 50));
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

    const on_scroll = (
        e: UIEvent & {
            currentTarget: EventTarget & HTMLDivElement;
        }
    ) => {
        const box = e.currentTarget.getBoundingClientRect();
        const top = e.currentTarget.scrollTop;
        const height = e.currentTarget.scrollHeight - box.height;
        if (top < 90) {
            e.currentTarget.style.top = -top + "px";
        } else if (top > height / 3) {
            e.currentTarget.style.top = -200 * (top / height) + "px";
        } else if (top > 90) {
            e.currentTarget.style.top = -90 + "px";
        }
    };
</script>

<div class="desktop">
    <div class="nav-bg" style="background-image: url({NavBG});" />
    <nav>
        <div class="header">
            <div class="group" style="padding: 0 0 0.6rem 0;">
                <Logo size={40} />
            </div>
            <a
                href="http://github.com/boon4681/vuta-ui"
                target="_blank"
                rel="noopener noreferrer"
            >
                <div class="circle-btn" style="--bg:#8c919618">
                    <Github />
                </div>
            </a>
        </div>
        <div>
            <NavButton
                active={$location.pathname == "/"}
                on:click={() => {
                    if ($location.pathname != "/") {
                        navigate("/", {
                            replace: true,
                        });
                        page.set(0);
                        document.dispatchEvent(new Event("vuta.search"));
                    }
                }}
            >
                <Home slot="icon" size={36} />
                <div slot="text">HOME</div>
            </NavButton>
        </div>
        <div style="margin-bottom:50px">
            <NavButton
                active={$location.pathname == "/search"}
                on:click={() => {
                    if ($location.pathname != "/search") {
                        navigate("/search", {
                            replace: true,
                        });
                    }
                }}
            >
                <Search slot="icon" size={36} />
                <div slot="text">SEARCH</div>
            </NavButton>
        </div>
        <Pager />
    </nav>
    <div class="container">
        <Route path="/" rimary={false}>
            <div class="title">
                <div>Comments</div>
                <div class="flex">
                    <button
                        class="circle-btn page-btn"
                        class:disable={$page == $all_page - 1}
                        on:click={() => {
                            if ($page > 0) {
                                page.set($page - 1);
                                document.dispatchEvent(
                                    new Event("vuta.search")
                                );
                            }
                        }}
                    >
                        <ChevonL />
                    </button>
                    <button
                        class="circle-btn page-btn"
                        class:disable={$page == $all_page - 1}
                        on:click={() => {
                            if ($page < $all_page - 1) {
                                page.set($page + 1);
                                document.dispatchEvent(
                                    new Event("vuta.search")
                                );
                            }
                        }}
                    >
                        <ChevonR />
                    </button>
                </div>
            </div>
            {#await searching}
                <div style="padding-left: 20px;">Loading...</div>
            {:then result}
                {#if result.total > 0}
                    {#if result.type == 0}
                        <div class="inner scroll" on:scroll={on_scroll}>
                            {#each result.hits as data}
                                <CommentCard
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
                                        open_queue = true;
                                    }}
                                />
                            {/each}
                        </div>
                    {/if}
                {:else}
                    <div
                        style="display: flex;flex-direction:column;align-items: center;user-select:none;"
                    >
                        <div style="font-weight:600;font-size:30px">
                            No Result
                        </div>
                        <img
                            style="width: 100%;max-width:200px"
                            src="yomi-cry.png"
                            alt=""
                        />
                        <div
                            style="font-weight:600;font-size:20px;max-width:250px"
                        >
                            Not found this query:
                        </div>
                        <div style="font-weight:600;font-size:20px;">
                            "{not_found}"
                        </div>
                    </div>
                {/if}
            {/await}
        </Route>
        <Route primary={false} path="search">
            <DesktopSearch />
        </Route>
    </div>
</div>
<footer>
    <Player data={$playingHIT} disable={!!$playingHIT["channelId"]} />
</footer>

<style lang="scss">
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 97px;
        z-index: 10000;
        background: linear-gradient(
            180deg,
            rgba(29, 30, 32, 0.77) 0%,
            #1d1e20 100%
        );
        box-shadow: 0px 12px 20px 20px rgb(0 0 0 / 21%);
        backdrop-filter: blur(3px);
    }
    .page-btn {
        color: white;
        border: 1px rgba(255, 255, 255, 0.603) solid;
        border-radius: 999px;
        margin-left: 10px;
        padding: 0.25rem;
        width: 40px;
        height: 40px;
    }
    .desktop {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: flex-end;
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        --scroll-bar-bg: transparent;
    }
    nav {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: #1e1f20b8;
        max-width: 300px;
        width: 100%;
        height: 100%;
        // height: calc(100% - 97px);
        box-shadow: -5px 0 40px 0 #00000040;
        padding: 20px 10px;
        padding-bottom: 120px;
        // padding-top: 60px;
        backdrop-filter: blur(6px);
        color: #a0a0a0;
        > div {
            margin-bottom: 0.5rem;
        }
    }
    .header {
        display: flex;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 25px;
        padding: 0.5rem 0.7rem;
        padding-left: 0.25rem;
        padding-right: 0;
        justify-content: space-between;
        .group {
            display: flex;
            align-items: center;
        }
    }
    .nav-bg {
        position: fixed;
        left: 0;
        top: 0;
        max-width: 300px;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
    }
    .inner {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(372px, 1fr));
        gap: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
        padding-top: 10px;
        // transition: 0.2s all;
        // padding-bottom: 120px;
    }
    .title {
        font-size: 32px;
        padding: 20px 20px;
        position: sticky;
        top: 0;
        background-color: #17181a61;
        z-index: 1000;
        width: 100%;
        backdrop-filter: blur(1px);
        display: flex;
        justify-content: space-between;

        // backdrop-filter: blur(6px);
    }
    .disable {
        cursor: not-allowed;
        opacity: 0.5;
        color: #ffffff81 !important;
    }
</style>
