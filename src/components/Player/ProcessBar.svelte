<script lang="ts">
    import { format } from "../../libs/utils";
    import { AudioPlayer, playerRequest } from "../../libs/player";
    const { duration, currentTime, is_load, playing } = AudioPlayer;
</script>

<div class="progress">
    <span>{format($currentTime)}</span>
    <div class="bar">
        <div class="buffer" />
        <progress value={$currentTime} max={$duration} />
    </div>
    <span>{format($duration)}</span>
</div>

<style lang="scss">
    .progress {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 12px;
        .bar {
            margin: 0 5px;
            margin-top: 5px;
            position: relative;
            width: 100%;
            height: 10px;
            isolation: isolate;
            overflow: hidden;
            width: 100%;
            background-clip: content-box;
            background-color: #3c3c42;
            border: calc(10px / 3) solid transparent;
            border-radius: calc(10px / 2);
            contain: paint;
            will-change: visibility;

            progress {
                color: #f3f3f3;
                width: 100%;
                appearance: none;
                background: transparent;
                border: transparent;
                cursor: pointer;
                display: block;
                height: inherit;
                inset: 0;
                margin: 0;
                outline: none;
                overflow: hidden;
                padding: 0;
                position: absolute;
                top: 0;
            }
            progress::-webkit-control-group {
                background-color: rgb(84, 84, 88);
            }
            progress::-moz-control-group {
                background-color: #f3f3f3;
                color: white;
            }
            progress::-webkit-progress-value {
                background-color: rgb(255, 255, 255);
            }
        }
    }
</style>
