<script setup lang="ts">
import { useTabs } from './composables/tabs'
import { useTableDatas } from './composables/table'
import { message, loadingBar } from './composables/discrete'
import { openDirectory as _openDirectory } from './composables/open'

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

const { tableDatas, evaluating, refresh } = $(
	useTableDatas($$(tabs))
)

const total = $computed(
	() => tableDatas?.flat().length ?? 0
)

watchEffect(() => {
	if (evaluating && !alertEmptyVisible) {
		loadingBar.start()
	} else {
		loadingBar.finish()
	}
})
</script>

<template>
	<Theme>
		<template #header>
			<Suspense>
				<Header :total="total" />
				<template #fallback>
					<NSpin size="large" />
				</template>
			</Suspense>
		</template>
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
				:tab="tab.name"
				display-directive="show:lazy">
				<Table
					:loading="evaluating"
					:data="tableDatas![index] ?? []">
				</Table>
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
					<ActionRefresh @refresh="refresh" />
					<ActionDialog
						@on-open-directory="handleDirectoryPath" />
					<Search />
				</NSpace>
			</template>
		</NTabs>
	</Theme>
</template>
