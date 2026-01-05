import EventDispatcher from 'openfl/events/EventDispatcher';
import Sprite from 'openfl/display/Sprite';
import DisplayObject from 'openfl/display/DisplayObject';
import { SecNum } from '../../com/cc/utils/SecNum';

/**
 * GameObject - Base game object
 * Stub for conversion
 */
export class GameObject extends EventDispatcher {
    public _mc: Sprite;
    public _health: SecNum;
    public _size: number = 0;
    public targetableStatus: number = 0;

    constructor() {
        super();
        this._mc = new Sprite();
        this._health = new SecNum(0);
    }

    public get graphic(): Sprite {
        return this._mc;
    }

    public get health(): number {
        return this._health.Get();
    }

    public setHealth(v: number): void {
        this._health.Set(v);
    }

    public get maxHealth(): number {
        return 100; // Stub
    }

    public addChild(child: DisplayObject): DisplayObject {
        return this._mc.addChild(child);
    }

    public removeChild(child: DisplayObject): DisplayObject {
        return this._mc.removeChild(child);
    }

    public get x(): number { return this._mc.x; }
    public get y(): number { return this._mc.y; }
    public get width(): number { return this._mc.width; }
    public get height(): number { return this._mc.height; }
    
    public set x(v: number) { this._mc.x = v; }
    public set y(v: number) { this._mc.y = v; }
    public set width(v: number) { this._mc.width = v; }
    public set height(v: number) { this._mc.height = v; }
}
