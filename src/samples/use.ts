import type { Dirs, Tabs } from '../types'
import { lazyUseNotification, lazyUseModal } from './lazy'

export function useTabs() {
	const tabs = useStorage<Tabs>('tabs', [])
	const activeKey = useStorage<string>('activeKey', '')

	const addHook = createEventHook<Tabs>()
	const deleteHook = createEventHook<number>()

	function refreshActiveKey() {
		activeKey.value = tabs.value.at(-1)?.key ?? ''
	}

	async function handleAdd(dirs: Dirs) {
		const news: Tabs = []

		const notification = await lazyUseNotification()
		for (const dir of dirs) {
			const exist = tabs.value.some(tab => {
				return tab.key === dir.path
			})

			if (exist) {
				notification.warning({
					closable: true,
					title: `${dir.path}`,
					content: '该目录已存在，请勿反复添加'
				})
				continue
			}

			news.push({
				key: dir.path,
				title: dir.name
			})

			notification.info({
				closable: true,
				title: `${dir.path}`,
				content: '添加成功'
			})
		}

		addHook.trigger(news)
		tabs.value.push(...news)
	}

	async function handleDelete(key: string | number) {
		const modal = await lazyUseModal()
		modal.info({
			title: `真的要移除目录?`,
			content: `${key}`,
			cancelText: '算了',
			closable: true,
			okText: '移除',
			draggable: true,
			hideCancel: false,
			simple: false,
			width: '400px',
			async onOk() {
				const index = tabs.value.findIndex(
					tab => tab.key === key
				)
				tabs.value.splice(index, 1)

				const notification = await lazyUseNotification()
				notification.info({
					closable: true,
					title: `${key}`,
					content: '移除目录成功'
				})

				deleteHook.trigger(index)
			}
		})
	}

	watch(tabs, () => {
		refreshActiveKey()
	})

	const currentTab = computed(() => {
		return tabs.value.find(
			tab => tab.key === activeKey.value
		)
	})

	return {
		tabs,
		activeKey,
		handleAdd,
		currentTab,
		handleDelete,
		onAdd: addHook.on,
		onDelete: deleteHook.on
	}
}

export function useSearch() {
	const text = useStorage('searchText', '')
	const evaluating = computed(() => text.value.length > 0)
	const startHook = createEventHook<void>()
	const closeHook = createEventHook<void>()

	whenever(evaluating, () => {
		startHook.trigger()
	})

	whenever(
		() => !evaluating.value,
		() => {
			closeHook.trigger()
		}
	)

	function reset() {
		text.value = ''
	}

	return {
		text,
		reset,
		evaluating,
		onStart: startHook.on,
		onClose: closeHook.on
	}
}
