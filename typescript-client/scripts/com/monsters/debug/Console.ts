import Stage from "openfl/display/Stage";
import KeyboardEvent from "openfl/events/KeyboardEvent";

import { ConsoleCommands } from "./ConsoleCommands";
import { ConsoleView } from "./ConsoleView";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }


/**
 * Debug console for in-game command execution.
 */
export class Console {
    public static readonly PRINT: string = "print";
    public static readonly WARNING: string = "warning";
    public static readonly ERROR: string = "error";
    
    public static readonly keyCodes: number[] = [223, 192]; // ~ and ` keys
    
    public static view: ConsoleView;
    private static _commands: Map<string, (...args: any[]) => string | null> = new Map();

    constructor() {}

    public static initialize(stage: Stage): void {
        if (!getGLOBAL()._aiDesignMode) return;
        
        Console.view = new ConsoleView();
        Console._commands = new Map();
        stage.addChild(Console.view);
        stage.tabChildren = false;
        Console.view.deactivate();
        stage.addEventListener(KeyboardEvent.KEY_UP, Console.onKeyDown);
        ConsoleCommands.initialize();
    }

    protected static onKeyDown = (event: KeyboardEvent): void => {
        if (Console.isKey(event.keyCode) && Console.view) {
            Console.view.toggleActive();
            event.stopImmediatePropagation();
        }
    };

    public static warning(message: string = "", showSource: boolean = false): void {
        Console.print("WARNING: " + message, showSource, Console.WARNING);
    }

    public static print(message: any, showSource: boolean = false, level: string = "print"): void {
        if (!getGLOBAL()._aiDesignMode) return;
        
        if (typeof message !== "string") {
            message = String(message);
        }
        
        const timestamp = Math.floor(Date.now() / 1000);
        if (showSource) {
            message = Console.getSource() + "|| " + message;
        }
        Console.view.addLogMessage(level, "", message);
    }

    public static processLine(line: string): string | null {
        const spaceIndex = line.indexOf(" ") + 1;
        const command = line.substring(0, spaceIndex ? spaceIndex - 1 : line.length).toLowerCase();
        const func = Console._commands.get(command);
        
        if (func) {
            const args: string[] = [];
            let startPos = spaceIndex;
            let commaPos = line.indexOf(",", startPos);
            args.push(line.substring(startPos, commaPos !== -1 ? commaPos : line.length));
            startPos = commaPos;
            
            while (commaPos !== -1) {
                args.push(line.substring(startPos, commaPos));
                commaPos = line.indexOf(",", commaPos + 1);
            }
            
            return func.apply(null, args);
        }
        
        Console.view.addLogMessage(Console.WARNING, "", "INVALID COMMAND");
        return null;
    }

    public static registerCommand(name: string, handler: (...args: any[]) => string | null): void {
        Console._commands.set(name.toLowerCase(), handler);
    }

    public static getSource(stackLevel: number = 4): string {
        // Note: Stack trace handling differs in TypeScript/JavaScript
        const trace = Console.getStackTrace();
        if (!trace) return "invalid stack trace";
        
        const parts = trace.split("at ");
        const part = parts[stackLevel];
        if (!part) return "invalid stack trace";
        
        return part.split("(")[0].trim();
    }

    public static getStackTrace(): string {
        try {
            throw new Error();
        } catch (e: any) {
            return e.stack || "";
        }
    }

    public static isKey(keyCode: number): boolean {
        for (const code of Console.keyCodes) {
            if (code === keyCode) return true;
        }
        return false;
    }

    public static get commands(): Map<string, (...args: any[]) => string | null> {
        return Console._commands;
    }
}
