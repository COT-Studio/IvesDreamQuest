import { img, msc, snd } from "./Assets.js";

export const TheImage = {
    test: img("test.png").load(),
};

export const TheSound = {
    hit: {
       2: snd("hit_2.mp3"),
    },
};

export const TheMusic = {
    sensation: msc(["sensation.mp3"]),
    ives_dream: msc(["Ives' Dream.mp3"]).load(),
};