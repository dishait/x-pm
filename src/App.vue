<script setup lang="ts">
import { useTabs } from './composables/tabs'
import { useSearch } from './composables/search'
import { useTableDatas } from './composables/table'
import { message, loadingBar } from './composables/discrete'
import { openDirectory as _openDirectory } from './composables/open'

const Search = defineAsyncComponent(
	() => import('./components/Search.vue')
)

const AlertEmpty = defineAsyncComponent(
	() => import('./components/alert/empty.vue')
)

const Table = defineAsyncComponent(
	() => import('./components/Table.vue')
)

let {
	tabs,
	tabPaths,
	currentTab,
	handleTabsClose: _handleTabsClose
} = $(useTabs())

async function handleDirectoryPath(path: string) {
	path = slash(path)
	if (tabPaths.includes(path)) {
		return message?.warning(
			`${path} 已存在，请误重复添加！`
		)
	}
	tabs.push({
		path,
		name: extractName(path)
	})
	message?.info(`${path} 添加成功！`)
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
		loadingBar?.start()
	} else {
		loadingBar?.finish()
	}
})

const totalTableDatas = $computed(
	() => tableDatas?.flat() ?? []
)

let {
	ing: searching,
	value: searchValue,
	result: searchResult
} = $(useSearch($$(totalTableDatas)))

let lastTab: string
watch($$(searching), ing => {
	if (ing) {
		lastTab = currentTab
		currentTab = 'Search'
	} else {
		if (!lastTab || lastTab === 'Search') {
			currentTab = tabs.at(-1)?.path ?? 'Empty'
		} else {
			currentTab = lastTab
		}
	}
})

function handleTabsClose(path: string | number) {
	if (path === 'Search') {
		return (searchValue = '')
	}
	_handleTabsClose(path)
}
</script>

<template>
	<Theme>
		<Search v-model:value="searchValue" />
		<template #header>
			<Suspense>
				<Header :total="total" />
				<template #fallback>
					<div class="h-62px w-200px flex flex justify-center items-center">
						<NSpin size="large" />
					</div>
				</template>
			</Suspense>
		</template>

		<NTabs type="card" class="p-4" animated closable v-model:value="currentTab" @close="handleTabsClose">
			<NTabPane v-for="(tab, index) of tabs" :key="tab.path" :name="tab.path" :tab="tab.name"
				display-directive="show:lazy">
				<Suspense>
					<Table :loading="evaluating" :data="tableDatas![index] ?? []">
					</Table>
					<template #fallback>
						<NSpace justify="center" align="center" class="h-550px">
							<NSpin size="large" />
						</NSpace>
					</template>
				</Suspense>
			</NTabPane>

			<NTabPane name="Empty" tab="Empty" :closable="false" v-if="alertEmptyVisible">
				<AlertEmpty title="未发现项目" description="请点击手动添加目录" class="cursor-pointer" @click="openDirectory" />
			</NTabPane>

			<NTabPane name="Search" tab="Search" v-if="searching" display-directive="show:lazy">
				<Suspense>
					<Table close-mtime-sort :loading="evaluating" :data="searchResult">
					</Table>
					<template #fallback>
						<NSpace justify="center" align="center" class="h-550px">
							<NSpin size="large" />
						</NSpace>
					</template>
				</Suspense>
			</NTabPane>

			<template #suffix>
				<NSpace>
					<ActionRefresh @refresh="refresh" />
					<ActionDialog @on-open-directory="handleDirectoryPath" />
				</NSpace>
			</template>
		</NTabs>
	</Theme>
</template>

<style>
/*
* 全局滚动条
*/
::-webkit-scrollbar-track {
	border-radius: 10px;
}

::-webkit-scrollbar {
	width: 7px;
	background-color: white;
}

::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: #bfbfbf;
}

/*
* 全局滚动条(暗黑模式)
*/
html.dark ::-webkit-scrollbar,
html.dark ::-webkit-scrollbar-track {
	background-color: #212529;
}

html.dark ::-webkit-scrollbar-thumb {
	background-color: #464649;
}
</style>
