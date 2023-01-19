<template>
	<NAlert :title="title" type="default">
		<template #icon>
			<NIcon size="20px">
				<ChatbubblesOutline />
			</NIcon>
		</template>
		{{ description }}
	</NAlert>
</template>

<script lang="ts" setup>
import { ChatbubblesOutline } from '@vicons/ionicons5'

defineProps<{
	title: string
	description: string
}>()
</script>
