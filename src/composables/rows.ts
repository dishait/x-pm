import type { Stats } from 'fs'
import { RowData } from '../types'
import { existsSync, lstatSync } from 'fs'
import { readdir } from 'node:fs/promises'

function createLstatSync(path: string) {
	let lstat: Stats
	return () => {
		if (!lstat) {
			lstat = lstatSync(path)
		}
		return lstat
	}
}

const TAGS = [
	{
		tag: 'node',
		files: ['package.json']
	},
	{
		tag: 'deno',
		files: ['mod.ts', 'deno.jsonc', 'deno.json']
	},
	{
		tag: 'go',
		files: ['go.mod', 'main.go']
	}
] as const

function generateTagsFromBase(
	base: string
): RowData['tags'] {
	const tags = TAGS.filter(t => {
		return t.files.some(f => existsSync(`${base}/${f}`))
	}).map(t => t.tag)

	const unknownTag = tags.length === 0
	if (unknownTag) {
		return ['unknown']
	}

	return tags
}

export async function generateRowsFromBase(base: string) {
	const dirents = await readdir(base, {
		withFileTypes: true
	})

	const directories = dirents.filter(dirent => {
		return dirent.isDirectory()
	})

	return directories.map(directory => {
		const { name } = directory
		const path = `${base}/${name}`

		const useLstat = createLstatSync(path)

		return {
			name,
			path,
			get mtime() {
				return useLstat().mtime.getTime()
			},
			get birthtime() {
				return useLstat().birthtime.getTime()
			},
			get tags() {
				return generateTagsFromBase(path)
			}
		}
	})
}
