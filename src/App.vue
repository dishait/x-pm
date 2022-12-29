<script setup lang="ts">
import Zone from './components/Zone.vue'
import Tabs from './components/Tabs.vue'
import Table from './components/Table.vue'
import '@arco-design/web-vue/es/modal/style/css.js'
import type { Dirs, Tabs as TabsType } from './types'
import type { TableData } from '@arco-design/web-vue'
import { Notification, Modal } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/notification/style/css.js'

import {
	readdir,
	existsSync,
	resolve
} from './samples/node-api'

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

const loading = ref(true)

async function showProjects() {
	const keys: string[] = []
	const promises = tabs.value.map(tab => {
		keys.push(tab.key)
		return readdir(tab.key, {
			withFileTypes: true
		})
	})
	const projectDirs = await Promise.all(promises)

	loading.value = false
	return projectDirs.map((dir, index) => {
		const key = keys[index]
		return dir
			.filter(p => p.isDirectory())
			.map(p => {
				const name = p.name
				const root = resolve(key, p.name)
				const types: string[] = []

				function _existsSync(file: string) {
					return existsSync(resolve(root, file))
				}

				function isNode() {
					return _existsSync('package.json')
				}

				function isDeno() {
					return (
						_existsSync('mod.ts') ||
						_existsSync('deno.jsonc') ||
						_existsSync('deno.json')
					)
				}

				function isUnknown() {
					return types.length === 0
				}

				if (isNode()) {
					types.push('node')
				}

				if (isDeno()) {
					types.push('deno')
				}

				if (isUnknown()) {
					types.push('unknown')
				}

				return {
					name,
					types,
					path: root
				}
			})
	})
}

const projects = computedAsync<TableData[][]>(
	showProjects,
	[]
)

const projectsCounter = computed(() => {
	return projects.value.flat().length
})
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
						<a-statistic
							animation
							:value="projectsCounter" />
					</template>
				</Tabs>
			</a-space>
		</a-space>
	</div>
</template>
