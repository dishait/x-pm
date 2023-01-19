<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { naiveTheme, SwitchIcon } from 'vue-dark-switch'
import 'vue-dark-switch/dist/style.css'
</script>

<template>
	<n-config-provider :theme="naiveTheme">
		<slot />
		<div class="fixed top-5 right-5">
			<SwitchIcon />
		</div>
	</n-config-provider>
</template>
