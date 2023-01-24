import { RowData } from '../types'
import type { Dirent } from 'node:fs'
import { CACHE_PATH } from './constant'
import { readdir, lstat } from 'node:fs/promises'
import { createFsComputed } from 'file-computed'

async function exists(path: string) {
	try {
		const stat = await lstat(path)
		return Boolean(stat)
	} catch (error) {
		return false
	}
}

export const fsComputed = createFsComputed({
	cachePath: CACHE_PATH
})

export function getLstatTimes(path: string) {
	return fsComputed(path, async () => {
		const { mtime, birthtime } = await lstat(path)
		return {
			mtime: mtime.getTime(),
			birthtime: birthtime.getTime()
		}
	})
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

export function generateTags(base: string) {
	return fsComputed(base, async () => {
		const nullableTags = await Promise.all(
			TAGS.map(async TAG => {
				const possibleExists = await Promise.all(
					TAG.files.map(async file => {
						return exists(`${base}/${file}`)
					})
				)
				if (possibleExists.includes(true)) {
					return TAG.tag
				}
				return null
			})
		)
		let tags = nullableTags.filter(
			Boolean
		) as RowData['tags']

		const unrefTags = unref(tags!)
		const unknownTag = unrefTags.length === 0
		if (unknownTag) {
			unrefTags.push('unknown')
		}

		return unrefTags
	})
}

export async function getDirectories(base: string) {
	return fsComputed(base, async () => {
		const dirents = await readdir(base, {
			withFileTypes: true
		})
	
		return dirents.filter(dirent => {
			return dirent.isDirectory()
		})
	})
}

function zipSizes(sizes: number[]) {
	return sizes.reduce((total, size) => (total += size), 0)
}

async function _getFolderSize(
	base: string,
	depth = 1
): Promise<number> {
	// 层级用尽
	if (depth === 0) {
		return 0
	}
	const dirents = await readdir(base, {
		withFileTypes: true
	})
	// 空目录
	if (dirents.length === 0) {
		return 0
	}

	const files: Dirent[] = []
	const directorys: Dirent[] = []

	for (const dirent of dirents) {
		if (dirent.isFile()) {
			files.push(dirent)
			continue
		}
		if (dirent.isDirectory()) {
			directorys.push(dirent)
		}
	}

	const sizes = await Promise.all(
		[
			files.map(async file => {
				const path = `${slash(base)}/${file.name}`
				const { size } = await lstat(path)
				return size
			}),
			directorys.map(directory => {
				const path = `${slash(base)}/${directory.name}`
				return _getFolderSize(path, depth - 1)
			})
		].flat()
	)

	return zipSizes(sizes)
}

export function getFolderSize(
	base: string,
	depth = Infinity
) {
	return fsComputed(base, async () => {
		if (!(await exists(base))) {
			return 0
		}
		return _getFolderSize(base, depth)
	})
}
