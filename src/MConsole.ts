export class MConsole {
    readonly mConsole: HTMLDivElement;
    readonly mouseInfo: HTMLDivElement;

    constructor() {
        this.mConsole = document.createElement("div");
        this.mConsole.id = "TheMConsole";

        this.mouseInfo = document.createElement("div");
        this.mouseInfo.id = "TheMouseInfo";
        
        this.mConsole.appendChild(this.mouseInfo);
        document.body.appendChild(this.mConsole);
    }
}

export const TheMConsole = new MConsole();