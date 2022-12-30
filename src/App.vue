<script setup lang="ts">
import Zone from './components/Zone.vue'
import Tabs from './components/Tabs.vue'
import Table from './components/Table.vue'
import '@arco-design/web-vue/es/modal/style/css.js'
import { computedProjects } from './samples/computed'
import type { Dirs, Tabs as TabsType } from './types'
import { Notification, Modal } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/notification/style/css.js'

const tabs = useStorage<TabsType>('tabs', [])

function onAdd(dirs: Dirs) {
	const news: TabsType = []

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

const {
	refresh,
	projects,
	projectsTotal,
	evaluating: loading
} = computedProjects(tabs)
</script>

<template>
	<div class="p-10">
		<a-space direction="vertical" size="large">
			<a-popover>
				<Zone @onAdd="onAdd">
					<icon-folder-add
						:size="40"
						class="!text-gray-400" />
				</Zone>

				<template #content>
					<a-list size="small" :bordered="false">
						<a-list-item>
							<icon-launch
								:size="15"
								class="!text-gray-500" />
							点击选择
						</a-list-item>
						<a-list-item>
							<icon-drag-arrow
								:size="15"
								class="!text-gray-500" />
							拖入目录
						</a-list-item>
					</a-list>
				</template>
			</a-popover>

			<a-space direction="vertical" size="large">
				<a-input-search
					:style="{ width: '320px' }"
					placeholder="请输入你要搜索的项目" />

				<Tabs :tabs="tabs" @onDelete="onDelete">
					<template #default="{ index }">
						<Table
							:loading="loading"
							:data="projects[index] || []" />
					</template>

					<template #extra>
						<a-tooltip content="点击刷新" mini>
							<a-statistic
								animation
								placeholder="total"
								@click="refresh"
								class="cursor-pointer"
								:value="projectsTotal" />
						</a-tooltip>
					</template>
				</Tabs>
			</a-space>
		</a-space>
	</div>
</template>
