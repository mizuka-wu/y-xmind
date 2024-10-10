/**
 * 转换 Theme
 * 因为有很多style，会强制给style数据加个key保存
 * @todo 绑定 yjs 和 theme 的事件
 */
import { XmlElement } from "yjs";
import { styleTransfer, STYLE_NODE_NAME } from './style';
import type { ThemeData, StyleData, ITransfer, SheetData } from "types/index.d";

type IThemeStyleData = StyleData & {
  key: string
}

export const THEME_NODE_NAME = "theme";

export const themeTransfer: ITransfer<ThemeData, SheetData> = {
  toY(themeData) {
    
    const xmlElement = new XmlElement(THEME_NODE_NAME);

    for (const key of (Object.keys(themeData) as (keyof ThemeData)[])) {
      if (key === 'id' || key === 'title') {
        xmlElement.setAttribute(key, themeData[key]);
      } else {
        const styleData: IThemeStyleData = {
          key,
          ...themeData[key] as StyleData
        }
        xmlElement.insert(0, [styleTransfer.toY(styleData)]);
      }
    }

    return xmlElement;
  },
  fromY(xmlElement) {
    if (xmlElement.nodeName !== THEME_NODE_NAME)
      throw new Error("Invalid node");
    const id = xmlElement.getAttribute("id") as string;
    const title = xmlElement.getAttribute("title") as string;
    const themeData: ThemeData = { id, title };

    // 读取style
    let child = xmlElement.firstChild;
    while (child) {
      if (child instanceof XmlElement && child.nodeName === STYLE_NODE_NAME) {
        const styleDataKey = child.getAttribute('key');
        if (styleDataKey) {
          const styleData = styleTransfer.fromY(child, themeData) as IThemeStyleData;
          Reflect.deleteProperty(styleData, 'key');
          Object.assign(themeData, {
            [styleDataKey]: styleData
          });
        }
      }
      child = child.nextSibling;
    }

    // 补全其他节点
    return themeData;
  },
};
