import open from 'open'
export { resolve } from 'node:path'
export { existsSync } from 'node:fs'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
export { readdir } from 'node:fs/promises'

export async function showDirectoryDialog() {
	const dir = await ipcRenderer.invoke(
		'showDirectoryDialog'
	)
	return dir as string
}

export function openVscode(path: string) {
	return new Promise((resolve, reject) => {
		exec(`code ${path}`, (error, stdout, stderr) => {
			const _error = error || stderr
			if (_error) {
				reject(_error)
			} else {
				resolve(stdout)
			}
		})
	})
}

export function openFileManager(path: string) {
	return open(path)
}
