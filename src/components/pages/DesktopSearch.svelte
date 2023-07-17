<script lang="ts">
    import { navigate } from "svelte-navigator";
    import ChevonL from "../icons/ChevonL.svelte";

    export let value = "";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="search">
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
        {value}
        autocomplete="off"
        autocorrect="false"
    />
</div>

<style lang="scss">
    .search {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
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
            background-color: rgba(52, 55, 58, 0.38);
            padding: 20px;
            padding-left: 60px;
            color: rgb(189, 189, 189);
            font-size: 1rem;
        }
        &:has(:focus) {
            color: white;
            .ico {
                color: rgb(167, 167, 167);
            }
        }
    }
</style>
