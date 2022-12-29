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
