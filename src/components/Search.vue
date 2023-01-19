<template>
	<NInput placeholder="Search">
		<template #prefix>
			<NIcon :component="FlashOutline" />
		</template>
	</NInput>
</template>

<script lang="ts" setup>
import { FlashOutline } from '@vicons/ionicons5'
</script>
