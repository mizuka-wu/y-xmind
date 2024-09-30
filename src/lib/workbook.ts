/**
 * 转换 Doc/Workbook
 * @todo 增加转换事件绑定
 */
import { Doc, XmlElement } from "yjs";
import {
  parseWorkbookByArrayBuffer,
  parseWorkbookBySheetDataList,
} from "./utils/parseFile";
import { sheetTransfer } from "./sheet";

import type { IWookbookTransfer, SheetData } from "types/index.d";

const WORKBOOK_NODE_NAME = "workbook";

export const FRAGMENT_NAME = "xmind";

export const workbookTransfer: IWookbookTransfer = {
  async toY(source, xmlFragmentName = FRAGMENT_NAME) {
    const ydoc = new Doc();
    const xmlFragment = ydoc.getXmlFragment(xmlFragmentName);
    const xmlElement = new XmlElement(WORKBOOK_NODE_NAME);
    xmlFragment.insert(0, [xmlElement]);

    const workbook =
      source instanceof ArrayBuffer
        ? await parseWorkbookByArrayBuffer(source)
        : source;

    xmlElement.insert(
      0,
      workbook.toJSON().map((sheetData) => sheetTransfer.toY(sheetData)),
    );

    return ydoc;
  },

  async fromY(doc, xmlFragmentName = FRAGMENT_NAME) {
    const xmlFragment = doc.getXmlFragment(xmlFragmentName);
    const xmlElment = xmlFragment.firstChild;
    if (
      !(xmlElment instanceof XmlElement) ||
      xmlElment.nodeName !== WORKBOOK_NODE_NAME
    ) {
      throw new Error("Invalid xmind file Y.Doc");
    }
    const sheets: SheetData[] = [];

    let sheetXmlElement = xmlElment.firstChild;
    while (sheetXmlElement) {
      if (sheetXmlElement instanceof XmlElement) {
        sheets.push(sheetTransfer.fromY(sheetXmlElement, sheets));
      }
      sheetXmlElement = sheetXmlElement.nextSibling;
    }

    return parseWorkbookBySheetDataList(sheets);
  },
};
