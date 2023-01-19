<template>
	<NButton secondary circle @click="openDirectory">
		<template #icon>
			<NIcon size="15px"><AlbumsOutline /> </NIcon>
		</template>
	</NButton>
</template>

<script lang="ts" setup>
import { openDirectory as _openDirectory } from '../../composables/open'
import { AlbumsOutline } from '@vicons/ionicons5'

const emits = defineEmits<{
	(e: 'onOpenDirectory', path: string): void
}>()

async function openDirectory() {
	const path = await _openDirectory()
	if (path) {
		emits('onOpenDirectory', path)
	}
}
</script>
