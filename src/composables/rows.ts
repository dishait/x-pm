import { RowData } from './../types'
import {
	generateTags,
	getLstatTimes,
	getDirectories
} from './fs'

export async function generateRowsFromBase(base: string) {
	const directories = await getDirectories(base)
	return directories.map(directory => {
		const { name } = directory
		const path = `${base}/${name}`

		const mtime = ref<number>()
		const birthtime = ref<number>()
		const tags = ref<RowData['tags']>()

		getLstatTimes(path)
			.then(fc => fc)
			.then(times => {
				mtime.value = times.mtime
				birthtime.value = times.birthtime
			})

		generateTags(path)
			.then(fc => fc)
			.then(_tags => {
				tags.value = _tags
			})

		return {
			name,
			path,
			tags,
			mtime,
			birthtime
		} as RowData
	})
}
