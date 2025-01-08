import { TheImage } from "../AssetDefination.js";
import { TheNullCamera } from "../graphic/Camera.js";
import { Layer } from "../Layer.js";
import { Order } from "../Order.js";
import { SCLikeSprite } from "./SCLikeSprite.js";

export class Background extends SCLikeSprite {

    costume = TheImage.bg.blank_grey;
    camera = TheNullCamera;
    layer = Layer.bottom;

    constructor() {
        super(Order.begin_bg);
        this.s = 2;
    }

    update(): void {}

}