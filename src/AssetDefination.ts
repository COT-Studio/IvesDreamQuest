import { img, msc, snd } from "./Assets.js";

export const TheImage = {
    bg: {
        blank_white: img("bg/blank_white.png").load(),
        blank_grey: img("bg/blank_grey.png").load(),
    },
    test: img("test.png").load(),
};

export const TheSound = {
    hit: {
       2: snd("hit_2.mp3", 2).load(),
    },
};

export const TheMusic = {
    sensation: msc(["sensation.mp3"]),
    ives_dream: msc(["Ives'_Dream.mp3"]).load(),
};