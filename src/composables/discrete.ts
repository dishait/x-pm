import { isDark } from 'vue-dark-switch'
import {
	messageDark,
	messageLight
} from 'naive-ui/es/message/styles'
import {
	loadingBarDark,
	loadingBarLight
} from 'naive-ui/es/loading-bar/styles'

const messageProviderProps = computed(() => {
	const themeOverrides = isDark.value
		? messageDark
		: messageLight

	return {
		themeOverrides
	}
})

const loadingBarProviderProps = computed(() => {
	const themeOverrides = isDark.value
		? loadingBarDark
		: loadingBarLight

	return {
		themeOverrides
	}
})

export const { message, loadingBar } = createDiscreteApi(
	['message', 'loadingBar'],
	{
		messageProviderProps,
		loadingBarProviderProps
	}
)
