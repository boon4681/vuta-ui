import { get, writable, type Writable } from "svelte/store";
import { channel, page, query, sort } from "./store";

const api = "https://vuta-api.illyaz.dev"

const regex = /(?<time>(((\d{1,2}):)?(\d{1,2}):(\d{2})))|<em>(?<text>.+)<\/em>/;

const INTL_NUMBERFORMAT = new Intl.NumberFormat('en', { 'compactDisplay': 'short', 'notation': 'compact', 'maximumFractionDigits': 2 })

export interface Text {
    text: string;
}

export interface Anchor {
    text: string;
    link: string
}

export interface Highlight {
    text: string
    glow: true
}

export type Comments = (Text | Anchor | Highlight)[]

export interface SearchResult {
    type: number;
    took: number;
    total: number;
    hits: (Hit & ArtistHit)[];
}

export interface Hit {
    id: string;
    videoId: string;
    channelId: string;
    channelTitle: string;
    videoTitle: string;
    videoPublishDate: Date;
    videoLastUpdate: Date;
    highlightedText: string;
}

export interface ArtistHit {
    id: string;
    title: string;
    thumbnail: string;
    subscriberCount: number;
    videoCount: number;
}

export const numberFormat = (n: number) => {
    return INTL_NUMBERFORMAT.format(n)
}

export const payload = (page: number, sort: number, isUta: boolean) => {
    const a = new URLSearchParams()
    a.set("page", page + '')
    a.set("sort", sort + '')
    a.set("isUta", isUta + '')
    return a
}

export const search = async () => {
    const _payload = payload(get(page), get(sort), true)
    _payload.set("query", get(query))
    const url = new URL(api)
    if (get(sort) == 2) {
        url.pathname = "/search/channels"
        _payload.delete('sort')
        _payload.delete('isUta')
        url.search = _payload.toString()
        return { ...await (await fetch(url)).json(), type: 1 } as unknown as SearchResult
    }
    url.pathname = "/search/comments"
    if (get(channel)['id']) {
        _payload.set("channelId", get(channel)['id'])
    }
    url.search = _payload.toString()
    return { ...await (await fetch(url)).json(), type: 0 } as unknown as SearchResult
}

export const swap = (arr: any[], i: number, j: number) => [arr[i], arr[j]] = [arr[j], arr[i]];


export const getTime = (text: string) => {
    const exec = regex.exec(text)
    if (!exec) return 0
    return [
        parseInt(exec[4]),
        parseInt(exec[5]),
        parseInt(exec[6])
    ].reduce((a, b, i) => a + (isNaN(b) ? 0 : b) * 60 ** (2 - i), 0)
}

export const comments = (videoId: string, comment: string, mode: "normal" | "queue" = "normal") => {
    const result: Comments = []
    comment = comment.replace(/\r/g, "").replace(/(\n{3,})/g, "\n\n")
    while (comment.length > 0) {
        const exec = regex.exec(comment)
        if (exec) {
            if (exec.groups.time) {
                const index = exec.index
                const timeText = exec.groups.time
                const time = [
                    parseInt(exec[4]),
                    parseInt(exec[5]),
                    parseInt(exec[6])
                ].reduce((a, b, i) => a + (isNaN(b) ? 0 : b) * 60 ** (2 - i), 0)
                const splited = comment.slice(0, index).split('\n')
                splited.map((a, i) => {
                    result.push({
                        text: a + (i == splited.length - 1 ? '' : '\n')
                    })
                })
                result.push({
                    text: timeText,
                    link: `https://youtube.com/watch?v=${videoId}&t=${time}`
                })
                comment = comment.slice(index + timeText.length)
            } else if (exec.groups.text) {
                const index = exec.index
                const text = exec.groups.text
                const splited = comment.slice(0, index).split('\n')
                splited.map((a, i) => {
                    result.push({
                        text: a + (i == splited.length - 1 ? '' : '\n')
                    })
                })
                result.push({
                    text: text.replace(/<em>(?<text>.+)<\/em>/g, ""),
                    glow: true
                })
                comment = comment.slice(index + text.length + 9)
            } else {
                result.push({
                    text: comment.slice(0)
                })
                break
            }
        } else {
            result.push({
                text: comment.slice(0)
            })
            break
        }
    }
    for (let i = 0; i < result.length; i += 1) {
        const a = result[i];
        const b = result[i + 1];
        const c = result[i + 2];
        if (a && b) {
            if (!a['link'] && b['link'] && c && !c['link']) {
                swap(result, i, i + 1)
            }
            if (!a['link'] && b['link'] && !c) {
                swap(result, i, i + 1)
            }
        }
    }
    if (mode == "queue") {
        const final = result.filter((a: any, i) =>
            (a['link'] && (i + 1 < result.length && !result[i + 1]['link'])) ||
            (a['text'] && (i > 1 && result[i - 1]['link']))
        )
        const groups: (Text | Anchor | Highlight)[] = []
        let start = false
        let text: string = ""
        for (const c of result) {
            if (c['link']) {
                if (!/\n/g.test(c['text'])) {
                    start = true
                }
                groups.push(c)
                continue
            }
            if (start) {
                text += c['text']
            }
            if (/\n/g.test(c['text'])) {
                start = false
                if (text.length) groups.push({ text })
                text = ""
            }
        }
        // console.log(final.map((a, i) => a['link'] ? [a, final[i + 1]] : undefined).filter(a => a))
        return groups.map((a, i) => a['link'] ? groups[i + 1] ? !groups[i + 1]['link'] ? [a, groups[i + 1]] : undefined : undefined : undefined)
        .filter(a => a && a[1].text.trim().length).sort((a,b)=>getTime(a[0].text) - getTime(b[0].text))
    }
    return result
}

export const limit = (a: number, min: number, max: number) => {
    return Math.min(max, Math.max(a, min))
}

export const date = new Intl.RelativeTimeFormat("en");
export const format_time = (time: number) => {
    const u = [60, 60 * 60, 24 * 60 * 60];
    const p = ["minutes", "hours", "days"];
    let o = "seconds";
    let j = 1;
    time -= Date.now() / 1000
    for (const i in u) {
        if (Math.abs(time) > u[i]) {
            j = u[i];
            o = p[i];
        }
    }
    time /= j;
    return date.format(Math.round(time), o as any)
        .replace(' days', 'd')
        .replace(' day', 'd')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' seconds', 's')
        .replace(' second', 's')
};

export const useMedia = (parent: HTMLElement): [() => void, Writable<boolean>, Writable<boolean>, Writable<boolean>] => {
    const body = parent
    const sm = writable(false)
    const md = writable(false)
    const lg = writable(false)
    const run = () => {
        const dim = body.getBoundingClientRect()
        if (dim.width < 400) {
            sm.set(true)
            md.set(false)
            lg.set(false)
        }
        if (dim.width >= 400 && dim.width < 800) {
            sm.set(false)
            md.set(true)
            lg.set(false)
        }
        if (dim.width >= 800) {
            sm.set(false)
            md.set(false)
            lg.set(true)
        }
    }
    const resizeObserver = new ResizeObserver(run)
    if (body) {
        resizeObserver.observe(body)
        const unsub = () => { resizeObserver.unobserve(body); resizeObserver.disconnect() }
        run()
        return [unsub, sm, md, lg]
    }
    return [() => { }, sm, md, lg]
}

export function format(seconds: number) {
    if (isNaN(seconds)) return "...";
    const hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds / 60) % 60;
    seconds = Math.floor(seconds % 60);
    if (minutes < 10 && hours > 0) minutes = ("0" + minutes) as unknown as number;
    if (seconds < 10) seconds = ("0" + seconds) as unknown as number;

    if (hours > 0) return `${hours}:${minutes}:${seconds}`

    return `${minutes}:${seconds}`;
}