import { TheImages, TheMusics, TheSounds } from "../AssetDefination.js";
import { BaseImage } from "../Assets.js";
import { Char } from "../Char.js";
import { deg } from "../MyMath.js";
import { Transform } from "../Transform.js";
import { DrawTextTask } from "../graphic/DrawTextTask.js";
import { Key, Mouse, TheInput } from "./Input.js";
import { SCLikeSprite } from "./base/SCLikeSprite.js";

export class HelloSprite extends SCLikeSprite {

    drawTextTask: DrawTextTask;

    constructor() {
        super();
        this.costume = TheImages.test;
        this.drawTextTask = new DrawTextTask(this.transform, this.camera,
            `你好，世界！\n我${Char.bold}操死${Char.boldEnd}你的马\n说的道理\uE001啊啊啊玛索鞋\uE002那我灭\n\uE003The quick brown fox jumps over the lazy \uE004dog.`,
            10, 12, "center", "middle", 210, "#000000", "#ffffff", 2);
    }

    update() {
        this.position = TheInput.mouse;
        //this.s = Math.cos(deg(this.clock) * 3) * 2;
        this.stretch = [
            Math.cos(deg(this.clock) * 3) * 2,
            Math.sin(deg(this.clock) * 3) * 2,
        ];
        this.d += deg(1);
        if (this.brightness > -1) {
            this.brightness -= 0.03;
        }
        if (TheInput.isShortClick(Mouse.Any) || TheInput.isLongRelease(Key.Space)) {
            this.brightness = 1.2;
            TheSounds.hit[2].play();
        }
        const mus = TheMusics.ives_dream
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

    draw() {
        super.draw();
        this.drawTextTask.queue();
    }

}