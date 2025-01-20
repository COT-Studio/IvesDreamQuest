import { DrawDebugRectTask } from "../../graphic/DrawDebugRectTask.js";
import { Layer } from "../../Layer.js";
import { TheLevelManager } from "../../level/LevelManager.js";
import { random } from "../../MyMath.js";
import { Order } from "../../Order.js";
import { Rect } from "../../Rect.js";
import { SCLikeSprite } from "../base/SCLikeSprite.js";
import { EnemyType } from "./EnemyType.js";

/** 默认重力加速度 */
export const TheGravity = -0.25;
/** 默认最大下落速度 */
export const TheMaxVy = -10;

export abstract class Enemy extends SCLikeSprite {

    abstract readonly enemyType: EnemyType;
    vx: number = 0;
    vy: number = 0;

    physicsRect: Rect = new Rect(this.rect.p3, this.rect.p1);
    private _physicsHitbox = new Rect(this.rect.p3, this.rect.p1)
    get physicsHitbox(): Rect {
        return this.physicsRect.trans(this.transform, this._physicsHitbox);
    }

    /** 是否站在地面上 */
    isStand: boolean = false;
    /** 是否浮在水面上 */
    isSwim: boolean = false;
    constructor(order: Order = Order.enemy, subOrder: number = 0) {
        super(order, subOrder);
        this.layer = Layer.enemy
        this.x = 350;
        this.y = 400;
        const d = TheLevelManager.level.getGroundDist(this.physicsHitbox);
        this.y += d;
    }

    autoSpawn(viewportRight = 330) {
        this.x += viewportRight - this.physicsHitbox.left;
    }

    /** 在地面上行走，或者往地面上掉
     * @param g 重力加速度，默认为 -1
     * @param maxVy 掉落速度的上限（准确地说，下限），默认为 -20 */
    walk(g?: number, maxVy?: number) {
        g = g || TheGravity;
        maxVy = maxVy || TheMaxVy;
        const h = - TheLevelManager.level.getGroundDist(this.physicsHitbox);
        this.x += this.vx;
        if (this.vy <= 0 && h <= 0) {
            this.vy = 0;
            this.y -= h;
            this.isStand = true;
        } else {
            this.vy += g;
            this.y += Math.max(-h, this.vy, maxVy);
            this.isStand = h + this.vy <= 0;
        }
    }

    debug() {
        super.debug();
        new DrawDebugRectTask(this.transform, this.camera, this.physicsRect, "#77dd00").queue();
    }

}

export class MAnim {

    phase: number = 0;
    cycle: number = Infinity;
    speed: number = 1;

    initPhaseMin: number;
    initPhaseMax: number;
    initSpeedMin: number;
    initSpeedMax: number;

    constructor(phase: number | [number, number] = 0, cycle: number = Infinity, speed: number | [number, number] = 1) {
        if (typeof phase === "number") {
            this.initPhaseMin = phase;
            this.initPhaseMax = phase;
        } else {
            this.initPhaseMin = phase[0];
            this.initPhaseMax = phase[1];
        }
        this.cycle = cycle;
        if (typeof speed === "number") {
            this.initSpeedMin = speed;
            this.initSpeedMax = speed;
        } else {
            this.initSpeedMin = speed[0];
            this.initSpeedMax = speed[1];
        }
        this.reset();
    }

    reset() {
        this.phase = random(this.initPhaseMin, this.initPhaseMax);
        this.speed = random(this.initSpeedMin, this.initSpeedMax);
    }

    update(step: number = 1) {
        this.phase = (this.phase + step * this.speed) % this.cycle;
    }

}