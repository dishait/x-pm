export interface ITab {
	name: string
	path: string
}

export type Tabs = ITab[]

export type RowData = {
	name: string
	path: string
	mtime: number
	birthtime: number
	tags: Array<'node' | 'deno' | 'go' | 'unknown'>
}
