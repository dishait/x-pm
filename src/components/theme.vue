<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import { naiveTheme } from 'vue-dark-switch'

const SwitchIcon = defineAsyncComponent(async () => {
	import('vue-dark-switch/dist/style.css')
	import('vue-dark-switch/dist/polyfill/global.css')
	// @ts-ignore
	import('vue-dark-switch/dist/polyfill/global.js')
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
			<SwitchIcon :unmount-persets="true" />
		</NSpace>

		<slot />
	</NConfigProvider>
</template>
