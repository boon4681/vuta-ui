<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import ChevonL from "./icons/ChevonL.svelte";
    import Search from "./icons/Search.svelte";
    import { channel, page, query, sort } from "../libs/store";
    import X from "./icons/X.svelte";
    import Pager from "./Pager.svelte";
    import InputRadio from "./InputRadio.svelte";
    import { onMount } from "svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    const location = useLocation();
    const navigate = useNavigate();

    let search_modal = false;
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

    $: {
        search_modal = $location.pathname == "/search";
    }

    onMount(() => {
        check($channel);
        const unsub = channel.subscribe(check);
        return () => {
            unsub();
        };
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="nav">
    <div
        class="home"
        on:click={() => {
            query.set("");
            sort.set(1);
            page.set(0);
            channel.set({});
            document.dispatchEvent(new Event("vuta.search"));
        }}
    >
        <img class="logo" src="yomi-full.png" alt="" />
        <div style="font-weight:600;font-size:20px">VUtau</div>
    </div>
    <div style="width: 100%;">
        <!-- <Pager /> -->
    </div>
    <div
        style="position: relative;display:flex;justify-content:center;align-items:center;"
    >
        <a
            href="/donate"
            target="_blank"
            rel="noopener noreferrer"
            class="donate"
        >
            <div>Donate ❤️</div>
        </a>
        <button
            class:x={search_modal}
            on:click={() => {
                if (!search_modal) {
                    navigate("/search");
                } else {
                    navigate(-1);
                }
            }}
        >
            {#if !search_modal}
                <Search size={32} />
            {:else}
                <X size={32} />
            {/if}
        </button>
    </div>
</div>
<div style="padding-bottom: 10px;">
    <Pager />
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if search_modal}
    <div
        class:open={search_modal}
        class="modal"
        transition:fade={{ duration: 150 }}
    >
        <div
            class="close"
            on:click|capture={(e) => {
                navigate(-1);
                search_modal = false;
            }}
        />
        <div class="top">
            <div class="home">
                <img class="logo" src="yomi-full.png" alt="" />
                <div class="title" style="font-weight:600;font-size:20px">
                    VUtau
                </div>
            </div>
        </div>
        <div class="inner">
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
                    sort.set(e.detail);
                }}
            />
            <div class="search">
                <div class="svg">
                    <Search />
                </div>
                {#if $channel["name"]}
                    <div class="tag">
                        <span>ch:</span>
                        {$channel["name"]}
                        <div class="x" on:click={() => channel.set({})}>
                            <X size={12} />
                        </div>
                    </div>
                {/if}
                <input
                    class:tag={$channel["name"]}
                    on:input|capture={(e) => query.set(e.currentTarget.value)}
                    on:keydown|capture={(e) => {
                        if (e.key == "Enter") {
                            query.set(e.currentTarget.value);
                            document.dispatchEvent(
                                new CustomEvent("vuta.search")
                            );
                            navigate(-1);
                            search_modal = false;
                        }
                    }}
                    value={$query}
                    type="text"
                    placeholder="Search"
                />
            </div>
            <!-- <select
                value={$sort}
                on:change|capture={(e) => sort.set(e.currentTarget.value)}
            >
                <option value="newest">Newest</option>
                <option value="relevance">Relevance</option>
                <option value="oldest">Oldest</option>
            </select> -->
            <button class="search-btn" on:click> Search </button>
        </div>
    </div>
{/if}

<style lang="scss">
    .x {
        position: relative;
        z-index: 1999999;
    }
    .home {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .title {
        font-size: 30px;
    }
    .top {
        // margin-top: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
    button {
        color: inherit;
    }
    .donate {
        white-space: nowrap;
        font-weight: 600;
        font-size: 16px;
        padding-left: 15px;
        padding-right: 15px;
        width: 100%;
        border-radius: 8px;
        height: 40px;
        background: #3772f1;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }
    .search-btn {
        font-weight: 600;
        font-size: 16px;
        padding-left: 15px;
        width: 100%;
        border-radius: 8px;
        height: 45px;
        background: #3772f1;
        margin-top: 20px;
    }
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(
            180deg,
            rgb(36, 40, 43) 10%,
            rgba(0, 0, 0, 0.568) 72%,
            rgba(0, 0, 0, 0.432) 100%
        );
        padding: 0 20px;
        z-index: 999999;
        .inner {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
    }
    .nav {
        // display: grid;
        // grid-template-columns: 100px auto 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        padding-right: 10px;
    }
    .logo {
        margin-left: -15px;
        width: 70px;
        aspect-ratio: 1;
    }
    .close {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .search {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border-radius: 8px;
        height: 45px;
        width: 100%;
        color: #242424;

        .svg {
            display: flex;
            align-items: center;
            position: absolute;
            margin: 0 12px;
            pointer-events: none;
        }

        input {
            color: inherit;
            font-weight: 600;
            font-size: 14px;
            padding-left: 48px;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            background-color: transparent;
            &.tag {
                padding-left: 8px;
            }
        }
        div.tag {
            position: relative;
            margin-left: 48px;
            max-width: 100px;
            padding: 2px 8px;
            padding-right: 20px;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            border-radius: 15px;
            transition: 0.25s;
            border: 1px #00000081 solid;
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
    }
</style>
