import { BitmapData } from "openfl/display/BitmapData";

/**
 * Rndm - Seeded random number generator utility.
 * Based on Grant Skinner's Rndm class, using BitmapData noise for seeded randomness.
 */
export class Rndm {
    protected static _instance: Rndm | null = null;
    protected _seed: number = 0;
    protected _pointer: number = 0;
    protected bmpd: BitmapData;
    protected seedInvalid: boolean = true;

    constructor(seed: number = 0) {
        this._seed = seed;
        this.bmpd = new BitmapData(1000, 200);
    }

    public static get instance(): Rndm {
        if (Rndm._instance === null) Rndm._instance = new Rndm();
        return Rndm._instance;
    }

    public static get seed(): number { return Rndm.instance.seed; }
    public static set seed(value: number) { Rndm.instance.seed = value; }
    public static get pointer(): number { return Rndm.instance.pointer; }
    public static set pointer(value: number) { Rndm.instance.pointer = value; }
    public static random(): number { return Rndm.instance.random(); }
    public static float(min: number, max: number = NaN): number { return Rndm.instance.float(min, max); }
    public static boolean(chance: number = 0.5): boolean { return Rndm.instance.boolean(chance); }
    public static sign(chance: number = 0.5): number { return Rndm.instance.sign(chance); }
    public static bit(chance: number = 0.5): number { return Rndm.instance.bit(chance); }
    public static integer(min: number, max: number = NaN): number { return Rndm.instance.integer(min, max); }
    public static reset(): void { Rndm.instance.reset(); }

    public get seed(): number { return this._seed; }
    public set seed(value: number) {
        if (value !== this._seed) { this.seedInvalid = true; this._pointer = 0; }
        this._seed = value;
    }

    public get pointer(): number { return this._pointer; }
    public set pointer(value: number) { this._pointer = value; }

    public random(): number {
        if (this.seedInvalid) { this.bmpd.noise(this._seed, 0, 255, 1 | 2 | 4 | 8); this.seedInvalid = false; }
        this._pointer = (this._pointer + 1) % 200000;
        return (this.bmpd.getPixel32(this._pointer % 1000, Math.floor(this._pointer / 1000)) * 0.999999999999998 + 1e-15) / 4294967295;
    }

    public float(min: number, max: number = NaN): number { if (isNaN(max)) { max = min; min = 0; } return this.random() * (max - min) + min; }
    public boolean(chance: number = 0.5): boolean { return this.random() < chance; }
    public sign(chance: number = 0.5): number { return this.random() < chance ? 1 : -1; }
    public bit(chance: number = 0.5): number { return this.random() < chance ? 1 : 0; }
    public integer(min: number, max: number = NaN): number { if (isNaN(max)) { max = min; min = 0; } return Math.floor(this.float(min, max)); }
    public reset(): void { this._pointer = 0; }
}
