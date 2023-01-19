import { messageDark } from 'naive-ui'
import { isDark } from 'vue-dark-switch'
import { messageLight } from 'naive-ui/es/message/styles'

const messageProviderProps = computed(() => {
	const themeOverrides = isDark.value
		? messageDark
		: messageLight

	return {
		themeOverrides
	}
})

export const { message } = createDiscreteApi(['message'], {
	messageProviderProps
})
