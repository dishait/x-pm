import { ipcRenderer } from 'electron'

export async function showDirectoryDialog() {
	const dir = await ipcRenderer.invoke(
		'showDirectoryDialog'
	)
	return dir as string
}
