import Point from "openfl/geom/Point";

/**
 * Smoke particle - individual particle for smoke effects.
 */
export class SmokeParticle {
    public position: Point | null = null;
    public speed: number = 0;
    public decay: number = 0;
    public wind: number = 0;

    constructor() {}
}
