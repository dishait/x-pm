import type { MaybeRef } from '@vueuse/core'

export interface ITab {
	name: string
	path: string
}

export type Tabs = ITab[]

export type RowData = {
	name: string
	path: string
	mtime?: MaybeRef<number>
	birthtime?: MaybeRef<number>
	tags?: MaybeRef<Array<'node' | 'deno' | 'go' | 'unknown'>>
}
