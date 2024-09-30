/**
 * 转换 Style
 * @todo 绑定 yjs 和 style 的事件
 */
import { XmlElement } from "yjs";
import type { TopicData, StyleData, ITransfer } from "types/index.d";

export const STYLE_NODE_NAME = "style";
const STYLE_PROPERTY_NODE_NAME = "properties";

export const styleTransfer: ITransfer<StyleData, TopicData> = {
  toY(styleData) {
    const xmlElement = new XmlElement(STYLE_NODE_NAME);
    xmlElement.setAttribute("id", styleData.id);
    const propertiesXmlElement = new XmlElement(STYLE_PROPERTY_NODE_NAME);
    Object.keys(styleData.properties).forEach((key) => {
      propertiesXmlElement.setAttribute(key, styleData.properties[key] + "");
    });
    xmlElement.insert(0, [propertiesXmlElement]);
    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== STYLE_NODE_NAME)
      throw new Error("Invalid node");
    const id = xmlElement.getAttribute("id") as string;
    const styleData: StyleData = { id, properties: {} };
    const firstChild = xmlElement.firstChild;
    if (
      firstChild instanceof XmlElement &&
      firstChild.nodeName === STYLE_PROPERTY_NODE_NAME
    ) {
      const attributes = firstChild.getAttributes();
      Object.keys(attributes).forEach((key) => {
        let value: string | number | undefined = attributes[key];
        if (value === undefined) return;
        if (value !== "") {
          if (!isNaN(+value)) {
            value = +value;
          }
        }
        styleData.properties[key] = value;
      });
    }

    // 补全其他节点
    return styleData;
  },
};
