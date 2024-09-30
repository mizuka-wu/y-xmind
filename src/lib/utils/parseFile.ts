/**
 * 从xmind文件读取 xml
 */
import JSZip from "jszip";
import { Workbook as OriginalWorkbook } from "xmind";
import { Workbook as XmindWorkbook } from "xmind-model";
import type { SheetData } from "xmind-model/types/models/sheet";

//@ts-ignore
class Workbook extends OriginalWorkbook {
  private resources: { [key: string]: string } = {};
  private workbook: XmindWorkbook;
  constructor(sheetDataList: SheetData[]) {
    super();
    this.workbook = new XmindWorkbook(sheetDataList);
    if (!sheetDataList.length) return this;
    this.resources = sheetDataList.reduce((resource, sheetData) => {
      return {
        ...resource,
        [sheetData.title]: sheetData.id,
      };
    }, this.resources);
    this.sheet = this.workbook.getSheetById(sheetDataList[0].id);
  }
}

export async function parseSheets(file: ArrayBuffer) {
  const zip = await new JSZip().loadAsync(file, {
    optimizedBinaryString: true,
  });

  if (zip.files["content.json"]) {
    const metadataJSON = await zip.files["metadata.json"].async("text");
    const metaData = JSON.parse(metadataJSON) as {
      dataStructureVersion: string;
    };
    if (+metaData.dataStructureVersion < 2) {
      throw new Error("Data structure is too old！");
    }

    const contentJSON = await zip.files["content.json"].async("text");
    const sheets = JSON.parse(contentJSON) as SheetData[];

    return sheets;
  } else {
    throw new Error("can not find content.json");
  }
}

export async function parseWorkbookByArrayBuffer(
  file: ArrayBuffer,
): Promise<OriginalWorkbook> {
  const sheets = await parseSheets(file);
  if (!sheets) throw new Error("paser fail");
  return new Workbook(sheets) as unknown as OriginalWorkbook;
}

export function parseWorkbookBySheetDataList(
  sheets: SheetData[],
): OriginalWorkbook {
  if (!sheets || !Array.isArray(sheets) || !sheets.length)
    throw new Error("sheets is not array");
  return new Workbook(sheets) as unknown as OriginalWorkbook;
}
