<script lang="ts">
    import { onMount } from "svelte";
    import Maximize from "./icons/Maximize.svelte";
    import X from "./icons/X.svelte";
    import { limit as range } from "../libs/utils";

    let dim = new DOMRect();
    let lastDIM = new DOMRect();
    let down = false;
    let resizing = false;
    let resize_mode: string;
    let dx = 0;
    let dy = 0;
    export let minHeight = 450;
    const mousemove = (e: MouseEvent) => {
        if (down) {
            dim.x = range(e.x - dx, 10, window.innerWidth - dim.width - 22);
            dim.y = range(e.y - dy, 10, window.innerHeight - dim.height - 22);
            lastDIM = dim;
        }
        if (resizing) {
            switch (resize_mode) {
                case "l":
                    dim.width -= e.movementX;
                    dim.x += e.movementX;
                    break;
                case "r":
                    dim.width += e.movementX;
                    break;
                case "b":
                    dim.height += e.movementY;
                    break;
                case "tl":
                    dim.width -= e.movementX;
                    dim.height -= e.movementY;
                    dim.x += e.movementX;
                    dim.y += e.movementY;
                    break;
                case "t":
                    dim.height -= e.movementY;
                    dim.y += e.movementY;
                    break;
                case "bl":
                    dim.width -= e.movementX;
                    dim.height += e.movementY;
                    dim.x += e.movementX;
                    break;
                case "br":
                    dim.width += e.movementX;
                    dim.height += e.movementY;
                    break;
            }
            dim.width = range(
                dim.width,
                300,
                Math.max(0, window.innerWidth - dim.x - 22)
            );
            dim.height = range(
                dim.height,
                minHeight,
                Math.max(minHeight, window.innerHeight - dim.y - 22)
            );
            dim.x = range(
                dim.x,
                10,
                Math.max(window.innerWidth - dim.width - 22, 10)
            );
            dim.y = range(
                dim.y,
                10,
                Math.max(window.innerHeight - dim.height - 22, 10)
            );
            lastDIM = dim;
        }
    };
    const mouseup = (e: MouseEvent) => {
        down = false;
        resizing = false;
    };
    const mousedown = (e: MouseEvent) => {
        e.preventDefault();
        dx = e.x - dim.x;
        dy = e.y - dim.y;
        down = true;
    };
    const mouseResize = (e: MouseEvent) => {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        dx = e.x - dim.x;
        dy = e.y - dim.y;
        resizing = true;
        resize_mode = target.id.replace("resize-", "") as any;
    };
    const resize = () => {
        if (window.innerWidth < dim.width && dim.width > 300) {
            dim.width = range(window.innerWidth - 22, 300, Infinity);
        }
        if (window.innerHeight < dim.height && dim.height > 340) {
            dim.height = range(window.innerHeight - 22, 340, Infinity);
        }
        dim.x = range(
            lastDIM.x,
            10,
            Math.max(window.innerWidth - dim.width - 22, 10)
        );
        dim.y = range(
            lastDIM.y,
            10,
            Math.max(window.innerHeight - dim.height - 22, 10)
        );
    };
    onMount(() => {
        dim.width = 300;
        dim.height = minHeight;
        window.addEventListener("resize", resize);
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);

        return () => {
            window.removeEventListener("resize", resize);
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
        };
    });
</script>

<div
    class="window"
    style="width: {dim.width}px;height:{dim.height}px;top:{dim.y}px;left:{dim.x}px;"
>
    <div class="inner">
        <div class="header" on:mousedown={mousedown}>
            <div class="title">vuta-music</div>
            <div class="menu">
                <div>
                    <Maximize />
                </div>
                <div>
                    <X />
                </div>
            </div>
        </div>
        <div class="body">
            <div class="context">
                <slot />
            </div>
        </div>
    </div>
    <div on:mousedown={mouseResize} id="resize-r" />
    <div on:mousedown={mouseResize} id="resize-l" />
    <div on:mousedown={mouseResize} id="resize-t" />
    <div on:mousedown={mouseResize} id="resize-b" />
    <div on:mousedown={mouseResize} id="resize-br" />
    <div on:mousedown={mouseResize} id="resize-bl" />
    <div on:mousedown={mouseResize} id="resize-tl" />
</div>

<style lang="scss">
    .window {
        position: fixed;
        z-index: 1000;
        min-width: 300px;
        min-height: 340px;
        > .inner {
            width: 100%;
            height: 100%;
            border-radius: 15px;
            overflow: clip;
            display: flex;
            flex-direction: column;
            contain: content;
            box-shadow: 0px 4px 32px #0000004d;
            > .header {
                width: 100%;
                height: 40px;
                display: flex;
                position: relative;
                z-index: 1;
                flex-shrink: 0;
                user-select: none;
                background-color: #36393fd9;
                backdrop-filter: blur(15px);
                font-size: 90%;
                font-weight: 700;
                cursor: move;
                align-items: center;
                > .title {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: move;
                    margin-left: 1rem;
                }
                > .menu {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    > div {
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            > .body {
                width: 100%;
                height: 100%;
                background-color: #242424;
                padding: 0 18px;
                padding-top: 30px;
                > .context {
                    border-radius: 10px 10px 0 0;
                    padding: 20px;
                    width: 100%;
                    min-height: 100%;
                    height: auto;
                    background-color: #36393f;
                }
            }
        }
        > #resize-r {
            position: absolute;
            right: -8px;
            top: 0;
            width: 8px;
            height: 100%;
            cursor: e-resize;
        }

        > #resize-l {
            position: absolute;
            left: -8px;
            top: 0;
            width: 8px;
            height: 100%;
            cursor: e-resize;
        }

        > #resize-t {
            position: absolute;
            top: -8px;
            width: 100%;
            height: 8px;
            cursor: s-resize;
        }
        > #resize-b {
            position: absolute;
            bottom: -8px;
            width: 100%;
            height: 8px;
            cursor: s-resize;
        }
        > #resize-br {
            position: absolute;
            bottom: -10px;
            right: -10px;
            width: 20px;
            height: 20px;
            cursor: se-resize;
        }
        > #resize-bl {
            position: absolute;
            bottom: -10px;
            left: -10px;
            width: 20px;
            height: 20px;
            cursor: ne-resize;
        }
        > #resize-tl {
            position: absolute;
            top: -10px;
            left: -10px;
            width: 20px;
            height: 20px;
            cursor: se-resize;
        }
    }
</style>
