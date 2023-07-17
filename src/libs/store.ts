import { writable } from "svelte/store";
import type { Hit } from "./utils";
import { emptyHit } from "./player";

// export const query = writable<string>("羽澄さひろ")
export const query = writable<string>("")
// export const channel = writable<{ name: string, id: string } | {}>({ name: '羽澄さひろ / Hasumi Sahiro', id: 'UCaHgUmTyQhth2s07ChoKJuw' })
export const channel = writable<{ name: string, id: string } | {}>({})
// export const sort = writable<number>(2)
export const sort = writable<number>(1)
export const page = writable<number>(0)
export const all_page = writable<number>(100)
export const error = writable<string>("")
export const playingHIT = writable<Hit>(emptyHit)