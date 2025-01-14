import "./Requires.js";

import { TheCanvasManager } from "./graphic/Canvas.js";
import { TheDrawTaskQueue } from "./graphic/DrawTaskQueue.js";
import { TheSpritePool } from "./SpritePool.js";
import { TheClock } from "./Clock.js";
import { DebugOptions } from "./DebugOptions.js";

/** 每两帧之间的最小时间间隔（毫秒）*/
const frameDelay: number = 17;
/** fps指示器 */
export let fps: number = 1000 / frameDelay;

function update() {
    //进行一帧的更新
    let t = Date.now();
    TheSpritePool.update();
    TheSpritePool.draw();
    if (DebugOptions.isDebug) TheSpritePool.debug();
    TheCanvasManager.ctx.clearRect(0, 0, TheCanvasManager.width, TheCanvasManager.height);
    TheDrawTaskQueue.draw();
    TheDrawTaskQueue.clear();
    t = Date.now() - t;
    setTimeout(update, Math.max(frameDelay - t, 0));
    fps = 1000 / Math.max(frameDelay, t);
    TheClock.step();
}

function main() {
    console.log("Game Main Started.");
    update();
};

TheCanvasManager.ctx.font = "30px sans-serif";
TheCanvasManager.ctx.fillText("请点击……", 20, 50);

window.addEventListener("load", () => window.addEventListener("click", main, {once: true}), {once: true});