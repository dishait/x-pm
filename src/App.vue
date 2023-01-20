<script setup lang="ts">
import { useTabs } from './composables/tabs'
import { message } from './composables/discrete'
import { generateRowsFromBase } from './composables/rows'
import { openDirectory as _openDirectory } from './composables/open'
import { RowData } from './types'

const { tabs, tabPaths, currentTab, handleTabsClose } = $(
	useTabs()
)

function handleDirectoryPath(path: string) {
	path = slash(path)
	if (tabPaths.includes(path)) {
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

const tableDatas = computedAsync(async function () {
	return (await Promise.all(
		tabs.map(tab => {
			return generateRowsFromBase(tab.path)
		})
	)) as RowData[][]
}, [])
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
				v-for="(tab, index) of tabs"
				:key="tab.path"
				:name="tab.path"
				:tab="tab.name">
				<Table :data="tableDatas[index] ?? []"> </Table>
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
