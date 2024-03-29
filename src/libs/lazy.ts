let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0
}

export const lazy = (image: HTMLImageElement, src) => {
    const loaded = () => {
        //image.classList.add('visible') 
        // image.style.opacity = "1"
    }
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            image.src = src
            if (image.complete) {
                loaded()
            } else {
                image.addEventListener('load', loaded)
            }
        }
    }, options)
    observer.observe(image)

    return {
        destroy() {
            image.removeEventListener('load', loaded)
        }
    }
}