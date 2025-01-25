import { TheImages } from "../../AssetDefination.js";
import { Enemy, MAnim } from "./Enemy.js";
import { EnemyType } from "./EnemyType.js";

export class Stickman extends Enemy {

    readonly enemyType = EnemyType.Stickman;
    mAnim: MAnim;
    private _cos = TheImages.enemy.stickman;

    constructor() {
        super();
        this.mAnim = new MAnim([0, 5], 5, [0.9, 1.1]);
        this.vx = -1.75 * this.mAnim.speed;
        this.s = 0.6;
        this.rect.size = [40, 100];
        this.physicsRect.size = [40, 100];
        this.physicsRect.y2 -= 50;
        this.autoSpawn();
    }

    update() {
        this.mAnim.update(1/6);
        this.costume = this._cos[Math.floor(this.mAnim.phase)] || this._cos[0];
        this.walk();
    }

}