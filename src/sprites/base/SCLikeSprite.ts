import { TheEmptyImage } from "../../AssetDefination.js";
import { PixiImage } from "../../Assets.js";
import { Camera, TheMainCamera } from "../../graphic/Camera.js";
import { DrawDebugRectTask } from "../../graphic/DrawDebugRectTask.js";
import { IDrawEffects, DrawImageTask, DrawTask } from "../../graphic/DrawTask.js";
import { Layer } from "../../Layer.js";
import { Vector } from "../../MyMath.js";
import { Order } from "../../Order.js";
import { Rect } from "../../Rect.js";
import { Transform } from "../../Transform.js";
import { DrawableSprite } from "./DrawableSprite.js";

/** 内置一个 transform 的 DrawableSprite。  
 * 因为不想起太长的名字，像 DrawableSpriteWithATransform 啥的，  
 * 所以就根据我的个人经历，起了这么一个简洁形象的名字：类似SC的角色。
 */
export abstract class SCLikeSprite extends DrawableSprite {

    drawImageTask: DrawImageTask;

    /** 该角色的变换 */
    get transform(): Transform {
        return this.drawImageTask.transform;
    }

    set transform(v: Transform) {
        this.drawImageTask.transform = v;
    }
    
    /** 该角色绑定的摄像机 */
    get camera(): Camera {
        return this.drawImageTask.camera;
    }

    set camera(v: Camera) {
        this.drawImageTask.camera = v;
    }

    /** 横坐标 */
    get x() { return this.transform.x; }
    set x(v) { this.transform.x = v; }
    /** 纵坐标 */
    get y() { return this.transform.y; }
    set y(v) { this.transform.y = v; }

    /** 位置 */
    get position() { return this.transform.position; }
    set position(v) { this.transform.position = v; }

    /** 缩放 */
    get s() { return this.transform.s; }
    set s(v) { this.transform.s = v; }

    /** 横向拉伸 */
    get sx() { return this.transform.sx; }
    set sx(v) { this.transform.sx = v; }
    /** 纵向拉伸 */
    get sy() { return this.transform.sy; }
    set sy(v) { this.transform.sy = v; }

    /** 拉伸 */
    get stretch() { return this.transform.stretch; }
    set stretch(v) { this.transform.stretch = v; }

    /** 方向 */
    get d() { return this.transform.d; }
    set d(v) { this.transform.d = v; }

    /** 外观特效 */
    get drawEffects(): IDrawEffects {
        return this.drawImageTask.effects;
    }

    set drawEffects(v: IDrawEffects) {
        this.drawImageTask.effects = v;
    }

    /** 虚像特效 */
    get ghost() { return this.drawEffects.ghost || 0; }
    set ghost(v: number) { this.drawEffects.ghost = v; }
    /** 高亮特效 */
    get brightness() { return this.drawEffects.brightness || 0; }
    set brightness(v: number) { this.drawEffects.brightness = v; }

    /** 角色的造型，即它的外观图像 */
    get costume(): PixiImage {
        return this.drawImageTask.image;
    }

    set costume(v: PixiImage) {
        this.drawImageTask.image = v;
    }

    /** 图层 */
    get layer(): Layer {
        return this.drawImageTask.layer;
    }
    
    set layer(v: Layer) {
        this.drawImageTask.layer = v;
    }

    /** 子图层 */
    get subLayer(): number {
        return this.drawImageTask.subLayer;
    }
    
    set subLayer(v: number) {
        this.drawImageTask.subLayer = v;
    }

    /** 判定范围（相对） */
    rect: Rect = new Rect([-20, -20], [20, 20]);
    private _hitbox: Rect = new Rect([-20, -20], [20, 20]);

    /** 判定范围（绝对） */
    get hitbox(): Rect {
        return this.rect.trans(this.transform, this._hitbox);
    }

    constructor(order: Order = Order.end, subOrder: number = 0) {
        super(order, subOrder);
        this.drawImageTask = new DrawImageTask(new Transform(), TheMainCamera, TheEmptyImage, Layer.top, 0, {});
    }

    update() {}

    draw() {
        this.drawImageTask.queue();
    }

    /** 该矩形是否接触另一个角色、矩形或点（包括搭边） */
    isTouch(other: Rect | Vector | SCLikeSprite) {
        if (other instanceof SCLikeSprite) {
            return this.hitbox.isTouch(other.hitbox);
        } else {
            return this.hitbox.isTouch(other);
        }
    }

    /** 该矩形是否碰到了另一个矩形或点（不包括搭边） */
    isHit(other: Rect | Vector | SCLikeSprite) {
        if (other instanceof SCLikeSprite) {
            return this.hitbox.isHit(other.hitbox);
        } else {
            return this.hitbox.isHit(other);
        }
    }

    debug() {
        super.debug();
        new DrawDebugRectTask(this.transform, this.camera, this.rect).queue();
    }

}
