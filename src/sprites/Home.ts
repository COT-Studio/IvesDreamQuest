import { TheImages } from "../AssetDefination.js";
import { Layer } from "../Layer.js";
import { Order } from "../Order.js";
import { TheSpritePool } from "../SpritePool.js";
import { SCLikeSprite } from "./base/SCLikeSprite.js";


export class Home extends SCLikeSprite {

    constructor() {
        super(Order.home);
        this.layer = Layer.home;
        this.position = [-270, -25];
        this.rect.center = [0, -30];
        this.rect.size = [135, 200];
        this.costume = TheImages.home.normal_assistant;
    }

    update() {}

}

const TheHome = new Home();
TheSpritePool.push(TheHome);