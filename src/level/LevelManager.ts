import { TheMConsole } from "../MConsole.js";
import { TheBackground } from "../sprites/Background.js";
import { Level } from "./Level.js";
import { Way } from "./Way.js";
import { TheLevels } from "./LevelDefination.js";

export class LevelManager {

    /** 注意：请勿引用并保存此值，此值会在切换关卡时指向不同的对象 */
    level: Level;

    constructor(level: Level = TheLevels["1-0"]) {
        this.level = level;
    }

    goto(level: Level) {
        this.level = level;
        TheBackground.costume = level.bg;
    }

}

export const TheLevelManager = new LevelManager();

TheLevelManager.goto(TheLevels["1-0"]);

const TheLevelInput = TheMConsole.addInput("level");
const TheGroundInput = TheMConsole.addTextarea("grounds", 5, 40);
const TheWaterWayInput = TheMConsole.addTextarea("waterways", 5, 40);

TheLevelInput.addEventListener("dblclick", () => {
    // @ts-ignore
    if (!TheLevels[TheLevelInput.value]) { return; }
    // @ts-ignore
    TheLevelManager.goto(TheLevels[TheLevelInput.value]);
});

TheGroundInput.addEventListener("dblclick", () => {
    TheLevelManager.level.grounds = TheGroundInput.value.split(";").map(points => Way.FromVector(...eval(`[${points}]`)));
});

TheWaterWayInput.addEventListener("dblclick", () => {
    TheLevelManager.level.waterWays = TheWaterWayInput.value.split(";").map(points => Way.FromVector(...eval(`[${points}]`)));
});