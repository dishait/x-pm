<template>
	<NDataTable
		:data="data"
		:loading="loading"
		:columns="columns"
		:max-height="550" />
</template>

<script lang="ts" setup>
import Open from './action/Open'
import Tags from './action/Tags'
import Time from './action/Time'
import Title from './action/Title'
import type { RowData } from '../types'
import { DataTableColumns } from 'naive-ui'

const props = defineProps<{
	loading: boolean
	data: Array<RowData>
}>()

const counter = $computed(() => props.data.length)

const columns: DataTableColumns<RowData> = [
	{
		title() {
			return h(Title, {
				tip: '项目',
				counter: counter
			})
		},
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
			return h(Time, {
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
			return h(Time, {
				time: row.birthtime
			})
		}
	}
]
</script>
