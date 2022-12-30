import type { Dirs, Tabs } from '../types'

export const lazyUseNotification = createSharedComposable(
	async () => {
		const [{ default: Notification }] = await Promise.all([
			import('@arco-design/web-vue/es/notification'),
			import(
				// @ts-ignore
				'@arco-design/web-vue/es/notification/style/css.js'
			)
		])
		return Notification
	}
)

export const lazyUseModal = createSharedComposable(
	async () => {
		const [{ default: Modal }] = await Promise.all([
			import('@arco-design/web-vue/es/modal'),
			import(
				// @ts-ignore
				'@arco-design/web-vue/es/modal/style/css.js'
			)
		])
		return Modal
	}
)

export function useTabs() {
	const tabs = useStorage<Tabs>('tabs', [])
	const activeKey = useStorage<string>('activeKey', '')

	function refreshActiveKey() {
		activeKey.value = tabs.value[tabs.value.length - 1].key
	}

	async function onAdd(dirs: Dirs) {
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

		tabs.value.push(...news)
		refreshActiveKey()
	}

	async function onDelete(key: string | number) {
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

				refreshActiveKey()
			}
		})
	}

	return {
		tabs,
		onAdd,
		onDelete,
		activeKey
	}
}
