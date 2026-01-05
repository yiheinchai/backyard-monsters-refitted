/**
 * SecNum - Secure Number stub
 * Converted from ActionScript to TypeScript
 */
export class SecNum {
    private _value: number;

    constructor(value: number = 0) {
        this._value = value;
    }

    public Get(): number {
        return this._value;
    }

    public Set(value: number): void {
        this._value = value;
    }

    public get value(): number {
        return this._value;
    }

    public set value(v: number) {
        this._value = v;
    }
}
