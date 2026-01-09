import { EventDispatcher } from "openfl/events/EventDispatcher";
import { Event } from "openfl/events/Event";
import { TimerEvent } from "openfl/events/TimerEvent";
import { Timer } from "openfl/utils/Timer";
import { SmartFox } from "../SmartFox";
import { PingPongRequest } from "../requests/PingPongRequest";

/**
 * LagMonitor - Monitors network latency/lag.
 */
export class LagMonitor extends EventDispatcher {
    private _lastReqTime: number = 0;
    private _valueQueue: Array<number>;
    private _interval: number;
    private _queueSize: number;
    private _thread: Timer;
    private _sfs: SmartFox;

    constructor(sfs: SmartFox, interval: number = 2, queueSize: number = 10) {
        super();
        this._sfs = sfs;
        this._valueQueue = [];
        this._interval = interval;
        this._queueSize = queueSize;
        this._thread = new Timer(interval * 1000);
        this._thread.addEventListener(TimerEvent.TIMER, this.threadRunner.bind(this));
    }

    public start(): void {
        if (this.isRunning) {
            return;
        }
        this._thread.start();
    }

    public stop(): void {
        if (!this.isRunning) {
            return;
        }
        this._thread.stop();
    }

    public destroy(): void {
        this.stop();
        this._thread.removeEventListener(TimerEvent.TIMER, this.threadRunner.bind(this));
        this._thread = null!;
        this._sfs = null!;
    }

    public get isRunning(): boolean {
        return this._thread.running;
    }

    public onPingPong(): number {
        const currentTime = Date.now();
        const pingTime = currentTime - this._lastReqTime;
        if (this._valueQueue.length >= this._queueSize) {
            this._valueQueue.shift();
        }
        this._valueQueue.push(pingTime);
        return this.averagePingTime;
    }

    public get lastPingTime(): number {
        if (this._valueQueue.length > 0) {
            return this._valueQueue[this._valueQueue.length - 1];
        }
        return 0;
    }

    public get averagePingTime(): number {
        if (this._valueQueue.length === 0) {
            return 0;
        }
        let total = 0;
        for (const val of this._valueQueue) {
            total += val;
        }
        return Math.floor(total / this._valueQueue.length);
    }

    private threadRunner(e: Event): void {
        this._lastReqTime = Date.now();
        this._sfs.send(new PingPongRequest());
    }
}
