import { TheDrawTaskQueue } from "./graphic/DrawTaskQueue.js";
import { TheSpritePool } from "./SpritePool.js";
import { HelloSprite } from "./sprites/HelloSprite.js";
import { TheClock } from "./Clock.js";
import { Background } from "./sprites/Background.js";

/** 每两帧之间的最小时间间隔（毫秒）*/
const frameDelay: number = 17;
/** fps指示器 */
let fps: number = 1000 / frameDelay;
const TheHelloSprite = new HelloSprite();
const TheBackground = new Background();

function update() {
    //进行一帧的更新
    let t = Date.now();
    TheSpritePool.update();
    TheSpritePool.draw();
    // TheCanvasManager.ctx.clearRect(0, 0, TheCanvasManager.width, TheCanvasManager.height);
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

window.addEventListener("load", main);