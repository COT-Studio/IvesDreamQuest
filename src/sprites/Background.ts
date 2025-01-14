import { TheImages, TheMusics } from "../AssetDefination.js";
import { AssetLoadState } from "../Assets.js";
import { TheNullCamera } from "../graphic/Camera.js";
import { Layer } from "../Layer.js";
import { Order } from "../Order.js";
import { Rect } from "../Rect.js";
import { TheSpritePool } from "../SpritePool.js";
import { SCLikeSprite } from "./base/SCLikeSprite.js";
import { Mouse, TheInput } from "./Input.js";

export class Background extends SCLikeSprite {

    /*x2: number = 0;
    y2: number = 0;
    x1: number = 160;
    y1: number = 90;*/

    constructor() {
        super(Order.begin_bg);
        this.costume = TheImages.bg["1-0"];
        this.camera = TheNullCamera;
        this.layer = Layer.bottom;
        this.rect = Rect.FromSize([0, 0], [640, 360]);
        this.addTask(task => TheMusics.area1.loadState == AssetLoadState.Ready, task => TheMusics.area1.play(), 1);
    }

    update(): void {/*
        if (TheInput.isDown(Mouse.Left)) {
            [this.x1, this.y1] = TheInput.mouse;
        }
        if (TheInput.isDown(Mouse.Right)) {
            [this.x2, this.y2] = TheInput.mouse;
        }
        this.rect = new Rect([this.x1, this.y1], [this.x2, this.y2]);*/
    }

}

//export const TheHelloSprite = new HelloSprite();
export const TheBackground = new Background();
TheSpritePool.push(TheBackground);
