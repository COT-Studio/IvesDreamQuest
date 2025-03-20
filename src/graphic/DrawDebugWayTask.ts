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
    pStroke?: PIXI.Graphics;
    pFill?: PIXI.Graphics;

    constructor(camera: Camera, way: Way, color: number = 0xdddd00) {
        super(Layer.top);
        this.camera = camera;
        this.way = way;
        this.color = color;
    }

    draw() {
        if (!this.way.points.length) { return; }

        // 计算路径上每个点在 Viewport 上的位置
        const points = this.way.points;
        const cPoints = [];
        for (const point of points) {
            const cp = this.camera.capturePosition(point);
            const p = TheCanvasManager.viewportToCanvasPoint(cp, TheViewport);
            cPoints.push({ x: p[0], y: p[1] });
        }

        this.pStroke = ThePixiManager.getWay(cPoints, 4, 0xffffff, this.pStroke);
        ThePixiManager.app.stage.addChild(this.pStroke);

        this.pFill = ThePixiManager.getWay(cPoints, 2, this.color, this.pFill);
        ThePixiManager.app.stage.addChild(this.pFill);
    }

}