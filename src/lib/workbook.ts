/**
 * 转换 Doc/Workbook
 */
import { Doc } from "yjs";
import { Workbook } from "xmind";
import { parseFromXmindFile } from "./utils/parseFromFile";
import type { WookbookTransfer } from "types/index.d";

export const name = "workbook";

export const workbookTransfer: WookbookTransfer = {
  async toY(workbook, xmlFragmentName = name) {
    const ydoc = new Doc();
    const xmlFragment = ydoc.getXmlFragment(xmlFragmentName);

    /**
     * 加载文件
     */
    if (workbook instanceof ArrayBuffer) {
      const xml = parseFromXmindFile(workbook);
    } else if (workbook instanceof Workbook) {
    } else {
      throw new Error("Invalid workbook");
    }

    return ydoc;
  },

  async fromY(doc, xmlFragmentName = name) {
    const workbook = new Workbook();

    // 读取数据并且转换sheet;

    return workbook;
  },
};
