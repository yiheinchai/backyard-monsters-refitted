import { Point } from "openfl/geom/Point";

import { GLOBAL } from "../../../GLOBAL";

/**
 * Math utility functions for geometry and angle calculations.
 */
export class MathUtils {
    public static readonly DEGREES_TO_RADIANS: number = Math.PI / 180;
    public static readonly RADIANS_TO_DEGREES: number = 180 / Math.PI;

    constructor() {}

    public static getDistanceBetweenTwoPoints(p1: Point, p2: Point): number {
        return GLOBAL.QuickDistance(p1, p2);
    }

    public static getAngleBetweenTwoPointsInRadians(p1: Point, p2: Point): number {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    public static getAngleBetweenTwoPointsInDegrees(p1: Point, p2: Point): number {
        return MathUtils.getAngleBetweenTwoPointsInRadians(p1, p2) * MathUtils.RADIANS_TO_DEGREES;
    }
}
