<script>
    import { Stretch } from "svelte-loading-spinners";
</script>

<div class="mini">
    <div class="scale">
        <Stretch size={40} unit="px" duration="1s" color="#31d179" />
    </div>
</div>

<style lang="scss">
    .mini {
        position: relative;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        .scale {
            transform: scale(0.4);
            position: absolute;
        }
    }
</style>
