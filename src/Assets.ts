// @ts-ignore
import * as Pixi from "pixi";
import { clamp } from "./MyMath.js";

export const enum AssetLoadState {
    /** 不可用，暂时没有开始加载，未设定其 src */
    Idle,
    /** 不可用，但正在加载中 */
    Loading,
    /** 可用，加载完毕 */
    Ready,
    /** 不可用，加载失败 */
    Fail,
}

export type ImageURL = `${string}${".png" | ".svg"}`;
export type SoundURL = `${string}${".mp3" | ".wav" | ".ogg"}`;
export type MusicURL = `${string}${".mp3" | ".wav" | ".ogg"}`;

abstract class Asset {

    abstract readonly loadState: AssetLoadState;

    abstract load(): this;

}
/*
export class BaseImage extends Asset {

    readonly image: HTMLImageElement;
    private _src: string;
    private _loadState: AssetLoadState;

    get loadState(): AssetLoadState {
        return this._loadState;
    }

    constructor(src: string) {
        super()
        this.image = new window.Image();
        this._src = src;
        this._loadState = AssetLoadState.Idle
    }

    load() {
        if (this.loadState == AssetLoadState.Loading || this.loadState == AssetLoadState.Ready) {
            return this;
        }
        if (this.loadState == AssetLoadState.Fail) {
            this.image.src = "";
        }
        this.image.src = this._src;
        this._loadState = AssetLoadState.Loading;
        this.image.addEventListener("load", ev => this._loadState = AssetLoadState.Ready);
        this.image.addEventListener("error", ev => this._loadState = AssetLoadState.Fail);
        return this;
    }

}
*/
export class PixiImage extends Asset {

    texture: any;
    private _src: string;
    private _loadState: AssetLoadState;

    get loadState(): AssetLoadState {
        return this._loadState;
    }

    constructor(src: string) {
        super();
        this._src = src;
        this._loadState = AssetLoadState.Idle
    }

    load() {
        if (this.loadState == AssetLoadState.Loading || this.loadState == AssetLoadState.Ready) {
            return this;
        }
        this._loadState = AssetLoadState.Loading;
        Pixi.Assets.load(this._src).then(
            (result: any) => {
                this.texture = result;
                this._loadState = AssetLoadState.Ready;
            },
            (error: any) => {
                this._loadState = AssetLoadState.Fail;
                console.warn(`Pixi loader error: fail to load image "${this._src}"`);
            }
        );
        return this;
    }

}

abstract class AbstractAudio extends Asset {

    abstract volume: number;
    abstract play(): void;
    abstract readonly playTimestamp: number;

}

export class BaseAudio extends AbstractAudio {

    private _audio: HTMLAudioElement;
    private _src: string;
    private _loadState: AssetLoadState;

    get loadState(): AssetLoadState {
        return this._loadState;
    }

    private _playTimestamp: number;

    /** 获取开始播放时的时间戳，基于 Date.now()。  
     * 如果当前没有播放，则返回 0。  
     * 注意：此值可能会在同一 tick 内发生变化。 */
    get playTimestamp(): number {
        return this._playTimestamp;
    }

    get loop(): boolean {
        return this._audio.loop;
    }

    set loop(v: boolean) {
        this._audio.loop = v;
    }

    addEndedEventListener(callback: (this: HTMLAudioElement, ev: Event) => any) {
        this._audio.addEventListener("ended", callback);
    }

    constructor(src: string) {
        super();
        this._audio = new window.Audio();
        this._src = src;
        this._loadState = AssetLoadState.Idle;
        this._playTimestamp = 0;
    }

    load(onReady?: (ev: Event) => void, onFail?: (ev: Event) => void) {
        const s = this.loadState
        if (s == AssetLoadState.Ready) { return this; }
        if (s == AssetLoadState.Idle) {
            this._audio.src = this._src;
        }
        if (this.loadState == AssetLoadState.Fail) {
            this._audio.load();
        }
        this._loadState = AssetLoadState.Loading;
        this._audio.addEventListener("canplaythrough", ev => {
            this._loadState = AssetLoadState.Ready;
            onReady && onReady(ev);
        });
        this._audio.addEventListener("error", ev => {
            this._loadState = AssetLoadState.Fail;
            onFail && onFail(ev);
        });
        this._audio.addEventListener("ended", ev => {
            this._playTimestamp = 0;
        })
        if (s == AssetLoadState.Fail) {
            this._audio.load();
        }
        return this;
    }

    /** 音量，最小为 0 ，最大为 1 */
    get volume(): number {
        return this._audio.volume;
    }

    set volume(v: number) {
        this._audio.volume = clamp(v, 0, 1);
    }

    /** 开始或继续播放 */
    play(onfullfiled?: () => void, onrejected?: (reason: any) => void) {
        const promise = this._audio.play();
        if (promise == undefined) { return; }
        promise.then(() => {
            this._playTimestamp = Date.now();
            onfullfiled && onfullfiled();
        }, (reason) => {
            this._playTimestamp = 0;
            console.warn(`Warn: Can't play audio: ${reason} (src: ${this._src})`);
            onrejected && onrejected(reason);
        });
    }

    /** 暂停 */
    pause() {
        this._audio.pause();
        this._playTimestamp = 0;
    }

    /** 重置播放进度 */
    reset() {
        this._audio.currentTime = 0;
        if (this.playTimestamp) {
            this._playTimestamp = Date.now();
        }
    }

}

export class Sound extends AbstractAudio {

    private _audioList: Array<BaseAudio>;
    private _src: string;
    private _nextIdx: number;
    private _length: number;

    private _loadState: AssetLoadState;

    private _volume: number;

    get loadState(): AssetLoadState {
        return this._loadState;
    }

    /** 获取上一个播放的音效开始播放时的时间戳，基于 Date.now()。  
     * 如果它当前没有播放，则返回 0。  
     * 注意：此值可能会在同一 tick 内发生变化。 */
    get playTimestamp(): number {
        return this._last.playTimestamp;
    }

    private get _next(): BaseAudio {
        return this._audioList[this._nextIdx];
    }

    private get _last(): BaseAudio {
        return this._audioList[(this._nextIdx - 1) % this._length];
    }

    private _step() {
        this._nextIdx = (this._nextIdx + 1) % this._length;
    }

    /**
     * 多重音效对象，该对象内含多个 BaseAudio 对象，允许同时播放多个指向同一音频文件的音效。
     * @param src 音效 src ，注意需要填写完整的相对路径，例如../assets/sound/xxx.mp3
     * @param amount 音效数量。例如此处填3，就可以允许3个该音效同时播放。
     */
    constructor(src: string, amount: number) {
        super();
        this._src = src;
        this._audioList = [];
        this._nextIdx = 0;
        this._length = amount;
        this._volume = 1;

        for (let i = 0; i < amount; i++) {
            this._audioList.push(new BaseAudio(src));
        }

        this._loadState = AssetLoadState.Idle;
    }

    load() {
        if (this.loadState == AssetLoadState.Loading || this.loadState == AssetLoadState.Ready) { return this; }
        this._loadState = AssetLoadState.Loading;
        for (const audio of this._audioList) {
            if (audio.loadState == AssetLoadState.Ready) { continue; }
            audio.load(ev => {
                if (this._audioList.every(a => a.loadState == AssetLoadState.Ready)) {
                    this._loadState = AssetLoadState.Ready;
                }
            }, ev => {
                this._loadState = AssetLoadState.Fail;
            });
        }
        return this;
    }

    /** 音量，最小为 0 ，最大为 1 */
    get volume(): number {
        return this._volume;
    }

    set volume(v: number) {
        if (v == this.volume) { return; }
        this._volume = v;
        for (const audio of this._audioList) {
            audio.volume = v;
        }
    }

    /** 开始播放 */
    play() {
        if (this.loadState != AssetLoadState.Ready) {
            if (this.loadState == AssetLoadState.Idle || this.loadState == AssetLoadState.Fail) {
                this.load();
                console.warn("自动加载了音效：" + this._src);
            }
            return;
        }
        this._next.reset();
        this._next.play();
        this._step();
    }

    /** 停止 */
    stop() {
        for (const audio of this._audioList) {
            audio.pause();
            audio.reset();
        }
    }
}

export class Music extends AbstractAudio {

    private _audioList: Array<BaseAudio>;
    private _firstSrc: string;
    private _currentIdx: number;
    private _nextIdx: number;
    private _length: number;

    /** 音乐片段总数 */
    get length(): number {
        return this._length;
    }

    /** 当前正在尝试播放的片段 */
    get currentIdx(): number {
        return this._currentIdx;
    }

    private _isHasPre: boolean;
    private _isHasEnd: boolean;

    private _loadState: AssetLoadState;

    private _volume: number;

    get loadState(): AssetLoadState {
        return this._loadState;
    }

    private _playTimestamp;

    /** 获取音乐开始播放时的时间戳，基于 Date.now()。
     * 多个片段视为同一段音频，所以该返回值实际上是上次成功调用 play() 的时间戳  
     * 如果当前没有播放，则返回 0。  
     * 注意：此值可能会在同一 tick 内发生变化。 */
    get playTimestamp(): number {
        return this._playTimestamp;
    }

    /**
     * 音乐对象，该对象内含多个 Audio 对象，允许依次或循环播放多个指向一组音频文件的音乐。
     * @param srcList 所有片段的 src ，注意需要填写完整的相对路径，例如../assets/sound/xxx.mp3
     * @param isHasPre 如果填 true，第一片段不会循环。
     * @param isHasEnd 如果填 true，最后片段不会循环。
     */
    constructor(srcList: string[], isHasPre: boolean, isHasEnd: boolean) {
        super();
        this._firstSrc = srcList[0];
        this._audioList = [];
        this._currentIdx = 0;
        this._nextIdx = 0;
        this._length = srcList.length;
        this._isHasPre = isHasPre;
        this._isHasEnd = isHasEnd;
        this._volume = 1;

        const handleAudioEndedBind = this._handleAudioEnded.bind(this)
        for (let i = 0; i < this.length; i++) {
            const audio = new BaseAudio(srcList[i]);
            audio.addEndedEventListener(handleAudioEndedBind);
            this._audioList.push(audio);
        }

        this._loadState = AssetLoadState.Idle;
        this._playTimestamp = 0;
    }

    private _handleAudioEnded() {
        if (0 <= this._nextIdx && this._nextIdx < this.length) {
            this._currentIdx = this._nextIdx;
            this._nextIdx ++;
            this._play(this.currentIdx, false);
        } else {
            this.stop();
            this._playTimestamp = 0;
        }
    }

    load() {
        if (this.loadState == AssetLoadState.Loading || this.loadState == AssetLoadState.Ready) { return this; }
        this._loadState = AssetLoadState.Loading;
        for (const audio of this._audioList) {
            if (audio.loadState == AssetLoadState.Ready) { continue; }
            audio.load(ev => {
                if (this._audioList.every(a => a.loadState == AssetLoadState.Ready)) {
                    this._loadState = AssetLoadState.Ready;
                }
            }, ev => {
                this._loadState = AssetLoadState.Fail;
            });
        }
        return this;
    }

    /** 音量，最小为 0 ，最大为 1 */
    get volume(): number {
        return this._volume;
    }

    set volume(v: number) {
        if (v == this.volume) { return; }
        this._volume = v;
        for (const audio of this._audioList) {
            audio.volume = v;
        }
    }

    private _play(idx: number, isBegin: boolean) {
        const current = this._audioList[idx];
        if ((this._isHasPre && idx == 0) || (this._isHasEnd && idx == this.length - 1)) {
            current.loop = false;
        } else {
            current.loop = true;
        }
        if (isBegin) {
            current.play(() => this._playTimestamp = Date.now());
        } else {
            current.play();
        }
    }

    /** 开始或继续播放 */
    play() {
        if (this.loadState != AssetLoadState.Ready) {
            if (this.loadState == AssetLoadState.Idle || this.loadState == AssetLoadState.Fail) {
                this.load();
                console.warn("自动加载了音乐，该音乐的首个src为：" + this._firstSrc);
            }
            return;
        }
        this._play(this.currentIdx, true);
    }

    /** 暂停 */
    pause() {
        this._audioList[this.currentIdx].pause();
        this._playTimestamp = 0;
    }

    /** 停止播放，并重置播放进度 */
    stop() {
        this.pause();
        this._currentIdx = 0;
        this._nextIdx = 0;
        this._audioList[0].reset();
    }

    /** 本节播放完毕后，跳转到第 idx 节，默认为下一节 */
    step(idx?: number) {
        const nextIdx = idx || this._currentIdx + 1;
        this._nextIdx = nextIdx;
        this._audioList[this.currentIdx].loop = false;
    }

    /** 立即跳转到第 idx 节，默认为下一节 */
    jump(idx?: number) {
        this.step(idx);
        this._audioList[this.currentIdx].pause();
        this._audioList[this.currentIdx].reset();
        this._handleAudioEnded();
    }

}


/**
 * 加载一张贴图。
 * @param url 图片在 image 文件夹中的路径。
 */
export function img(url: ImageURL): PixiImage {
    return new PixiImage("../assets/image/" + url);
}

/**
 * 加载一个音效。
 * @param url 音效在 sound 文件夹中的路径。
 * @param amount 多重音频数量，默认为1。
 */
export function snd(url: SoundURL, amount: number = 1): Sound {
    return new Sound("../assets/sound/" + url, amount);
}

/**
 * 加载一首音乐
 * @param urlList 音乐所有片段在 music 文件夹中的路径。
 * @param isHasPre 如果填 true，第一片段不会循环。
 * @param isHasEnd 如果填 true，最后片段不会循环。
 */
export function msc(urlList: MusicURL[], isHasPre: boolean = false, isHasEnd: boolean = false): Music {
    const srcList = [];
    for (const url of urlList) {
        srcList.push("../assets/music/" + url);
    }
    return new Music(srcList, isHasPre, isHasEnd);
}