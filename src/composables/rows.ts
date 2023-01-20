import {
	createUseFsInfo,
	getDirectoriesFromBase
} from './fs'

export async function generateRowsFromBase(base: string) {
	const directories = await getDirectoriesFromBase(base)

	return directories.map(directory => {
		const { name } = directory
		const path = `${base}/${name}`

		const useFsInfo = createUseFsInfo(path)

		return {
			name,
			path,
			get tags() {
				return useFsInfo().tags
			},
			get mtime() {
				return useFsInfo().mtime
			},
			get birthtime() {
				return useFsInfo().birthtime
			}
		}
	})
}
