<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import { naiveTheme, SwitchIcon } from 'vue-dark-switch'
import 'vue-dark-switch/dist/style.css'

defineProps<{
	total: number
}>()
</script>

<template>
	<NConfigProvider
		:locale="zhCN"
		:theme="naiveTheme"
		:date-locale="dateZhCN">
		<NSpace class="p-3" justify="space-between">
			<NStatistic label="总数">
				<NNumberAnimation
					:from="0"
					:to="total"
					show-separator />
			</NStatistic>
			<SwitchIcon />
		</NSpace>

		<slot />
	</NConfigProvider>
</template>
