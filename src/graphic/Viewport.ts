/** 摄像机“拍摄”下来的可见区 */
export class Viewport {

    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

}

/** 相机拍摄到的范围大小 */
export const TheViewport = new Viewport(640, 360);