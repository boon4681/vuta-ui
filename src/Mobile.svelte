<script lang="ts">
    import NavButton from "./components/NavButton.svelte";
    import Search from "./components/icons/Search.svelte";
    import Home from "./components/icons/Home.svelte";
    import NavBG from "./assets/nav-bg.png";
    import Github from "./components/icons/Github.svelte";
    import Logo from "./components/icons/Logo.svelte";
    import Pager from "./components/Pager.svelte";
    import CommentCard from "./components/CommentCard.svelte";
    import { Route } from "svelte-navigator";
    import { onMount } from "svelte";
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
        useMedia,
    } from "./libs/utils";
    import ChevonL from "./components/icons/ChevonL.svelte";
    import ChevonR from "./components/icons/ChevonR.svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    import PageSearch from "./pages/Search.svelte";
    import PageQueue from "./pages/Queue.svelte";
    import Menu from "./components/icons/Menu.svelte";
    import MobileMenu from "./components/MobileMenu.svelte";
    import List from "./components/icons/List.svelte";
    import MobilePages from "./pages/MobilePages.svelte";
    const location = useLocation();
    const navigate = useNavigate();

    export let result: SearchResult;
    export let searching;
    export let not_found;

    let open = false;

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
<div class="container">
    <Route path="/" primary={false}>
        <div class="header">
            <div class="group" style="padding: 0 0 0.6rem 0;">
                <Logo size={40} />
            </div>
            <div class="flex cx">
                <a
                    href="http://github.com/boon4681/vuta-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="circle-btn" style="--bg:#8c919618">
                        <Github />
                    </div>
                </a>
                <!-- <div class="circle-btn" style="--bg:#8c919618" on:click={()=>{
                    open = true
                }}>
                    <Menu size={24} />
                </div> -->
            </div>
        </div>
        {#await searching}
            <div style="padding-left: 20px;">Loading...</div>
        {:then result}
            {#if result.total > 0}
                {#if result.type == 0}
                    <div class="inner scroll">
                        {#each result.hits as data}
                            <CommentCard
                                {data}
                                on:click={() => {
                                    if ($playingHIT != data) {
                                        $playingHIT = data;
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
                    </div>
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
    </Route>
    <Route primary={false} path="search">
        <PageSearch {result} />
    </Route>
    <Route primary={false} path="queue">
        <PageQueue data={$playingHIT} />
    </Route>
    <Route primary={false} path="pages">
        <MobilePages />
    </Route>
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if !$sizeLg}
    <footer>
        <div class="nav">
            <div
                class="item"
                on:click={() => {
                    if ($location.pathname != "/") {
                        navigate("/", {
                            replace: true,
                        });
                    }
                }}
            >
                <Home size={40} />
                <div>Home</div>
            </div>
            <div
                class="item"
                on:click={() => {
                    if ($location.pathname != "/search") {
                        navigate("/search", {
                            replace: true,
                        });
                    }
                }}
            >
                <Search size={40} />
                <div>Search</div>
            </div>
            <div
                class="item"
                on:click={() => {
                    if ($location.pathname != "/pages") {
                        navigate("/pages", {
                            replace: true,
                        });
                    }
                }}
            >
                <List size={40} />
                <div>Pages</div>
            </div>
        </div>
    </footer>
{/if}

<!-- <MobileMenu {open} /> -->

<style lang="scss">
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        --scroll-bar-bg: transparent;
    }
    .header {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        justify-content: space-between;
        .group {
            display: flex;
            align-items: center;
        }
    }
    .inner {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        height: calc(100% - 140px);
        padding-bottom: 100px;
        padding: 0 20px;
        padding-right: 15px;
        justify-content: center;
        // transition: 0.2s all;
        // padding-bottom: 120px;
    }
    .cx {
        align-items: center;
    }
    footer {
        z-index: 10000;
        width: calc(100% - 20px);
        position: fixed;
        overflow: hidden;
        height: 70px;
        bottom: 0;
        left: 0;
        margin: 0 10px;
        margin-bottom: 7px;
        border-radius: 12px;
        background-color: #17181a;
        // background: linear-gradient(
        //     180deg,
        //     rgb(25 26 26 / 89%) 0%,
        //     rgb(14 14 14 / 84%) 100%
        // );
        box-shadow: 0px 4px 25px 0px rgb(0 0 0 / 40%);
        backdrop-filter: blur(47px);
        .nav {
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 10px;
            .item {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                user-select: none;
                cursor: pointer;
            }
        }
    }
</style>
