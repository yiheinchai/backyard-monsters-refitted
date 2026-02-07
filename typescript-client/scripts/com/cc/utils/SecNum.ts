import { LOGGER } from "../../../LOGGER";

/**
 * Secure number storage with obfuscation to prevent memory hacking.
 */
export class SecNum {
    private static readonly TWOPOW32: number = Math.pow(2, 32);

    private _seed: number = 0;
    private _x: number = 0;
    private _n: number = 0;
    private _n64: number = 0;
    private _neg: boolean = false;

    constructor(value: number) {
        this.Set(value);
    }

    public Set(value: number): void {
        this._neg = false;
        if (value < 0) {
            value *= -1;
            this._neg = true;
        }
        this._seed = Math.floor(Math.random() * 99999);
        value = Math.round(value);
        this._x = (value ^ this._seed) >>> 0;
        this._n = ((value >>> 0) + (this._seed << 1) ^ this._seed) >>> 0;
        this._n64 = Math.floor(value / SecNum.TWOPOW32);
    }

    public Add(amount: number): number {
        const result = amount + this.Get();
        this.Set(result);
        return result;
    }

    public Get(): number {
        const decoded = this._n64 * SecNum.TWOPOW32 + ((this._x ^ this._seed) >>> 0);
        const check = this._n64 * SecNum.TWOPOW32 + (((this._n ^ this._seed) >>> 0) - (this._seed << 1) >>> 0);
        
        if (decoded === check) {
            return this._neg ? -decoded : decoded;
        }
        
        LOGGER.Log("err", "SecNum Broke (impossible unless.....)" + decoded + " != " + check + "?");
        // Use lazy import to avoid circular dependency with GLOBAL
        import("../../../GLOBAL").then(({ GLOBAL }) => {
            GLOBAL.ErrorMessage("SecNum");
        });
        return 0;
    }
}
