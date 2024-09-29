import type { Doc, XmlElement } from "yjs";
import type { Workbook } from "xmind";

export interface Transfer<Node = unknown, ParentNode = unknown> {
  toY(node: Node): XmlElement;
  fromY(xmlElement: XmlElement, parentNode: ParentNode): Node;
}

export interface WookbookTransfer {
  toY(workbook: Workbook | ArrayBuffer, xmlFragment?: string): Promise<Doc>;
  fromY(doc: Doc, xmlFragment?: string): Promise<Workbook>;
}
