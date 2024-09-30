/**
 * 转换 Sheet
 * @todo 绑定 yjs和sheet的事件
 */
import { XmlElement } from "yjs";
import { v4 } from "uuid";
import { topicTransfer, TOPIC_NODE_NAME } from "./topic";
import type { SheetData, ITransfer } from "types/index.d";

const SHEET_NODE_NAME = "sheet";

export const sheetTransfer: ITransfer<SheetData, SheetData[]> = {
  toY(sheetData) {
    const xmlElement = new XmlElement(SHEET_NODE_NAME);
    xmlElement.setAttribute("id", sheetData.id);
    xmlElement.setAttribute("title", sheetData.title);
    xmlElement.insert(0, [topicTransfer.toY(sheetData.rootTopic)]);

    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== SHEET_NODE_NAME)
      throw new Error("Invalid node");
    const id = xmlElement.getAttribute("id") as string;
    const title = xmlElement.getAttribute("title") as string;
    const sheetData: SheetData = {
      id,
      title,
      rootTopic: { id: v4(), title: "Default Title" },
    };

    // 补全属性
    let child = xmlElement.firstChild;
    while (child) {
      if (child instanceof XmlElement) {
        switch (child.nodeName) {
          case TOPIC_NODE_NAME: {
            sheetData.rootTopic = topicTransfer.fromY(child, sheetData);
            break;
          }
          default:
            break;
        }
      }
      child = child.nextSibling;
    }

    return sheetData;
  },
};
