import Point from "openfl/geom/Point";

/**
 * Smoke system - manages smoke effect parameters.
 */
export class SmokeSystem {
    public id: number = 0;
    public position: Point | null = null;
    public life: number = 0;
    public density: number = 0;
    public basesize: number = 0;
    public expand: number = 0;

    constructor() {}
}
