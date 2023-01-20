<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import { naiveTheme, SwitchIcon } from 'vue-dark-switch'
import 'vue-dark-switch/dist/style.css'
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
