import { Point } from "openfl/geom/Point";

import { LASER } from "./LASER";

import { MAP } from "../../../MAP";

/**
 * Static laser effects manager.
 */
export class LASERS {
    public static _distance: number = 0;
    public static _angle: number = 0;
    public static _pointA: Point = new Point(50, 50);
    public static _pointB: Point | null = null;
    public static _duration: number = 0;
    public static _power: number = 0;
    public static _lasers: { [key: string]: LASER } = {};
    public static _laserCount: number = 0;

    constructor() {}

    public static Fire(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        color: number = 0,
        duration: number = 0,
        power: number = 0,
        callback: Function | null = null
    ): void {
        const laser = new LASER();
        laser.Fire(
            MAP._PROJECTILES,
            new Point(startX, startY),
            new Point(endX, endY),
            color,
            duration,
            power,
            callback
        );
        LASERS._lasers["l" + LASERS._laserCount] = laser;
        LASERS._laserCount++;
    }

    public static Tick(): void {
        for (const key in LASERS._lasers) {
            if (LASERS._lasers[key].Tick()) {
                delete LASERS._lasers[key];
            }
        }
    }
}
