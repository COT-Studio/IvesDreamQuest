import { img, msc, snd } from "./Assets.js";

export const TheEmptyImage = img("__null__.png");

export const TheImages = {
    bg: {
        blank_white: img("bg/blank_white.png").load(),
        blank_grey: img("bg/blank_grey.png").load(),
        "1-0": img("bg/bg_1-0.svg"),
        "1-1": img("bg/bg_1-1.svg"),
        "1-2": img("bg/bg_1-2.svg"),
        "1-3": img("bg/bg_1-3.svg"),
        "1-4": img("bg/bg_1-4.svg"),
    },
    weapon: {
        hammer0: img("weapon/Hammer.svg"),
        hammer1: img("weapon/Hammer-Hit.svg"),
        magnet0: img("weapon/GoldMagnet.svg"),
        magnet1: img("weapon/GoldMagnet-Hit.svg"),
        rod0: img("weapon/BounceRod.svg"),
        rod1: img("weapon/BounceRod-Hit.svg"),
        light: img("weapon/DropLight.svg"),
        cutter0: img("weapon/SoulCutter.svg"),
        cutter1: img("weapon/SoulCutter-Hit.svg"),
    },
    home: {
        normal_assistant: img("home/NA.svg"),
    },
    enemy: {
        stickman: [
            img("enemy/stickman/SM-1.svg"),
            img("enemy/stickman/SM-2.svg"),
            img("enemy/stickman/SM-3.svg"),
            img("enemy/stickman/SM-4.svg"),
            img("enemy/stickman/SM-5.svg"),
        ],
        tiger: {
            normal: img("enemy/tiger/TI-1.svg", { resolution: 0.7 }),
        }
    },
    test: img("test.png"),
} as const;

export const TheSounds = {
    hit: {
       2: snd("hit_2.mp3", 2),
    },
    weapon: {
        switch: snd("weapon/Change_weapon.wav", 2).load(),
        hammer: snd("weapon/Hammer.wav", 2).load(),
        magnet: snd("weapon/ZZZZZ.wav", 1).load(),
        rod: snd("weapon/G_ukulele.wav", 2).load(),
    }
} as const;

export const TheMusics = {
    sensation: msc(["sensation.mp3"]),
    ives_dream: msc(["Ives'_Dream.mp3"]),
    sad: msc(["水泥楼里的档案室.mp3"]).load(),
    area1: msc(["蠢蠢欲动的黑晶.mp3"]).load(),
} as const;