<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";
    export let min = 0;
    export let max = 100;
    export let initialValue = 0;
    export let id = null;
    export let value =
        typeof initialValue === "string"
            ? parseInt(initialValue)
            : initialValue;
    export let disable = false;
    export let mode: "horizontal" | "vertical" = "horizontal";
    let container = null;
    let thumb = null;
    let progressBar = null;
    let element = null;
    let elementX = null;
    let elementY = null;
    let currentThumb = null;
    let holding = false;
    let thumbHover = false;
    let keydownAcceleration = 0;
    let accelerationTimer = null;

    const dispatch = createEventDispatcher();

    const mouseEventShield = document.createElement("div");
    mouseEventShield.setAttribute("class", "mouse-over-shield");
    mouseEventShield.addEventListener("mouseover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    function resizeWindow() {
        elementX = element.getBoundingClientRect().left;
        elementY = element.getBoundingClientRect().top;
    }

    function setValue(val) {
        value = val;
        dispatch("change", { value });
    }

    function onTrackEvent(e) {
        if (disable) return;
        updateValueOnEvent(e);
        onDragStart(e);
    }

    function onHover(e) {
        thumbHover = thumbHover ? false : true;
    }

    function onDragStart(e) {
        if (disable) return;
        if (e.type === "mousedown") document.body.append(mouseEventShield);
        currentThumb = thumb;
    }

    function onDragEnd(e) {
        if (disable) return;
        if (e.type === "mouseup") {
            if (document.body.contains(mouseEventShield))
                document.body.removeChild(mouseEventShield);
            if (isMouseInElement(e, thumb)) thumbHover = true;
        }
        currentThumb = null;
    }

    function isMouseInElement(event, element) {
        let rect = element.getBoundingClientRect();
        let { clientX: x, clientY: y } = event;
        if (x < rect.left || x >= rect.right) return false;
        if (y < rect.top || y >= rect.bottom) return false;
        return true;
    }

    function calculateNewValue(pos) {
        let percent;
        if (mode == "horizontal") {
            let delta = pos - (elementX + 7);
            percent = (delta * 100) / (container.clientWidth - 7);
            percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;
            setValue((percent * (max - min)) / 100 + min);
        }
        if (mode == "vertical") {
            let delta = pos - (elementY + 7);
            percent = (delta * 100) / (container.clientHeight - 7);
            percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;
            setValue(100 - (percent * (max - min)) / 100 + min);
        }
    }

    function updateValueOnEvent(e) {
        if (!currentThumb && e.type !== "touchstart" && e.type !== "mousedown")
            return false;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        if (mode == "horizontal") {
            const clientX =
                e.type === "touchmove" || e.type === "touchstart"
                    ? e.touches[0].clientX
                    : e.clientX;

            calculateNewValue(clientX);
        }
        if (mode == "vertical") {
            const clientY =
                e.type === "touchmove" || e.type === "touchstart"
                    ? e.touches[0].clientY
                    : e.clientY;

            calculateNewValue(clientY);
        }
    }
    $: if (element) resizeWindow();
    $: holding = Boolean(currentThumb);
    $: if (progressBar && thumb) {
        value = value > min ? value : min;
        value = value < max ? value : max;
        if (mode == "horizontal") {
            let percent = ((value - min) * 100) / (max - min);
            let offsetLeft = (container.clientWidth - 7) * (percent / 100) + 5;
            thumb.style.left = `${offsetLeft}px`;
            progressBar.style.width = `${offsetLeft}px`;
        }
        if (mode == "vertical") {
            let percent = ((value - min) * 100) / (max - min);
            let offsetBottom =
                (container.clientHeight - 7) * (percent / 100) + 5;
            thumb.style.top = `${container.clientHeight - offsetBottom}px`;
            progressBar.style.height = `${offsetBottom}px`;
        }
    }
</script>

<svelte:window
    on:touchmove|nonpassive={updateValueOnEvent}
    on:touchcancel={onDragEnd}
    on:touchend={onDragEnd}
    on:mousemove={updateValueOnEvent}
    on:mouseup={onDragEnd}
    on:resize={resizeWindow}
/>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    class="range"
    class:disable
    class:horizontal={mode == "horizontal"}
    class:vertical={mode == "vertical"}
>
    <div
        class="range__wrapper"
        tabindex="0"
        bind:this={element}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        {id}
        on:mousedown={onTrackEvent}
        on:touchstart={onTrackEvent}
    >
        <div class="range__track" bind:this={container}>
            <div class="range__track--highlighted" bind:this={progressBar} />
            <div
                class="range__thumb"
                class:range__thumb--holding={holding}
                bind:this={thumb}
                on:touchstart={onDragStart}
                on:mousedown={onDragStart}
                on:mouseover={() => (thumbHover = true)}
                on:mouseout={() => (thumbHover = false)}
            >
                <!-- {#if holding || thumbHover}
                    <div
                        class="range__tooltip"
                        in:fly={{ y: 7, duration: 200 }}
                        out:fade={{ duration: 100 }}
                    >
                        {value}
                    </div>
                {/if} -->
            </div>
        </div>
    </div>
</div>

<svelte:head>
    <style>
        .mouse-over-shield {
            position: fixed;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            background-color: rgba(255, 0, 0, 0);
            z-index: 10000;
            cursor: grabbing;
        }
    </style>
</svelte:head>

<style lang="scss">
    .range {
        position: relative;
        flex: 1;

        .range__wrapper {
            position: relative;
            padding: 0.5rem;
            box-sizing: border-box;
            outline: none;
        }

        .range__wrapper:focus-visible > .range__track {
            box-shadow: 0 0 0 2px white, 0 0 0 3px var(--track-focus, #6185ff);
        }

        .range__thumb {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 12px;
            height: 12px;
            background-color: var(--thumb-bgcolor, white);
            cursor: pointer;
            border-radius: 999px;
            transition: box-shadow 100ms;
            user-select: none;
            box-shadow: var(
                --thumb-boxshadow,
                0 1px 1px 0 rgba(0, 0, 0, 0.14),
                0 0px 2px 1px rgba(0, 0, 0, 0.2)
            );
        }

        .range__thumb--holding {
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
                0 1px 2px 1px rgba(0, 0, 0, 0.2),
                0 0 0 6px var(--thumb-holding-outline, rgba(113, 119, 250, 0.3));
        }
        .range__track {
            background-color: var(--track-bgcolor, #d0d0d0);
            border-radius: 999px;
        }

        .range__track--highlighted {
            background-color: var(--track-highlight-bgcolor, #6185ff);
            width: 0;
            position: absolute;
            border-radius: 999px;
        }

        &.horizontal {
            .range__wrapper {
                min-width: 100%;
            }

            .range__track {
                height: 4px;
            }

            .range__thumb {
                margin-top: -4.5px;
            }

            .range__track--highlighted {
                height: 4px;
                width: 0;
                background: var(
                    --track-highlight-bg,
                    linear-gradient(90deg, #6185ff, #9c65ff)
                );
            }
        }
        &.vertical {
            .range__wrapper {
                height: 100%;
            }

            .range__track {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                width: 4px;
                height: 100%;
                margin: 0 auto;
            }

            .range__thumb {
                margin-left: -4.5px;
            }

            .range__track--highlighted {
                margin-top: auto;
                width: 4px;
                height: 0;
                background: var(
                    --track-highlight-bg,
                    linear-gradient(0deg, #6185ff, #9c65ff)
                );
            }
        }
    }
</style>
