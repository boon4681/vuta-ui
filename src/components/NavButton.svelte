<script lang="ts">
    export let icon = true;
    export let active = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button class="button" class:icon class:active on:click>
    <div class="ico">
        <slot name="icon" />
    </div>
    <div class="text">
        <slot name="text" />
    </div>
</button>

<style lang="scss">
    .button {
        font-size: 1rem;
        width: 100%;
        padding: 0.5rem 0.7rem;
        border-radius: 8px;
        background-color: transparent;
        color: #a0a0a0;
        display: flex;
        align-items: center;
        cursor: pointer;

        transition: 0.2s;
        .text {
            display: flex;
            align-items: center;
        }
        &.icon {
            .ico {
                display: flex;
                align-items: center;
                color: #797979;
                margin-right: 0.7em;
                transition: 0.2s;
            }
        }
        &.active {
            .ico {
                color: #bfbfbf;
            }
        }
        &:hover {
            background-color: #8c919618;
        }
    }
</style>
