import { execa } from 'execa'
export { resolve } from 'node:path'
export { existsSync } from 'node:fs'
import { ipcRenderer } from 'electron'
export { readdir } from 'node:fs/promises'

export async function showDirectoryDialog() {
	const dir = await ipcRenderer.invoke(
		'showDirectoryDialog'
	)
	return dir as string
}

export function openVscode(path: string) {
	return execa('code', [path], {
		detached: true
	})
}

export async function openFileManager(path: string) {
	const dir = await ipcRenderer.invoke(
		'openFileManager',
		path
	)
	return dir as string
}
