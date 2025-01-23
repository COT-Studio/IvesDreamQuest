// @ts-ignore
import * as PIXI from "pixi";
import { CanvasManager, TheCanvasManager } from "../Canvas.js";
import { Transform } from "../../Transform.js";
import { AssetLoadState, PixiImage } from "../../Assets.js";

console.log(`正在使用Pixi.js，Pixi版本: ${PIXI.VERSION}`);

export class PixiManager {

    readonly app;

    constructor(canvasManager: CanvasManager) {
        this.app = new PIXI.Application();
        this.app.init({
            view: canvasManager.canvas,
            width: canvasManager.width,
            height: canvasManager.height
        });
    }

    drawImage(transform: Transform, image: PixiImage) {
        if (image.loadState != AssetLoadState.Ready) { return; }
        const pSprite = new PIXI.Sprite(image);

        pSprite.anchor.set(0.5);
        [ pSprite.x, pSprite.y ] = transform.position;
        pSprite.scale.x = transform.sx * transform.s;
        pSprite.scale.y = transform.sy * transform.s;
        pSprite.rotation = transform.d;

        this.app.stage.addChild(pSprite);
    }

    clear() {
        this.app.stage.removeChildren();
    }

    render() {
        this.app.renderer && this.app.render();
    }

}

export const ThePixiManager = new PixiManager(TheCanvasManager);