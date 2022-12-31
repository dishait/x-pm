import { execa } from 'execa'
export { existsSync } from 'node:fs'
import { ipcRenderer } from 'electron'
export { readdir } from 'node:fs/promises'
export { resolve, basename } from 'node:path'

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
