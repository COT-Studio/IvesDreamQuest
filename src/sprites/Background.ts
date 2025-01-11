import { TheImage } from "../AssetDefination.js";
import { TheNullCamera } from "../graphic/Camera.js";
import { Layer } from "../Layer.js";
import { Order } from "../Order.js";
import { SCLikeSprite } from "./base/SCLikeSprite.js";

export class Background extends SCLikeSprite {

    constructor() {
        super(Order.begin_bg);
        this.costume = TheImage.bg.blank_grey;
        this.camera = TheNullCamera;
        this.layer = Layer.bottom;
        this.s = 2;
    }

    update(): void {}

}