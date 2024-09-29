/**
 * 从xmind文件读取 xml
 */
import JSZip from "jszip";
export async function parseFromXmindFile(file: ArrayBuffer) {
  const zip = new JSZip().loadAsync(file);
  console.log(zip);
}
