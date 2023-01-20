<script setup lang="ts">
import type { Tabs } from './types'
import { isNumber } from 'm-type-tools'
import { message } from './composables/discrete'
import { openDirectory as _openDirectory } from './composables/open'

let tabs = $(useStorage<Tabs>('tabs', []))

const paths = $computed(() => tabs.map(t => t.path))

function handleDirectoryPath(path: string) {
	path = slash(path)
	if (paths.includes(path)) {
		return message.warning(`${path} 已存在，请误重复添加！`)
	}
	tabs.push({
		path,
		name: extractName(path)
	})
	message.info(`${path} 添加成功！`)
}

async function openDirectory() {
	const path = await _openDirectory()
	if (path) {
		handleDirectoryPath(path)
	}
}

const alertEmptyVisible = $computed(() => tabs.length === 0)

let currentTab = $ref(tabs[0]?.path ?? 'Empty')

function handleTabsClose(path: string | number) {
	if (isNumber(path)) {
		return tabs.splice(path, 1)
	}
	tabs = tabs.filter(t => t.path !== path)
}

watchArray($$(tabs), (newTabs, _, added, removed) => {
	const shouldMove =
		Boolean(added.length) || Boolean(removed.length)

	if (shouldMove) {
		currentTab = newTabs.at(-1)?.path ?? 'Empty'
	}
})
</script>

<template>
	<Theme>
		<NTabs
			type="card"
			class="p-4"
			animated
			closable
			v-model:value="currentTab"
			@close="handleTabsClose">
			<NTabPane
				v-for="tab of tabs"
				:key="tab.path"
				:name="tab.path"
				:tab="tab.name">
				{{ tab.name }}
			</NTabPane>

			<NTabPane
				name="Empty"
				tab="Empty"
				:closable="false"
				v-if="alertEmptyVisible">
				<AlertEmpty
					title="未发现项目"
					description="请点击手动添加目录"
					class="cursor-pointer"
					@click="openDirectory" />
			</NTabPane>

			<template #suffix>
				<NSpace>
					<NTooltip trigger="hover">
						<template #trigger>
							<ActionDialog
								@on-open-directory="handleDirectoryPath" />
						</template>
						添加目录
					</NTooltip>
					<Search />
				</NSpace>
			</template>
		</NTabs>
	</Theme>
</template>
