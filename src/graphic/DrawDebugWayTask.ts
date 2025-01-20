import { Layer } from "../Layer.js";
import { Way } from "../level/Way.js";
import { Camera } from "./Camera.js";
import { TheCanvasManager } from "./Canvas.js";
import { DrawTask } from "./DrawTask.js";
import { TheViewport } from "./Viewport.js";

export class DrawDebugWayTask extends DrawTask {

    camera: Camera;
    way: Way;
    color: string;

    constructor(camera: Camera, way: Way, color: string = "#dddd00") {
        super(Layer.top);
        this.camera = camera;
        this.way = way;
        this.color = color;
    }

    private _draw(ctx: CanvasRenderingContext2D) {
        const points = this.way.points;
        ctx.beginPath();
        for (const point of points) {
            const cp = this.camera.capturePosition(point);
            const p = TheCanvasManager.viewportToCanvasPoint(cp, TheViewport);
            if (point == points[0]) {
                ctx.moveTo(...p);
            } else {
                ctx.lineTo(...p);
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    draw() {
        if (!this.way.points.length) { return; }
        const ctx = TheCanvasManager.ctx;
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        this._draw(ctx);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        this._draw(ctx);
        ctx.restore();
    }

}