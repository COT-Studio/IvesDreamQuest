import { TheImage, TheMusic, TheSound } from "../AssetDefination.js";
import { BaseImage } from "../Assets.js";
import { deg } from "../MyMath.js";
import { Key, Mouse, TheInput } from "./Input.js";
import { SCLikeSprite } from "./SCLikeSprite.js";

export class HelloSprite extends SCLikeSprite {

    costume: BaseImage = TheImage.test;

    update(): void {
        this.position = TheInput.mouse;
        this.stretch = [
            Math.cos(deg(this.clock) * 3) * 2,
            Math.sin(deg(this.clock) * 3) * 2,
        ];
        //this.d += deg(1);
        if (this.brightness > -1) {
            this.brightness -= 0.03;
        }
        if (TheInput.isShortClick(Mouse.Any) || TheInput.isLongRelease(Key.Space)) {
            this.brightness = 1.2;
            TheSound.hit[2].play();
        }
        const mus = TheMusic.ives_dream
        this.doOnce(() => {
            this.addTimeTask(180, task => mus.play(), 1);
            this.addTask(task => TheInput.isShortClick(Key.KeyP), task => {
                if (mus.playTimestamp) {
                    mus.pause();
                } else {
                    mus.play();
                }
            });
            this.addTask(task => TheInput.isShortClick(Key.KeyO), task => {
                mus.stop();
            });
            this.addTask(task => TheInput.wheel != 0, task => {
                mus.volume += TheInput.wheel * 0.1;
            });
        }, "addMusicTasks");
        /*for (const key in TheInput.s) {
            if (TheInput.s[key] !== 0) {
                console.log(key, TheInput.s[key]);
            }
        }*/
    }

}