import { DebugOptions } from "./DebugOptions.js";

export class MConsole {
    readonly mConsole: HTMLDivElement;
    readonly mouseInfoDiv: HTMLDivElement;
    readonly debugSwitchDiv: HTMLDivElement;
    readonly debugSwitch: HTMLInputElement;
    readonly performanceMonitorSwitch: HTMLInputElement;
    readonly performanceMonitorDiv: HTMLDivElement;
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

        const createDebugCheckbox = (id: string, checked: boolean, onchange: (checked: boolean) => any) => {
            const e = document.createElement("input");
            e.id = id;
            e.type = "checkbox";
            e.checked = checked;
            e.addEventListener("change", () => onchange(e.checked));
            return e;
        }

        this.debugSwitch = createDebugCheckbox("TheDebugSwitch", DebugOptions.isDebug, (checked) => DebugOptions.isDebug = checked);
        this.performanceMonitorSwitch = createDebugCheckbox(
            "ThePerformanceMonitorSwitch",
            DebugOptions.isPerformanceMonitor,
            (checked) => {
                DebugOptions.isPerformanceMonitor = checked;
                this.performanceMonitorDiv.style.display = checked ? "block" : "none";
            }
        );

        this.performanceMonitorDiv = document.createElement("div");
        this.performanceMonitorDiv.id = "ThePerformanceMonitorDiv";
        this.performanceMonitorDiv.style.whiteSpace = "pre-wrap";
        this.performanceMonitorDiv.style.fontFamily = "monospace";

        this.inputDiv = document.createElement("div");
        this.inputDiv.id = "TheInputDiv";
        this.inputs = {};

        this.textareaDiv = document.createElement("div");
        this.textareaDiv.id = "TheTextAreaDiv";
        this.textareas = {};
        
        const appendDebugSwitch = (ele: HTMLInputElement, txt: string) => {
            this.debugSwitchDiv.appendChild(ele);
            const textNode = document.createTextNode(txt);
            this.debugSwitchDiv.appendChild(textNode);
        }

        appendDebugSwitch(this.debugSwitch, "debug");
        appendDebugSwitch(this.performanceMonitorSwitch, "performance monitor");

        this.mConsole.appendChild(this.mouseInfoDiv);
        this.mConsole.appendChild(this.debugSwitchDiv);
        this.mConsole.appendChild(this.performanceMonitorDiv);
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
        this.inputs[name] = input;
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
        this.textareas[name] = textarea;
        return textarea;
    }
}

export const TheMConsole = new MConsole();