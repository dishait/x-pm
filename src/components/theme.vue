<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import { naiveTheme, SwitchIcon } from 'vue-dark-switch'
import 'vue-dark-switch/dist/style.css'
</script>

<template>
	<NConfigProvider
		:theme="naiveTheme"
		:locale="zhCN"
		:date-locale="dateZhCN">
		<div class="flex justify-end p-3">
			<SwitchIcon />
		</div>
		<slot />
	</NConfigProvider>
</template>
