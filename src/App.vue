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
			<Zone @onAdd="onAdd" />

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
