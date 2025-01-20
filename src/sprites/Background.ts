import { TheImages, TheMusics } from "../AssetDefination.js";
import { AssetLoadState } from "../Assets.js";
import { TheMainCamera, TheNullCamera } from "../graphic/Camera.js";
import { Layer } from "../Layer.js";
import { TheLevelManager } from "../level/LevelManager.js";
import { Order } from "../Order.js";
import { Rect } from "../Rect.js";
import { TheSpritePool } from "../SpritePool.js";
import { SCLikeSprite } from "./base/SCLikeSprite.js";
import { Mouse, TheInput } from "./Input.js";

export class Background extends SCLikeSprite {

    constructor() {
        super(Order.begin_bg);
        this.costume = TheImages.bg.blank_white;
        this.camera = TheNullCamera;
        this.layer = Layer.bottom;
        this.rect = Rect.FromSize([0, 0], [640, 360]);
        this.addTask(task => TheMusics.area1.loadState == AssetLoadState.Ready, task => TheMusics.area1.play(), 1);
    }

    debug(): void {
        super.debug();
        TheLevelManager.level.drawDebugWay();
    }

}

//export const TheHelloSprite = new HelloSprite();
export const TheBackground = new Background();
TheSpritePool.push(TheBackground);
