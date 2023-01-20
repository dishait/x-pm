import {
	NNumberAnimation,
	NSpace,
	NGradientText
} from 'naive-ui'

export default defineComponent({
	props: {
		counter: {
			type: Number,
			required: true
		},
		tip: {
			type: String,
			required: true
		}
	},
	setup(props) {
		return () => (
			<NSpace size="small" align="baseline">
				<div>{props.tip}</div>
				<NGradientText size="15">
					<NNumberAnimation
						from={0}
						show-separator
						to={props.counter}
					/>
				</NGradientText>
			</NSpace>
		)
	}
})
