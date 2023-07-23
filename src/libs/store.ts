import { writable } from "svelte/store";
import type { Hit } from "./utils";
import { emptyHit } from "./player";

// export const query = writable<string>("羽澄さひろ")
// export const query = writable<string>("nornis")
export const query = writable<string>("")
export const channel = writable<{ name: string, id: string } | {}>({ name: 'Suisei', id: 'UC5CwaMl1eIgY8h02uZw7u8A' })
// export const channel = writable<{ name: string, id: string } | {}>({})
// export const sort = writable<number>(2)
export const sort = writable<number>(1)
export const page = writable<number>(0)
export const all_page = writable<number>(0)
export const error = writable<string>("")
export const playingHIT = writable<Hit>(emptyHit)