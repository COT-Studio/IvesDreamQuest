import { DebugOptions } from "./DebugOptions.js";

export class MConsole {
    readonly mConsole: HTMLDivElement;
    readonly mouseInfoDiv: HTMLDivElement;
    readonly debugSwitchDiv: HTMLDivElement;
    readonly debugSwitch: HTMLInputElement;
    readonly inputDiv: HTMLDivElement;
    readonly inputs: { [key: string]: HTMLInputElement };
    readonly textareaDiv: HTMLDivElement;
    readonly textareas: { [key: string]: HTMLTextAreaElement };

    constructor() {
        this.mConsole = document.createElement("div");
        this.mConsole.id = "TheMConsole";

        this.mouseInfoDiv = document.createElement("div");
        this.mouseInfoDiv.id = "TheMouseInfo";
        this.mouseInfoDiv.style.userSelect = "none";

        this.debugSwitchDiv = document.createElement("div");
        this.debugSwitchDiv.id = "TheDebugSwitchDiv";
        this.debugSwitchDiv.style.userSelect = "none";
        this.debugSwitch = document.createElement("input");
        this.debugSwitch.id = "TheDebugSwitch";
        this.debugSwitch.type = "checkbox";
        this.debugSwitch.checked = false;
        this.debugSwitch.addEventListener("change", () => DebugOptions.isDebug = this.debugSwitch.checked);

        this.inputDiv = document.createElement("div");
        this.inputDiv.id = "TheInputDiv";
        this.inputs = {};

        this.textareaDiv = document.createElement("div");
        this.textareaDiv.id = "TheTextAreaDiv";
        this.textareas = {};
        
        this.debugSwitchDiv.appendChild(this.debugSwitch);
        const isDebugText = document.createTextNode("isDebug");
        this.debugSwitchDiv.appendChild(isDebugText);

        this.mConsole.appendChild(this.mouseInfoDiv);
        this.mConsole.appendChild(this.debugSwitchDiv);
        this.mConsole.appendChild(this.inputDiv);
        this.mConsole.appendChild(this.textareaDiv);

        document.body.appendChild(this.mConsole);
    }

    addInput(name: string, size: number = 20): HTMLInputElement {
        if (this.inputs[name]) { return this.inputs[name]; }
        const input = document.createElement("input");
        input.className = "MConsoleInput";
        input.placeholder = name;
        input.size = size;
        this.inputDiv.appendChild(input);
        return input;
    }

    addTextarea(name: string, rows: number = 4, cols: number = 20): HTMLTextAreaElement {
        if (this.textareas[name]) { return this.textareas[name]; }
        const textarea = document.createElement("textarea");
        textarea.className = "MConsoleTextarea";
        textarea.placeholder = name;
        textarea.rows = rows;
        textarea.cols = cols;
        this.textareaDiv.appendChild(textarea);
        return textarea;
    }
}

export const TheMConsole = new MConsole();