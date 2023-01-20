<template>
	<NDataTable
		:loading="loading"
		:columns="columns"
		:max-height="550"
		:data="data" />
</template>

<script lang="ts" setup>
import Open from './action/Open'
import Tags from './action/Tags'
import FormatDistance from './action/FormatDistance'
import type { RowData } from '../types'
import { DataTableColumns } from 'naive-ui'

defineProps<{
	loading: boolean
	data: Array<RowData>
}>()

const columns: DataTableColumns<RowData> = [
	{
		title: '项目',
		key: 'name',
		resizable: true,
		sorter: 'default'
	},

	{
		title: '类型',
		key: 'tags',
		align: 'center',
		resizable: true,
		filter: 'default',
		filterOptions: [
			{
				label: 'go',
				value: 'go'
			},
			{
				label: 'deno',
				value: 'deno'
			},
			{
				label: 'node',
				value: 'node'
			},
			{
				label: 'unknown',
				value: 'unknown'
			}
		],
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
	},
	{
		title: '更新时间',
		key: 'mtime',
		align: 'center',
		resizable: true,
		sorter: 'default',
		defaultSortOrder: 'descend',
		render(row) {
			return h(FormatDistance, {
				time: row.mtime
			})
		}
	},
	{
		title: '创建时间',
		key: 'birthtime',
		align: 'center',
		resizable: true,
		sorter: 'default',
		render(row) {
			return h(FormatDistance, {
				time: row.birthtime
			})
		}
	}
]
</script>
