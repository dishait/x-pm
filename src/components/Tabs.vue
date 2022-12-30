<script setup lang="ts">
import type { Tabs } from '../types'

const props = defineProps<{
	tabs: Tabs
	activeKey: string
}>()

const emits = defineEmits<{
	(e: 'onAdd', key: Event): void
	(e: 'onDelete', key: string | number): void
	(e: 'update:activeKey', key: string): void
}>()

const activeKey = useVModel(props, 'activeKey', emits)

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
		lazy-load
		@add="handleAdd"
		class="penetration"
		@delete="handleDelete"
		v-model:active-key="activeKey">
		<template #extra>
			<slot name="extra" />
		</template>

		<a-tab-pane
			v-for="(item, index) of tabs"
			:key="item.key"
			:title="item.title"
			closable>
			<slot
				:key="item.key"
				:title="item.title"
				:index="index" />
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
.penetration {
	width: calc(100vw - 5rem);
}
</style>
