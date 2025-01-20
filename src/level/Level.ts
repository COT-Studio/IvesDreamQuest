import { BaseImage } from "../Assets.js";
import { Rect } from "../Rect.js";
import { Way } from "./Way.js";

export class Level {

    readonly name: string;
    readonly bg: BaseImage;
    grounds: Way[];
    waterWays: Way[];

    constructor(name: string, bg: BaseImage, grounds: Way[], waterWays: Way[]) {
        this.name = name;
        this.bg = bg;
        this.grounds = grounds;
        this.waterWays = waterWays;
        for (const way of waterWays) {
            way.drawDebugWayTask.color = "#00ffff";
        }
    }

    /** 想让 Rect 正好站在 way 上需要移动的纵向距离  
     * 如果返回 0，说明正好站在地上，大于 0 说明嵌在地里，小于 0 说明飘在空中 */
    getWayDist(rect: Rect, way: Way): number {
        const { left, right, top, bottom } = rect;
        let wayTop = way.top(left, right);
        if (wayTop == -Infinity) { return -Infinity; }
        let wayBottom = way.bottom(left, right);
        if (wayBottom <= top) {
            // 能兜住，返回跟地面的距离
            return wayTop - bottom;
        } else {
            // 兜不住，那我认为我这条路下方就是无底深渊
            return -Infinity;
        }
    }

    getWaysDist(rect: Rect, ways: Way[]) {
        const temp = ways.map(way => this.getWayDist(rect, way));
        temp.push(-Infinity);
        console.log(temp);
        return Math.max(...temp);
    }

    /** 想让 Rect 正好站在地面上需要移动的纵向距离  
     * 如果返回 0，说明正好站在地上，大于 0 说明嵌在地里，小于 0 说明飘在空中 */
    getGroundDist(rect: Rect): number {
        return this.getWaysDist(rect, this.grounds);
    }

    /** 想让 Rect 正好浮在水面需要移动的纵向距离  
     * 如果返回 0，说明正好浮在水面，大于 0 说明泡在水里，小于 0 说明飘在空中 */
    getWaterwayDist(rect: Rect): number {
        return this.getWaysDist(rect, this.waterWays);
    }

    drawDebugWay() {
        for (const way of this.grounds) {
            way.drawDebugWayTask.queue();
        }
        for (const way of this.waterWays) {
            way.drawDebugWayTask.queue();
        }
    }
}