import { TheNullCamera } from "../graphic/Camera.js";
import { DrawDebugWayTask } from "../graphic/DrawDebugWayTask.js";
import { Vector, linear } from "../MyMath.js";


export class Way {

    points: Vector[];
    start: number;
    fragments: number[];
    end: number;
    drawDebugWayTask: DrawDebugWayTask;

    /** 注意：折线必须始终从左到右延伸，不能向左或上下延伸 */
    constructor(...points: Vector[]) {
        this.points = points;
        this.start = points[0][0];
        this.fragments = [];
        for (let i = 0; i + 1 < points.length; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i + 1];
            const length = x2 - x1;
            for (let t = 0; t < length; t++) {
                this.fragments.push(linear(y1, y2, t / length));
            }
        }
        this.fragments.push(points[points.length - 1][1]);
        this.end = this.start + this.fragments.length - 1;
        this.drawDebugWayTask = new DrawDebugWayTask(TheNullCamera, this);
    }

    /** 注意：折线必须始终从左到右延伸，不能向左或上下延伸 */
    static FromVector(...vectors: Vector[]): Way {
        let last = vectors[0];
        const points = [last];
        for (let i = 1; i < vectors.length; i++) {
            points.push([last[0] + vectors[i][0], last[1] + vectors[i][1]]);
            last = points[i];
        }
        return new Way(...points);
    }

    /** 获取一个范围内的最高点，如果在折线外则返回-Infinity */
    top(from: number, to: number): number {
        const x1 = Math.max(Math.round(from) - this.start, 0);
        const x2 = Math.round(to) - this.start;
        let top: number = -Infinity;
        for (let x = x1; x <= x2; x++) {
            const y = this.fragments[x];
            if (y > top) {
                top = y;
            }
        }
        return top;
    }

    /** 获取一个范围内的最低点，如果在折线外则返回-Infinity */
    bottom(from: number, to: number): number {
        const x1 = Math.max(Math.round(from) - this.start, 0);
        const x2 = Math.round(to) - this.start;
        let bottom: number = Infinity;
        for (let x = x1; x <= x2; x++) {
            const y = this.fragments[x];
            if (y < bottom) {
                bottom = y;
            }
        }
        return bottom == Infinity ? -Infinity : bottom;
    }

}
