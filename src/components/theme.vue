<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import { naiveTheme } from 'vue-dark-switch'

const SwitchIcon = defineAsyncComponent(async () => {
	import('vue-dark-switch/dist/style.css')
	return (await import('vue-dark-switch')).SwitchIcon
})
</script>

<template>
	<NConfigProvider
		:locale="zhCN"
		:theme="naiveTheme"
		:date-locale="dateZhCN">
		<NSpace class="p-3" justify="space-between">
			<slot name="header" />
			<SwitchIcon />
		</NSpace>

		<slot />
	</NConfigProvider>
</template>
