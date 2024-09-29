import { workbookTransfer } from "./lib/workbook";
export * from "./lib/workbook";

export const xmindToY = workbookTransfer.toY;
export const yToXmind = workbookTransfer.fromY;

export default workbookTransfer;
