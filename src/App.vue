<script setup lang="ts">
import Zone from './components/Zone.vue'
import Tabs from './components/Tabs.vue'
import type { Dirs, Tabs as TabsType } from './types'

let tabs: TabsType = $ref([
	{
		key: '1',
		title: 'Demo'
	},
	{
		key: '2',
		title: 'Work'
	}
])

function onAdd(dirs: Dirs) {
	console.log('onAdd', dirs)
}

function onTabAdd() {}

function onTabDelete(key: string | number) {
	tabs = tabs.filter(tab => tab.key !== key)
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

				<Tabs
					:tabs="tabs"
					@onAdd="onTabAdd"
					@onDelete="onTabDelete">
					<a-empty />
				</Tabs>
			</a-space>
		</a-space>
	</div>
</template>
