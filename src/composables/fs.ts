import { RowData } from '../types'
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
	const dirents = await readdir(base, {
		withFileTypes: true
	})

	return dirents.filter(dirent => {
		return dirent.isDirectory()
	})
}

export async function shallowGetFolderSize(base: string) {
	if (!(await exists(base))) {
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
