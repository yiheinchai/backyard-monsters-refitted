import { Bitmap } from "openfl/display/Bitmap";
import { DisplayObject } from "openfl/display/DisplayObject";
import { MovieClip } from "openfl/display/MovieClip";
import { Sprite } from "openfl/display/Sprite";
import { Point } from "openfl/geom/Point";

import { Flame } from "./Flame";

/**
 * Fire - manages flame effects on buildings/monsters.
 */
export class Fire extends Sprite {
    private static flames: Array<Flame> = [];
    private static flame: Flame | null = null;
    private static phase: number = 0;
    private static _frameNumber: number = 0;

    private monster: Sprite | null = null;
    private monsterBmp: Bitmap | null = null;
    private count: number = 0;
    private countMax: number = 0;

    constructor() {
        super();
    }

    public static Add(target: DisplayObject, bitmap: Bitmap, position: Point): void {
        if (Fire.flames.length < 5) {
            Fire.flame = (target as MovieClip).addChild(new Flame(target, bitmap.width + 20, bitmap.height + 60)) as Flame;
            Fire.flame.emitter = bitmap;
            Fire.flame.enhance = 5;
            Fire.flame.cooling = 5;
            Fire.flame.x = position.x;
            Fire.flame.y = position.y + 2;
            Fire.flames.push(Fire.flame);
        }
    }

    public static Remove(index: number): void {
        Fire.flames[index].Clear();
        Fire.flames.splice(index, 1);
    }

    public static Tick(): void {
        if (++Fire._frameNumber % 2 === 0) {
            for (let i = 0; i < Fire.flames.length; i++) {
                Fire.flame = Fire.flames[i];
                Fire.flame.Tick();
                if (Fire.flame.phase === 0) {
                    Fire.flame.cooling -= 0.2;
                    if (Fire.flame.cooling < 0.8) {
                        Fire.flame.phase = 1;
                    }
                } else if (Fire.flame.phase > 0) {
                    Fire.flame.phase += 1;
                    if (Fire.flame.phase > 200) {
                        Fire.flame.cooling += 0.02;
                        if (Fire.flame.cooling > 5) {
                            Fire.Remove(i);
                            i--;
                        }
                    }
                }
            }
        }
    }

    public static Clear(): void {
        for (let i = 0; i < Fire.flames.length; i++) {
            Fire.Remove(i);
            i--;
        }
        Fire.flames = [];
    }
}
