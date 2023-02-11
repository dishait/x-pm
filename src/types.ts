import type { MaybeRef } from "@vueuse/core";
import type { AnyFunction } from "m-type-tools";

export interface ITab {
  name: string;
  path: string;
}

export type Tabs = ITab[];

export type RowData = {
  name: string;
  path: string;
  io: AnyFunction;
  size?: MaybeRef<number>;
  mtime?: MaybeRef<number>;
  birthtime?: MaybeRef<number>;
  tags?: MaybeRef<Array<"node" | "deno" | "go" | "unknown">>;
};
