<template>
	<NDataTable
		:data="data"
		:loading="loading"
		:columns="columns"
		virtual-scroll
		:min-height="550"
		:max-height="550" />
</template>

<script lang="ts" setup>
import Open from './action/Open'
import Time from './action/Time'
import Title from './action/Title'
import prettyBytes from 'pretty-bytes'
import { isNumber } from 'm-type-tools'
import type { RowData } from '../types'
import { DataTableColumns } from 'naive-ui'
import { createMemTags } from './action/Tags'
import { LoadingTextVNode } from './action/Loading'

const props = defineProps<{
	loading: boolean
	data: Array<RowData>
	closeMtimeSort?: boolean
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
		sorter: 'default',
		ellipsis: {
			tooltip: true
		}
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
			const tags = unref(row.tags)
			if (!tags) {
				return LoadingTextVNode
			}
			return createMemTags(tags)
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
		title: '大小',
		key: 'size',
		align: 'center',
		resizable: true,
		sorter: 'default',
		render(row) {
			row.io()
			const size = unref(row.size)
			if (!isNumber(size)) {
				return LoadingTextVNode
			}
			return h('div', prettyBytes(size))
		}
	},
	{
		title: '更新时间',
		key: 'mtime',
		align: 'center',
		resizable: true,
		sorter: 'default',
		defaultSortOrder: props.closeMtimeSort
			? false
			: 'descend',
		render(row) {
			const time = unref(row.mtime)
			if (!isNumber(time)) {
				return LoadingTextVNode
			}
			return h(Time, {
				time
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
			const time = unref(row.birthtime)
			if (!isNumber(time)) {
				return LoadingTextVNode
			}
			return h(Time, {
				time
			})
		}
	}
]
</script>
