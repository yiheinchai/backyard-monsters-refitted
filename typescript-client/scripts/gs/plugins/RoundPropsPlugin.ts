import { TweenPlugin } from "./TweenPlugin";

/**
 * RoundPropsPlugin - Rounds properties during tweening.
 */
export class RoundPropsPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "roundProps";
        this.overwriteProps = [];
        this.round = true;
    }

    public add(target: any, prop: string, start: number, change: number): void {
        this.addTween(target, prop, start, start + change, prop);
        this.overwriteProps[this.overwriteProps.length] = prop;
    }
}
