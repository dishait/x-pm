<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { naiveTheme, SwitchIcon } from 'vue-dark-switch'
import 'vue-dark-switch/dist/style.css'
</script>

<template>
	<NConfigProvider :theme="naiveTheme">
		<div class="flex justify-end p-2">
			<SwitchIcon />
		</div>
		<slot />
	</NConfigProvider>
</template>
