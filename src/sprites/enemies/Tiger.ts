import { TheImages } from "../../AssetDefination.js";
import { random } from "../../MyMath.js";
import { Enemy, MAnim } from "./Enemy.js";
import { EnemyType } from "./EnemyType.js";

export class Tiger extends Enemy {

    readonly enemyType = EnemyType.Tiger;
    mAnim: MAnim;
    private _cos = TheImages.enemy.tiger;

    constructor() {
        super();
        this.mAnim = new MAnim(0, 0, [0.9, 1.1]);
        this.vx = -1.5 * this.mAnim.speed;
        this.s = 0.35;
        this.costume = this._cos.normal;
        this.rect.size = [100, 120];
        this.physicsRect.size = [50, 120];
        this.autoSpawn();
    }

    update() {
        this.walk();
        if (this.isStand) {
            this.vy = random(3.5, 4.4);
        }
    }

}