import { Point } from "openfl/geom/Point";

import { BFOUNDATION } from "../../../BFOUNDATION";

/**
 * Represents an attack solution computed by the AI.
 */
export class Solution {
    public degrees: number;
    public entryPoint: Point;
    public wayPoints: any[] = [];
    public composition: any[] = [];
    public targetBuilding: BFOUNDATION | any = null;
    public defensiveBuilding: BFOUNDATION | any = null;
    public resourcesGained: number = 0;
    public damageTaken: number = 0;
    public attack: { [key: string]: any } | null = null;
    public targetHP: number = 0;
    public looters: { [key: string]: any } | null = null;
    public tanks: { [key: string]: any } | null = null;
    public dps: { [key: string]: any } | null = null;
    public anything: { [key: string]: any } | null = null;
    public distanceToTarget: number = 0;
    public nearestTower: Point | null = null;
    public attackTime: number = 0;
    public distances: { [key: string]: any } | null = null;
    public towersInPath: any[] = [];

    constructor(degrees: number, radiusX: number, radiusY: number) {
        const degToRad = 0.0174532925;
        this.degrees = degrees;
        this.entryPoint = new Point(radiusX * Math.cos(degrees * degToRad), radiusY * Math.sin(degrees * degToRad));
        this.wayPoints = [];
        this.resourcesGained = 0;
        this.damageTaken = 0;
        this.targetHP = 0;
        this.towersInPath = [];
    }

    public toString(): string {
        return "Solution";
    }
}
