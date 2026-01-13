import { TweenLite } from "./TweenLite";
import { TweenInfo } from "./utils/tween/TweenInfo";

/**
 * OverwriteManager - Manages tween overwrite behaviors.
 */
export class OverwriteManager {
    public static readonly version: number = 3.12;
    public static readonly NONE: number = 0;
    public static readonly ALL: number = 1;
    public static readonly AUTO: number = 2;
    public static readonly CONCURRENT: number = 3;

    public static mode: number = 2;
    public static enabled: boolean = false;

    constructor() {}

    public static init(defaultMode: number = 2): number {
        TweenLite.overwriteManager = OverwriteManager;
        OverwriteManager.mode = defaultMode;
        OverwriteManager.enabled = true;
        return OverwriteManager.mode;
    }

    public static manageOverwrites(tween: TweenLite, tweens: Array<TweenLite>): void {
        const vars = tween.vars;
        const overwriteMode = vars.overwrite === undefined ? OverwriteManager.mode : vars.overwrite;
        
        if (overwriteMode < 2 || tweens === null) {
            return;
        }
        
        const startTime = tween.startTime;
        const overlaps: Array<TweenLite> = [];
        let tweenIndex = -1;
        
        for (let i = tweens.length - 1; i > -1; i--) {
            const t = tweens[i];
            if (t === tween) {
                tweenIndex = i;
            } else if (i < tweenIndex && t.startTime <= startTime && t.startTime + t.duration * 1000 / t.combinedTimeScale > startTime) {
                overlaps[overlaps.length] = t;
            }
        }
        
        if (overlaps.length === 0 || tween.tweens.length === 0) {
            return;
        }
        
        if (overwriteMode === OverwriteManager.AUTO) {
            const tweenInfos = tween.tweens;
            const propLookup: { [key: string]: boolean } = {};
            
            for (let i = tweenInfos.length - 1; i > -1; i--) {
                const ti = tweenInfos[i];
                if (ti.isPlugin) {
                    if (ti.name === "_MULTIPLE_") {
                        const props = ti.target.overwriteProps;
                        for (let j = props.length - 1; j > -1; j--) {
                            propLookup[props[j]] = true;
                        }
                    } else {
                        propLookup[ti.name] = true;
                    }
                    propLookup[ti.target.propName] = true;
                } else {
                    propLookup[ti.name] = true;
                }
            }
            
            for (let i = overlaps.length - 1; i > -1; i--) {
                OverwriteManager.killVars(propLookup, overlaps[i].exposedVars, overlaps[i].tweens);
            }
        } else {
            for (let i = overlaps.length - 1; i > -1; i--) {
                overlaps[i].enabled = false;
            }
        }
    }

    public static killVars(lookup: { [key: string]: boolean }, exposedVars: any, tweens: Array<TweenInfo>): void {
        for (let i = tweens.length - 1; i > -1; i--) {
            const ti = tweens[i];
            if (ti.name in lookup) {
                tweens.splice(i, 1);
            } else if (ti.isPlugin && ti.name === "_MULTIPLE_") {
                ti.target.killProps(lookup);
                if (ti.target.overwriteProps.length === 0) {
                    tweens.splice(i, 1);
                }
            }
        }
        for (const prop in lookup) {
            delete exposedVars[prop];
        }
    }
}
