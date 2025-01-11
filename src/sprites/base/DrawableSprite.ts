import { Viewport } from "../../graphic/Viewport.js";
import { Order } from "../../Order.js";
import { Sprite } from "./Sprite.js";


export abstract class DrawableSprite extends Sprite {

    // 如果此值变为 false，不会调用该角色的 draw()
    isShow: boolean;

    constructor(order: Order = Order.end, subOrder: number = 0) {
        super(order, subOrder);
        this.isShow = true;
    }

    abstract draw(): void;

    /** 此方法返回 false 时，不会调用该角色的 draw() */
    isInViewport(viewport: Viewport): boolean {
        return true;
    }

}
