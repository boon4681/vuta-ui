<script>
    import { onMount } from "svelte";
    import { all_page, page } from "../libs/store";
    import Select from "./Select.svelte";
    import ChevonL from "./icons/ChevonL.svelte";
    import ChevonR from "./icons/ChevonR.svelte";

    let all = [];
    $: {
        all = new Array($all_page).fill("").map((_, i) => {
            return { value: i, render: i + 1 + "" };
        });
    }
</script>

<div class="pager">
    <button
        class:disable={$page == 0}
        on:click={() => {
            if ($page > 0) {
                page.set($page - 1);
                document.dispatchEvent(new Event("vuta.search"));
            }
        }}
    >
        <ChevonL />
    </button>
    <Select
        value={$page}
        options={all}
        on:change={(e) => {
            page.set(e.detail);
            document.dispatchEvent(new Event("vuta.search"));
        }}
    />
    <button
        class:disable={$page == $all_page - 1}
        on:click={() => {
            if ($page < $all_page - 1) {
                page.set($page + 1);
                document.dispatchEvent(new Event("vuta.search"));
            }
        }}
    >
        <ChevonR />
    </button>
</div>

<style lang="scss">
    .pager {
        display: flex;
        padding: 0 20px;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            padding: 8px;
            color: #ffffff81;
            transition: 0.25s;
            width: 36px;
            height: 36px;
            border: 1px #ffffff81 solid;
            background: transparent;
            * {
                pointer-events: none;
            }

            &:hover {
                color: white;
            }
        }
        .disable {
            cursor: not-allowed;
            opacity: 0.5;
            color: #ffffff81 !important;
        }
    }
</style>
