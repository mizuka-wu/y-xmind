import { XMindEmbedViewer } from "xmind-embed-viewer";
import { xmindToY, name } from "../src/index";

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
  .then((buffer) => {
    return xmindToY(buffer);
  })
  .then((yDoc) => {
    const xmlString = yDoc.getXmlFragment(name).toString();
    console.log("转换后", xmlString);
  });
