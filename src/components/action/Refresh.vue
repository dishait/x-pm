<script setup lang="ts">
import { FlashOutline } from '@vicons/ionicons5'

const emits = defineEmits<{
	(e: 'refresh'): void
}>()

function refresh() {
	emits('refresh')
}
</script>

<template>
	<NTooltip trigger="hover">
		<template #trigger>
			<NButton secondary circle @click="refresh">
				<template #icon>
					<NIcon size="15px">
						<FlashOutline />
					</NIcon>
				</template>
			</NButton>
		</template>
		刷新
	</NTooltip>
</template>
