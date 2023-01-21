import { NButton, NSpace, NIcon } from 'naive-ui'
import {
	CodeSlashOutline,
	FolderOpenOutline
} from '@vicons/ionicons5'
import {
	openFileManager as _openFileManager,
	openVscode as _openVscode
} from '../../composables/open'

export default defineComponent({
	props: {
		path: {
			type: String,
			required: true
		}
	},
	setup(props) {
		function openFileManager() {
			_openFileManager(props.path)
		}

		function openVscode() {
			_openVscode(props.path)
		}

		return () => (
			<NSpace justify="center">
				<NButton
					circle
					type="info"
					secondary
					onClick={openVscode}>
					{{
						icon: () => (
							<NIcon>
								<CodeSlashOutline />
							</NIcon>
						)
					}}
				</NButton>
				<NButton
					circle
					secondary
					type="warning"
					onClick={openFileManager}>
					{{
						icon: () => (
							<NIcon>
								<FolderOpenOutline />
							</NIcon>
						)
					}}
				</NButton>
			</NSpace>
		)
	}
})
