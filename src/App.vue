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
	onDelete: onTabDelete
} = useTabs()

const {
	refresh,
	projects,
	projectsTotal,
	evaluating: loading
} = computedProjects(tabs)
</script>

<template>
	<div class="p-10">
		<a-space direction="vertical" size="large">
			<a-popover>
				<Zone @onAdd="onTabAdd">
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

				<Tabs
					:tabs="tabs"
					v-model:active-key="activeKey"
					@onDelete="onTabDelete">
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
								@click="refresh"
								class="cursor-pointer"
								:value="projectsTotal" />
						</a-tooltip>
					</template>
				</Tabs>
			</a-space>
		</a-space>
	</div>
</template>
