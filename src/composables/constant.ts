import { resolve } from 'path'
import { detectGoGetFolderSizeName } from './detect'

export const CACHE_PATH = resolve(
	__dirname,
	'../../../temp'
)

export const GO_GET_FOLDER_SIZE_BIN_PATH = resolve(
	__dirname,
	`../../../resources/bin/${detectGoGetFolderSizeName()}`
)
