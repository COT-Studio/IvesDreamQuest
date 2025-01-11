import { DrawTask } from "./DrawTask.js";


function layerSort(a: DrawTask, b: DrawTask): number {
    return (b.layer - a.layer) || (b.subLayer - a.subLayer) || (a.orgLayer - b.orgLayer);
}

export class DrawTaskQueue {

    readonly tasks: DrawTask[];
    readonly useLayer: boolean;

    constructor(useLayer: boolean = true) {
        this.tasks = [];
        this.useLayer = useLayer;
    }

    push(task: DrawTask) {
        this.tasks.push(task);
    }

    clear() {
        this.tasks.length = 0;
    }

    draw() {
        if (this.useLayer) {
            this.tasks.sort(layerSort);
        }
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].draw();
        }
    }

}

/** 绘制任务队列 */
export const TheDrawTaskQueue = new DrawTaskQueue();