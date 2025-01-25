// @ts-ignore
import * as PIXI from "pixi";
import { CanvasManager, TheCanvasManager } from "./Canvas.js";
import { Transform } from "../Transform.js";
import { AssetLoadState, PixiImage } from "../Assets.js";
import { IDrawEffects } from "./DrawTask.js";
import { clamp } from "../MyMath.js";
import { Rect } from "../Rect.js";

console.log(`正在使用Pixi.js，Pixi版本: ${PIXI.VERSION}`);

export class PixiManager {

    readonly app;

    constructor(canvasManager: CanvasManager) {
        this.app = new PIXI.Application();
        this.app.init({
            view: canvasManager.canvas,
            width: canvasManager.width,
            height: canvasManager.height,
            background: 0xffffff,
            antialias: false,
        });
    }

    drawImage(transform: Transform, image: PixiImage, effects: IDrawEffects) {
        if (image.loadState != AssetLoadState.Ready) { return; }
        const pSprite = new PIXI.Sprite(image);

        pSprite.anchor.set(0.5);
        [ pSprite.x, pSprite.y ] = transform.position;
        pSprite.scale.x = transform.sx * transform.s;
        pSprite.scale.y = transform.sy * transform.s;
        pSprite.rotation = transform.d;

        if (effects.ghost) {
            pSprite.alpha = clamp(1 - effects.ghost, 0, 1);
        }

        if (effects.brightness) {
            const filter = new PIXI.ColorMatrixFilter();
            const b = clamp(effects.brightness, -1, 1);
            if (b < 0) {
                filter.brightness(b + 1);
            } else {
                const bm = 1 - Math.abs(b);
                const ba = b;
                filter.matrix = [
                    bm, 0, 0, 0, ba,
                    0, bm, 0, 0, ba,
                    0, 0, bm, 0, ba,
                    0, 0, 0, 1, 0
                ];
            }
            pSprite.filters = filter;
        }

        this.app.stage.addChild(pSprite);
    }

    drawRect(rect: Rect, width: number, color: number) {
        const pRect = new PIXI.Graphics();
        pRect.rect(rect.left, rect.bottom, rect.w, rect.h);
        pRect.stroke({ width: width, color: color });
        this.app.stage.addChild(pRect);
    }

    drawWay(points: {x: number, y: number}[], width: number, color: number) {
        const pWay = new PIXI.Graphics();
        pWay.poly(points, false);
        pWay.stroke({ width: width, color: color });
        this.app.stage.addChild(pWay);
    }

    clear() {
        this.app.stage.removeChildren();
    }

    render() {
        this.app.renderer && this.app.render();
    }

}

export const ThePixiManager = new PixiManager(TheCanvasManager);