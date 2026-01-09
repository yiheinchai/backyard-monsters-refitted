import { Sprite } from "openfl/display/Sprite";
import { Stage } from "openfl/display/Stage";
import { InteractiveObject } from "openfl/display/InteractiveObject";
import { Event } from "openfl/events/Event";
import { EventDispatcher } from "openfl/events/EventDispatcher";
import { TextField } from "openfl/text/TextField";
import { TextFieldAutoSize } from "openfl/text/TextFieldAutoSize";
import { TextFormat } from "openfl/text/TextFormat";
import { Shape } from "openfl/display/Shape";
import { Graphics } from "openfl/display/Graphics";

declare var GLOBAL: any;

/**
 * SWFProfiler - Performance profiling utility for FPS and memory monitoring.
 */
export class SWFProfiler {
    private static itvTime: number = 0;
    private static initTime: number = 0;
    private static currentTime: number = 0;
    private static frameCount: number = 0;
    private static totalCount: number = 0;

    public static minFps: number = 0;
    public static maxFps: number = 0;
    public static minMem: number = 0;
    public static maxMem: number = 0;

    public static history: number = 60;
    public static fpsList: Array<number> = [];
    public static memList: Array<number> = [];

    private static displayed: boolean = false;
    private static started: boolean = false;
    private static inited: boolean = false;
    private static frame: Sprite;
    private static _stage: Stage;
    private static content: ProfilerContent;

    constructor() {}

    public static init(stage: Stage, interactive: InteractiveObject | null = null): void {
        if (SWFProfiler.inited) {
            return;
        }
        SWFProfiler.inited = true;
        SWFProfiler._stage = stage;
        SWFProfiler.content = new ProfilerContent();
        SWFProfiler.frame = new Sprite();
        SWFProfiler.minFps = Number.MAX_VALUE;
        SWFProfiler.maxFps = Number.MIN_VALUE;
        SWFProfiler.minMem = Number.MAX_VALUE;
        SWFProfiler.maxMem = Number.MIN_VALUE;

        // Context menu functionality is not available in OpenFL, skip it
        SWFProfiler.start();
    }

    public static start(): void {
        if (SWFProfiler.started) {
            return;
        }
        SWFProfiler.started = true;
        SWFProfiler.initTime = SWFProfiler.itvTime = Date.now();
        SWFProfiler.totalCount = SWFProfiler.frameCount = 0;
        SWFProfiler.addEvent(SWFProfiler.frame, Event.ENTER_FRAME, SWFProfiler.draw);
    }

    public static stop(): void {
        if (!SWFProfiler.started) {
            return;
        }
        SWFProfiler.started = false;
        SWFProfiler.removeEvent(SWFProfiler.frame, Event.ENTER_FRAME, SWFProfiler.draw);
    }

    public static gc(): void {
        // Garbage collection not directly accessible in TypeScript/OpenFL
    }

    public static get currentFps(): number {
        return SWFProfiler.frameCount / SWFProfiler.intervalTime;
    }

    public static get currentMem(): number {
        // System.totalMemory not available in OpenFL, return 0
        return 0;
    }

    public static get averageFps(): number {
        return SWFProfiler.totalCount / SWFProfiler.runningTime;
    }

    private static get runningTime(): number {
        return (SWFProfiler.currentTime - SWFProfiler.initTime) / 1000;
    }

    private static get intervalTime(): number {
        return (SWFProfiler.currentTime - SWFProfiler.itvTime) / 1000;
    }

    public static onSelect(event: Event | null = null): void {
        if (!SWFProfiler.displayed) {
            SWFProfiler.show();
        } else {
            SWFProfiler.hide();
        }
    }

    private static show(): void {
        SWFProfiler.displayed = true;
        SWFProfiler.addEvent(SWFProfiler._stage, Event.RESIZE, SWFProfiler.resize);
        SWFProfiler._stage.addChild(SWFProfiler.content);
        SWFProfiler.updateDisplay();
    }

    private static hide(): void {
        SWFProfiler.displayed = false;
        SWFProfiler.removeEvent(SWFProfiler._stage, Event.RESIZE, SWFProfiler.resize);
        SWFProfiler._stage.removeChild(SWFProfiler.content);
    }

    private static resize(event: Event): void {
        SWFProfiler.content.update(
            SWFProfiler.runningTime,
            SWFProfiler.minFps,
            SWFProfiler.maxFps,
            SWFProfiler.minMem,
            SWFProfiler.maxMem,
            SWFProfiler.currentFps,
            SWFProfiler.currentMem,
            SWFProfiler.averageFps,
            SWFProfiler.fpsList,
            SWFProfiler.memList,
            SWFProfiler.history
        );
        SWFProfiler.content.x = GLOBAL._SCREEN.x;
        SWFProfiler.content.y = GLOBAL._SCREEN.y;
    }

    private static draw(event: Event): void {
        SWFProfiler.currentTime = Date.now();
        ++SWFProfiler.frameCount;
        ++SWFProfiler.totalCount;

        if (SWFProfiler.intervalTime >= 1) {
            if (SWFProfiler.displayed) {
                SWFProfiler.updateDisplay();
            } else {
                SWFProfiler.updateMinMax();
            }
            SWFProfiler.fpsList.unshift(SWFProfiler.currentFps);
            SWFProfiler.memList.unshift(SWFProfiler.currentMem);
            if (SWFProfiler.fpsList.length > SWFProfiler.history) {
                SWFProfiler.fpsList.pop();
            }
            if (SWFProfiler.memList.length > SWFProfiler.history) {
                SWFProfiler.memList.pop();
            }
            SWFProfiler.itvTime = SWFProfiler.currentTime;
            SWFProfiler.frameCount = 0;
        }
    }

    private static updateDisplay(): void {
        SWFProfiler.updateMinMax();
        SWFProfiler.content.update(
            SWFProfiler.runningTime,
            SWFProfiler.minFps,
            SWFProfiler.maxFps,
            SWFProfiler.minMem,
            SWFProfiler.maxMem,
            SWFProfiler.currentFps,
            SWFProfiler.currentMem,
            SWFProfiler.averageFps,
            SWFProfiler.fpsList,
            SWFProfiler.memList,
            SWFProfiler.history
        );
    }

    private static updateMinMax(): void {
        SWFProfiler.minFps = Math.min(SWFProfiler.currentFps, SWFProfiler.minFps);
        SWFProfiler.maxFps = Math.max(SWFProfiler.currentFps, SWFProfiler.maxFps);
        SWFProfiler.minMem = Math.min(SWFProfiler.currentMem, SWFProfiler.minMem);
        SWFProfiler.maxMem = Math.max(SWFProfiler.currentMem, SWFProfiler.maxMem);
    }

    private static addEvent(target: EventDispatcher, type: string, listener: (e: Event) => void): void {
        target.addEventListener(type, listener);
    }

    private static removeEvent(target: EventDispatcher, type: string, listener: (e: Event) => void): void {
        target.removeEventListener(type, listener);
    }
}

/**
 * ProfilerContent - Visual display component for the profiler.
 */
class ProfilerContent extends Sprite {
    private minFpsTxtBx: TextField;
    private maxFpsTxtBx: TextField;
    private minMemTxtBx: TextField;
    private maxMemTxtBx: TextField;
    private infoTxtBx: TextField;
    private box: Shape;
    private fps: Shape;
    private mb: Shape;

    constructor() {
        super();
        this.fps = new Shape();
        this.mb = new Shape();
        this.box = new Shape();
        this.mouseChildren = false;
        this.mouseEnabled = false;
        this.fps.x = 65;
        this.fps.y = 45;
        this.mb.x = 65;
        this.mb.y = 90;

        const textFormat = new TextFormat("_sans", 9, 0xAAAAAA);

        this.infoTxtBx = new TextField();
        this.infoTxtBx.autoSize = TextFieldAutoSize.LEFT;
        this.infoTxtBx.defaultTextFormat = new TextFormat("_sans", 11, 0xCCCCCC);
        this.infoTxtBx.y = 98;

        this.minFpsTxtBx = new TextField();
        this.minFpsTxtBx.autoSize = TextFieldAutoSize.LEFT;
        this.minFpsTxtBx.defaultTextFormat = textFormat;
        this.minFpsTxtBx.x = 7;
        this.minFpsTxtBx.y = 37;

        this.maxFpsTxtBx = new TextField();
        this.maxFpsTxtBx.autoSize = TextFieldAutoSize.LEFT;
        this.maxFpsTxtBx.defaultTextFormat = textFormat;
        this.maxFpsTxtBx.x = 7;
        this.maxFpsTxtBx.y = 5;

        this.minMemTxtBx = new TextField();
        this.minMemTxtBx.autoSize = TextFieldAutoSize.LEFT;
        this.minMemTxtBx.defaultTextFormat = textFormat;
        this.minMemTxtBx.x = 7;
        this.minMemTxtBx.y = 83;

        this.maxMemTxtBx = new TextField();
        this.maxMemTxtBx.autoSize = TextFieldAutoSize.LEFT;
        this.maxMemTxtBx.defaultTextFormat = textFormat;
        this.maxMemTxtBx.x = 7;
        this.maxMemTxtBx.y = 50;

        this.addChild(this.box);
        this.addChild(this.infoTxtBx);
        this.addChild(this.minFpsTxtBx);
        this.addChild(this.maxFpsTxtBx);
        this.addChild(this.minMemTxtBx);
        this.addChild(this.maxMemTxtBx);
        this.addChild(this.fps);
        this.addChild(this.mb);

        this.addEventListener(Event.ADDED_TO_STAGE, this.added.bind(this));
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.removed.bind(this));
    }

    public update(
        runningTime: number,
        minFps: number,
        maxFps: number,
        minMem: number,
        maxMem: number,
        currentFps: number,
        currentMem: number,
        averageFps: number,
        fpsList: Array<number>,
        memList: Array<number>,
        history: number
    ): void {
        if (runningTime >= 1) {
            this.minFpsTxtBx.text = minFps.toFixed(3) + " Fps";
            this.maxFpsTxtBx.text = maxFps.toFixed(3) + " Fps";
            this.minMemTxtBx.text = minMem.toFixed(3) + " Mb";
            this.maxMemTxtBx.text = maxMem.toFixed(3) + " Mb";
        }
        this.infoTxtBx.text = "Current Fps " + currentFps.toFixed(3) + "   |   Average Fps " + averageFps.toFixed(3) + "   |   Memory Used " + currentMem.toFixed(3) + " Mb";
        this.infoTxtBx.x = this.stage!.stageWidth - this.infoTxtBx.width - 20;

        const fpsGraphics: Graphics = this.fps.graphics;
        fpsGraphics.clear();
        fpsGraphics.lineStyle(1, 0x00CC00, 0.7);

        const fpsLen = fpsList.length;
        const graphHeight = 35;
        const graphWidth = this.stage!.stageWidth - 80;
        const xStep = graphWidth / (history - 1);
        const fpsRange = maxFps - minFps;

        for (let i = 0; i < fpsLen; i++) {
            const yPos = (fpsList[i] - minFps) / fpsRange;
            if (i === 0) {
                fpsGraphics.moveTo(0, -yPos * graphHeight);
            } else {
                fpsGraphics.lineTo(i * xStep, -yPos * graphHeight);
            }
        }

        const mbGraphics: Graphics = this.mb.graphics;
        mbGraphics.clear();
        mbGraphics.lineStyle(1, 0x0066FF, 0.7);

        const memLen = memList.length;
        const memRange = maxMem - minMem;

        for (let i = 0; i < memLen; i++) {
            const yPos = (memList[i] - minMem) / memRange;
            if (i === 0) {
                mbGraphics.moveTo(0, -yPos * graphHeight);
            } else {
                mbGraphics.lineTo(i * xStep, -yPos * graphHeight);
            }
        }
    }

    private added(event: Event): void {
        this.resizeHandler();
        this.stage!.addEventListener(Event.RESIZE, this.resizeHandler.bind(this));
    }

    private removed(event: Event): void {
        this.stage!.removeEventListener(Event.RESIZE, this.resizeHandler.bind(this));
    }

    private resizeHandler(event: Event | null = null): void {
        const g: Graphics = this.box.graphics;
        g.clear();
        g.beginFill(0x000000, 0.8);
        g.drawRect(0, 0, this.stage!.stageWidth, 120);
        g.lineStyle(1, 0xFFFFFF, 0.2);
        g.moveTo(65, 45);
        g.lineTo(65, 10);
        g.moveTo(65, 45);
        g.lineTo(this.stage!.stageWidth - 15, 45);
        g.moveTo(65, 90);
        g.lineTo(65, 55);
        g.moveTo(65, 90);
        g.lineTo(this.stage!.stageWidth - 15, 90);
        g.endFill();
        this.infoTxtBx.x = this.stage!.stageWidth - this.infoTxtBx.width - 20;
    }
}
