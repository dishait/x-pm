<template>
	<NDataTable
		:columns="columns"
		:data="data"
		:pagination="pagination" />
</template>

<script lang="ts">
import { h, defineComponent } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, createDiscreteApi } from 'naive-ui'

type Song = {
	no: number
	title: string
	length: string
}

const createColumns = ({
	play
}: {
	play: (row: Song) => void
}): DataTableColumns<Song> => {
	return [
		{
			title: 'No',
			key: 'no'
		},
		{
			title: 'Title',
			key: 'title'
		},
		{
			title: 'Length',
			key: 'length'
		},
		{
			title: 'Action',
			key: 'actions',
			render(row) {
				return h(
					NButton,
					{
						strong: true,
						tertiary: true,
						size: 'small',
						onClick: () => play(row)
					},
					{ default: () => 'Play' }
				)
			}
		}
	]
}

const data: Song[] = []

export default defineComponent({
	setup() {
		const { message } = createDiscreteApi(['message'])
		return {
			data,
			columns: createColumns({
				play(row: Song) {
					message.info(`Play ${row.title}`)
				}
			}),
			pagination: false as const
		}
	}
})
</script>
