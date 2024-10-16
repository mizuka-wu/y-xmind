/**
 * 转换 Sheet
 * @todo 绑定 yjs和sheet的事件
 */
import { XmlElement } from "yjs";
import { v4 } from "uuid";
import { topicTransfer, TOPIC_NODE_NAME } from "./topic";
import { styleTransfer, STYLE_NODE_NAME } from "./style";
import { themeTransfer, THEME_NODE_NAME } from './theme';
import { relationshipTransfer, RELATIONSHIT_NODE_NAME } from './relationship';
import type { SheetData, ITransfer, RelationshipData } from "types/index.d";

const SHEET_NODE_NAME = "sheet";

export const sheetTransfer: ITransfer<SheetData, SheetData[]> = {
  toY(sheetData) {
    const xmlElement = new XmlElement(SHEET_NODE_NAME);
    xmlElement.setAttribute("id", sheetData.id);
    xmlElement.setAttribute("title", sheetData.title);
    // rootTopic
    xmlElement.insert(0, [topicTransfer.toY(sheetData.rootTopic)]);
    // style
    if (sheetData.style)
      xmlElement.insert(0, [styleTransfer.toY(sheetData.style)]);

    if (sheetData.topicPositioning)
      xmlElement.setAttribute("topic-positioning", sheetData.topicPositioning);

    if (sheetData.topicOverlapping)
      xmlElement.setAttribute("topic-overlapping", sheetData.topicOverlapping);

    if (sheetData.theme)
      xmlElement.insert(0, [themeTransfer.toY(sheetData.theme)]);

    if (sheetData.relationships) {
      xmlElement.insert(0, sheetData.relationships.map(relationship => relationshipTransfer.toY(relationship)));
    }

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

    if (xmlElement.getAttribute("topic-positioning"))
      sheetData.topicPositioning = xmlElement.getAttribute(
        "topic-positioning",
      ) as "free" | "fixed";

    if (xmlElement.getAttribute("topic-overlapping"))
      sheetData.topicOverlapping = xmlElement.getAttribute(
        "topic-overlapping",
      ) as "overlap" | "none";

    // 补全属性
    const relationships: RelationshipData[] = []
    
    let child = xmlElement.firstChild;
    while (child) {
      if (child instanceof XmlElement) {
        switch (child.nodeName) {
          case TOPIC_NODE_NAME: {
            sheetData.rootTopic = topicTransfer.fromY(child, sheetData);
            break;
          }
          case STYLE_NODE_NAME: {
            sheetData.style = styleTransfer.fromY(child, sheetData);
            break;
          }

          case THEME_NODE_NAME: { 
            sheetData.theme = themeTransfer.fromY(child, sheetData);
            break;
          }

          case RELATIONSHIT_NODE_NAME: {
            relationships.push(relationshipTransfer.fromY(child, sheetData))
            break;
          }

          default:
            break;
        }
      }
      child = child.nextSibling;
    }

    if (relationships.length === 2) {
      sheetData.relationships = relationships as [RelationshipData, RelationshipData];
    }

    return sheetData;
  },
};
