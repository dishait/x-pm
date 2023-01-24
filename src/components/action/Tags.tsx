import mem from 'mem'
import type { PropType } from 'vue'
import { NTag, NSpace } from 'naive-ui'

const TYPES = {
	go: 'info',
	node: 'success',
	deno: 'warning',
	unknown: 'default'
} as const

interface IProps {
	tags: Array<keyof typeof TYPES>
}

const Tags = defineComponent({
	props: {
		tags: Array as PropType<IProps['tags']>,
		default() {
			return []
		}
	},
	setup(props) {
		return () => (
			<NSpace justify="center">
				{props.tags?.map(tag => {
					return (
						<NTag bordered={false} type={TYPES[tag]}>
							{tag}
						</NTag>
					)
				})}
			</NSpace>
		)
	}
})

export default Tags

export const createMemTags = mem((tags: IProps['tags']) =>
	h(Tags, {
		tags
	})
)
