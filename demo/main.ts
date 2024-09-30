import { XMindEmbedViewer } from "xmind-embed-viewer";
import { Dumper } from "xmind/dist/browser";
import formatter from "xml-formatter";
import JSZip from "jszip";
import { parseSheets } from "../src/lib/utils/parseFile";
import { xmindToY, yToXmind, FRAGMENT_NAME } from "../src/index";

import "./style.css";
const beforeViewer = new XMindEmbedViewer({
  el: "#before",
  region: "cn",
  styles: {
    width: "100%",
    height: "100%",
  },
});

const afterViewer = new XMindEmbedViewer({
  el: "#after",
  region: "cn",
  styles: {
    width: "100%",
    height: "100%",
  },
});

/**
 * 测试数据
 */
fetch("./demo.xmind")
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    // 预览
    beforeViewer.load(buffer);
    return buffer;
  })
  .then(async (buffer) => {
    // 生成原始的workbook
    const sheets = await parseSheets(buffer);
    console.log("original sheets", sheets);
    return xmindToY(buffer);
  })
  .then((yDoc) => {
    const fragment = yDoc.getXmlFragment(FRAGMENT_NAME);
    console.log("fragment", fragment);
    const xmlString = fragment.toString();
    console.log("xmlString" + "\n" + formatter(xmlString));
    return yToXmind(yDoc);
  })
  .then((workbook) => {
    console.log("transfer", workbook.toJSON());
    const dumper = new Dumper({ workbook });
    const files = dumper.dumping();
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.filename, file.value);
    });
    return zip.generateAsync({ type: "arraybuffer" });
  })
  .then((buffer) => {
    afterViewer.load(buffer);
  });
