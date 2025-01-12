import { TheEmptyImage as TheNullImage } from "../../AssetDefination.js";
import { BaseImage } from "../../Assets.js";
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

    get transform(): Transform {
        return this.drawImageTask.transform;
    }

    set transform(v: Transform) {
        this.drawImageTask.transform = v;
    }
    
    get camera(): Camera {
        return this.drawImageTask.camera;
    }

    set camera(v: Camera) {
        this.drawImageTask.camera = v;
    }

    get x() { return this.transform.x; }
    set x(v) { this.transform.x = v; }
    get y() { return this.transform.y; }
    set y(v) { this.transform.y = v; }

    get position() { return this.transform.position; }
    set position(v) { this.transform.position = v; }

    get s() { return this.transform.s; }
    set s(v) { this.transform.s = v; }

    get sx() { return this.transform.sx; }
    set sx(v) { this.transform.sx = v; }
    get sy() { return this.transform.sy; }
    set sy(v) { this.transform.sy = v; }

    get stretch() { return this.transform.stretch; }
    set stretch(v) { this.transform.stretch = v; }

    get d() { return this.transform.d; }
    set d(v) { this.transform.d = v; }

    get drawEffects(): IDrawEffects {
        return this.drawImageTask.effects;
    }

    set drawEffects(v: IDrawEffects) {
        this.drawImageTask.effects = v;
    }

    get ghost() { return this.drawEffects.ghost || 0; }
    set ghost(v: number) { this.drawEffects.ghost = v; }
    get brightness() { return this.drawEffects.brightness || 0; }
    set brightness(v: number) { this.drawEffects.brightness = v; }

    get costume(): BaseImage {
        return this.drawImageTask.image;
    }

    set costume(v: BaseImage) {
        this.drawImageTask.image = v;
    }

    get layer(): Layer {
        return this.drawImageTask.layer;
    }
    
    set layer(v: Layer) {
        this.drawImageTask.layer = v;
    }

    get subLayer(): number {
        return this.drawImageTask.subLayer;
    }
    
    set subLayer(v: number) {
        this.drawImageTask.subLayer = v;
    }

    rect: Rect = new Rect([-20, -20], [20, 20]);

    get hitBox(): Rect {
        return this.rect.trans(this.transform);
    }

    constructor(order: Order = Order.end, subOrder: number = 0) {
        super(order, subOrder);
        this.drawImageTask = new DrawImageTask(new Transform(), TheMainCamera, TheNullImage, Layer.top, 0, {});
    }

    draw(): void {
        this.drawImageTask.queue();
    }

    /** 该矩形是否接触另一个角色、矩形或点（包括搭边） */
    isTouch(other: Rect | Vector | SCLikeSprite) {
        if (other instanceof SCLikeSprite) {
            return this.hitBox.isTouch(other.hitBox);
        } else {
            return this.hitBox.isTouch(other);
        }
    }

    /** 该矩形是否碰到了另一个矩形或点（不包括搭边） */
    isHit(other: Rect | Vector | SCLikeSprite) {
        if (other instanceof SCLikeSprite) {
            return this.hitBox.isHit(other.hitBox);
        } else {
            return this.hitBox.isHit(other);
        }
    }

    debug() {
        super.debug();
        new DrawDebugRectTask(this.transform, this.camera, this.rect).queue();
    }

}
