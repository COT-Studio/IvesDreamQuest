import { Char, ControlCharRegExp, ImageCharRegExp, MagicCharRegExp } from "../Char.js";
import { Layer } from "../Layer.js";
import { clamp } from "../MyMath.js";
import { Transform } from "../Transform.js";
import { Camera } from "./Camera.js";
import { TheCanvasManager } from "./Canvas.js";
import { DrawTask, IDrawEffects } from "./DrawTask.js";
import { TheViewport } from "./Viewport.js";

type partString = {text: string, width: number}

const getTextWidth = function(ctx: CanvasRenderingContext2D, text: string): number {
    if (ControlCharRegExp.test(text)) {
        return 0;
    } else if (ImageCharRegExp.test(text)) {
        return 0;
    } else {
        return ctx.measureText(text).width;
    }
}

export const getFontText = function(isBold: boolean, isItalic: boolean, size: number) {
    let italic = isItalic ? "italic " : ""
    let bold = isBold ? "bold " : "";
    return italic + bold + `${Math.abs(size)}px sans-serif`
}

/** 绘制文本的任务 */

export class DrawTextTask extends DrawTask {

    transform: Transform;
    camera: Camera;
    lines: partString[][];
    fontSize: number;
    lineHeight: number;
    alignX: "left" | "center" | "right";
    alignY: "top" | "middle" | "bottom";
    width: number;
    height: number;
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    effects: IDrawEffects;

    constructor(transform: Transform, camera: Camera, text: string, fontSize: number, lineHeight: number,
        alignX: "left" | "center" | "right" = "center", alignY: "top" | "middle" | "bottom" = "middle",
        width: number = 0, color?: string, strokeColor?: string, strokeWidth?: number,
        layer: Layer = Layer.top, subLayer: number = 0, effects: IDrawEffects = {}) {
        super(layer, subLayer);
        this.transform = transform;
        this.camera = camera;
        this.fontSize = fontSize;
        this.lineHeight = lineHeight;
        this.alignX = alignX;
        this.alignY = alignY;
        this.width = width > 0 ? width : Infinity;
        this.color = color;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.effects = effects;

        // 计算文本信息
        // 此处用\g\i\b\w指代各种特殊字符
        // "离离原上\g草\i、一岁一\g枯荣\i。\w\r\n野火烧不尽、\b春风\i吹又生。"
        // 用顿号是为了便于区分逗号
        // 初步分词
        const linesBase = text.replace("\r\n", "\n").split("\n"); // ["离离原上\g草\i、一岁一\g枯荣\i。\w", "野火烧不尽、\b春风\i吹又生。"]
        const linesMagic: string[][] = [];

        for (let row in linesBase) {
            const line = linesBase[row];
            const parts = line.split(MagicCharRegExp).filter(str => str !== "");
            linesMagic.push(parts);
        }

        // [["离离原上", "\g", "草", "\i", "、一岁一", "\g", "枯荣", "\i", "。", "\w"],
        // ["野火烧不尽、", "\b", "春风", "\i", "吹又生。"]]
        // 把超出行宽的部分拆成多行（自动换行）
        const ctx = TheCanvasManager.ctx;
        ctx.save();
        ctx.textAlign = alignX;
        ctx.textBaseline = alignY;
        ctx.font = getFontText(false, false, this.fontSize);
        console.log();
        let linesAutoN: partString[][] = [];
        for (let row of linesMagic) {
            let x = 0;
            const line = row;
            const newLines: partString[][] = [];
            let newLine: partString[] = [];
            for (let part of line) {
                const partWidth = getTextWidth(ctx, part);
                if (x + partWidth <= width) {
                    // 一行能塞下
                    newLine.push({text: part, width: partWidth});
                    x += partWidth;
                    continue;
                }
                // 一行塞不下
                let tryPart: string = "";
                let nextTryWidth;
                for (let char of part) {
                    nextTryWidth = getTextWidth(ctx, tryPart + char);
                    if (x + nextTryWidth > width) {
                        // 加完这个出头了，换行，把出头的这个字塞到下一行
                        const tryWidth = getTextWidth(ctx, tryPart + char);
                        if (tryPart !== "") { newLine.push({text: tryPart, width: tryWidth}); }
                        newLines.push(newLine);
                        newLine = [];
                        tryPart = "";
                        x = 0;
                    }
                    tryPart += char;
                }
                if (tryPart !== "" && nextTryWidth) {
                    newLine.push({text: tryPart, width: nextTryWidth});
                }
            }
            newLines.push(newLine);
            linesAutoN.push(...newLines);
        }
        ctx.restore();

        // [["离离原上", "\g", "草", "\i", "、"],
        // ["一岁一", "\g", "枯荣", "\i", "。", "\w"],
        // ["野火烧不尽、"],
        // ["\b", "春风", "\i", "吹又生。"]]
        this.lines = linesAutoN;
        this.height = this.lines.length * lineHeight;
    }

    draw() {

        if (!this.color && !this.strokeColor) { return; }
        let ghost = this.effects.ghost || 0;
        ghost = clamp(ghost, 0, 1);
        let brightness = this.effects.brightness || 0;
        brightness = clamp(brightness, -1, 1);

        // 透明度为1，直接跳过绘制
        if (ghost == 1) { return; }

        const t = this.camera.capture(this.transform);
        const ct = TheCanvasManager.viewportToCanvas(t, TheViewport);
        const { x, y, s, sx, sy, d } = ct;

        const ctx = TheCanvasManager.ctx;
        ctx.save();
        // 变换
        ctx.translate(x, y);
        ctx.rotate(-d);
        // 翻转
        if (s * sx < 0 && s * sy < 0) {
            ctx.transform(-1, 0, 0, -1, 0, 0);
        } else if (s * sx < 0) {
            ctx.transform(-1, 0, 0, 1, 0, 0);
        } else if (s * sy < 0) {
            ctx.transform(1, 0, 0, -1, 0, 0);
        }
        // 透明度
        if (ghost) {
            ctx.globalAlpha = 1 - ghost;
        }
        // 变暗
        if (brightness < 0) {
            ctx.filter = `brightness(${brightness + 1})`;
        }
        ctx.textAlign = this.alignX;
        ctx.textBaseline = this.alignY;
        const fontScale = Math.abs(ct.s * ct.sx);
        ctx.lineWidth = (this.strokeWidth ? this.strokeWidth : 1) * fontScale;
        let fontSize = Math.abs(this.fontSize * fontScale);
        if (this.strokeColor) { ctx.strokeStyle = this.strokeColor; }
        if (this.color) { ctx.fillStyle = this.color; }

        let isBold = false;
        let isItalic = false;
        const updateFont = () => {
            ctx.font = getFontText(isBold, isItalic, fontSize);
        }
        updateFont();
        let py = 0;
        if (this.alignY == "bottom") {
            py = (this.lines.length - 1) * this.lineHeight * -1 * Math.abs(ct.s * ct.sy);
        } else if (this.alignY == "middle") {
            py = (this.lines.length - 1) * this.lineHeight * -0.5 * Math.abs(ct.s * ct.sy);
        }
        for (let line of this.lines) {
            let px = 0;
            let lineWidth = 0;
            if (this.alignX == "right" || this.alignX == "center") {
                for (const part of line) {
                    lineWidth += part.width;
                }
                lineWidth -= line[0].width;
            }
            if (this.alignX == "right") {
                px = lineWidth * -1;
            }
            if (this.alignX == "center") {
                px = lineWidth * -0.5;
            }
            px *= fontScale;
            for (let i = 0; i < line.length; i++) {
                let { text, width } = line[i];
                let nextWidth = i + 1 < line.length ? line[i + 1].width : 0;
                let mx: number;
                if (this.alignX == "left") {
                    mx = width;
                } else if (this.alignX == "center") {
                    mx = (width + nextWidth) / 2;
                } else {
                    mx = nextWidth;
                }
                mx *= fontScale;
                if (Char.__controlBegin__ <= text && text <= Char.__controlEnd__) {
                    // 控制字符
                    switch (text) {
                        case Char.bold:
                            isBold = true;
                            updateFont();                
                            break;
                        case Char.boldEnd:
                            isBold = false;
                            updateFont();
                            break;
                        case Char.italic:
                            isItalic = true;
                            updateFont();                
                            break;
                        case Char.italicEnd:
                            isItalic = false;
                            updateFont();
                            break;
                    }
                } else if (Char.__imageBegin__ <= text && text <= Char.__imageEnd__) {/*
                    // 图案字符
                    // 透明度
                    if (ghost) {
                        ctx.globalAlpha = 1 - ghost;
                    }
                    // 变暗
                    if (brightness < 0) {
                        ctx.filter = `brightness(${brightness + 1})`;
                    }
                    // 绘制
                    ctx.drawImage(img.image, -w / 2, -h / 2, w, h);
                    // 变亮
                    if (brightness > 0) {
                        ctx.filter = "contrast(0) brightness(2)";
                        ctx.globalAlpha = brightness;
                        ctx.drawImage(img.image, -w / 2, -h / 2, w, h);
                    }*/
                } else {
                    // 普通文段
                    // 透明度
                    if (ghost) {
                        ctx.globalAlpha = 1 - ghost;
                    }
                    // 变暗
                    if (brightness < 0) {
                        ctx.filter = `brightness(${brightness + 1})`;
                    }
                    // 绘制
                    if (this.strokeColor) {
                        ctx.strokeText(text, px, py);
                    };
                    if (this.color) {
                        ctx.fillText(text, px, py);
                    };
                    // 变亮
                    if (brightness > 0) {
                        ctx.filter = "contrast(0) brightness(2)";
                        ctx.globalAlpha = brightness;
                        if (this.strokeColor) {
                            ctx.strokeText(text, px, py);
                        };
                        if (this.color) {
                            ctx.fillText(text, px, py);
                        };
                    }
                }
                px += mx;
            }
            py += this.lineHeight * Math.abs(ct.s * ct.sy);
        }
        ctx.restore();
    }

}