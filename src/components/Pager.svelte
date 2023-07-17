<script lang="ts">
    import { onMount } from "svelte";
    import { all_page, page } from "../libs/store";
    import { Svroller } from "svrollbar";
    import Options from "./Options.svelte";
    let all = [];
    $: {
        all = new Array($all_page).fill("").map((_, i) => {
            return { value: i, render: i + 1 + "" };
        });
    }
</script>

<div class="pager">
    <div class="header">PAGES</div>
    <Svroller width="100%" height="calc(100vh - 420px)">
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
    .pager {
        border-radius: 17px;
        background: #15151661;
        height: 100%;
        max-height: calc(100vh - 300px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .header {
            padding: 0.7rem 1rem;
            font-size: 15px;
        }
        :global(.svlr-contents) {
            scroll-behavior: smooth;
        }
    }
</style>
