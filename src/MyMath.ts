/** 坐标相关方法 */

export type Vector = [number, number];

/** 把角度转化为弧度 */
export function deg(angle: number): number {
    return angle / 180 * Math.PI 
}

/**
 * 将 point 绕 center 旋转 theta 弧度，返回旋转后的点
 * @example
 * Coord.rotate([40, 30], arc(90)) // [-30, 40]
 * Coord.rotate([13, 16], arc(-90), [10, 10]) // [16, 7]
 */
export function rotate(point: Vector, theta: number, center: Vector = [0, 0]): Vector {
    let st = Math.sin(theta);
    let ct = Math.cos(theta);
    let x = point[0] - center[0];
    let y = point[1] - center[1];
    return [
        x * ct - y * st + center[0],
        x * st + y * ct + center[1]
    ];
}

/** 返回 point1 到 point2 的直线距离（欧几里得距离） */
export function length(point1: Vector, point2: Vector): number {
    return Math.sqrt((point2[0] - point1[0]) ** 2 + (point2[1] - point1[1]) ** 2);
}

/** 返回由 point1 指向 point2 的方向 */
export function direction(point1: Vector, point2: Vector): number {
    return Math.atan2((point2[1] - point1[1]), (point2[0] - point1[0]));
}

/** 返回 arc2 指向 arc1 的夹角（即arc1 - arc2），返回值∈(-π, π] */
export function minArc(arc1: number, arc2: number = 0): number {
    return (arc1 - arc2 - Math.PI) % (-2 * Math.PI) + Math.PI
}

/** 将 num 限制在[a, b]之间 */
export function clamp(num: number, a: number, b: number): number {
    return Math.max(a, Math.min(num, b));
}