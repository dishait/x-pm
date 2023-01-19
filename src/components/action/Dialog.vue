<template>
	<NButton secondary circle @click="openDirectory">
		<template #icon>
			<NIcon size="15px"><AlbumsOutline /> </NIcon>
		</template>
	</NButton>
</template>

<script lang="ts" setup>
import { ipcRenderer } from 'electron'
import { isString } from 'm-type-tools'
import { AlbumsOutline } from '@vicons/ionicons5'
import { message } from '../../composables/discrete'

const emits = defineEmits<{
	(e: 'onOpenDirectory', path: string): void
}>()

async function openDirectory() {
	const path = (await ipcRenderer.invoke(
		'openDirectory'
	)) as string | undefined

	if (!isString(path)) {
		message.warning('未选择文件夹')
		return
	}

	emits('onOpenDirectory', path)
}
</script>
