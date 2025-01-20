import { TheImages } from "../AssetDefination.js";
import { Level } from "./Level.js";
import { Way } from "./Way.js";

export const TheLevels = {
    "1-0": new Level("1-0", TheImages.bg["1-0"], [
        Way.FromVector([-320,-145], [250,10], [200,6], [250,5]),
    ], []),
    "1-1": new Level("1-1", TheImages.bg["1-1"], [
        Way.FromVector([-320,-135], [140,6], [180,0], [50,-3], [60,-6], [100,-15], [120,-23]),
    ], []),
};