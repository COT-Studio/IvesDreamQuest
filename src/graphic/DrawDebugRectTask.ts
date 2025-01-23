import { Layer } from "../Layer.js";
import { Rect } from "../Rect.js";
import { Transform } from "../Transform.js";
import { Camera } from "./Camera.js";
import { TheCanvasManager } from "./Canvas.js";
import { DrawTask } from "./DrawTask.js";
import { TheViewport } from "./Viewport.js";

export class DrawDebugRectTask extends DrawTask {

    transform: Transform;
    camera: Camera;
    rect: Rect;
    color: string;

    constructor(transform: Transform, camera: Camera, rect: Rect, color: string = "#00ff00") {
        super(Layer.top);
        this.transform = transform;
        this.camera = camera;
        this.rect = rect;
        this.color = color;
    }

    draw() {/*
        const ct = this.camera.capture(this.transform);
        const t = TheCanvasManager.viewportToCanvas(ct, TheViewport);
        t.sy *= -1;
        const ctx = TheCanvasManager.ctx;
        const { left: x1, bottom: y1, w, h } = this.rect.trans(t);
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.strokeRect(x1, y1, w, h);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x1, y1, w, h);
        ctx.restore();*/
    }

}