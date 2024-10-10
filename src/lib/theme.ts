/**
 * 转换 Theme
 * @todo 绑定 yjs 和 theme 的事件
 */
import { XmlElement } from "yjs";
import type { ThemeData, StyleData, ITransfer } from "types/index.d";

export const THEME_NODE_NAME = "theme";

export const styleTransfer: ITransfer<ThemeData, StyleData> = {
  toY(themeData) {
    const xmlElement = new XmlElement(THEME_NODE_NAME);
    xmlElement.setAttribute("id", themeData.id);
    xmlElement.setAttribute("title", themeData.title);
    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== THEME_NODE_NAME)
      throw new Error("Invalid node");
    const id = xmlElement.getAttribute("id") as string;
    const title = xmlElement.getAttribute("title") as string;
    const themeData: ThemeData = { id, title };

    // 补全其他节点
    return themeData;
  },
};
