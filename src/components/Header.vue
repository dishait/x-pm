<script setup lang="ts">
import prettyBytes from 'pretty-bytes'
import { createFsComputed } from 'file-computed'
import { CACHE_PATH } from '../composables/constant'
import { shallowGetFolderSize } from '../composables/fs'
import {
	FileTrayOutline,
	ExtensionPuzzleOutline
} from '@vicons/ionicons5'

defineProps<{
	total: number
}>()

const fsComputed = createFsComputed({
	cachePath: CACHE_PATH
})

const bytes = await fsComputed(
	CACHE_PATH,
	async function () {
		return prettyBytes(
			await shallowGetFolderSize(CACHE_PATH)
		)
	}
)
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
