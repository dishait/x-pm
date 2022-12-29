<script setup lang="ts">
import Zone from './components/Zone.vue'
import Tabs from './components/Tabs.vue'
import type { Dirs, Tabs as TabsType } from './types'
import { Notification } from '@arco-design/web-vue'
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

function onTabDelete(key: string | number) {
	tabs.value = tabs.value.filter(tab => tab.key !== key)
}
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
					placeholder="Please enter something" />

				<Tabs :tabs="tabs" @onDelete="onTabDelete">
					<a-empty />
				</Tabs>
			</a-space>
		</a-space>
	</div>
</template>
