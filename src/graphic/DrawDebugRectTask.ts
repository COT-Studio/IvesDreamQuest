import { Layer } from "../Layer.js";
import { Rect } from "../Rect.js";
import { Transform } from "../Transform.js";
import { Camera } from "./Camera.js";
import { TheCanvasManager } from "./Canvas.js";
import { DrawTask } from "./DrawTask.js";
import { ThePixiManager } from "./PixiManager.js";
import { TheViewport } from "./Viewport.js";

export class DrawDebugRectTask extends DrawTask {

    transform: Transform;
    camera: Camera;
    rect: Rect;
    color: number;
    pStroke?: PIXI.Graphics;
    pFill?: PIXI.Graphics;

    constructor(transform: Transform, camera: Camera, rect: Rect, color: number = 0x00ff00) {
        super(Layer.top);
        this.transform = transform;
        this.camera = camera;
        this.rect = rect;
        this.color = color;
    }

    draw() {
        const ct = this.camera.capture(this.transform);
        const t = TheCanvasManager.viewportToCanvas(ct, TheViewport);
        t.sy *= -1;
        const cr = this.rect.trans(t);

        this.pStroke = ThePixiManager.getRect(cr, 4, 0xffffff, this.pStroke);
        ThePixiManager.app.stage.addChild(this.pStroke);

        this.pFill = ThePixiManager.getRect(cr, 2, this.color, this.pFill);
        ThePixiManager.app.stage.addChild(this.pFill);
    }

}