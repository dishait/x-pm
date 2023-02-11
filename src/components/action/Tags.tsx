import mem from "mem";
import type { PropType } from "vue";
import { NSpace, NTag } from "naive-ui";

type Tag = "go" | "node" | "deno" | "unknown";

type Type = "info" | "success" | "warning" | "default" | "error" | "primary";

const _types = new Map<Tag, Type>([
  ["go", "info"],
  ["node", "success"],
  ["deno", "warning"],
  ["unknown", "default"],
]);

interface IProps {
  tags: Array<Tag>;
}

const Tags = defineComponent({
  props: {
    tags: Array as PropType<IProps["tags"]>,
    default() {
      return [];
    },
  },
  setup(props) {
    return () => (
      <NSpace justify="center">
        {props.tags?.map((tag) => {
          return (
            <NTag bordered={false} type={_types.get(tag)}>
              {tag}
            </NTag>
          );
        })}
      </NSpace>
    );
  },
});

export default Tags;

export const createMemTags = mem((tags: IProps["tags"]) =>
  h(Tags, {
    tags,
  })
);
