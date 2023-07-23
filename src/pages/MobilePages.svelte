<script lang="ts">
    import { useLocation, useNavigate } from "svelte-navigator";

    import { onMount } from "svelte";
    import { all_page, page } from "../libs/store";
    import { Svroller } from "svrollbar";
    import Options from "../components/Options.svelte";
    import ChevonD from "../components/icons/ChevonD.svelte";
    import ChevonL from "../components/icons/ChevonL.svelte";
    const navigate = useNavigate();
    let all = [];

    $: if ($all_page) {
        all = new Array(100).fill("").map((_, i) => {
            return { value: i, render: i + 1 + "" };
        });
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="back-tab">
    <button
        style="width: 60px;height:60px"
        on:click={() => {
            navigate(-1);
        }}
    >
        <ChevonL size={20} />
    </button>
</div>
<div class="header">PAGES</div>
<div class="container">
    <Svroller width="100%" height="100%">
        <Options
            value={$page}
            options={all}
            on:change={(e) => {
                page.set(e.detail);
                document.dispatchEvent(new Event("vuta.search"));
            }}
        />
        <!-- {#each all as page (page.value)}
            <div class="item">
                {page.render}
            </div>
        {/each} -->
    </Svroller>
</div>

<style lang="scss">
    .container {
        position: relative;
        width: 100%;
        height: calc(100% - 190px);
        --scroll-bar-bg: transparent;
        background: #15151661;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        :global(.svlr-contents) {
            scroll-behavior: smooth;
        }
    }
    .header {
        padding: 0.7rem 1rem;
        font-size: 15px;
    }
    .back-tab {
        display: flex;
        align-items: center;
        background-color: #222426;
    }
</style>
