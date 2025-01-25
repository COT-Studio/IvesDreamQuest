import { Layer } from "../Layer.js";
import { Way } from "../level/Way.js";
import { Camera } from "./Camera.js";
import { TheCanvasManager } from "./Canvas.js";
import { DrawTask } from "./DrawTask.js";
import { ThePixiManager } from "./PixiManager.js";
import { TheViewport } from "./Viewport.js";

export class DrawDebugWayTask extends DrawTask {

    camera: Camera;
    way: Way;
    color: number;

    constructor(camera: Camera, way: Way, color: number = 0xdddd00) {
        super(Layer.top);
        this.camera = camera;
        this.way = way;
        this.color = color;
    }

    private _draw(width: number, color: number) {
        const points = this.way.points;
        const cPoints = [];
        for (const point of points) {
            const cp = this.camera.capturePosition(point);
            const p = TheCanvasManager.viewportToCanvasPoint(cp, TheViewport);
            cPoints.push({ x: p[0], y: p[1] });
        }
        ThePixiManager.drawWay(cPoints, width, color);
    }

    draw() {
        if (!this.way.points.length) { return; }
        this._draw(4, 0xffffff);
        this._draw(2, this.color);
    }

}