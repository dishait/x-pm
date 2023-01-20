import type { Ref } from 'vue'
import { Tabs, RowData } from './../types'

const parallel = Promise.all.bind(Promise)

export function useTableDatas(tabs: Ref<Tabs>) {
	const evaluating = ref(false)

	const isRefresh = ref(true)

	let oldTabPaths: string[] = []
	let oldTableDatas: RowData[][] = []

	function updateOldTabPaths() {
		oldTabPaths = tabs.value.map(tab => tab.path)
	}

	async function update(
		mode: 'refresh' | 'add' | 'delete' | 'ignore'
	) {
		if (mode === 'ignore') {
			return oldTableDatas
		}

		if (mode === 'add') {
			oldTableDatas = await parallel(
				tabs.value.map((tab, index) => {
					const oldRows = oldTableDatas[index]
					if (oldRows) {
						return oldRows
					}
					return generateRowsFromBase(tab.path)
				})
			)
			updateOldTabPaths()
			return oldTableDatas
		}

		if (mode === 'delete') {
			const discardIndexs: number[] = []

			oldTabPaths.forEach((oldTabPath, oldTabIndex) => {
				const discard = !tabs.value.some(
					tab => tab.path === oldTabPath
				)
				if (discard) {
					discardIndexs.push(oldTabIndex)
				}
			})

			oldTableDatas = oldTableDatas.filter((_, index) => {
				return !discardIndexs.includes(index)
			})

			updateOldTabPaths()
			return oldTableDatas
		}

		if (mode === 'refresh') {
			oldTableDatas = await parallel(
				tabs.value.map(tab => {
					return generateRowsFromBase(tab.path)
				})
			)
			updateOldTabPaths()
			isRefresh.value = false
			return oldTableDatas
		}
	}

	function inferUpdate() {
		if (isRefresh.value) {
			return update('refresh')
		}

		const isIgnore =
			oldTabPaths.length === tabs.value.length

		if (isIgnore) {
			return update('ignore')
		}

		const isAdd = oldTabPaths.length < tabs.value.length
		if (isAdd) {
			return update('add')
		}

		const isDelete = oldTabPaths.length > tabs.value.length
		if (isDelete) {
			return update('delete')
		}

		return update('refresh')
	}

	const tableDatas = computedAsync(inferUpdate, [], {
		lazy: true,
		evaluating
	})

	function refresh() {
		isRefresh.value = true
	}

	return {
		refresh,
		evaluating,
		tableDatas
	}
}
