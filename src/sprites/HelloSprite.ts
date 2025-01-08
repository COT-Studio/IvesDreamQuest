import { TheImage } from "../AssetDefination.js";
import { Image } from "../Assets.js";
import { deg } from "../MyMath.js";
import { Key, Mouse, TheInput } from "./Input.js";
import { SCLikeSprite } from "./Sprite.js";

export class HelloSprite extends SCLikeSprite {

    costume: Image = TheImage.test;

    update(): void {
        this.position = TheInput.mousePosition;
        this.stretch = [
            Math.cos(deg(this.clock) * 3) + 1,
            Math.sin(deg(this.clock) * 3) + 1,
        ];
        if (this.brightness > -1) {
            this.brightness -= 0.03;
        }
        if (TheInput.isShortClick(Mouse.Any) || TheInput.isLongRelease(Key.Space)) {
            this.brightness = 1.2;
        }
        /*for (const key in TheInput.s) {
            if (TheInput.s[key] !== 0) {
                console.log(key, TheInput.s[key]);
            }
        }*/
    }

}