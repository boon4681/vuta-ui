import { writable } from "svelte/store";

export const query = writable<string>("羽澄さひろ")
// export const channel = writable<{ name: string, id: string } | {}>({ name: '羽澄さひろ / Hasumi Sahiro', id: 'UCaHgUmTyQhth2s07ChoKJuw' })
export const channel = writable<{ name: string, id: string } | {}>({})
export const sort = writable<number>(2)
export const page = writable<number>(0)
export const all_page = writable<number>(0)
export const error = writable<string>("")