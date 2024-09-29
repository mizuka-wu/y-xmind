/**
 * 转换 Doc/Workbook
 * @todo 增加转换事件绑定
 */
import { Doc } from "yjs";
import { Workbook } from "xmind";
import { parseWorkbook } from "./utils/parseFile";

import type { WookbookTransfer } from "types/index.d";

export const name = "workbook";

export const workbookTransfer: WookbookTransfer = {
  async toY(source, xmlFragmentName = name) {
    const ydoc = new Doc();
    const xmlFragment = ydoc.getXmlFragment(xmlFragmentName);

    const workbook =
      source instanceof ArrayBuffer ? await parseWorkbook(source) : source;
    console.log(workbook);

    return ydoc;
  },

  async fromY(doc, xmlFragmentName = name) {
    const workbook = new Workbook();

    // 读取数据并且转换sheet;

    return workbook;
  },
};
