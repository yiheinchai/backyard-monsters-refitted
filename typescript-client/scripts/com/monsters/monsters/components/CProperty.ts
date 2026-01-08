import { Event } from "openfl/events/Event";
import { EventDispatcher } from "openfl/events/EventDispatcher";

import { Component } from "./Component";

/**
 * A property value with min/max bounds and event dispatching.
 */
export class CProperty extends Component {
    public static readonly MODIFIED: string = "valueModified";
    public static readonly DECREASED: string = "valueDecreased";
    public static readonly INCREASED: string = "valueIncreased";
    public static readonly MINIMIZED: string = "valueMinimized";
    public static readonly MAXIMIZED: string = "valueMaximized";

    public doesDispatchEvents: boolean = false;
    protected _maximum: number = Number.MAX_VALUE;
    protected _value: number;
    protected _minimum: number = -Infinity;
    private _previousValue: number = 0;
    private _eventDispatcher: EventDispatcher;

    constructor(maximum: number = Number.MAX_VALUE, minimum: number = 0, value: number = -1) {
        super();
        this._eventDispatcher = new EventDispatcher();
        this._maximum = maximum;
        this._minimum = minimum;
        this._value = value === -1 ? this._maximum : value;
    }

    public get previousValue(): number {
        return this._previousValue;
    }

    public get eventDispatcher(): EventDispatcher {
        return this._eventDispatcher;
    }

    public set value(val: number) {
        val = Math.max(this._minimum, val);
        val = Math.min(this._maximum, val);
        if (val === this._value) return;
        
        this._previousValue = this._value;
        this._value = val;
        this.dispatchPropertyEvent(CProperty.MODIFIED);
        
        if (this._value - this._previousValue >= 0) {
            this.dispatchPropertyEvent(CProperty.INCREASED);
            if (this._value === this._maximum) {
                this.dispatchPropertyEvent(CProperty.MAXIMIZED);
            }
        } else {
            this.dispatchPropertyEvent(CProperty.DECREASED);
            if (this._value === this._minimum) {
                this.dispatchPropertyEvent(CProperty.MINIMIZED);
            }
        }
    }

    public get value(): number {
        return this._value;
    }

    public get maximum(): number {
        return this._maximum;
    }

    public get minimum(): number {
        return this._minimum;
    }

    public modify(amount: number, source: any = null): number {
        this.value += amount;
        return this.value;
    }

    public set(val: number, source: any = null): number {
        this.value = val;
        return this.value;
    }

    public minimize(source: any = null): number {
        return this.set(this._minimum, source);
    }

    public maximize(source: any = null): number {
        return this.set(this._maximum, source);
    }

    public getValuePercentage(): number {
        return 1 - (this._maximum - this._value) / (this._maximum - this._minimum);
    }

    public setValuePercentage(percentage: number): void {
        this.value = percentage * (this._maximum - this._minimum) + this._minimum;
    }

    private dispatchPropertyEvent(eventType: string): void {
        if (!this.doesDispatchEvents) return;
        this._eventDispatcher.dispatchEvent(new Event(eventType));
    }
}
