/**
 * Helper class for managing image callback data.
 */
export class ImageCallbackHelper {
    private _ref: Function | null;
    private _state: string | null;
    private _level: number;
    private _imageDataA: any;
    private _imageDataB: any;

    constructor(ref: Function, state: string, level: number, imageDataA: any, imageDataB: any) {
        this._ref = ref;
        this._state = state;
        this._level = level;
        this._imageDataA = imageDataA;
        this._imageDataB = imageDataB;
    }

    public get ref(): Function | null {
        return this._ref;
    }

    public get state(): string | null {
        return this._state;
    }

    public get level(): number {
        return this._level;
    }

    public get imageDataA(): any {
        return this._imageDataA;
    }

    public get imageDataB(): any {
        return this._imageDataB;
    }

    public clear(): void {
        this._ref = null;
        this._state = null;
        this._imageDataA = null;
        this._imageDataB = null;
    }
}
