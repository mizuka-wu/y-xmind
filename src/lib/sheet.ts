import { XmlElement } from "yjs";
import type { SheetData, Transfer, Workbook } from "types/index.d";

export const sheetTransfer: Transfer<SheetData, Workbook> = {
  toY(sheetData) {
    const xmlElement = new XmlElement("sheet");
    xmlElement.setAttribute("id", sheetData.id);

    return xmlElement;
  },
  fromY(xmlElement, parentNode) {
    const sheet;
    const sheet = parentNode.addSheet();
  },
};
