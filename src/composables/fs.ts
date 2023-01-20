import { RowData } from '../types'
import { CACHE_PATH } from './constant'
import { existsSync, lstatSync } from 'node:fs'
import { readdir, lstat } from 'node:fs/promises'
import { createFsComputedSync } from 'file-computed'

const fsComputedSync = createFsComputedSync({
	cachePath: CACHE_PATH
})

export function createUseFsInfo(path: string) {
	let info: Pick<RowData, 'mtime' | 'birthtime' | 'tags'>

	return function useFsInfo() {
		if (info) {
			return info
		}
		info = fsComputedSync(path, () => {
			const { mtime, birthtime } = lstatSync(path)
			return {
				mtime: mtime.getTime(),
				birthtime: birthtime.getTime(),
				tags: generateTagsFromBase(path)
			}
		})

		return info
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

export async function getDirectoriesFromBase(base: string) {
	const dirents = await readdir(base, {
		withFileTypes: true
	})

	return dirents.filter(dirent => {
		return dirent.isDirectory()
	})
}

export async function shallowGetFolderSize(base: string) {
	if (!existsSync(base)) {
		return 0
	}

	const dirents = await readdir(base, {
		withFileTypes: true
	})

	const sizes = await Promise.all(
		dirents.map(async dirent => {
			const path = `${slash(base)}/${dirent.name}`
			const { size } = await lstat(path)
			return size
		})
	)

	return sizes.reduce((totalSize, size) => {
		return (totalSize += size)
	}, 0)
}
