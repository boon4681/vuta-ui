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

<div class="menu" class:open>
    <!-- <div class="box">
        Credit
        <div class="box">
            Frontend by
            <div>boon4681</div>
        </div>
        <div class="box">
            Vtuber api by
            <div>illyaz</div>
        </div>
    </div> -->
    <a
        href="/donate"
        target="_blank"
        rel="noopener noreferrer"
        class="donate"
        style="width: 100%;"
    >
        <div>Donate ❤️</div>
    </a>
</div>

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
        transition: 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
        padding: 0 20px;
        padding-top: 70px;

        &.open {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0px);
        }
    }
    .box {
        padding: 20px 20px;
        border: white 1px solid;
        border-radius: 17px;
        margin: 20px 0;
    }
</style>
