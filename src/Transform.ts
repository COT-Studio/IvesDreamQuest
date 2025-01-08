import { minArc, Vector } from "./MyMath.js";

export class Transform {

    /** 横坐标 */
    x: number = 0;
    /** 纵坐标 */
    y: number = 0;
    /** 缩放 */
    s: number = 1;
    /** 横向拉伸 */
    sx: number = 1;
    /** 纵向拉伸 */
    sy: number = 1;
    /** 方向 */
    private _d: number = 0;

    /** 坐标 */
    get position(): Vector {
        return [this.x, this.y];
    }

    set position(v: Vector) {
        [this.x, this.y] = v;
    }

    /** 缩放 */
    get scale(): number {
        return this.s;
    }

    set scale(v: number) {
        this.s = v;
    }

    /** 拉伸 */
    get stretch(): Vector {
        return [this.sx, this.sy];
    }

    set stretch(v: Vector) {
        [this.sx, this.sy] = v;
    }

    /** 方向 */
    get direction(): number {
        return minArc(this._d);
    }

    set direction(v: number) {
        this._d = minArc(v);
    }

    /** 方向 */
    d = this.direction;

    /**
     * 构造一个 Transform，它是 Stage 中一个对象的位置、缩放等信息的集合
     * @param position 坐标，默认为 [0, 0]
     * @param scale 缩放，默认为 1
     * @param stretch 拉伸，默认为 [1, 1]
     * @param direction 方向，默认为 0
     */
    constructor(position: Vector = [0, 0], scale: number = 1, stretch: Vector = [1, 1], direction: number = 0) {
        [this.x, this.y] = position;
        this.scale = scale;
        [this.sx, this.sy]= stretch;
        this.direction = direction;
    }

};