<script setup lang="ts">
import type {
	TableColumnData,
	TableData
} from '@arco-design/web-vue'
const rowSelection = {
	showCheckedAll: true
}

const columns: TableColumnData[] = [
	{
		title: 'name',
		dataIndex: 'name',
		align: 'center'
	},
	{
		title: 'description',
		dataIndex: 'description',
		align: 'center',
		slotName: 'description',
		width: 400
	},
	{
		title: 'type',
		dataIndex: 'type',
		align: 'center',
		slotName: 'type'
	},
	{
		title: 'open',
		slotName: 'open',
		align: 'center'
	}
]
const data: TableData[] = reactive([
	{
		key: '1',
		name: 'Demo',
		type: 'node',
		description: '测试'
	}
])

const colors = {
	root: 'red',
	node: 'green',
	deno: 'default'
}

function handleTagColor(type: 'root' | 'node' | 'deno') {
	return colors[type]
}
</script>

<template>
	<a-table
		:data="data"
		:columns="columns"
		column-resizable
		:pagination="false"
		:row-selection="rowSelection">
		<template #type="{ record }">
			<a-tag bordered :color="handleTagColor(record.type)">
				{{ record.type }}
			</a-tag>
		</template>
		<template #description="{ record }">
			<a-input v-model="record.description" />
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
