import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { SmokeParticle } from "./SmokeParticle";
import { SmokeSystem } from "./SmokeSystem";
import { smoke1 } from "../../../../smoke1";

import { GLOBAL } from "../../../../GLOBAL";
import { LOGGER } from "../../../../LOGGER";
import { MAP } from "../../../../MAP";

/**
 * Smoke - particle system for smoke effects.
 */
export class Smoke {
    private static _bmd: BitmapData;
    private static _mc: DisplayObject;
    private static _tmpPoint: Point;
    private static _tmpSmokeParticle: SmokeParticle;
    private static _noiseBMD: BitmapData;
    private static setupCompleted: boolean = false;
    private static _rect: Rectangle;
    private static _frameNumber: number = 0;
    private static _sourceID: number = 0;
    private static lastProcessTime: number = 0;
    private static _particles: Array<SmokeParticle> = [];
    private static _sources: Array<SmokeSystem> = [];
    private static _enabled: boolean = false;
    public static _smokeParticleBMD: Array<BitmapData> = new Array<BitmapData>(100);

    constructor() {
    }

    public static Setup(): void {
        try {
            if (!Smoke._enabled) {
                return;
            }
            if (!Smoke.setupCompleted) {
                Smoke._rect = new Rectangle(0, 0, 1500, 800);
                Smoke._frameNumber = 0;
                Smoke._sourceID = 0;
                const tmpSpriteSheet = new smoke1(0, 0);
                for (let i = 0; i < 100; i++) {
                    const tmpW = 5 + 25 / 100 * i;
                    const tmpO = (30 - tmpW) * 0.5;
                    const tmpSprite = new BitmapData(tmpW, tmpW, true, 16777215);
                    tmpSprite.copyPixels(tmpSpriteSheet, new Rectangle(i * 30 + tmpO, tmpO, tmpW, tmpW), new Point(0, 0), null, null, true);
                    Smoke._smokeParticleBMD[i] = tmpSprite;
                }
                Smoke.setupCompleted = true;
            }
            Smoke._bmd = new BitmapData(Smoke._rect.width, Smoke._rect.height, true, 0);
            Smoke._mc = MAP._EFFECTSTOP.addChild(new Bitmap(Smoke._bmd));
            Smoke._mc.x = -Smoke._rect.width;
            Smoke._mc.y = -Smoke._rect.height;
            Smoke._mc.scaleX = Smoke._mc.scaleY = 2;
            Smoke._sources = [];
            Smoke._particles = [];
            Smoke._bmd.fillRect(Smoke._bmd.rect, 0);
        } catch (e: any) {
            LOGGER.Log("err", "Smoke.Setup " + Smoke.setupCompleted);
        }
    }

    public static CreatePoof(pos: Point, size: number, density: number): void {
        if (!Smoke._enabled) {
            return;
        }
        if (GLOBAL._fps < 30) {
            return;
        }
        Smoke.Add(pos, 5, 100 * density, size, 2);
    }

    public static CreateStream(pos: Point): void {
        if (!Smoke._enabled) {
            return;
        }
        if (GLOBAL._fps < 30) {
            return;
        }
        Smoke.Add(pos, 200, 4, 2, 1);
    }

    private static Add(pos: Point, life: number, density: number, basesize: number, expand: number): void {
        if (!Smoke._enabled) {
            return;
        }
        if (!Smoke.setupCompleted) {
            return;
        }
        pos = new Point(pos.x * 0.5, pos.y * 0.5).add(new Point(Smoke._rect.width * 0.5, Smoke._rect.height * 0.5));
        const system = new SmokeSystem();
        system.id = ++Smoke._sourceID;
        system.position = pos;
        system.life = life;
        system.density = density;
        system.basesize = basesize * 0.5;
        system.expand = expand;
        Smoke._sources.push(system);
        if (Smoke._sources.length > 3) {
            Smoke._sources.shift();
        }
    }

    private static Remove(id: number): void {
        if (!Smoke._enabled) {
            return;
        }
        if (!Smoke.setupCompleted) {
            return;
        }
        const len = Smoke._sources.length;
        for (let i = 0; i < len; i++) {
            if (Smoke._sources[i].id === id) {
                Smoke._sources.splice(i, 1);
                return;
            }
        }
    }

    public static Tick(): void {
        if (!Smoke._enabled) {
            return;
        }
        if (!Smoke.setupCompleted) {
            return;
        }
        const startTime = Date.now();
        Smoke._frameNumber++;
        let particleCount = Smoke._particles.length;
        let sourceCount = Smoke._sources.length;
        if (Smoke._frameNumber % 2 === 0) {
            if (particleCount < 700 && GLOBAL._fps > 20) {
                for (let i = 0; i < sourceCount; i++) {
                    const source = Smoke._sources[i];
                    const halfSize = source.basesize * 0.5;
                    source.life--;
                    if (Smoke.lastProcessTime > 10) {
                        source.life--;
                    }
                    if (source.life <= 0) {
                        Smoke.Remove(source.id);
                        sourceCount--;
                        i--;
                    } else {
                        for (let j = 0; j < source.density; j++) {
                            const particle = new SmokeParticle();
                            particle.position = new Point(
                                source.position.x - halfSize + Math.random() * source.basesize,
                                source.position.y - halfSize + Math.random() * source.basesize
                            );
                            particle.position.x += Math.random() * source.basesize - source.basesize * 0.5;
                            particle.position.y += (Math.random() * source.basesize - source.basesize * 0.5) * 0.5;
                            particle.speed = 2 + Math.random();
                            particle.wind = Math.random() * source.expand;
                            Smoke._particles.push(particle);
                        }
                        if (source.life % 10 === 0 && source.density > 1) {
                            source.density--;
                        }
                    }
                }
            }
            particleCount = Smoke._particles.length;
            if (particleCount > 0) {
                Smoke._bmd.lock();
                for (let i = 0; i < particleCount; i++) {
                    const particle = Smoke._particles[i];
                    const age = Math.floor(100 - 100 / 3 * particle.speed);
                    const clearSize = Smoke._smokeParticleBMD[age].rect.width + 2;
                    Smoke._bmd.fillRect(new Rectangle(particle.position.x - 1, particle.position.y - 1, clearSize, clearSize), 0);
                }
                for (let loop = 0; loop < GLOBAL._loops; loop++) {
                    for (let i = 0; i < particleCount; i++) {
                        const particle = Smoke._particles[i];
                        particle.position.x = particle.position.x + particle.wind * 0.25;
                        particle.position.y -= particle.speed * 0.25;
                        particle.speed -= 0.01;
                        const age = Math.floor(100 - 100 / 3 * particle.speed);
                        if (age >= 98) {
                            Smoke._particles.splice(i, 1);
                            i--;
                            particleCount--;
                        }
                    }
                }
                for (let i = 0; i < particleCount; i++) {
                    const particle = Smoke._particles[i];
                    const age = Math.floor(100 - 100 / 3 * particle.speed);
                    const bmd = Smoke._smokeParticleBMD[age];
                    if (!GLOBAL._catchup) {
                        Smoke._bmd.copyPixels(bmd, bmd.rect, particle.position, null, null, true);
                    }
                }
                Smoke._bmd.unlock();
            }
            Smoke.lastProcessTime = Date.now() - startTime;
        }
    }
}
