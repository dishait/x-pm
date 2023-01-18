<script setup lang="ts">
import Fuse from 'fuse.js'
import Zone from './components/Zone.vue'
import Tabs from './components/Tabs.vue'
import {
	LazyTable,
	LazySwitchDarkIcon
} from './composables/lazy'
import { useTabs, useSearch } from './composables/use'
import { computedProjects } from './composables/computed'

const {
	tabs,
	activeKey,
	onAdd: onTabAdd,
	onDelete: onTabDelete,
	handleAdd: handleTabAdd,
	handleDelete: handleTabDelete
} = useTabs()

const {
	text: serachText,
	reset: resetSearchText,
	onStart: onStartSearching,
	onClose: onCloseSearching
} = useSearch()

const searchTab = {
	key: 'search',
	title: 'Search'
}

const searching = computed(() => {
	return tabs.value.some(tab => tab.key === searchTab.key)
})

const normalTabs = computed(() => {
	return tabs.value.filter(tab => tab.key !== searchTab.key)
})

whenever(() => !searching.value, resetSearchText)

const {
	refresh,
	projects,
	evaluating: loading,
	total: projectsTotal
} = computedProjects(normalTabs)

onTabAdd(tabs => refresh({ type: 'add', tabs }))
onTabDelete(index => refresh({ type: 'delete', index }))

onStartSearching(() => {
	tabs.value.push(searchTab)
})

onCloseSearching(() => {
	tabs.value = normalTabs.value
})

const fuse = computed(() => {
	return new Fuse(projects.value.flat(), {
		keys: ['name']
	})
})

const searchTabIndex = computed(() => {
	return tabs.value.findIndex(
		tab => tab.key === searchTab.key
	)
})

const lazySerachText = useThrottle(
	serachText,
	1000,
	true,
	true
)

const foundProjects = computed(() => {
	return fuse.value
		.search(lazySerachText.value)
		.map(p => p.item)
})

const projectsWithSearchResults = computed(() => {
	return new Proxy(projects.value, {
		get(target, index, receiver) {
			if (searchTabIndex.value === Number(index)) {
				return foundProjects.value
			}

			if (
				searchTabIndex.value !== -1 &&
				Number(index) > searchTabIndex.value
			) {
				return Reflect.get(
					target,
					Number(index) - 1,
					receiver
				)
			}

			return Reflect.get(target, index, receiver)
		}
	})
})

function onSearchFocus() {
	if (searching.value) {
		activeKey.value = searchTab.key
	}
}
</script>

<template>
	<div class="p-5">
		<a-space direction="vertical" size="medium" fill>
			<div class="flex justify-end">
				<Suspense>
					<LazySwitchDarkIcon />

					<template #fallback>
						<div class="flex justify-center">
							<a-spin />
						</div>
					</template>
				</Suspense>
			</div>

			<a-popover>
				<Zone class="h-20vh w-full flex justify-center items-center rounded" @onAdd="handleTabAdd">
					<a-space>
						<icon-file :size="32" class="!text-gray-400" />

						<a-statistic animation class="cursor-pointer" :value-style="{ color: 'rgb(156, 163, 175)' }"
							:animation-duration="1500" :value="projectsTotal" />
					</a-space>
				</Zone>

				<template #content>
					<a-list size="small" :bordered="false">
						<a-list-item>
							<icon-launch :size="15" class="!text-gray-500" />
							点击选择
						</a-list-item>
						<a-list-item>
							<icon-drag-arrow :size="15" class="!text-gray-500" />
							拖入目录
						</a-list-item>
					</a-list>
				</template>
			</a-popover>

			<a-input-search v-model="serachText" @focus="onSearchFocus" :style="{ width: '320px' }"
				placeholder="请输入你要搜索的项目" />
			<Transition name="slide-fade" mode="out-in">
				<Tabs v-if="tabs.length > 0" :tabs="tabs" v-model:active-key="activeKey" @onDelete="handleTabDelete">
					<template #default="{ index }">
						<Suspense>
							<LazyTable :loading="loading" :data="
								projectsWithSearchResults[index] || []
							" />

							<template #fallback>
								<div class="flex justify-center">
									<a-spin dot />
								</div>
							</template>
						</Suspense>
					</template>

					<template #extra>
						<a-space>
							<a-tooltip mini content="点击刷新" background-color="#455a64">
								<a-button shape="round">
									<template #icon>
										<icon-refresh @click="refresh()" />
									</template>
								</a-button>
							</a-tooltip>

							<a-tooltip mini content="新建项目" background-color="#00897b">
								<a-button shape="round" status="success">
									<template #icon>
										<icon-folder-add />
									</template>
								</a-button>
							</a-tooltip>

							<a-tooltip mini content="删除选中" background-color="#e53935">
								<a-button shape="round" status="danger">
									<template #icon>
										<icon-delete />
									</template>
								</a-button>
							</a-tooltip>
						</a-space>
					</template>
				</Tabs>

				<a-empty v-else description="暂无项目，请手动添加 🦕 " />
			</Transition>
		</a-space>
	</div>
</template>

<style>
.slide-fade-enter-active {
	transition: all 0.2s ease-in-out;
}

.slide-fade-leave-active {
	transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
</style>
