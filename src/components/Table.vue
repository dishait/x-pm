<script setup lang="ts">
import type {
	TableData,
	TableColumnData,
	TableRowSelection
} from '@arco-design/web-vue'
import {
	openVscode,
	openFileManager
} from '../samples/node-api'

defineProps<{
	data: TableData[]
	loading: boolean
}>()

const columns: TableColumnData[] = [
	{
		title: '项目',
		dataIndex: 'name',
		width: 300,
		sortable: {
			sortDirections: ['ascend', 'descend']
		}
	},
	{
		title: '类型',
		dataIndex: 'types',
		align: 'center',
		slotName: 'types',
		filterable: {
			filters: [
				{
					text: 'node',
					value: 'node'
				},
				{
					text: 'deno',
					value: 'deno'
				},
				{
					text: 'go',
					value: 'go'
				},
				{
					text: 'unknown',
					value: 'unknown'
				}
			],
			filter: (values, record) => {
				return values.some(value =>
					record.types.includes(value)
				)
			},
			multiple: true
		}
	},
	{
		title: '启动',
		slotName: 'open',
		align: 'center'
	}
]

const colors = {
	go: 'blue',
	node: 'green',
	deno: 'orangered',
	unknown: 'gray'
}

function showTagColor(type: 'node' | 'deno') {
	return colors[type]
}

const scroll = { y: 350 }

const rowSelection = {
	type: 'checkbox',
	showCheckedAll: true,
	onlyCurrent: false
} as TableRowSelection

const selectedKeys = ref([])
</script>

<template>
	<a-table
		lazy-load
		:data="data"
		row-key="name"
		:scroll="scroll"
		:columns="columns"
		column-resizable
		:loading="loading"
		:row-selection="rowSelection"
		v-model:selectedKeys="selectedKeys"
		:pagination="false">
		<template #types="{ record }">
			<a-space>
				<a-tag
					v-for="type of record.types"
					:key="type"
					:color="showTagColor(type)">
					{{ type }}
				</a-tag>
			</a-space>
		</template>
		<template #open="{ record }">
			<a-space>
				<a-button shape="round">
					<template #icon>
						<icon-edit @click="openVscode(record.path)" />
					</template>
				</a-button>
				<a-button status="warning" shape="round">
					<template #icon>
						<icon-folder
							@click="openFileManager(record.path)" />
					</template>
				</a-button>
			</a-space>
		</template>
	</a-table>
</template>
