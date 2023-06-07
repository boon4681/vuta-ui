import { get, writable, type Writable } from "svelte/store";
import { error } from "./store";
import { comments, getTime, type Comments, type Hit } from "./utils";

export function playerRequest(videoId: string) {
    return fetch(`api/v1/player?videoId=${videoId}`);
}


async function updateTrack(data: Hit, queue: Comments, active: number) {
    if (queue[active]) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: queue[active][1].text,
            artist: data.channelTitle,
            album: data.videoTitle,
            artwork: [
                {
                    src: `https://vuta-music.boon4681.com/image/square/${data.videoId}.jpg`,
                    sizes: `512x512`,
                    type: "image/jpeg",
                },
            ],
        });
    } else {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: data.videoTitle,
            artist: data.channelTitle,
            album: data.videoTitle,
            artwork: [
                {
                    src: `https://vuta-music.boon4681.com/image/square/${data.videoId}.jpg`,
                    sizes: `512x512`,
                    type: "image/jpeg",
                },
            ],
        });
    }
}

function metadata(data: Hit, queue: Comments, active: number) {
    if ("mediaSession" in navigator) {
        updateTrack(data, queue, active)
        navigator.mediaSession.setActionHandler("play", () => {
            AudioPlayer.play();
        });
        navigator.mediaSession.setActionHandler("pause", () => AudioPlayer.pause());
        navigator.mediaSession.setActionHandler("previoustrack", () => AudioPlayer.previous());
        navigator.mediaSession.setActionHandler("nexttrack", () => AudioPlayer.next());
    }
}

export class Player {
    private _player = new Audio();
    private _music: Writable<string> = writable("")
    public data: Writable<Hit | {}> = writable({})
    public currentTime: Writable<number> = writable(0)
    public duration: Writable<number> = writable(0)
    public playing: Writable<boolean> = writable(false)
    public is_load: Writable<boolean> = writable(false)
    public queue: Writable<Comments> = writable([])
    public active: Writable<number> = writable(-1)
    constructor() {
        if (window['_player']) {
            this._player = window['_player']
            this.duration.set(this._player.duration)
            this.currentTime.set(this._player.currentTime)
            this.play()
            metadata(get(this.data) as unknown as Hit, get(this.queue), get(this.active))
        }
        this._player.autoplay = true;
        this._player.preload = "metadata";
        this._player.onloadstart = () => {
            this.is_load.set(true)
        }
        this._player.onloadedmetadata = () => {
            this.is_load.set(false)
            this.duration.set(this._player.duration)
            metadata(get(this.data) as unknown as Hit, get(this.queue), get(this.active))
        }
        this._player.ontimeupdate = () => {
            if (get(this.is_load)) {
                this.is_load.set(false)
                this.playing.set(true)
            }
            this.currentTime.set(this._player.currentTime)
            this.active.set(((get(this.queue).map((a, i) => [i, getTime(a[0].text)])
                .filter((a) => a[1] <= get(this.currentTime))
                .sort((a, b) => a[1] - b[1])
                .slice(-1) ?? [])[0] ?? [])[0] ?? -1)
            updateTrack(get(this.data) as unknown as Hit, get(this.queue), get(this.active))
        }
        this._player.onended = () => {
            this.playing.set(false)
            this.is_load.set(false)
        }
        this._player.onerror = () => {
            this.is_load.set(false)
        }
        if (!window['_player']) {
            this._player.load()
        }
        this.redeem()
        window['_player'] = this._player
    }
    get music() {
        return get(this._music)
    }
    set music(url: string) {
        console.log(url)
        this._music.set(url)
        this._player.src = url
    }
    updateTime(time: number) {
        this.currentTime.set(time)
        this._player.currentTime = time
    }
    async redeem() {
        if (!this._player.src) return;
        const parsed = new URL(this._player.src)
        const data = get(this.data) as Hit
        if (Number(parsed.searchParams.get('expire')) < Date.now() / 1000) {
            if (get(this.data)['videoId']) {
                const music = await AudioPlayer.getSRC(data).catch(e => e);
                this.data.set(data)
                if (music instanceof Error) {
                    this.duration.set(0)
                    this.currentTime.set(0)
                    this.pause()
                    AudioPlayer.music = "";
                    throw music
                }
                error.set("")
                const queue = comments(data.videoId, data.highlightedText, "queue") as Comments
                this.queue.set(queue)
                this.active.set(((queue.map((a, i) => [i, getTime(a[0].text)])
                    .filter((a) => a[1] <= get(this.currentTime))
                    .sort((a, b) => a[1] - b[1])
                    .slice(-1) ?? [])[0] ?? [])[0] ?? -1)
                AudioPlayer.music = music.url;
            }
        }
    }
    async getMusic(data: Hit) {
        if (get(this.is_load)) return;
        if (get(this.data)['id'] != data.id) {
            const music = await AudioPlayer.getSRC(data).catch(e => e);
            this.data.set(data)
            if (music instanceof Error) {
                this.duration.set(0)
                this.currentTime.set(0)
                this.pause()
                AudioPlayer.music = "";
                throw music
            }
            error.set("")
            const queue = comments(data.videoId, data.highlightedText, "queue") as Comments
            this.queue.set(queue)
            this.active.set(((queue.map((a, i) => [i, getTime(a[0].text)])
                .filter((a) => a[1] <= get(this.currentTime))
                .sort((a, b) => a[1] - b[1])
                .slice(-1) ?? [])[0] ?? [])[0] ?? -1)
            AudioPlayer.music = music.url;
            return music.url;
        }
        return this.music;
    }
    async getSRC(data: Hit) {
        this.is_load.set(true)
        // if (data.id == '3BrtCYZyOXE') throw new Error('LIVE_OFFLINE')
        return playerRequest(data.videoId)
            .then((a) => a.json())
            .then((a) => {
                if (a.playabilityStatus.status == "OK") {
                    return a.streamingData.adaptiveFormats
                        .filter((a) => a.mimeType.startsWith("audio"))
                        .sort((a, b) => b.bitrate - a.bitrate)[0];
                }
                throw new Error(a.playabilityStatus.status)
            })
    }
    seek(time: number) {
        time = Math.min(this._player.duration, Math.max(0, this._player.currentTime + time))
        this.updateTime(time)
    }
    next() {
        const next = get(this.queue).slice(get(this.active) + 1)[0]
        if (next) {
            this.updateTime(getTime(next[0]['text']))
        }
    }
    previous() {
        const previous = get(this.queue).slice(get(this.active) - 1)[0]
        if (get(this.active) > 1) {
            if (previous) {
                this.updateTime(getTime(previous[0]['text']))
            }
        } else {
            this.updateTime(0)
        }
    }
    play() {
        this.redeem()
        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
        this._player.play()
        this.playing.set(true)
    }
    pause(): void {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
        this.playing.set(false)
        this._player.pause();
    }
    destroy() {
        this._player.remove()
    }
}

export const AudioPlayer = new Player()