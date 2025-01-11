export const enum Char {
    /** 表示控制字符的起点，无意义 */
    __controlBegin__ = "\uE000",
    /** 启用粗体 */
    bold = "\uE001",
    /** 关闭粗体 */
    boldEnd = "\uE002",
    /** 启用粗体 */
    italic = "\uE003",
    /** 关闭粗体 */
    italicEnd = "\uE004",
    /** 表示控制字符的终点，无意义 */
    __controlEnd__ = "\uE3FF",

    /** 表示图案字符的起点，无意义 */
    __imageBegin__ = "\uE400",
    /** 表示图案字符的终点，无意义 */
    __imageEnd__ = "\uE7FF",
}

/** 匹配所有需要单独提取出来的字符 */
export const MagicCharRegExp = /([\uE000-\uE7FF])/;

/** 匹配所有控制字符 */
export const ControlCharRegExp = /([\uE000-\uE3FF])/;

/** 匹配所有图案字符 */
export const ImageCharRegExp = /([\uE400-\uE7FF])/;

/** 匹配所有能在其后安全换行的字符 */
export const NewLineCharRegExp = /[ ,\.?!:;\)\]\}\+\-\*\/=，。？！：；”’）】]/;

/** 暂未实现 */
export const enum NewLineMode {
    /** 可以在任何字符处换行（如中文） */
    any,
    /** 只能在单词边缘换行（如英文） */
    word,
}