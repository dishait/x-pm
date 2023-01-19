<script setup lang="ts">
import type { Roots } from './types'
import { message } from './composables/discrete'

const roots = $(useStorage<Roots>('roots', []))

const paths = $computed(() => roots.map(r => r.path))

function onOpenDirectory(path: string) {
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
</script>

<template>
	<Theme>
		<NTabs type="line" class="p-4" animated>
			<NTabPane name="oasis" tab="Oasis">
				Wonderwall
			</NTabPane>
			<NTabPane name="foo" tab="foo"> foo </NTabPane>

			<template #suffix>
				<NSpace>
					<NTooltip trigger="hover">
						<template #trigger>
							<ActionDialog
								@on-open-directory="onOpenDirectory" />
						</template>
						添加目录
					</NTooltip>
					<Search />
				</NSpace>
			</template>
		</NTabs>
	</Theme>
</template>
