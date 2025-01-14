import { rotate, Vector } from "./MyMath.js";
import { Transform } from "./Transform.js";

export class Rect {

    private _x1: number;
    private _y1: number;

    private _x2: number;
    private _y2: number;

    /** 左边界 */
    get x1() {
        return Math.min(this._x1, this._x2);
    }

    set x1(v: number) {
        if (this._x1 <= this._x2) {
            this._x1 = v;
        } else {
            this._x2 = v;
        }
    }

    /** 下边界 */
    get y1() {
        return Math.min(this._y1, this._y2);
    }

    set y1(v: number) {
        if (this._y1 <= this._y2) {
            this._y1 = v;
        } else {
            this._y2 = v;
        }
    }

    /** 右边界 */
    get x2() {
        return Math.max(this._x1, this._x2);
    }

    set x2(v: number) {
        if (this._x1 > this._x2) {
            this._x1 = v;
        } else {
            this._x2 = v;
        }
    }

    /** 上边界 */
    get y2() {
        return Math.max(this._y1, this._y2);
    }

    set y2(v: number) {
        if (this._y1 > this._y2) {
            this._y1 = v;
        } else {
            this._y2 = v;
        }
    }

    /** 右上角 */
    get p1(): Vector {
        return [this.x2, this.y2];
    }
    
    set p1(v: Vector) {
        [this.x2, this.y2] = v;
    }

    /** 左上角 */
    get p2(): Vector {
        return [this.x1, this.y2];
    }
    
    set p2(v: Vector) {
        [this.x1, this.y2] = v;
    }

    /** 左下角 */
    get p3(): Vector {
        return [this.x1, this.y1];
    }
    
    set p3(v: Vector) {
        [this.x1, this.y1] = v;
    }

    /** 右下角 */
    get p4(): Vector {
        return [this.x2, this.y1];
    }
    
    set p4(v: Vector) {
        [this.x2, this.y1] = v;
    }

    /** 宽度 */
    get w() {
        return this.x2 - this.x1;
    }

    set w(v: number) {
        const t = Math.abs(v / 2);
        const cx = this.cx;
        this._x1 = cx - t;
        this._x2 = cx + t;
    }

    /** 高度 */
    get h() {
        return this.y2 - this.y1;
    }

    set h(v: number) {
        const t = Math.abs(v / 2);
        const cy = this.cy;
        this._y1 = cy - t;
        this._y2 = cy + t;
    }

    /** 宽高 */
    get size(): Vector {
        return [this.w, this.h];
    }

    set size(v: Vector) {
        [this.w, this.h] = v;
    }

    /** 中心点X */
    get cx() {
        return (this.x1 + this.x2) / 2;
    }

    set cx(v: number) {
        const t = this.w / 2;
        this._x1 = v - t;
        this._x2 = v + t;
    }

    /** 中心点Y */
    get cy() {
        return (this.y1 + this.y2) / 2;
    }

    set cy(v: number) {
        const t = this.h / 2;
        this._y1 = v - t;
        this._y2 = v + t;
    }

    /** 中心点 */
    get center(): Vector {
        return [this.cx, this.cy];
    }

    set center(v: Vector) {
        [this.cx, this.cy] = v;
    }

    /** 从两个端点构造一个矩形 */
    constructor(p1: Vector, p2: Vector) {
        [this._x1, this._y1] = p1;
        [this._x2, this._y2] = p2;
    }

    /** 通过中心点和宽高构造一个矩形 */
    static FromSize(center: Vector, size: Vector) {
        const [x, y] = center;
        const [w, h] = size;
        return new Rect([x - w / 2, y - h / 2], [x + w / 2, y + h / 2]);
    }

    private _getRectDist(other: Rect): number {
        return Math.min(Math.abs(this.cx - other.cx) - this.w + other.w,
               Math.abs(this.cy - other.cy) - this.h + other.h);
    }

    private _getPointDist(other: Vector): number {
        const [x, y] = other;
        return Math.min(Math.abs(this.cx - x) - this.w,
               Math.abs(this.cy - y) - this.h);
    }

    /** 该矩形是否接触另一个矩形或点（包括搭边） */
    isTouch(other: Rect | Vector): boolean {
        if (other instanceof Rect) {
            return this._getRectDist(other) <= 0;
        } else {
            return this._getPointDist(other) <= 0;
        }
    }

    /** 该矩形是否碰到了另一个矩形或点（不包括搭边） */
    isHit(other: Rect | Vector): boolean {
        if (other instanceof Rect) {
            return this._getRectDist(other) < 0;
        } else {
            return this._getPointDist(other) < 0;
        }
    }

    /** 返回一个经过 Transform 变换的新矩形 */
    trans(transform: Transform): Rect {
        let [cx, cy] = rotate(this.center, transform.d);
        cx *= transform.s * transform.sx;
        cy *= transform.s * transform.sy;
        cx += transform.x;
        cy += transform.y;
        let [sx, sy] = this.size;
        sx *= transform.s * transform.sx;
        sy *= transform.s * transform.sy;
        return Rect.FromSize(
            [cx, cy],
            [Math.abs(sx), Math.abs(sy)]
        );
    }

}