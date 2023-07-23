<script lang="ts">
    import { onMount } from "svelte";

    export let open;
    const overflow_handler = () => {
        if (open) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }
    };
    onMount(() => {
        overflow_handler();
    });
    $: open, overflow_handler();
</script>

<div class="menu" class:open />

<style lang="scss">
    .menu {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        width: 100dvw;
        height: 100dvh;
        background-color: #17181a;
        z-index: 1000000;
        opacity: 0;
        pointer-events: none;
        transform: translateY(100px);
        transition: 0.2s;
        padding: 0 20px;
        padding-top: 100px;

        &.open {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0px);
        }
    }
</style>
