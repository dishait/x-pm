<template>
	<NDataTable :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import Open from './action/Open'
import Tags from './action/Tags'
import type { RowData } from '../types'
import type { DataTableColumns } from 'naive-ui'

defineProps<{
	data: Array<RowData>
}>()

const columns: DataTableColumns<RowData> = [
	{
		title: '项目',
		key: 'name',
		resizable: true,
		align: 'center'
	},
	{
		title: '类型',
		key: 'tags',
		align: 'center',
		resizable: true,
		render(row) {
			return h(Tags, {
				tags: row.tags
			})
		}
	},
	{
		title: '启动',
		key: 'open',
		align: 'center',
		resizable: true,
		render(row) {
			return h(Open, {
				path: row.path
			})
		}
	}
]
</script>
