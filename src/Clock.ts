class Clock {
    private _tick: number = 0;

    get tick() {
        return this._tick;
    }

    step() {
        this._tick ++;
    }

}

/** 游戏的主计时器，从游戏开始到当前已经经过的 tick 数，初始为0，每秒增加60 */
export let TheClock = new Clock();
