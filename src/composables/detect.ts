import mem from "mem";
import { resolve } from "node:path";
import { inferVersion } from "go-get-folder-size/npm/bin";

export const detectGoGetFolderSizeName = mem(function (
  version: string = inferVersion(),
) {
  return `go-get-folder-size${version.startsWith("windows") ? ".exe" : ""}`;
});

export const detectGoGetFolderSizeBin = mem(function () {
  const version = inferVersion();
  const name = detectGoGetFolderSizeName(version);
  const dist = `node_modules/go-get-folder-size/dist`;
  return resolve(
    dist,
    `go-get-folder-size_${version}/${name}`,
  );
});
