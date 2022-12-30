import type { Dirs, Tabs } from '../types'
import { Notification, Modal } from '@arco-design/web-vue'

export function useTabs() {
	const tabs = useStorage<Tabs>('tabs', [])
	const activeKey = useStorage('activeKey', '')

	function onAdd(dirs: Dirs) {
		const news: Tabs = []

		for (const dir of dirs) {
			const exist = tabs.value.some(tab => {
				return tab.key === dir.path
			})

			if (exist) {
				Notification.warning({
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

			Notification.success({
				closable: true,
				title: `${dir.path}`,
				content: '添加目录成功'
			})
		}

		tabs.value.push(...news)
	}

	function onDelete(key: string | number) {
		Modal.info({
			title: `真的要移除目录?`,
			content: `${key}`,
			cancelText: '算了',
			closable: true,
			okText: '移除',
			draggable: true,
			hideCancel: false,
			simple: false,
			width: '400px',
			onOk() {
				const index = tabs.value.findIndex(
					tab => tab.key === key
				)
				tabs.value.splice(index)
				Notification.info({
					closable: true,
					title: `${key}`,
					content: '移除目录成功'
				})
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
