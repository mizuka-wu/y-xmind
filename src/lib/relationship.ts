/**
 * 转换 Relationship
 * @todo 绑定 yjs 和 relationship 的事件
 * 这个特殊一点，是成对出现的
 */
import { XmlElement } from "yjs";
import { styleTransfer, STYLE_NODE_NAME } from './style';
import { pointTransfer, POINT_NODE_NAME } from './point';
import type {
  Point,
  ITransfer,
  SheetData,
  RelationshipData
} from "types/index.d";

export const RELATIONSHIT_NODE_NAME = "relationship";

export const relationshipTransfer: ITransfer<RelationshipData, SheetData> = {
  toY(relationshipData) {
    
    const xmlElement = new XmlElement(RELATIONSHIT_NODE_NAME);

    xmlElement.setAttribute("id", relationshipData.id);
    xmlElement.setAttribute("title", relationshipData.title);
    xmlElement.insert(0, [styleTransfer.toY(relationshipData.style)]);
    xmlElement.setAttribute("class", relationshipData.class);
    xmlElement.setAttribute("end1Id", relationshipData.end1Id);
    xmlElement.setAttribute("end2Id", relationshipData.end2Id);
    xmlElement.insert(0, relationshipData.controlPoints.map(point => pointTransfer.toY(point)));

    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== RELATIONSHIT_NODE_NAME)
      throw new Error("Invalid node");
    const id = xmlElement.getAttribute("id") as string;
    const title = xmlElement.getAttribute("title") as string;
    const propClass = xmlElement.getAttribute("class") as string;
    const end1Id = xmlElement.getAttribute("end1Id") as string;
    const end2Id = xmlElement.getAttribute("end2Id") as string;

    const relationshipData: Partial<RelationshipData> = {
      id,
      title,
      class: propClass,
      end1Id,
      end2Id,
    }
    
    const controlPoints: Point[] = [];
    let child = xmlElement.firstChild;
    while (child) {
      if (child instanceof XmlElement) {
        switch (child.nodeName) {
          case STYLE_NODE_NAME: {
            relationshipData.style = styleTransfer.fromY(child, relationshipData as RelationshipData);
            break;
          }
          case POINT_NODE_NAME: {
            controlPoints.push(pointTransfer.fromY(child, relationshipData as RelationshipData))
            break;
          }
          default: break;
        }
      }
      child = child.nextSibling;
    }

    if (controlPoints.length === 2) relationshipData.controlPoints = controlPoints as [Point, Point]

    // 补全其他节点
    return relationshipData as RelationshipData;
  },
};
