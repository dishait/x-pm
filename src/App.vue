<script setup lang="ts">
import type { Roots } from './types'
import { message } from './composables/discrete'
import { openDirectory as _openDirectory } from './composables/open'
import { isNumber } from 'm-type-tools'

let roots = $(useStorage<Roots>('roots', []))

const paths = $computed(() => roots.map(r => r.path))

function handleDirectoryPath(path: string) {
	path = slash(path)
	if (paths.includes(path)) {
		return message.warning(`${path} 已存在，请误重复添加！`)
	}
	roots.push({
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

const alertEmptyVisible = $computed(
	() => roots.length === 0
)

let currentTab = $ref(roots[0]?.path ?? 'Empty')

function handleTabsClose(path: string | number) {
	if (isNumber(path)) {
		return roots.splice(path, 1)
	}
	roots = roots.filter(r => r.path !== path)
}

watchArray(
	$$(roots),
	(newRoots, oldRoots, added, removed) => {
		const backOff = Boolean(removed.length)
		const forward = Boolean(added.length)

		if (forward || backOff) {
			currentTab = newRoots.at(-1)?.path ?? 'Empty'
		}
	}
)
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
				v-for="r of roots"
				:key="r.path"
				:name="r.path"
				:tab="r.name">
				{{ r.name }}
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
