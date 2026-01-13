import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";

declare var GLOBAL: any;
declare var LOGGER: any;

/**
 * Timekeeper - Singleton class for managing game time.
 */
export class Timekeeper {
    private static _instance: Timekeeper | null = null;

    protected time: number = 0;
    protected isTicking: boolean = false;
    protected tickFrequency: number = 1000;
    protected tickDuration: number = 1000;
    private regulator: Timer;
    private regulatorAcc: number = 0;
    private regulatorCache: number = 0;

    constructor() {
        if (Timekeeper._instance === null) {
            this.init();
            Timekeeper._instance = this;
        } else {
            LOGGER.Log("err", "Timekeeper dupe");
        }
    }

    public destroy(): void {
        this.regulator.removeEventListener(TimerEvent.TIMER, this.onTimerEvent.bind(this));
    }

    public setRealTimeValue(): void {
        this.time = Date.now();
    }

    public setRealTimeTick(): void {
        this.setTickDuration(1000);
        this.setTickFrequency(1000);
    }

    public getValue(): number {
        return this.time;
    }

    public setValue(value: number): void {
        if (this.time !== value) {
            this.time = value;
            GLOBAL.Tick();
        }
    }

    public getTickDuration(): number {
        return this.tickDuration;
    }

    public setTickDuration(value: number): void {
        this.tickDuration = value;
    }

    public getTickFrequency(): number {
        return this.tickFrequency;
    }

    public setTickFrequency(value: number): void {
        this.tickFrequency = value;
    }

    public stopTicking(): void {
        this.isTicking = false;
    }

    public startTicking(): void {
        this.isTicking = true;
    }

    private init(): void {
        this.regulatorAcc = 0;
        this.regulatorCache = Date.now();
        this.regulator = new Timer(50);
        this.regulator.addEventListener(TimerEvent.TIMER, this.onTimerEvent.bind(this));
        this.regulator.start();
    }

    private onTimerEvent(e: TimerEvent): void {
        const currentTime = Date.now();
        const elapsed = currentTime - this.regulatorCache;
        this.regulatorAcc += elapsed;
        if (this.regulatorAcc > this.tickFrequency) {
            if (this.isTicking) {
                this.setValue(this.time + this.tickDuration);
            }
            this.regulatorAcc -= this.tickFrequency;
        }
        this.regulatorCache = currentTime;
    }
}
