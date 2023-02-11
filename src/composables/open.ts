import { execa } from "execa";
import { message } from "./discrete";
import { ipcRenderer } from "electron";
import { isString } from "m-type-tools";

export async function openDirectory() {
  const path = (await ipcRenderer.invoke(
    "openDirectory",
  )) as string | undefined;

  if (!isString(path)) {
    message.warning("未选择文件夹");
    return;
  }

  return path;
}

export function openVscode(path: string) {
  return execa("code", [path]);
}

export function openFileManager(path: string) {
  return ipcRenderer.invoke("openFileManager", path);
}
