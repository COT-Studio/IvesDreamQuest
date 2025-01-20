import { TheViewport } from "./graphic/Viewport.js";
import { Sprite } from "./sprites/base/Sprite.js";
import { DrawableSprite } from "./sprites/base/DrawableSprite.js";

/** 
 * 如果 < 0，则 a 在 b 前面；如果 > 0，则 a 在 b 后面。
 */
function orderSort(a: Sprite, b: Sprite): number {
    return (a.order - b.order) || (a.subOrder - b.subOrder)
}

export class SpritePool {

    sprites: Sprite[];
    useOrder: boolean;

    constructor(useOrder: boolean = true) {
        this.sprites = [];
        this.useOrder = useOrder;
    }

    push(sprite: Sprite) {
        if (this.useOrder) {
            let idx = this.sprites.findIndex(s => orderSort(s, sprite) > 0);
            if (idx > -1) {
                this.sprites.splice(idx, 0, sprite);
                return;
            }
        }
        this.sprites.push(sprite);
    }

    // 注意：新角色在生成的那一帧就会更新一次
    update() {
        let snapshot = [...this.sprites];
        for (let i = 0; i < snapshot.length; i++) {
            let sprite = snapshot[i];
            if (!sprite) { continue; }
            if (sprite.isActive && sprite.isLive) {
                sprite.baseUpdate();
                sprite.update();
            }
        }
    }

    draw() {
        // 注意！！！如果在 draw 的过程中插入新角色会导致迭代器死循环！！！
        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = this.sprites[i];
            if (sprite instanceof DrawableSprite) {
                if (sprite.isShow && sprite.isInViewport(TheViewport) && sprite.isLive) {
                    sprite.draw();
                }
            }
        }
    }

    debug() {
        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = this.sprites[i];
            if (sprite.isLive) {
                sprite.debug();
            }
        }
    }

    clean() {
        const liveCheck = (sprite: Sprite) => sprite.isLive;
        if(this.sprites.every(liveCheck)) { return; }
        this.sprites = this.sprites.filter(liveCheck);
    }

}

/** 对象池，每个对象都会自动把自己添加到此对象池中 */
export const TheSpritePool = new SpritePool();