import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * ShortRotationPlugin - Tweens rotation using shortest path.
 */
export class ShortRotationPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "shortRotation";
        this.overwriteProps = [];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (typeof value === "number") {
            return false;
        }
        for (const prop in value) {
            this.initRotation(target, prop, target[prop], value[prop]);
        }
        return true;
    }

    public initRotation(target: any, prop: string, start: number, end: number): void {
        let diff = (end - start) % 360;
        if (diff !== diff % 180) {
            diff = diff < 0 ? diff + 360 : diff - 360;
        }
        this.addTween(target, prop, start, start + diff, prop);
        this.overwriteProps[this.overwriteProps.length] = prop;
    }
}
