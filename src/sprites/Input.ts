import { TheCanvasManager } from "../graphic/Canvas.js";
import { TheViewport, Viewport } from "../graphic/Viewport.js";
import { Vector } from "../MyMath.js";
import { Order } from "../Order.js";
import { Sprite } from "./base/Sprite.js";
import { DrawableSprite } from "./base/DrawableSprite.js";
import { TheMConsole } from "../MConsole.js";

const enum KeyEventType {
    none = 0,
    down = 1,
    up = 2,
    downAndUp = 3,
}

/** 键码表，仅包含 Required 部分，注释为个人简单翻译  
 * 来源：https://w3c.github.io/uievents-code/#code-value-tables  
 * 此枚举最后更新于：2025/1/6  
 * 注意：有些按键不支持响应，请查阅 ActiveButtons */
export const enum Key {
    /* -- Alphanumeric Section - Writing System Keys -- */
    /** 美式键盘的 “`~”。 同时也是日式键盘的 “半角/全角/漢字” */
    Backquote = "Backquote",
    /** Used for both the US \\| (on the 101-key layout) and also for the key located between the " and Enter keys on row C of the 102-, 104- and 106-key layouts. Labelled #~ on a UK (102) keyboard. */
    Backslash = "Backslash",
    /** 美式键盘的 “[{”。 */
    BracketLeft = "BracketLeft",
    /** 美式键盘的 “]}”。 */
    BracketRight = "BracketRight",
    /** 美式键盘的 “,<”。 */
    Comma = "Comma",
    /** 美式键盘的 “0)”。 */
    Digit0 = "Digit0",
    /** 美式键盘的 “1!”。 */
    Digit1 = "Digit1",
    /** 美式键盘的 “2@”。 */
    Digit2 = "Digit2",
    /** 美式键盘的 “3#”。 */
    Digit3 = "Digit3",
    /** 美式键盘的 “4$”。 */
    Digit4 = "Digit4",
    /** 美式键盘的 “5%”。 */
    Digit5 = "Digit5",
    /** 美式键盘的 “6^”。 */
    Digit6 = "Digit6",
    /** 美式键盘的 “7&”。 */
    Digit7 = "Digit7",
    /** 美式键盘的 “8*”。 */
    Digit8 = "Digit8",
    /** 美式键盘的 “9(”。 */
    Digit9 = "Digit9",
    /** 美式键盘的 “=+”。 */
    Equal = "Equal",
    /** Located between the left Shift and Z keys. Labelled \\| on a UK keyboard. */
    IntlBackslash = "IntlBackslash",
    /** Located between the / and right Shift keys. Labelled \\ろ (ro) on a Japanese keyboard. */
    IntlRo = "IntlRo",
    /** Located between the = and Backspace keys. Labelled ¥ (yen) on a Japanese keyboard. \\/ on a Russian keyboard. */
    IntlYen = "IntlYen",
    /**美式键盘的 “ a”。 在 AZERTY 键盘（如法国）上标识为 “q”。 */
    KeyA = "KeyA",
    /**美式键盘的 “ b”。 */
    KeyB = "KeyB",
    /**美式键盘的 “ c”。 */
    KeyC = "KeyC",
    /**美式键盘的 “ d”。 */
    KeyD = "KeyD",
    /**美式键盘的 “ e”。 */
    KeyE = "KeyE",
    /**美式键盘的 “ f”。 */
    KeyF = "KeyF",
    /**美式键盘的 “ g”。 */
    KeyG = "KeyG",
    /**美式键盘的 “ h”。 */
    KeyH = "KeyH",
    /**美式键盘的 “ i”。 */
    KeyI = "KeyI",
    /**美式键盘的 “ j”。 */
    KeyJ = "KeyJ",
    /**美式键盘的 “ k”。 */
    KeyK = "KeyK",
    /**美式键盘的 “ l”。 */
    KeyL = "KeyL",
    /**美式键盘的 “ m”。 */
    KeyM = "KeyM",
    /**美式键盘的 “ n”。 */
    KeyN = "KeyN",
    /**美式键盘的 “ o”。 */
    KeyO = "KeyO",
    /**美式键盘的 “ p”。 */
    KeyP = "KeyP",
    /**美式键盘的 “ q”。 在 AZERTY 键盘（如法国）上标识为 “a”。 */
    KeyQ = "KeyQ",
    /**美式键盘的 “ r”。 */
    KeyR = "KeyR",
    /**美式键盘的 “ s”。 */
    KeyS = "KeyS",
    /**美式键盘的 “ t”。 */
    KeyT = "KeyT",
    /**美式键盘的 “ u”。 */
    KeyU = "KeyU",
    /**美式键盘的 “ v”。 */
    KeyV = "KeyV",
    /**美式键盘的 “ w”。 在 AZERTY 键盘（如法国）上标识为 “z”。 */
    KeyW = "KeyW",
    /**美式键盘的 “ x”。 */
    KeyX = "KeyX",
    /**美式键盘的 “ y”。 在 QWERTZ 键盘（如德国）上标识为 “z”。 */
    KeyY = "KeyY",
    /**美式键盘的 “ z”。 在 AZERTY 键盘（如法国）上标识为 “w”，在 QWERTZ 键盘（如德国）上标识为 “y”。 */
    KeyZ = "KeyZ",
    /** 美式键盘的 “-_”。 */
    Minus = "Minus",
    /** 美式键盘的 “.>”。 */
    Period = "Period",
    /** 美式键盘的 “'"”。 */
    Quote = "Quote",
    /** 美式键盘的 “;:”。 */
    Semicolon = "Semicolon",
    /** 美式键盘的 “/?”。 */
    Slash = "Slash",
    /* -- Alphanumeric Section - Functional Keys -- */
    /** “Alt”，“Option” 或 “⌥”。 */
    AltLeft = "AltLeft",
    /** “Alt”，“Option” 或 “⌥”。 在很多键盘布局上标识为 “AltGr”。 */
    AltRight = "AltRight",
    /** “Backspace” 或 “⌫”。 在 Apple 键盘上标识为 “Delete”。 */
    Backspace = "Backspace",
    /** “CapsLock” 或 “⇪”。 */
    CapsLock = "CapsLock",
    /** The application context menu key, which is typically found between the right Meta key and the right Control key. */
    ContextMenu = "ContextMenu",
    /** “Control” 或 “⌃”。 */
    ControlLeft = "ControlLeft",
    /** “Control” 或 “⌃”。 */
    ControlRight = "ControlRight",
    /** “Enter” 或 “↵”。 在 Apple 键盘上标识为 “Return”。 */
    Enter = "Enter",
    /** The Windows, ⌘, Command or other OS symbol key. */
    MetaLeft = "MetaLeft",
    /** The Windows, ⌘, Command or other OS symbol key. */
    MetaRight = "MetaRight",
    /** “Shift” 或 “⇧”。 */
    ShiftLeft = "ShiftLeft",
    /** “Shift” 或 “⇧”。 */
    ShiftRight = "ShiftRight",
    /** “ ” （空格） */
    Space = "Space",
    /** “Tab” 或 “⇥”。 */
    Tab = "Tab",
    /* -- Control Pad Section -- */
    /** ⌦. The forward delete key. Note that on Apple keyboards, the key labelled Delete on the main part of the keyboard should be encoded as "Backspace". */
    Delete = "Delete",
    /** “End” 或 “↘”。 */
    End = "End",
    /** Help. Not present on standard PC keyboards. */
    Help = "Help",
    /** “Home” 或 “↖”。 */
    Home = "Home",
    /** “Insert” 或 “I”。ns. Not present on Apple keyboards. */
    Insert = "Insert",
    /** Page Down, PgDn or ⇟ */
    PageDown = "PageDown",
    /** Page Up, PgUp or ⇞ */
    PageUp = "PageUp",
    /* -- Arrow Pad Section -- */
    /** ↓ */
    ArrowDown = "ArrowDown",
    /** ← */
    ArrowLeft = "ArrowLeft",
    /** → */
    ArrowRight = "ArrowRight",
    /** ↑ */
    ArrowUp = "ArrowUp",
    /* -- Numpad Section -- */
    /** On the Mac, the "NumLock" code should be used for the numpad Clear key. */
    NumLock = "NumLock",
    /** 0 Ins on a keyboard  
     * 0 on a phone or remote control */
    Numpad0 = "Numpad0",
    /** 1 End on a keyboard  
     * 1 or 1 QZ on a phone or remote control */
    Numpad1 = "Numpad1",
    /** 2 ↓ on a keyboard  
     * 2 ABC on a phone or remote control */
    Numpad2 = "Numpad2",
    /** 3 PgDn on a keyboard  
     * 3 DEF on a phone or remote control */
    Numpad3 = "Numpad3",
    /** 4 ← on a keyboard  
     * 4 GHI on a phone or remote control */
    Numpad4 = "Numpad4",
    /** 5 on a keyboard  
     * 5 JKL on a phone or remote control */
    Numpad5 = "Numpad5",
    /** 6 → on a keyboard  
     * 6 MNO on a phone or remote control */
    Numpad6 = "Numpad6",
    /** 7 Home on a keyboard  
     * 7 PQRS or 7 PRS on a phone or remote control */
    Numpad7 = "Numpad7",
    /** 8 ↑ on a keyboard  
     * 8 TUV on a phone or remote control */
    Numpad8 = "Numpad8",
    /** 9 PgUp on a keyboard  
     * 9 WXYZ or 9 WXY on a phone or remote control */
    Numpad9 = "Numpad9",
    /** + */
    NumpadAdd = "NumpadAdd",
    /** . Del. For locales where the decimal separator is "," (e.g., Brazil), this key may generate a ,. */
    NumpadDecimal = "NumpadDecimal",
    /** / */
    NumpadDivide = "NumpadDivide",
    /**  */
    NumpadEnter = "NumpadEnter",
    /** \* on a keyboard. For use with numpads that provide mathematical operations (+, -, * and /).  
     * Use "NumpadStar" for the * key on phones and remote controls. */
    NumpadMultiply = "NumpadMultiply",
    /* -- Function Section -- */
    /** “Esc” 或 “⎋”。 */
    Escape = "Escape",
    /** F1 */
    F1 = "F1",
    /** F2 */
    F2 = "F2",
    /** F3 */
    F3 = "F3",
    /** F4 */
    F4 = "F4",
    /** F5 */
    F5 = "F5",
    /** F6 */
    F6 = "F6",
    /** F7 */
    F7 = "F7",
    /** F8 */
    F8 = "F8",
    /** F9 */
    F9 = "F9",
    /** F10 */
    F10 = "F10",
    /** F11 */
    F11 = "F11",
    /** F12 */
    F12 = "F12",
    /** PrtScr SysRq or Print Screen */
    PrintScreen = "PrintScreen",
    /** Scroll Lock */
    ScrollLock = "ScrollLock",
    /** Pause Break */
    Pause = "Pause",
}

/** 鼠标键码 */
export const enum Mouse {
    /** 主按键（通常是左键） */
    Left = "Mouse0",
    /** 辅助按键（通常是滚轮中键） */
    Middle = "Mouse1",
    /** 次按键（通常是右键） */
    Right = "Mouse2",
    /** 主按键、次按键或辅助按键，只要按住任意一个就视为按住了 “Any” 键 */
    Any = "MouseAny",
}

/** 所有支持响应的按键编码，包括键盘、鼠标、手柄等。  
 * 此列表之外的按键不会响应。 */
export const ActiveButtons: Set<string> = new Set<string>([
    Key.Backquote,
    Key.Backslash,
    Key.BracketLeft,
    Key.BracketRight,
    Key.Comma,
    Key.Digit0,
    Key.Digit1,
    Key.Digit2,
    Key.Digit3,
    Key.Digit4,
    Key.Digit5,
    Key.Digit6,
    Key.Digit7,
    Key.Digit8,
    Key.Digit9,
    Key.Equal,
    Key.IntlBackslash,
    Key.IntlRo,
    Key.IntlYen,
    Key.KeyA,
    Key.KeyB,
    Key.KeyC,
    Key.KeyD,
    Key.KeyE,
    Key.KeyF,
    Key.KeyG,
    Key.KeyH,
    Key.KeyI,
    Key.KeyJ,
    Key.KeyK,
    Key.KeyL,
    Key.KeyM,
    Key.KeyN,
    Key.KeyO,
    Key.KeyP,
    Key.KeyQ,
    Key.KeyR,
    Key.KeyS,
    Key.KeyT,
    Key.KeyU,
    Key.KeyV,
    Key.KeyW,
    Key.KeyX,
    Key.KeyY,
    Key.KeyZ,
    Key.Minus,
    Key.Period,
    Key.Quote,
    Key.Semicolon,
    Key.Slash,
    Key.AltLeft,
    Key.AltRight,
    Key.Backspace,
    Key.CapsLock,
    Key.ControlLeft,
    Key.ControlRight,
    Key.Enter,
    Key.MetaLeft,
    Key.MetaRight,
    Key.ShiftLeft,
    Key.ShiftRight,
    Key.Space,
    Key.Tab,
    Key.ArrowDown,
    Key.ArrowLeft,
    Key.ArrowRight,
    Key.ArrowUp,
    Key.Numpad0,
    Key.Numpad1,
    Key.Numpad2,
    Key.Numpad3,
    Key.Numpad4,
    Key.Numpad5,
    Key.Numpad6,
    Key.Numpad7,
    Key.Numpad8,
    Key.Numpad9,
    Key.NumpadAdd,
    Key.NumpadDecimal,
    Key.NumpadDivide,
    Key.NumpadEnter,
    Key.NumpadMultiply,
    Key.Escape,
    Mouse.Left,
    Mouse.Middle,
    Mouse.Right,
    Mouse.Any,
]);

/** 各种按键编码（Mouse, Key等）的版本号。不同版本号之间不保证兼容性。 */
export const InputCodeVersion = 0;

export class Input extends Sprite {

    private readonly _keyEventType: {[key: string]: KeyEventType};

    // 注意：如果按住一个键，突然松开极短的时间，然后再次按住，有可能忽视这次抬手，视为一直按住。
    /** 所有按键的状态，初始为0，按住则从1开始每帧加1，松开的一帧变为相反数，之后归0。 */
    readonly state: {[key: string]: number} = {};
    /** state 的简写 */
    readonly s: {[key: string]: number} = this.state;

    private _mouseNowX: number = 0;
    private _mouseNowY: number = 0;

    private _mouseTickX: number = 0;
    private _mouseTickY: number = 0;

    /** 鼠标在 Viewport 上的横坐标 */
    get mouseX(): number {
        return this._mouseTickX;
    }
    /** 鼠标在 Viewport 上的纵坐标 */
    get mouseY(): number {
        return this._mouseTickY;
    }
    /** 鼠标在 Viewport 上的位置 */
    get mouse(): Vector {
        return [this.mouseX, this.mouseY];
    }

    private _wheelNow: number = 0;
    private _wheelTick: number = 0;

    /** 返回鼠标滚轮的状态，正数为向上滚动，负数为向下滚动，绝对值为这一帧内滚动的次数 */
    get wheel(): number {
        return this._wheelTick;
    }
    
    /** 如果此值为 false ，说明鼠标坐标不可靠，通常是因为鼠标离开 Canvas。 */
    isMouseActive: boolean = false;

    constructor() {
        super(Order.begin_input);
        for (const key of ActiveButtons) {
            this.state[key] = 0;
        }
        this._keyEventType = {...this.state};

        document.addEventListener("keydown", ev => this._setKeyEventType(ev.code, true));
        document.addEventListener("keyup", ev => this._setKeyEventType(ev.code, false));

        TheCanvasManager.canvas.addEventListener("mousedown", ev => this._handleMouseClick(ev, true));
        TheCanvasManager.canvas.addEventListener("mouseup", ev => this._handleMouseClick(ev, false));

        TheCanvasManager.canvas.addEventListener("mousemove", ev => this._handleMouseMove(ev, true));
        TheCanvasManager.canvas.addEventListener("mouseleave", ev => this._handleMouseMove(ev, false));

        document.addEventListener("wheel", ev => this._wheelNow -= Math.sign(ev.deltaY))
    }

    private _setKeyEventType(key: string, isDown: boolean) {
        if (!ActiveButtons.has(key)) { return }
        if (isDown) {
            this._keyEventType[key] = KeyEventType.down;
        } else {
            if (this._keyEventType[key] == KeyEventType.none) {
                this._keyEventType[key] = KeyEventType.up;
            } else if (this._keyEventType[key] == KeyEventType.down) {
                this._keyEventType[key] = KeyEventType.downAndUp;
            }
        }
    }

    private _handleMouseClick(ev: MouseEvent, isDown: boolean) {
        switch (ev.button) {
            case 0:
                this._setKeyEventType(Mouse.Left, isDown);
                break;
            case 1:
                this._setKeyEventType(Mouse.Middle, isDown);
                break;
            case 2:
                this._setKeyEventType(Mouse.Right, isDown);
                break;
            default:
                return;
        }
        if (isDown || ev.buttons == 0) {
            this._setKeyEventType(Mouse.Any, isDown);
        }
    }

    private _handleMouseMove(ev: MouseEvent, isLeave: boolean) {
        let { left, top } = TheCanvasManager.rect;
        left += TheCanvasManager.clientLeft;
        top += TheCanvasManager.clientTop;
        const width = TheCanvasManager.clientWidth;
        const height = TheCanvasManager.clientHeight;
        const sx = TheCanvasManager.width / width;
        const sy = TheCanvasManager.height / height;
        [this._mouseNowX, this._mouseNowY] = TheCanvasManager.canvasToViewport([
            (ev.clientX - left) / sx,
            (ev.clientY - top) / sy,
        ], TheViewport);
        this.isMouseActive = this.isActive;
    }

    update(): void {
        for (const key of ActiveButtons) {
            switch (this._keyEventType[key]) {
                case KeyEventType.none:
                    if (this.s[key] > 0) {
                        this.s[key] += 1;
                    } else {
                        this.s[key] = 0;
                    }
                    break;
                case KeyEventType.up:
                    if (this.s[key] > 0) {
                        this.s[key] *= -1;
                    } else {
                        this.s[key] = 0
                    }
                    break;

                case KeyEventType.down:
                case KeyEventType.downAndUp:
                    if (this.s[key] < 0) {
                        this.s[key] = 1;
                    } else {
                        this.s[key] += 1
                    }
                    break;
            
                default:
                    break;
            }
            if (this._keyEventType[key] == KeyEventType.downAndUp) {
                this._keyEventType[key] = KeyEventType.up;
            } else {
                this._keyEventType[key] = KeyEventType.none;
            }
        }
        this._mouseTickX = this._mouseNowX;
        this._mouseTickY = this._mouseNowY;
        this._wheelTick = this._wheelNow;
        this._wheelNow = 0;
        TheMConsole.mouseInfo.innerText = `mouse: ${this.mouseX}, ${this.mouseY}`;
    }

    /** 按键被按下的一瞬间，返回 true */
    isDown(button: Key | Mouse): boolean {
        return this.s[button] == 1;
    }

    /** 按键松开的一瞬间，返回 true */
    isUp(button: Key | Mouse): boolean {
        return this.s[button] < 0;
    }

    /** 如果按键被按住，返回 true */
    isHold(button: Key | Mouse): boolean {
        return this.s[button] > 0;
    }

    /** 如果按键闲置，返回 true */
    isIdle(button: Key | Mouse): boolean {
        return this.s[button] <= 0;
    }

    /** 如果轻敲按键并立即松开，在松开的那一帧返回 true
     * @param maxHoldTime 容许按住的最大持续帧数，若按住的时长超过此值则不会判定为轻敲 */
    isShortClick(button: Key | Mouse, maxHoldTime: number = 10): boolean {
        return this.isUp(button) && this.s[button] >= -maxHoldTime;
    }

    /** 如果长按按键并松开，在松开的那一帧返回 true
     * @param minHoldTime 容许按住的最小持续帧数，若按住的时长低于此值则不会判定为长按 */
    isLongRelease(button: Key | Mouse, minHoldTime: number = 12): boolean {
        return this.s[button] <= -minHoldTime;
    }

}

export const TheInput = new Input();