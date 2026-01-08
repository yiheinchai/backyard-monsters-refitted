import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { FullScreenEvent } from "openfl/events/FullScreenEvent";
import { KeyboardEvent } from "openfl/events/KeyboardEvent";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";
import { Keyboard } from "openfl/ui/Keyboard";
import { TextField } from "openfl/text/TextField";
import { TextFieldType } from "openfl/text/TextFieldType";
import { TextFormat } from "openfl/text/TextFormat";
import { TextFormatAlign } from "openfl/text/TextFormatAlign";

import { Console } from "./Console";
import { GLOBAL } from "../../../GLOBAL";

interface LogEntry {
    color: number;
    text: string;
}

/**
 * Glyph cache for efficient text rendering.
 */
class GlyphCache {
    protected readonly _textFormat: TextFormat = new TextFormat("Verdana", 12, 0xDDDDDD, true);
    protected readonly _textField: TextField = new TextField();
    protected readonly _glyphCache: Map<number, Glyph> = new Map();
    protected readonly _colorCache: Map<number, BitmapData> = new Map();

    constructor() {
        this._textField.setTextFormat(this._textFormat);
        this._textField.defaultTextFormat = this._textFormat;
    }

    public drawLineToBitmap(text: string, x: number, y: number, color: number, bmd: BitmapData): number {
        if (!this._colorCache.has(color)) {
            this._colorCache.set(color, new BitmapData(128, 128, false, color));
        }
        const colorBmd = this._colorCache.get(color)!;
        const pos = new Point(x, y);
        let lines = 1;
        const len = text.length;
        
        for (let i = 0; i < len; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode === 10) {
                pos.x = x;
                pos.y += 16;
                lines++;
            } else {
                const glyph = this.getGlyph(charCode);
                bmd.copyPixels(colorBmd, glyph.rect, pos, glyph.bitmap, null, true);
                pos.x += glyph.rect.width - 1;
            }
        }
        return lines;
    }

    protected getGlyph(charCode: number): Glyph {
        if (!this._glyphCache.has(charCode)) {
            const glyph = new Glyph();
            this._textField.text = String.fromCharCode(charCode);
            glyph.bitmap = new BitmapData(Math.floor(this._textField.textWidth + 2), 16, true, 0);
            glyph.bitmap.draw(this._textField);
            glyph.rect = glyph.bitmap.rect.clone();
            this._glyphCache.set(charCode, glyph);
        }
        return this._glyphCache.get(charCode)!;
    }

    public getLineHeight(): number {
        this._textField.text = "HPI";
        return this._textField.getLineMetrics(0).height;
    }
}

/**
 * Single glyph cache entry.
 */
class Glyph {
    public rect: Rectangle = new Rectangle();
    public bitmap!: BitmapData;
}

/**
 * Debug console view with input field and log display.
 */
export class ConsoleView extends Sprite {
    private readonly _OUTPUT_COLOR: number = 0;
    private readonly _INPUT_COLOR: number = 0;
    
    protected _messageQueue: any[] = [];
    protected _maxLength: number = 200000;
    protected _truncating: boolean = false;
    protected _width: number = 500;
    protected _height: number = 150;
    protected _consoleHistory: string[] = [];
    protected _historyIndex: number = 0;
    protected _outputBitmap: Bitmap;
    protected _input!: TextField;
    protected tabCompletionPrefix: string = "";
    protected tabCompletionCurrentStart: number = 0;
    protected tabCompletionCurrentEnd: number = 0;
    protected tabCompletionCurrentOffset: number = 0;
    protected glyphCache: GlyphCache;
    protected bottomLineIndex: number = Number.MAX_SAFE_INTEGER;
    protected logCache: LogEntry[] = [];
    protected _dirtyConsole: boolean = true;
    protected _isActive: boolean = false;

    constructor() {
        super();
        this._messageQueue = [];
        this._consoleHistory = [];
        this._outputBitmap = new Bitmap(new BitmapData(640, 480, false, 0));
        this.glyphCache = new GlyphCache();
        this.logCache = [];
        this.layout();
        this.addEventListener(Event.ADDED_TO_STAGE, this.addedToStage);
    }

    public static clamp(value: number, min: number = 0, max: number = 1): number {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    private addedToStage = (event: Event): void => {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.addedToStage);
        this.addListeners();
        this.resize();
    };

    protected layout(): void {
        if (!this._input) {
            this.createInputField();
        }
        this.resize();
        this._outputBitmap.name = "ConsoleOutput";
        this.addEventListener(MouseEvent.DOUBLE_CLICK, this.onBitmapDoubleClick);
        this._outputBitmap.alpha = 0.85;
        this.addChild(this._outputBitmap);
        this.addChild(this._input);
        this.mouseEnabled = true;
        this.doubleClickEnabled = true;
        this._dirtyConsole = true;
    }

    protected addListeners(): void {
        this._input.addEventListener(KeyboardEvent.KEY_DOWN, this.onInputKeyDown);
        this._input.addEventListener(KeyboardEvent.KEY_UP, this.onInputKeyUp);
        this.stage.addEventListener(Event.RESIZE, this.resize);
        this.stage.addEventListener(FullScreenEvent.FULL_SCREEN, this.resize);
        this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }

    protected onInputKeyDown = (event: KeyboardEvent): void => {
        if (event.keyCode === Keyboard.TAB) {
            const commands = Console.commands;
            const matches: string[] = [];
            this.tabCompletionPrefix = this._input.text.toLowerCase();
            
            commands.forEach((_, key) => {
                if (key.substr(0, this.tabCompletionPrefix.length).toLowerCase() === this.tabCompletionPrefix) {
                    matches.push(key);
                }
            });
            
            if (matches.length >= 1) {
                this._input.text = matches[0] + " ";
                if (matches.length >= 2) {
                    for (const match of matches) {
                        Console.print("    " + match);
                    }
                }
                this.stage.focus = this._input;
                this._input.setSelection(5, 6);
            }
        }
        event.stopImmediatePropagation();
        event.stopPropagation();
    };

    protected removeListeners(): void {
        this._input.removeEventListener(KeyboardEvent.KEY_DOWN, this.onInputKeyDown);
        this._input.removeEventListener(KeyboardEvent.KEY_UP, this.onInputKeyUp);
        this.stage.removeEventListener(Event.RESIZE, this.resize);
        this.stage.removeEventListener(FullScreenEvent.FULL_SCREEN, this.resize);
        this.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    }

    private onEnterFrame = (event: Event): void => {
        this.onFrame();
    };

    protected onBitmapDoubleClick = (event: MouseEvent | null = null): void => {
        let text = "";
        for (const entry of this.logCache) {
            text += entry.text + "\n";
        }
        // Note: System.setClipboard not available in TypeScript
        console.log("Console log:\n" + text);
    };

    protected resize = (event: Event | null = null): void => {
        if (this.stage && GLOBAL._SCREEN) {
            this.x = GLOBAL._SCREEN.x;
            this.y = GLOBAL._SCREEN.y;
            this._width = this.stage.stageWidth - 1;
            this._height = Math.floor(this.stage.stageHeight / 3);
        }
        this._outputBitmap.bitmapData.dispose();
        this._outputBitmap.bitmapData = new BitmapData(this._width, this._height, false, this._OUTPUT_COLOR);
        this._input.height = 18;
        this._input.width = this._width;
        this._input.y = this._outputBitmap.height;
        this._dirtyConsole = true;
    };

    protected createInputField(): TextField {
        this._input = new TextField();
        this._input.type = TextFieldType.INPUT;
        this._input.border = true;
        this._input.borderColor = this._INPUT_COLOR;
        this._input.multiline = false;
        this._input.wordWrap = false;
        this._input.condenseWhite = false;
        this._input.background = true;
        this._input.backgroundColor = this._INPUT_COLOR;
        
        const format = new TextFormat();
        format.font = "Verdana";
        format.size = 12;
        format.bold = true;
        format.color = 0xFFFFFF;
        format.align = TextFormatAlign.LEFT;
        
        this._input.setTextFormat(format);
        this._input.defaultTextFormat = format;
        this._input.name = "ConsoleInput";
        return this._input;
    }

    protected setHistory(text: string): void {
        this._input.text = text;
    }

    protected onInputKeyUp = (event: KeyboardEvent): void => {
        if (event.keyCode !== Keyboard.TAB && event.keyCode !== Keyboard.SHIFT) {
            this.tabCompletionPrefix = this._input.text;
            this.tabCompletionCurrentStart = -1;
            this.tabCompletionCurrentOffset = 0;
        }
        
        if (event.keyCode === Keyboard.ENTER) {
            if (this._input.text.length <= 0) {
                this.addLogMessage("CMD", ">", this._input.text);
                return;
            }
            this.processCommand();
        } else if (event.keyCode === Keyboard.UP) {
            if (this._historyIndex > 0) {
                this.setHistory(this._consoleHistory[--this._historyIndex]);
            } else if (this._consoleHistory.length > 0) {
                this.setHistory(this._consoleHistory[0]);
            }
            event.preventDefault();
        } else if (event.keyCode === Keyboard.DOWN) {
            if (this._historyIndex < this._consoleHistory.length - 1) {
                this.setHistory(this._consoleHistory[++this._historyIndex]);
            } else if (this._historyIndex === this._consoleHistory.length - 1) {
                this._input.text = "";
            }
            event.preventDefault();
        } else if (event.keyCode === Keyboard.PAGE_UP) {
            if (this.bottomLineIndex === Number.MAX_SAFE_INTEGER) {
                this.bottomLineIndex = this.logCache.length - 1;
            }
            this.bottomLineIndex -= this.getScreenHeightInLines() - 2;
            if (this.bottomLineIndex < 0) this.bottomLineIndex = 0;
        } else if (event.keyCode === Keyboard.PAGE_DOWN) {
            if (this.bottomLineIndex !== Number.MAX_SAFE_INTEGER) {
                this.bottomLineIndex += this.getScreenHeightInLines() - 2;
                if (this.bottomLineIndex + this.getScreenHeightInLines() >= this.logCache.length) {
                    this.bottomLineIndex = Number.MAX_SAFE_INTEGER;
                }
            }
        } else if (Console.isKey(event.keyCode)) {
            this.toggleActive();
            this._input.text = "";
        }
        
        this._dirtyConsole = true;
        event.stopImmediatePropagation();
    };

    protected processCommand(): void {
        this.addLogMessage("CMD", ">", this._input.text);
        const result = Console.processLine(this._input.text);
        if (result) {
            this.addLogMessage("CMD", "<", result);
        }
        this._consoleHistory.push(this._input.text);
        this._historyIndex = this._consoleHistory.length;
        this._input.text = "";
        this._dirtyConsole = true;
    }

    public getScreenHeightInLines(): number {
        const height = this._outputBitmap.bitmapData.height;
        return Math.floor(height / this.glyphCache.getLineHeight());
    }

    public onFrame(deltaTime: number = 0): void {
        if (!this._dirtyConsole || !this.parent) return;
        
        this._dirtyConsole = false;
        const linesPerScreen = this.getScreenHeightInLines() - 1;
        let startLine = 0;
        let endLine = 0;
        
        if (this.bottomLineIndex === Number.MAX_SAFE_INTEGER) {
            startLine = ConsoleView.clamp(this.logCache.length - linesPerScreen, 0, Number.MAX_SAFE_INTEGER);
        } else {
            startLine = ConsoleView.clamp(this.bottomLineIndex - linesPerScreen, 0, Number.MAX_SAFE_INTEGER);
        }
        endLine = ConsoleView.clamp(startLine + linesPerScreen, 0, this.logCache.length - 1);
        startLine--;
        
        const bmd = this._outputBitmap.bitmapData;
        bmd.fillRect(bmd.rect, this._OUTPUT_COLOR);
        
        for (let i = endLine; i >= startLine; i--) {
            if (this.logCache[i]) {
                this.glyphCache.drawLineToBitmap(
                    this.logCache[i].text,
                    0,
                    this._outputBitmap.height - (endLine + 1 - i) * this.glyphCache.getLineHeight(),
                    this.logCache[i].color,
                    bmd
                );
            }
        }
    }

    public addLogMessage(level: string, prefix: string, message: string): void {
        const color = this.getColorFromLevel(level);
        let tempPrefix = prefix;
        
        const lastDoubleColon = tempPrefix.lastIndexOf("::");
        if (lastDoubleColon !== -1) {
            tempPrefix = tempPrefix.substr(lastDoubleColon + 2);
        }
        
        const lines = message.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const fullText = (i > 0 ? level + ": " : "") + tempPrefix + lines[i];
            this.logCache.push({
                color: parseInt(color.substr(1), 16),
                text: fullText
            });
        }
        this._dirtyConsole = true;
    }

    private getColorFromLevel(level: string): string {
        if (level === Console.WARNING) {
            return "#FF0000";
        }
        return "#FFFFFF";
    }

    public toggleActive(): void {
        if (this._isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    public activate(): void {
        this.visible = true;
        this.layout();
        this._isActive = true;
        this.addListeners();
        if (this.stage) {
            this.stage.focus = this._input;
        }
        this._input.text = "";
    }

    public deactivate(): void {
        this.visible = false;
        this.removeListeners();
        this._isActive = false;
        if (this.stage) {
            this.stage.focus = null;
        }
    }

    public set restrict(value: string) {
        this._input.restrict = value;
    }

    public get restrict(): string {
        return this._input.restrict;
    }
}
