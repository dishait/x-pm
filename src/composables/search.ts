import type { ComputedRef } from 'vue'
import Fuse from 'fuse.js'
import { RowData } from '../types'

export function useSearch(data: ComputedRef<RowData[]>) {
	let value = $(useStorage('Search', ''))

	let ing = $computed(() => value.length > 0)

	let store = $computed(() => {
		return new Fuse(data.value, {
			shouldSort: true,
			keys: ['name']
		})
	})

	let result = $computed(() =>
		store.search(value).map(v => v.item)
	)

	return $$({
		ing,
		value,
		store,
		result
	})
}
