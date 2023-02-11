import { NTime } from "naive-ui";

export default defineComponent({
  props: {
    time: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <NTime
        time={props.time}
        to={new Date()}
        type="relative"
      />
    );
  },
});
