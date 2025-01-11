import { BaseImage } from "../Assets.js";
import { Camera, TheMainCamera } from "../graphic/Camera.js";
import { IDrawEffects, DrawImageTask } from "../graphic/DrawTask.js";
import { Layer } from "../Layer.js";
import { Vector } from "../MyMath.js";
import { Rect } from "../Rect.js";
import { Transform } from "../Transform.js";
import { DrawableSprite } from "./base/DrawableSprite.js";

/** 内置一个 transform 的 DrawableSprite。
 * 因为不想起太长的名字，像 DrawableSpriteWithATransform 啥的，
 * 所以就根据我的个人经历，起了这么一个简洁形象的名字：类似SC的角色。
 */

export abstract class SCLikeSprite extends DrawableSprite {

    readonly transform: Transform = new Transform();

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

    private _drawEffects: IDrawEffects = {
        ghost: 0,
        brightness: 0,
    };

    get ghost() { return this._drawEffects.ghost || 0; }
    set ghost(v: number) { this._drawEffects.ghost = v; }
    get brightness() { return this._drawEffects.brightness || 0; }
    set brightness(v: number) { this._drawEffects.brightness = v; }

    get drawEffects() {
        return {
            ghost: this.ghost,
            brightness: this.brightness,
        };
    }

    camera: Camera = TheMainCamera;
    abstract costume: BaseImage;
    layer: Layer = Layer.top;
    subLayer: number = 0;

    readonly hitBox: Rect = new Rect([0, 0], [0, 0]);

    draw(): void {
        new DrawImageTask(this.transform, this.camera, this.costume, this.layer, this.subLayer, this.drawEffects);
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

}
