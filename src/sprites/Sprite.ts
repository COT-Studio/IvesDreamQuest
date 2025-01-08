import { TheSpritePool } from "../SpritePool.js";
import { Viewport } from "../graphic/Viewport.js";
import { Order } from "../Order.js";
import { TheClock } from "../Clock.js";
import { Transform } from "../Transform.js";
import { DrawImageTask, IDrawEffects } from "../graphic/DrawTask.js";
import { Camera, TheMainCamera } from "../graphic/Camera.js";
import { Image } from "../Assets.js";
import { Layer } from "../Layer.js";

//let TheSpriteOriOrder: number = 0;

class SpriteTask {

    private _sprite: Sprite;
    private _predicate: (task: SpriteTask) => boolean;
    private _callback: (task: SpriteTask) => any;
    private _durability?: number;
    private _callbackCount: number;
    private _birthClock: number;

    /** 注意：这个时钟从 1 开始走（即创建任务那帧过后的第一帧） */
    get clock(): number {
        return TheClock.tick - this._birthClock;
    }

    get callbackCount(): number {
        return this._callbackCount;
    }

    constructor(sprite: Sprite, predicate: (task: SpriteTask) => boolean, callback: (task: SpriteTask) => any, durability?: number) {
        this._sprite = sprite;
        this._predicate = predicate;
        this._callback = callback;
        this._durability = durability;
        this._callbackCount = 0;
        this._birthClock = TheClock.tick;
        this._sprite.tasks.add(this);
    }

    update() {
        if (this._predicate(this)) {
            this._callback(this);
            this._callbackCount ++;
            if (this._durability !== undefined && this.callbackCount >= this._durability) {
                this.destroy();
            }
        }
    }

    destroy() {
        this._sprite.tasks.delete(this);
    }

}

interface IStates<T> {
    init: (stateMachine: StateMachine) => T;
    [key: string]: (stateMachine: StateMachine) => T;
}

export class StateMachine<T = any> {

    readonly states: IStates<T>;
    private _current: string;

    /** 当前状态名称，可以更改此值以切换状态。  
     * 如果试图改为不存在的状态，则什么也不会做。
     */
    get current(): string {
        return this._current;
    }

    set current(state: string) {
        this.switch(state);
    }

    /**
     * @example 
     * new StateMachine<void>({
     *     init: (sm) => {
     *         this.doOnce(() => sayHello(), "hello");
     *         if (this.clock >= 100) {
     *             sm.current = "show";
     *         }
     *     },
     *     show: (sm) => {
     *         sing();
     *         dance();
     *         rap();
     *         basketball();
     *         music();
     *         this.doOnce(() => this.addTimeTask(2.5 * 365, (task) => {
     *             sm.switch("stop");
     *         }));
     *     },
     *     stop: (sm) => {}
     * });
     */
    constructor(states: IStates<T>) {
        this.states = states;
        this._current = "init";
    }

    update(): T {
        return this.states[this.current](this);
    }

    /** 切换到另一个状态。  
     * 如果试图改为不存在的状态，则什么也不会做。
     */
    switch(state: string) {
        if (this.states[state]) {
            this._current = state;
        }
    }

}

export abstract class Sprite {

    readonly order: Order;
    readonly subOrder: number;
    //readonly oriOrder: number;

    private _isLive: boolean;

    /** 如果此值变为 false ，不会调用该角色的 update() 或 draw() ，且会在一段时间后被移出对象池 */
    get isLive(): boolean {
        return this._isLive
    }

    set isLive(v: false) {
        this._isLive = v;
    }

    private _doOnceFlags: Set<string | null>;
    
    /** 如果此值变为 false ，不会调用该角色的 update() */
    isActive: boolean;

    tasks: Set<SpriteTask>;
    private _birthClock: number;

    get clock(): number {
        return TheClock.tick - this._birthClock;
    }

    constructor(order: Order = Order.end, subOrder: number = 0) {
        this.order = order;
        this.subOrder = subOrder;
        TheSpritePool.push(this);

        this._isLive = true;
        this.isActive = true;
        this.tasks = new Set<SpriteTask>();
        this._birthClock = TheClock.tick;
        this._doOnceFlags = new Set<string | null>;
    }

    baseUpdate(): void {
        for (const task of this.tasks) {
            task.update();
        }
    }

    abstract update(): void

    /** 每次 update 之前都会调用一次 predicate，如果返回 true 则调用 callback，最多 durability 次（不填则表示无数次） */
    addTask(predicate: (task: SpriteTask) => boolean, callback: (task: SpriteTask) => any, durability?: number) {
        new SpriteTask(this, predicate, callback, durability);
    }

    /** 接下来每过 number 帧就调用一次 callback，最多 durability 次（不填则表示无数次）  
     * 例如 0 tick 调用该函数，时间为3，那么在第 3, 6, 9...tick分别会调用一次 callback
     */
    addTimeTask(time: number, callback: (task: SpriteTask) => any, durability?: number) {
        const t = Math.max(time, 1);
        this.addTask((task: SpriteTask) => task.clock % time === 0, callback, durability);
    }

    /** 角色在整个生命周期内，只会执行一次 func 的内容。多个 doOnce 之间靠 flag 辨别。
     * @returns 返回一个对象，isFullfiled 表示是否执行了 func，result 是 func 的返回值（如果有）
     */
    doOnce(func: () => any, flag: string | null = null): {isFullfiled: boolean, result?: any} {
        if (this._doOnceFlags.has(flag)) {
            return { isFullfiled: false };
        } else {
            return { result: func(), isFullfiled: true }
        }
    }

}

export abstract class DrawableSprite extends Sprite {

    // 如果此值变为 false，不会调用该角色的 draw()
    isShow: boolean;

    constructor(order: Order = Order.begin, subOrder: number = 0) {
        super(order, subOrder);
        this.isShow = true;
    }

    abstract draw(): void

    /** 此方法返回 false 时，不会调用该角色的 draw() */
    isInViewport(viewport: Viewport): boolean {
        return true;
    }

}

/** 内置一个 transform 的 DrawableSprite。  
 * 因为不想起太长的名字，像 DrawableSpriteWithATransform 啥的，  
 * 所以就根据我的个人经历，起了这么一个简洁形象的名字：类似SC的角色。
 */
export abstract class SCLikeSprite extends DrawableSprite {

    transform: Transform = new Transform();

    get x() { return this.transform.x }
    set x(v) { this.transform.x = v }
    get y() { return this.transform.y }
    set y(v) { this.transform.y = v }

    get position() { return this.transform.position }
    set position(v) { this.transform.position = v }

    get s() { return this.transform.s }
    set s(v) { this.transform.s = v }

    get sx() { return this.transform.sx }
    set sx(v) { this.transform.sx = v }
    get sy() { return this.transform.sy }
    set sy(v) { this.transform.sy = v }

    get stretch() { return this.transform.stretch }
    set stretch(v) { this.transform.stretch = v }

    get d() { return this.transform.d }
    set d(v) { this.transform.d = v }

    private _drawEffects: IDrawEffects = {
        ghost: 0,
        brightness: 0,
    };

    get ghost() { return this._drawEffects.ghost || 0 }
    set ghost(v: number) { this._drawEffects.ghost = v }
    get brightness() { return this._drawEffects.brightness || 0 }
    set brightness(v: number) { this._drawEffects.brightness = v }

    get drawEffects() {
        return {
            ghost: this.ghost,
            brightness: this.brightness,
        }
    }

    camera: Camera = TheMainCamera;
    abstract costume: Image;
    layer: Layer = Layer.top;
    subLayer: number = 0;

    draw(): void {
        new DrawImageTask(this.transform, this.camera, this.costume, this.layer, this.subLayer, this.drawEffects);
    }

}