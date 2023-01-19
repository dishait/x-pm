<script setup lang="ts">
import type { Roots } from './types'
import { message } from './composables/discrete'
import { openDirectory as _openDirectory } from './composables/open'

const roots = $(useStorage<Roots>('roots', []))

const paths = $computed(() => roots.map(r => r.path))

function handleDirectoryPath(path: string) {
	if (paths.includes(path)) {
		return message.warning(`${path} 已存在，请误重复添加！`)
	}
	const name = showNameFromPath(path)
	roots.push({
		name,
		path
	})
	message.info('添加成功！')
}

async function openDirectory() {
	const path = await _openDirectory()
	if (path) {
		handleDirectoryPath(path)
	}
}
</script>

<template>
	<Theme>
		<NTabs type="line" class="p-4" animated>
			<NTabPane name="oasis" tab="Oasis">
				Wonderwall
			</NTabPane>

			<NTabPane name="Empty" tab="Empty">
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
