import {
	createFsInfoFromPath,
	getDirectoriesFromBase
} from './fs'

export async function generateRowsFromBase(base: string) {
	const directories = await getDirectoriesFromBase(base)
	return Promise.all(
		directories.map(async directory => {
			const { name } = directory
			const path = `${base}/${name}`

			const { tags, mtime, birthtime } =
				await createFsInfoFromPath(path)
			return {
				name,
				path,
				tags,
				mtime,
				birthtime
			}
		})
	)
}
