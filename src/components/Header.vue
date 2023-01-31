<script setup lang="ts">
import { CACHE_PATH } from '../composables/constant'
import { getFolderSizeForce } from '../composables/fs'
import {
	FileTrayOutline,
	ExtensionPuzzleOutline
} from '@vicons/ionicons5'

defineProps<{
	total: number
}>()

const bytes = await getFolderSizeForce(CACHE_PATH)
</script>

<template>
	<NSpace :size="30">
		<NStatistic label="项目数汇总">
			<template #prefix>
				<NIcon>
					<FileTrayOutline />
				</NIcon>
			</template>
			<NNumberAnimation
				:from="0"
				:to="total"
				show-separator />
		</NStatistic>
		<NStatistic label="表缓存大小">
			<template #prefix>
				<NIcon>
					<ExtensionPuzzleOutline />
				</NIcon>
			</template>
			{{ bytes }}
		</NStatistic>
	</NSpace>
</template>
