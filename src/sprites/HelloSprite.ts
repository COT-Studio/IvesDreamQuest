import { TheImage } from "../AssetDefination.js";
import { Image } from "../Assets.js";
import { deg } from "../Coord.js";
import { TheInput } from "./Input.js";
import { SCLikeSprite } from "./Sprite.js";

export class HelloSprite extends SCLikeSprite {

    costume: Image = TheImage.test;

    update(): void {
        this.position = TheInput.mousePosition;
        this.stretch = [
            Math.cos(deg(this.clock) * 3) + 1,
            Math.sin(deg(this.clock) * 3) + 1,
        ];
        this.brightness = Math.cos(deg(this.clock) * 3);
    }

}