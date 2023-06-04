import { get, writable, type Writable } from "svelte/store";
import { error } from "./store";
import { comments, getTime, type Comments, type Hit } from "./utils";

export function playerRequest(videoId: string) {
    return fetch(`api/v1/player?videoId=${videoId}`);
}

function metadata(queue: Comments) {
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
        }
        this._player.autoplay = true;
        this._player.preload = "metadata";
        this._player.onloadstart = () => {
            this.is_load.set(true)
        }
        this._player.onloadedmetadata = () => {
            this.is_load.set(false)
            this.duration.set(this._player.duration)
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
    async getMusic(data: Hit) {
        if (get(this.is_load)) throw new Error("loading");
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
    play() {
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