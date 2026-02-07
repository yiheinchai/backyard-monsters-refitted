import Point from "openfl/geom/Point";

import { ParticleDamageItem } from "./ParticleDamageItem";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }



/**
 * Particle text - manages damage/heal text particles with object pooling.
 */
export class ParticleText {
    public static readonly TYPE_DAMAGE: number = 10;
    public static readonly TYPE_THORN: number = 11;
    public static readonly TYPE_HEAL: number = 11;

    private static _pool: Array<ParticleDamageItem> = [];
    private static _currentCount: number = 0;
    private static _currentMax: number = 20;

    constructor() {
    }

    public static Create(position: Point, value: number, type: number): ParticleDamageItem | null {
        let particle: ParticleDamageItem | null = null;
        if (!getGLOBAL()._catchup && ParticleText._currentCount < ParticleText._currentMax) {
            particle = ParticleText.PoolGet(type);
            if (particle) {
                particle.Init(position, value, type);
            }
        }
        return particle;
    }

    private static PoolGet(type: number): ParticleDamageItem | null {
        let particle: ParticleDamageItem | null = null;
        ++ParticleText._currentCount;
        if (ParticleText._pool.length) {
            particle = ParticleText._pool.pop() as ParticleDamageItem;
        } else {
            particle = new ParticleDamageItem();
        }
        return particle;
    }

    public static Remove(particle: ParticleDamageItem): void {
        --ParticleText._currentCount;
        if (ParticleText._currentCount < 0) {
            ParticleText._currentCount = 0;
        }
        ParticleText.PoolSet(particle);
    }

    private static PoolSet(particle: ParticleDamageItem): void {
        ParticleText._pool.push(particle);
    }

    public static Clear(): void {
        ParticleText._pool = [];
        ParticleText._currentCount = 0;
    }
}
