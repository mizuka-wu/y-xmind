/**
 * 转换 Topic
 * @todo 绑定 yjs和 topic 的事件
 */
import { XmlElement } from "yjs";
import type { TopicData, SheetData, ITransfer } from "types/index.d";

export const TOPIC_NODE_NAME = "topic";

export const topicTransfer: ITransfer<TopicData, SheetData> = {
  toY(sheetData) {
    const xmlElement = new XmlElement(TOPIC_NODE_NAME);
    xmlElement.setAttribute("id", sheetData.id);
    xmlElement.setAttribute("title", sheetData.title);

    // 设置其他属性

    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== TOPIC_NODE_NAME)
      throw new Error("Invalid node");
    const id = xmlElement.getAttribute("id") as string;
    const title = xmlElement.getAttribute("title") as string;
    const topic: TopicData = { id, title };

    // 补全其他节点
    return topic;
  },
};
