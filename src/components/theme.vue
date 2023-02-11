<script setup lang="ts">
import { naiveTheme } from 'vue-dark-switch'
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'

const SwitchIcon = defineAsyncComponent(async () => {
	import('vue-dark-switch/dist/style.css')
	return (await import('vue-dark-switch')).SwitchIcon
})
</script>

<template>
	<NConfigProvider :locale="zhCN" :theme="naiveTheme" :date-locale="dateZhCN">
		<NSpace class="p-3" justify="space-between">
			<slot name="header" />
			<SwitchIcon :unmount-persets="true" />
		</NSpace>

		<slot />
	</NConfigProvider>
</template>
