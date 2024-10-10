import type { Doc, XmlElement } from "yjs";
import type { Workbook } from "xmind";
import type { StyleData } from "xmind-model/types/models/style";
// import type { RelationshipData } from "xmind-model/types/models/relationship";

export type { Workbook } from "xmind-model";
export type { SheetData } from "xmind-model/types/models/sheet";
export type { TopicData } from "xmind-model/types/models/topic";
export type { StyleData } from "xmind-model/types/models/style";
export type { ThemeData } from "xmind-model/types/models/theme";
export type { RelationshipData } from "xmind-model/types/models/relationship";
export type { Point } from "xmind-model/types/common/utils";

export interface ITransfer<Node = unknown, ParentNode = unknown> {
  toY(node: Node): XmlElement;
  fromY(xmlElement: XmlElement, parentNode?: ParentNode): Node;
}

export interface IStyleDataTransfer {
  toY(styleData: StyleData, name: string): XmlElement;
  fromY(xmlElement: XmlElement, keys: string[]): Node;
}

export interface IWookbookTransfer {
  toY(workbook: Workbook | ArrayBuffer, xmlFragment?: string): Promise<Doc>;
  fromY(doc: Doc, xmlFragment?: string): Promise<Workbook>;
}
