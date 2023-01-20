import type { Ref } from 'vue'
import { Tabs, RowData } from './../types'

const parallel = Promise.all.bind(Promise)

export function useTableDatas(tabs: Ref<Tabs>) {
	const evaluating = ref(false)

	let oldTableDatas: RowData[][] = []
	const tableDatas = computedAsync(
		async function () {
			oldTableDatas = await parallel(
				tabs.value.map((tab, index) => {
					const oldRows = oldTableDatas[index]
					if (oldRows) {
						return oldRows
					}
					return generateRowsFromBase(tab.path)
				})
			)
			return oldTableDatas
		},
		[],
		evaluating
	)

	return {
		evaluating,
		tableDatas
	}
}
