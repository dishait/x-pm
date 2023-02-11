<template>
	<NTooltip trigger="hover">
		<template #trigger>
			<NButton circle secondary @click="openDirectory">
				<template #icon>
					<NIcon size="15px">
						<AlbumsOutline />
					</NIcon>
				</template>
			</NButton>
		</template>
		添加目录
	</NTooltip>
</template>

<script lang="ts" setup>
import { AlbumsOutline } from '@vicons/ionicons5'
import { openDirectory as _openDirectory } from '../../composables/open'

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
