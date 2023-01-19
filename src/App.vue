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
		<NSpace vertical class="p-2" size="medium">
			<NSpace justify="space-between" align="end">
				<NInputGroup class="w-400px">
					<Search />
					<NButton> Enter </NButton>
				</NInputGroup>
				<ActionDialog
					@on-open-directory="onOpenDirectory" />
			</NSpace>
			<Table />
		</NSpace>
	</Theme>
</template>
