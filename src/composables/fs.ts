import { RowData } from "../types";
import { lstat, readdir } from "node:fs/promises";
import { createFsComputedWithStream } from "file-computed";
import { getFolderSizeBin } from "go-get-folder-size/npm/bin";
import { detectGoGetFolderSizeBin as _detectGoGetFolderSizeBin } from "./detect";

import { CACHE_PATH, GO_GET_FOLDER_SIZE_BIN_PATH } from "./constant";

async function exists(path: string) {
  try {
    const stat = await lstat(path);
    return Boolean(stat);
  } catch (error) {
    return false;
  }
}

export const fsComputed = createFsComputedWithStream({
  cachePath: CACHE_PATH,
});

export function getLstatTimes(path: string) {
  return fsComputed(path, async () => {
    const { mtime, birthtime } = await lstat(path);
    return {
      mtime: mtime.getTime(),
      birthtime: birthtime.getTime(),
    };
  });
}

const TAGS = [
  {
    tag: "node",
    files: ["package.json"],
  },
  {
    tag: "deno",
    files: ["mod.ts", "deno.jsonc", "deno.json"],
  },
  {
    tag: "go",
    files: ["go.mod", "main.go"],
  },
] as const;

export function generateTags(base: string) {
  return fsComputed(base, async () => {
    const nullableTags = await Promise.all(
      TAGS.map(async (TAG) => {
        const possibleExists = await Promise.all(
          TAG.files.map(async (file) => {
            return exists(`${base}/${file}`);
          }),
        );
        if (possibleExists.includes(true)) {
          return TAG.tag;
        }
        return null;
      }),
    );
    let tags = nullableTags.filter(
      Boolean,
    ) as RowData["tags"];

    const unrefTags = unref(tags!);
    const unknownTag = unrefTags.length === 0;
    if (unknownTag) {
      unrefTags.push("unknown");
    }

    return unrefTags;
  });
}

export async function getDirectories(base: string) {
  return fsComputed(base, async () => {
    const dirents = await readdir(base, {
      withFileTypes: true,
    });

    return dirents.filter((dirent) => {
      return dirent.isDirectory();
    });
  });
}

function detectGoGetFolderSizeBin() {
  // dev
  if (import.meta.env.DEV) {
    return _detectGoGetFolderSizeBin();
  }
  // production
  return GO_GET_FOLDER_SIZE_BIN_PATH;
}

export function getFolderSize(base: string) {
  return fsComputed(base, async () => {
    if (!(await exists(base))) {
      return 0;
    }
    return getFolderSizeBin(base, false, {
      binPath: detectGoGetFolderSizeBin(),
    });
  });
}

export async function getFolderSizeForce(base: string) {
  if (!(await exists(base))) {
    return 0;
  }
  return getFolderSizeBin(base, true, {
    binPath: detectGoGetFolderSizeBin(),
  });
}
