import Fuse from "fuse.js";
import { RowData } from "../types";
import type { ComputedRef } from "vue";

export function useSearch(data: ComputedRef<RowData[]>) {
  let value = $(useStorage("Search", ""));

  let ing = $computed(() => value.length > 0);

  let storeIndex = $computed(() => {
    return Fuse.createIndex(["name"], data.value);
  });

  let store = $computed(() => {
    return new Fuse(
      data.value,
      {
        shouldSort: true,
        keys: ["name"],
      },
      storeIndex,
    );
  });

  let result = $computed(() => store.search(value).map((v) => v.item));

  return $$({
    ing,
    value,
    store,
    result,
    storeIndex,
  });
}
