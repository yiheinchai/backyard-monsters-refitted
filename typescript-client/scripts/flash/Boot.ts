import { MovieClip } from "openfl/display/MovieClip";
import { Stage } from "openfl/display/Stage";
import { Event } from "openfl/events/Event";
import { TextField } from "openfl/text/TextField";
import { TextFieldAutoSize } from "openfl/text/TextFieldAutoSize";
import { TextFormat } from "openfl/text/TextFormat";
import { Lib } from "./Lib";

/**
 * Boot - Bootstrap class for Flash applications.
 */
export class Boot extends MovieClip {
    public static tf: TextField | null = null;
    public static lines: Array<string> | null = null;
    public static lastError: Error | null = null;
    public static skip_constructor: boolean = false;

    constructor() {
        super();
        if (Boot.skip_constructor) {
            return;
        }
    }

    public static enum_to_string(obj: any): string {
        if (obj.params === null || obj.params === undefined) {
            return String(obj.tag);
        }
        const parts: Array<string> = [];
        for (const param of obj.params) {
            parts.push(Boot.__string_rec(param, ""));
        }
        return String(obj.tag) + "(" + parts.join(",") + ")";
    }

    public static __instanceof(obj: any, cls: any): boolean {
        try {
            if (cls === Object) {
                return true;
            }
            return obj instanceof cls;
        } catch (e) {
            return false;
        }
    }

    public static __clear_trace(): void {
        if (Boot.tf === null) {
            return;
        }
        if (Boot.tf.parent) {
            Boot.tf.parent.removeChild(Boot.tf);
        }
        Boot.tf = null;
        Boot.lines = null;
    }

    public static __set_trace_color(color: number): void {
        Boot.getTrace().textColor = color;
    }

    public static getTrace(): TextField {
        const current = Lib.current;
        if (Boot.tf === null) {
            Boot.tf = new TextField();
            const format = Boot.tf.getTextFormat();
            format.font = "Consolas";
            Boot.tf.defaultTextFormat = format;
            Boot.tf.width = current.stage === null ? 800 : current.stage.stageWidth;
            Boot.tf.autoSize = TextFieldAutoSize.LEFT;
        }
        if (current.stage === null) {
            current.addChild(Boot.tf);
        } else {
            current.stage.addChild(Boot.tf);
        }
        return Boot.tf;
    }

    public static __trace(value: any, info: any): void {
        const tf = Boot.getTrace();
        const pos = info === null ? "(null)" : String(info.fileName) + ":" + info.lineNumber;
        if (Boot.lines === null) {
            Boot.lines = [];
        }
        Boot.lines = Boot.lines.concat((pos + ": " + Boot.__string_rec(value, "")).split("\n"));
        tf.text = Boot.lines.join("\n");
        const stage = Lib.current.stage;
        if (stage === null) {
            return;
        }
        while (Boot.lines.length > 1 && tf.height > stage.stageHeight) {
            Boot.lines.shift();
            tf.text = Boot.lines.join("\n");
        }
    }

    public static __string_rec(value: any, indent: string): string {
        if (value === null || value === undefined) {
            return String(value);
        }
        const type = typeof value;
        if (type === "function") {
            return "<function>";
        }
        if (Array.isArray(value)) {
            const parts: Array<string> = [];
            for (let i = 0; i < value.length; i++) {
                parts.push(Boot.__string_rec(value[i], indent));
            }
            return "[" + parts.join(",") + "]";
        }
        if (type === "object") {
            const keys = Object.keys(value);
            const parts: Array<string> = [];
            for (const key of keys) {
                parts.push(" " + key + " : " + Boot.__string_rec(value[key], indent));
            }
            return "{" + parts.join(",") + (parts.length > 0 ? " " : "") + "}";
        }
        return String(value);
    }

    public static __unprotect__(str: string): string {
        return str;
    }

    public start(): void {
        const current = Lib.current;
        try {
            if (current === this && current.stage !== null && current.stage.align === "") {
                current.stage.align = "TOP_LEFT" as any;
            }
        } catch (e) {
            if (current.stage === null) {
                current.addEventListener(Event.ADDED_TO_STAGE, this.doInitDelay.bind(this));
            } else if (current.stage.stageWidth === 0) {
                setTimeout(this.start.bind(this), 1);
            } else {
                this.init();
            }
            return;
        }
    }

    public init(): void {
        Boot.lastError = new Error();
        throw "assert";
    }

    public doInitDelay(event: any): void {
        Lib.current.removeEventListener(Event.ADDED_TO_STAGE, this.doInitDelay.bind(this));
        this.start();
    }
}
