import { ipcRenderer } from 'electron'
import { isString } from 'm-type-tools'
import { message } from './discrete'

export async function openDirectory() {
	const path = (await ipcRenderer.invoke(
		'openDirectory'
	)) as string | undefined

	if (!isString(path)) {
		message.warning('未选择文件夹')
		return
	}

	return path
}
