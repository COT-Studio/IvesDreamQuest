import "./Requires.js";

import { TheCanvasManager } from "./graphic/Canvas.js";
import { TheDrawTaskQueue } from "./graphic/DrawTaskQueue.js";
import { TheSpritePool } from "./SpritePool.js";
import { TheClock } from "./Clock.js";
import { DebugOptions } from "./DebugOptions.js";
import { TheMConsole } from "./MConsole.js";
import { ThePixiManager } from "./graphic/pixi/PixiManager.js";

/** 每两帧之间的最小时间间隔（毫秒）*/
const frameDelay: number = 16;

const pm: { name: string, timeStamp: number }[] = []

function pmMark(name: string) {
    if (!DebugOptions.isPerformanceMonitor) { return; }
    pm.push({name: name, timeStamp: performance.now()})
}

let lastT = Date.now();

/** 进行一帧的更新 */
function update() {
    let t = Date.now();
    //console.log(lastT - t);
    lastT = t;
    pmMark("supdate");
    TheSpritePool.update();
    pmMark("sdraw");
    TheSpritePool.draw();
    pmMark("sdebug");
    if (DebugOptions.isDebug) TheSpritePool.debug();
    pmMark("sclean");
    if (TheClock.tick % 60 == 0) TheSpritePool.clean();
    pmMark("cdraw");
    //TheCanvasManager.ctx.clearRect(0, 0, TheCanvasManager.width, TheCanvasManager.height);
    ThePixiManager.clear();
    TheDrawTaskQueue.draw();
    TheDrawTaskQueue.clear();
    ThePixiManager.render();
    pmMark("windup");
    t = Date.now() - t;
    setTimeout(update, Math.max(frameDelay - t, 0));
    TheClock.step();
    pmMark("end");
    if (DebugOptions.isPerformanceMonitor) {
        let report = "";
        let total = 0;
        for (let i = 0; i < pm.length - 1; i++) {
            let dt = pm[i + 1].timeStamp - pm[i].timeStamp;
            let dts = dt.toString();
            report += `${pm[i].name}\t${dts.slice(0, dts.indexOf(".") + 4)}\n`;
            total += dt;
        }
        let ts = total.toString();
        report += `total\t${ts.slice(0, ts.indexOf(".") + 4)}`;
        TheMConsole.performanceMonitorDiv.innerText = report;
    }
    pm.length = 0;
    pmMark("last");
}

function main() {
    console.log("Game Main Started.");
    update();
};
/*
TheCanvasManager.ctx.font = "30px sans-serif";
TheCanvasManager.ctx.fillText("请点击……", 20, 50);
*/
window.addEventListener("load", () => window.addEventListener("click", main, {once: true}), {once: true});