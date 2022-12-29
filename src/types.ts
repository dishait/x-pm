export type MabyeFiles = File[] | null

export interface Tab {
	key: string
	title: string
}

export type Tabs = Tab[]

export type Dirs = Array<Pick<File, 'name' | 'path'>>
