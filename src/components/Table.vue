<script setup lang="ts">
import type {
	TableData,
	TableColumnData
} from '@arco-design/web-vue'

const columns: TableColumnData[] = [
	{
		title: '项目',
		dataIndex: 'name',
		width: 200
	},
	{
		title: '类型',
		dataIndex: 'type',
		align: 'center',
		slotName: 'type'
	},
	{
		title: '启动',
		slotName: 'open',
		align: 'center'
	}
]

defineProps<{
	data: TableData[]
}>()

const colors = {
	node: 'green',
	deno: 'blue',
	unknown: 'gray'
}

function handleTagColor(type: 'node' | 'deno') {
	return colors[type]
}
</script>

<template>
	<a-table
		:data="data"
		:scroll="{
			y: 350
		}"
		:columns="columns"
		column-resizable
		:pagination="false">
		<template #type="{ record }">
			<a-space>
				<a-tag
					v-for="v of record.type"
					:key="v"
					:color="handleTagColor(v)">
					{{ v }}
				</a-tag>
			</a-space>
		</template>
		<template #open="{ record }">
			<a-space>
				<a-button status="success" shape="round">
					<template #icon>
						<icon-edit />
					</template>
				</a-button>
				<a-button status="warning" shape="round">
					<template #icon>
						<icon-folder />
					</template>
				</a-button>
			</a-space>
		</template>
	</a-table>
</template>
