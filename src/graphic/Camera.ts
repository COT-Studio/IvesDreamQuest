import { Transform } from "../Transform.js";
import { minArc, rotate } from "../MyMath.js";
import { Vector } from "../MyMath.js";

export class Camera extends Transform {

    /**
     * 构造一个摄像机，它是把所有 Transform 映射到 Viewport 上的基准
     * @param position 坐标
     * @param scale 缩放
     * @param stretch 拉伸
     * @param direction 方向
     */
    constructor(position: Vector = [0, 0], scale: number = 1, stretch: Vector = [1, 1], direction: number = 0) {
        super(position, scale, stretch, direction);
    }

    /** 把一个 Transform “拍摄”到 Viewport 上，返回新的 Transform。 */
    capture(transform: Transform) : Transform {
        if (
            this.x == 0 &&
            this.y == 0 &&
            this.s == 1 &&
            this.sx == 1 &&
            this.sy == 1 &&
            this.d == 0
        ) {
            // 如果相机处于初始状态，则跳过变换计算
            return new Transform(
                transform.position,
                transform.scale,
                transform.stretch,
                transform.direction
                
            );
        } else {
            return new Transform(
                this.capturePosition(transform.position),
                this.captureScale(transform.scale),
                this.captureStretch(transform.stretch),
                this.captureDirection(transform.direction)
            );
        }
    }

    /** 计算一个点被摄像机拍摄到 Viewport 后的位置 */
    capturePosition(position: Vector): Vector {
        let [x, y] = position;
        x -= this.x;
        y -= this.y;
        x *= this.s * this.sx;
        y *= this.s * this.sy;
        return rotate([x, y], this.d, this.position);
    }

    /** 计算一个缩放被摄像机拍摄到 Viewport 后的缩放 */
    captureScale(scale: number): number {
        return scale * this.s;
    }

    /** 计算一个拉伸被摄像机拍摄到 Viewport 后的拉伸 */
    captureStretch(stretch: Vector): Vector {
        let [sx, sy] = stretch;
        return [sx * this.sx, sy * this.sy];
    }

    /** 计算一个方向被摄像机拍摄到 Viewport 后的方向 */
    captureDirection(direction: number): number {
        return minArc(direction, this.d);
    }

    /** 把该相机“拍摄”的一个点从 Viewport 坐标系转换为 Stage 坐标系 */
    uncapturePosition(position: Vector): Vector {
        let [x, y] = rotate(position, -this.d, this.position);
        x /= this.s * this.sx;
        y /= this.s * this.sy;
        x += this.x;
        y += this.y;
        return [x, y];
    }
};

/** 用于“拍摄”游戏场景的主要相机
 * 注意：一切对相机的改动都应该在一帧最开始时进行，否则DrawText无法准确获取
 */
export const TheMainCamera = new Camera();
/** 用于“拍摄”UI的相机，通常不会变化 */
export const TheUICamera = new Camera();
/** 一个空相机，绝对不会发生任何变化 */
export const TheNullCamera = new Camera();