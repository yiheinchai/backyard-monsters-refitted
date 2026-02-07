import BitmapData from "openfl/display/BitmapData";
import Matrix from "openfl/geom/Matrix";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { ParticlesObject } from "./ParticlesObject";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getGRID(): any { return require("../../../../GRID").GRID; }
function getMAP(): any { return require("../../../../MAP").MAP; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }



/**
 * Particles - manages particle effects system.
 */
export class Particles {
    public static _particles: Record<string, ParticlesObject> = {};
    public static _particleCount: number = 0;
    public static _tmpParticleCount: number = 0;
    public static _frame: number = 0;
    private static _pool: Array<ParticlesObject> = [];

    constructor() {
    }

    public static Clear(): void {
        try {
            for (const g in Particles._particles) {
                const particle: ParticlesObject = Particles._particles[g];
                if (particle.parent) {
                    particle.parent.removeChild(particle);
                }
                particle.Clear();
                Particles.PoolSet(particle);
                delete Particles._particles[g];
            }
            Particles._particles = {};
            Particles._particleCount = 0;
            Particles._frame = 0;
        } catch (e: any) {
            getLOGGER().Log("err", "Particles Clear " + e.stack);
        }
    }

    public static PoolGet(id: number, startPos: Point, endPos: Point, distance: number, delay: number, alpha: number): ParticlesObject {
        let particle: ParticlesObject;
        if (Particles._pool.length) {
            particle = Particles._pool.pop()!;
        } else {
            particle = new ParticlesObject();
            particle.gotoAndStop(Math.floor(Math.random() * 3) + 1);
        }
        particle.init(id, startPos, endPos, distance, delay, alpha);
        return particle;
    }

    public static PoolSet(particle: ParticlesObject): void {
        Particles._pool.push(particle);
    }

    public static Create(origin: Point, alpha: number, distance: number, count: number, offsetY: number = 0): void {
        if (!getGLOBAL()._catchup) {
            if (Particles._tmpParticleCount < 80) {
                for (let i = 0; i < count; i++) {
                    Particles._tmpParticleCount += 1;
                    let dist: number = distance * 0.2 + Math.random() * (distance * 0.8);
                    if (Math.random() <= 0.3) {
                        dist *= 1.5;
                    }
                    Particles.Spawn(origin.add(new Point(-3 + Math.random() * 6, -2 + Math.random() * 4)), alpha, dist, i / 100, offsetY);
                }
            }
        }
    }

    public static Spawn(origin: Point, alpha: number, distance: number, delay: number, offsetY: number): void {
        const angle: number = Math.random() * 360;
        const isoPos: Point = getGRID().FromISO(origin.x, origin.y);
        const newX: number = isoPos.x + Math.cos(angle) * distance;
        const newY: number = isoPos.y + Math.sin(angle) * distance;
        const endPos: Point = getGRID().ToISO(newX, newY, 0).add(new Point(0, offsetY));
        Particles._particles[Particles._particleCount] = getMAP()._GROUND.addChild(Particles.PoolGet(Particles._particleCount, origin, endPos, distance, delay, alpha)) as ParticlesObject;
        Particles._particleCount += 1;
    }

    public static Remove(id: any): void {
        const particle: ParticlesObject = Particles._particles[id];
        --Particles._tmpParticleCount;
        try {
            getMAP()._GROUND.removeChild(particle);
            particle.Clear();
            Particles.PoolSet(particle);
            delete Particles._particles[id];
        } catch (e: any) {
            // Ignore error
        }
    }

    public static SnapShot(x: number, y: number, scale: number, particle: ParticlesObject): void {
        try {
            const matrix: Matrix = new Matrix();
            const width: number = 26;
            const height: number = 26;
            const bmd: BitmapData = new BitmapData(width, height, true, 0);
            matrix.scale(scale, scale);
            matrix.tx = width * 0.5;
            matrix.ty = height * 0.5;
            bmd.draw(particle, matrix);
            getMAP().effectsBMD.copyPixels(bmd, new Rectangle(0, 0, width, height), new Point(x + getMAP().effectsBMD.width * 0.5 - width / 2, y + getMAP().effectsBMD.height * 0.5 - height * 0.5), null, null, true);
        } catch (e: any) {
            // Ignore error
        }
    }
}
