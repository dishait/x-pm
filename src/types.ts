export interface ITab {
	name: string
	path: string
}

export type Tabs = ITab[]

export type RowData = {
	name: string
	path: string
	tags: Array<'node' | 'deno' | 'go' | 'unknown'>
}
