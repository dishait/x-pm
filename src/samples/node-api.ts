import open from 'open'
export { resolve } from 'node:path'
export { existsSync } from 'node:fs'
import { execa } from 'execa'
import { ipcRenderer } from 'electron'
export { readdir } from 'node:fs/promises'

export async function showDirectoryDialog() {
	const dir = await ipcRenderer.invoke(
		'showDirectoryDialog'
	)
	return dir as string
}

export function openVscode(path: string) {
	return execa('code', [path])
}

export function openFileManager(path: string) {
	return open(path)
}
