import { zhCN } from 'date-fns/locale'
import { formatDistance } from 'date-fns'

export default defineComponent({
	props: {
		time: {
			type: Number,
			required: true
		}
	},
	setup(props) {
		const distance = computed(() => {
			return formatDistance(props.time, new Date(), {
				locale: zhCN,
				addSuffix: true
			})
		})
		return () => <span>{distance.value}</span>
	}
})
