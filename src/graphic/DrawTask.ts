import { Transform } from "../Transform.js";
import { Camera } from "./Camera.js";
import { TheViewport } from "./Viewport.js";
import { clamp } from "../MyMath.js";
import { Layer } from "../Layer.js";
import { TheDrawTaskQueue } from "./DrawTaskQueue.js";
import { TheCanvasManager } from "./Canvas.js";
import { AssetLoadState, BaseImage } from "../Assets.js";

/**
 * Stage 中有许多的 Transform，表示各种对象的位置、缩放等信息。
 * 他们都需要基于一个 Camera 进行变换，Camera 会将它们“拍摄”到 Viewport 上。
 * 然后，Viewport 上记录下的画面会被显示在 Canvas 上。
 * 如果 Viewport 的尺寸与 Canvas 不符，Viewport 会被等比缩放，使其高度等于 Canvas。
 * Canvas 再经由 css 进行最后处理，显示到网页上。
 */

export abstract class DrawTask {

    readonly layer: Layer;
    readonly subLayer: number;
    readonly orgLayer: number;

    constructor(layer: Layer = Layer.top, subLayer: number = 0) {
        this.layer = layer;
        this.subLayer = subLayer;
        this.orgLayer = TheDrawTaskQueue.tasks.length;
        TheDrawTaskQueue.push(this);
    }

    abstract draw(): void;

}

export interface IDrawEffects {
    /** 透明度，1为全透明 */
    ghost?: number,
    /** 亮度，-1为全黑，1为全白 */
    brightness?: number,
}

/** 绘制图像的任务 */
export class DrawImageTask extends DrawTask {

    transform: Transform;
    camera: Camera;
    image: BaseImage;
    effects: IDrawEffects;

    constructor(transform: Transform, camera: Camera, image: BaseImage,
        layer: Layer = Layer.top, subLayer: number = 0, effects: IDrawEffects = {}) {
        super(layer, subLayer);
        this.transform = transform;
        this.camera = camera;
        this.image = image;
        this.effects = effects;
        if (image.loadState == AssetLoadState.Idle || image.loadState == AssetLoadState.Fail) {
            image.load();
        }
    }

    draw() {
        const img = this.image;
        // 如果图片没加载好，则跳过绘制
        if (img.loadState !== AssetLoadState.Ready) { return; }

        let ghost = this.effects.ghost || 0;
        ghost = clamp(ghost, 0, 1);
        let brightness = this.effects.brightness || 0;
        brightness = clamp(brightness, -1, 1);

        // 透明度为1的图像直接跳过绘制
        if (ghost == 1) { return; }

        const t = this.camera.capture(this.transform);
        const ct = TheCanvasManager.viewportToCanvas(t, TheViewport);
        const {x, y, s, sx, sy, d} = ct;
        const w = img.image.width * s * sx;
        const h = img.image.height * s * sy;

        const ctx = TheCanvasManager.ctx;
        ctx.save();
        // 变换
        ctx.translate(x, y);
        ctx.rotate(-d);
        // 翻转
        if (w < 0 && h < 0) {
            ctx.transform(-1, 0, 0, -1, 0, 0);
        } else if (w < 0) {
            ctx.transform(-1, 0, 0, 1, 0, 0);
        } else if (h < 0) {
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
        // 绘制
        ctx.drawImage(img.image, -w / 2, -h / 2, w, h);
        // 变亮
        if (brightness > 0) {
            ctx.filter = "contrast(0) brightness(2)";
            ctx.globalAlpha = brightness;
            ctx.drawImage(img.image, -w / 2, -h / 2, w, h);
        }
        ctx.restore();
    }
};
