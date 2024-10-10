/**
 * 转换 Point
 * @todo 绑定 yjs和 point 的事件
 */
import { XmlElement } from "yjs";
import type { ITransfer, Point, RelationshipData } from "types/index.d";

export const POINT_NODE_NAME = "topic";

const attributes: (keyof Point)[] = ['x', 'y', 'amount', 'angle'];

export const pointTransfer: ITransfer<Point, RelationshipData> = {
  toY(point) {
    const xmlElement = new XmlElement(POINT_NODE_NAME);
    for (const attr of attributes) {
    const value = point[attr];
      if (typeof value === 'number') {
        xmlElement.setAttribute(attr, value.toString());
      }
    }

    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== POINT_NODE_NAME)
      throw new Error("Invalid node");
    const point: Point = { };

    for (const attr of attributes) {
      const value = xmlElement.getAttribute(attr);
      if (value) {
        point[attr] = Number(value);
      }
    }

    // 补全其他节点
    return point;
  },
};
