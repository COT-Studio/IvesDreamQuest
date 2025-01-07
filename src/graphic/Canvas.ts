import { Vector } from "../Coord.js";
import { Transform } from "../Transform.js";
import { Viewport } from "./Viewport.js";

export class CanvasManager {

    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _rect?: DOMRect;
    private _clientLeft?: number;
    private _clientTop?: number;
    private _clientWidth?: number;
    private _clientHeight?: number;
    private _resizeObserver: ResizeObserver;

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get rect() {
        if (this._rect === undefined) {
            this._rect = this.canvas.getBoundingClientRect();
        }
        return this._rect;
    }

    get clientLeft() {
        if (this._clientLeft === undefined) {
            this._clientLeft = this.canvas.clientLeft;
        }
        return this._clientLeft;
    }

    get clientTop() {
        if (this._clientTop === undefined) {
            this._clientTop = this.canvas.clientTop;
        }
        return this._clientTop;
    }

    get clientWidth() {
        if (this._clientWidth === undefined) {
            this._clientWidth = this.canvas.clientWidth;
        }
        return this._clientWidth;
    }

    get clientHeight() {
        if (this._clientHeight === undefined) {
            this._clientHeight = this.canvas.clientHeight;
        }
        return this._clientHeight;
    }

    constructor(width: number, height: number) {
        this.canvas = document.createElement("canvas");
        this._width = width;
        this._height = height;
        this._updateSize();
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        try {
            if (this.ctx == null) {
                throw new Error("null canvas ctx.");
            }
        } catch (error) {
            console.warn("未知错误：尝试获取 Canvas 绘图上下文时，获取到的值为 null。");
        }
        this._resizeObserver = new ResizeObserver(() => {
            this._rect = undefined;
            this._clientLeft = undefined;
            this._clientTop = undefined;
        });
        this._resizeObserver.observe(this.canvas);
    }

    private _updateSize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    resize(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._updateSize();
    }

    /** 把 Transform 从 Viewport 坐标系（笛卡尔坐标系）转换为 Canvas 坐标系（屏幕坐标系）*/
    viewportToCanvas(transform: Transform, viewport: Viewport): Transform {
        let {width: vx, height: vy} = viewport;
        let {width: cx, height: cy} = this;
        let s = cy / vy;
        return new Transform(
            [(vx / 2 + transform.x) * s, (vy / 2 - transform.y) * s],
            transform.s * s,
            [transform.sx, transform.sy],
            transform.d
        );
    }

    /** 把一个点从 Canvas 坐标系（屏幕坐标系）转换为 Viewport 坐标系（笛卡尔坐标系）*/
    canvasToViewport(position: Vector, viewport: Viewport) {
        let [px, py] = position;
        let {width: vx, height: vy} = viewport;
        let {width: cx, height: cy} = this;
        let s = cy / vy;
        return [(px) / s - vx / 2, vy / 2 - (py) / s];
    }

}

export const TheCanvasManager = new CanvasManager(1280, 720);
TheCanvasManager.canvas.id = "TheCanvas";
document.body.appendChild(TheCanvasManager.canvas);