import { TheImages, TheSounds } from "../AssetDefination.js";
import { Layer } from "../Layer.js";
import { TheMConsole } from "../MConsole.js";
import { clamp } from "../MyMath.js";
import { Order } from "../Order.js";
import { TheSpritePool } from "../SpritePool.js";
import { SCLikeSprite } from "./base/SCLikeSprite.js";
import { Key, Mouse, TheInput } from "./Input.js";

export const enum WeaponName {
    none,
    hammer,
    magnet,
    rod,
    light,
    cutter,
    seed,
}

export class Weapon extends SCLikeSprite {

    weapon: WeaponName = WeaponName.none;
    targetWeapon: WeaponName = WeaponName.none;
    phase: number = 0;/*
    wx;
    wy;
    wx2;
    wy2;*/

    constructor() {
        super(Order.weapon);
        this.weapon = WeaponName.none;
        this.layer = Layer.weapon;/*
        this.wx = TheMConsole.addInput("weaponx");
        this.wx.value = "-10";
        this.wy = TheMConsole.addInput("weapony");
        this.wy.value = "-10";
        this.wx2 = TheMConsole.addInput("weaponx2");
        this.wx2.value = "-10";
        this.wy2 = TheMConsole.addInput("weapony2");
        this.wy2.value = "-10";*/
    }

    update() {
        this.doOnce(() => { this.weapon = this.targetWeapon = 1; });

        const cos = TheImages.weapon;
        const snd = TheSounds.weapon;

        this.position = TheInput.mouse;

        // 切武器
        this._checkKeySwitchWeapon(Key.Digit1, WeaponName.hammer);
        this._checkKeySwitchWeapon(Key.Digit2, WeaponName.magnet);
        this._checkKeySwitchWeapon(Key.Digit3, WeaponName.rod);
        this._checkKeySwitchWeapon(Key.Digit4, WeaponName.light);
        this._checkKeySwitchWeapon(Key.Digit5, WeaponName.cutter);

        if (this.phase == 0 && this.targetWeapon != this.weapon) {
            this.weapon = this.targetWeapon;
            snd.switch.play();
        }

        // 攻击逻辑
        const isHold = (TheInput.isHold(Mouse.Left) || TheInput.isHold(Key.Space)) && TheInput.isMouseActive;
        const isClick = (TheInput.isDown(Mouse.Left) || TheInput.isDown(Key.Space)) && TheInput.isMouseActive;
        let leftSide = -230;
        let topSide = 120;
        switch (this.weapon) {
            case WeaponName.hammer:
                this.x += -40;
                if (this.phase == 0) {
                    if (isHold) {
                        this.phase = 9;
                        snd.hammer.play();
                    }
                } else {
                    this.phase -= 1;
                }
                if (this.phase < 5) {
                    this.costume = cos.hammer0;
                    this.rect.center = [0, 20];
                    this.rect.size = [30, 50];
                } else {
                    this.costume = cos.hammer1;
                    this.rect.center = [25, 15];
                    this.rect.size = [40, 40];
                }
                break;
            case WeaponName.magnet:
                this.x += -10;
                this.y += 11;
                if (isClick) {
                    this.phase = 5;
                    snd.magnet.play();
                } else if (this.phase > 0) {
                    this.phase -= 1;
                }
                if (this.phase == 0) {
                    this.costume = cos.magnet0;
                } else {
                    this.costume = cos.magnet1;
                }
                this.rect.center = [0, 0];
                this.rect.size = [40, 40];
                break;
            case WeaponName.rod:
                this.costume = cos.rod0;
                break;
            case WeaponName.light:
                this.costume = cos.light;
                break;
            case WeaponName.cutter:
                this.costume = cos.cutter0;
                break;
        }

        this.position = [
            clamp(this.x, leftSide, 310),
            clamp(this.y, -180, topSide)
        ];
    }

    private _checkKeySwitchWeapon(key: Key, weapon: WeaponName) {
        if (TheInput.isDown(key) && TheInput.isMouseActive) {
            this.targetWeapon = weapon;
        }
    }

}

const TheWeapon = new Weapon();
TheSpritePool.push(TheWeapon);