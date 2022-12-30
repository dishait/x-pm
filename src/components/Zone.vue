<script setup lang="ts">
import { basename } from 'path'
import type { MabyeFiles, Dirs } from '../types'
import { showDirectoryDialog } from '../samples/node-api'

const emit = defineEmits<{
	(e: 'onAdd', dirs: Dirs): void
}>()

const dropZoneRef = ref<HTMLDivElement>()

function onDrop(dirs: MabyeFiles) {
	dirs ??= []
	emit(
		'onAdd',
		dirs
			.filter(dir => !dir.type)
			.map(dir => {
				return {
					name: dir.name,
					path: dir.path
				}
			})
	)
}

useDropZone(dropZoneRef, onDrop)

async function selectDirectory() {
	const dir = await showDirectoryDialog()

	if (!dir) {
		return emit('onAdd', [])
	}

	emit('onAdd', [
		{
			path: dir,
			name: basename(dir)
		}
	])
}
</script>

<template>
	<div
		class="bg-gray-100 cursor-pointer flex justify-center items-center rounded"
		ref="dropZoneRef"
		@click="selectDirectory">
		<slot />
	</div>
</template>
