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

		const size = ref<number>()
		const mtime = ref<number>()
		const birthtime = ref<number>()
		const tags = ref<RowData['tags']>()

		let readed = false
		function io() {
			if (readed) {
				return
			}
			readed = true
			getLstatTimes(path)
				.then(times => {
					mtime.value = times.mtime
					birthtime.value = times.birthtime
				})

			generateTags(path)
				.then(_tags => {
					tags.value = _tags
				})

			getFolderSize(path)
				.then(_size => {
					size.value = _size
				})
		}

		return {
			io,
			name,
			size,
			path,
			tags,
			mtime,
			birthtime
		} as RowData
	})
}
