<script setup lang="ts">
import type { Tabs } from '../types'

defineProps<{
	tabs: Tabs
}>()

const emits = defineEmits<{
	(e: 'onAdd', key: Event): void
	(e: 'onDelete', key: string | number): void
}>()

const handleAdd = (ev: Event) => {
	emits('onAdd', ev)
}
const handleDelete = (
	key: string | number,
	event: Event
) => {
	emits('onDelete', key)
}
</script>

<template>
	<a-tabs
		editable
		@add="handleAdd"
		@delete="handleDelete"
		class="penetration"
		auto-switch>
		<template #extra>
			<a-space>
				<a-button status="success"> Create </a-button>
				<a-button status="danger"> Destroy </a-button>
			</a-space>
		</template>

		<a-tab-pane
			v-for="(item, index) of tabs"
			:key="item.key"
			:title="item.title"
			closable>
			<slot />
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
.penetration {
	width: calc(100vw - 5rem);
}
</style>
