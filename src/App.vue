<script setup lang="ts">
import { useTabs } from './samples/use'
import Zone from './components/Zone.vue'
import Tabs from './components/Tabs.vue'
import { defineAsyncComponent } from 'vue'
import { computedProjects } from './samples/computed'

const Table = defineAsyncComponent(
	() => import('./components/Table.vue')
)

const {
	tabs,
	activeKey,
	onAdd: onTabAdd,
	onDelete: onTabDelete,
	handleAdd: handleTabAdd,
	handleDelete: handleTabDelete
} = useTabs()

const {
	refresh,
	projects,
	evaluating: loading,
	total: projectsTotal
} = computedProjects(tabs)

onTabAdd(tabs => refresh({ type: 'add', tabs }))
onTabDelete(index => refresh({ type: 'delete', index }))
</script>

<template>
	<div class="p-10">
		<a-space direction="vertical" size="large" fill>
			<a-popover>
				<Zone class="h-20vh w-full" @onAdd="handleTabAdd">
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

			<a-input-search
				:style="{ width: '320px' }"
				placeholder="请输入你要搜索的项目" />

			<Transition name="slide-fade" mode="out-in">
				<Tabs
					v-if="tabs.length > 0"
					:tabs="tabs"
					v-model:active-key="activeKey"
					@onDelete="handleTabDelete">
					<template #default="{ index }">
						<Suspense>
							<Table
								:loading="loading"
								:data="projects[index] || []" />

							<template #fallback>
								<div class="flex justify-center">
									<a-spin dot />
								</div>
							</template>
						</Suspense>
					</template>

					<template #extra>
						<a-tooltip content="点击刷新" mini>
							<a-statistic
								animation
								placeholder="total"
								@click="refresh()"
								class="cursor-pointer"
								:animation-duration="1500"
								:value="projectsTotal" />
						</a-tooltip>
					</template>
				</Tabs>

				<a-empty
					v-else
					description="暂无项目，请手动添加 🦕 " />
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
