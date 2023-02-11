<script lang="ts" setup>
import { Search } from '@vicons/ionicons5'

const props = defineProps<{
	value: string
}>()
const emit = defineEmits(['update:value'])

const value = $(useVModel(props, 'value', emit))

let isShow = $ref(false)

const keys = useMagicKeys()

const CtrlF = keys['Ctrl+F']

const Enter = keys['Enter']

whenever(CtrlF, () => {
	isShow = !isShow
})

whenever(Enter, () => {
	if (value.length > 0) {
		isShow = false
	}
})

function noSideSpace(value: string) {
	return !value.startsWith(' ')
}
</script>

<template>
	<NModal v-model:show="isShow">
		<NInput clearable size="large" class="rounded" v-model:value="value" transform-origin="center"
			:allow-input="noSideSpace" placeholder="输入搜索以查找" style="
				top: 60px;
				width: 450px;
				position: fixed;
				right: calc(50% - 225px);
			">
			<template #prefix>
				<NIcon :component="Search" class="mr-2" />
			</template>
		</NInput>
	</NModal>
</template>
