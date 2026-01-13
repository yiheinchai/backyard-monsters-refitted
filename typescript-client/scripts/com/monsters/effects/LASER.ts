import BitmapData from "openfl/display/BitmapData";
import DisplayObjectContainer from "openfl/display/DisplayObjectContainer";
import MovieClip from "openfl/display/MovieClip";
import Shape from "openfl/display/Shape";
import GlowFilter from "openfl/filters/GlowFilter";
import Point from "openfl/geom/Point";
import getTimer from "openfl/utils/getTimer";

import { MonsterBase } from "../monsters/MonsterBase";

import { EFFECTS } from "../../../EFFECTS";
import { GLOBAL } from "../../../GLOBAL";
import { Targeting } from "../../../Targeting";

/**
 * Laser beam effect with animated glow.
 */
export class LASER {
    public _container: DisplayObjectContainer | null = null;
    public _mc: MovieClip | null = null;
    public _buffer: Shape | null = null;
    public _mcBitmapData: BitmapData | null = null;
    public _height: number = 0;
    public _distance: number = 0;
    public _angle: number = 0;
    public _origin: Point | null = null;
    public _pointA: Point | null = null;
    public _pointB: Point | null = null;
    public _duration: number = 0;
    public _power: number = 0;
    public _trackCallbackFunction: Function | null = null;
    public _damage: number = 0;
    public _splash: number = 0;
    public _frameNumber: number = 0;
    public _bitmapWidth: number = 500;
    public _bitmapHeight: number = 250;

    constructor() {}

    public Fire(
        container: MovieClip,
        pointA: Point,
        pointB: Point,
        height: number,
        damage: number,
        splash: number,
        callback: Function | null
    ): void {
        this._height = height;
        this._damage = damage;
        this._splash = splash;
        this._pointA = pointA;
        this._pointB = pointB;
        this._origin = pointA;
        
        if (callback !== null) {
            this._trackCallbackFunction = callback;
        }
        
        this._container = container.addChild(new MovieClip()) as DisplayObjectContainer;
        this._distance = Point.distance(this._pointA, this._pointB);
        
        const dx = this._pointA.x - this._pointB.x;
        const dy = this._pointA.y - this._pointB.y;
        this._angle = Math.atan2(dy, dx) * 57.2957795 + 180 - 150 / Math.sqrt(this._distance);
        this._duration = 0;
    }

    public Tick(): boolean {
        if (!this._pointA || !this._pointB || !this._container) return true;
        
        let distTotal = Point.distance(new Point(this._pointA.x, this._pointA.y), new Point(this._pointB.x, this._pointB.y));
        let dx = this._pointB.x - this._pointA.x;
        let dy = this._pointB.y - this._pointA.y;
        const dirX = Math.cos(Math.atan2(dy, dx)) * 8;
        const dirY = Math.sin(Math.atan2(dy, dx)) * 8;
        const startPoint = this._pointA.add(new Point(dirX, dirY - this._height));
        
        if (this._duration < 80) {
            if (this._power < 1) {
                this._power += 0.1;
            }
        } else if (this._power > 0) {
            this._power -= 0.1;
        }
        
        if (this._mc && this._container) {
            this._container.removeChild(this._mc);
            this._mc = null;
        }
        
        this._mc = this._container.addChild(new MovieClip()) as MovieClip;
        
        if (this._duration > 100) {
            return true;
        }
        
        const angleSpeed = 4 / Math.sqrt(this._distance);
        this._angle += angleSpeed / 2 * GLOBAL._loops;
        this._duration += GLOBAL._loops;
        
        const time = getTimer();
        const endX = this._pointA.x + Math.cos(this._angle * (Math.PI / 180)) * 
            (this._distance + Math.sin((this._duration / 4 + time / 1000) / 20) * (this._distance / 20));
        const endY = this._pointA.y + Math.sin(this._angle * (Math.PI / 180)) * 
            (this._distance + Math.sin((this._duration / 4 + time / 1000) / 20) * (this._distance / 20));
        
        this._pointB = new Point(endX, endY);
        
        if (this._trackCallbackFunction !== null) {
            this._trackCallbackFunction(this._angle - 25);
        }
        
        if (!GLOBAL._catchup) {
            // End point glow
            this._buffer = new Shape();
            this._buffer.graphics.beginFill(0xFCBB33, 1);
            this._buffer.graphics.drawEllipse(this._pointB.x - 8, this._pointB.y - 4, 16, 8);
            (this._buffer as any).filters = [new GlowFilter(0xFCBB33, 1, 40, 20, 15 + Math.random() * 5, 2, false, false)];
            this._buffer.alpha = this._power / 2;
            this._mc.addChild(this._buffer);
            
            // Start point glow
            this._buffer = new Shape();
            this._buffer.graphics.beginFill(0xFCBB33, 1);
            this._buffer.graphics.drawEllipse(startPoint.x, startPoint.y, 8, 8);
            (this._buffer as any).filters = [new GlowFilter(0xFCBB33, 1, 20, 20, 5 + Math.random() * 5, 1, false, false)];
            this._buffer.alpha = this._power / 2;
            this._mc.addChild(this._buffer);
            
            // Inner start point
            this._buffer = new Shape();
            this._buffer.graphics.beginFill(0xF4F4DD, 1);
            this._buffer.graphics.drawEllipse(startPoint.x, startPoint.y, 5, 5);
            (this._buffer as any).filters = [new GlowFilter(0xF4F4DD, 0.75, 20, 20, 1 + Math.random() * 2, 1, false, false)];
            this._mc.addChild(this._buffer);
            
            // Main beam line
            this._buffer = new Shape();
            this._buffer.graphics.lineStyle(2 + Math.random() * 2, 0xF4F4DD, 1);
            this._buffer.graphics.moveTo(startPoint.x, startPoint.y);
            this._buffer.graphics.lineTo(this._pointB.x, this._pointB.y);
            (this._buffer as any).filters = [new GlowFilter(0xCB088B, 1, 20 + Math.random() * 2, 20 + Math.random() * 2, 4, 2, false, false)];
            this._buffer.alpha = this._power;
            this._mc.addChild(this._buffer);
            
            // Wavy beam effect
            this._buffer = new Shape();
            this._buffer.graphics.moveTo(startPoint.x, startPoint.y);
            distTotal = Point.distance(new Point(startPoint.x, startPoint.y), new Point(this._pointB.x, this._pointB.y));
            
            for (let i = 1; i < 30; i++) {
                const thickness = 3 + Math.sin(i / 3 - time / 70);
                this._buffer.graphics.lineStyle(thickness, 0xF4F4DD, 1);
                dx = this._pointB.x - startPoint.x;
                dy = this._pointB.y - startPoint.y;
                const segX = Math.cos(Math.atan2(dy, dx)) * (distTotal / 30 * i);
                const segY = Math.sin(Math.atan2(dy, dx)) * (distTotal / 30 * i);
                this._buffer.graphics.lineTo(segX + startPoint.x, segY + startPoint.y);
            }
            
            this._buffer.graphics.lineTo(this._pointB.x, this._pointB.y);
            (this._buffer as any).filters = [new GlowFilter(0xF4F4DD, 1, 6 + Math.random() * 2, 6 + Math.random() * 2, 2, 2, false, false)];
            this._buffer.alpha = this._power;
            this._mc.addChild(this._buffer);
            
            // End point
            this._buffer = new Shape();
            this._buffer.graphics.beginFill(0xF4F4DD, 1);
            this._buffer.graphics.drawEllipse(this._pointB.x - 6, this._pointB.y - 3, 12, 6);
            (this._buffer as any).filters = [new GlowFilter(0xF4F4DD, 1, 20, 10, 5 + Math.random() * 5, 2, false, false)];
            this._mc.addChild(this._buffer);
        }
        
        for (let loop = 0; loop < GLOBAL._loops; loop++) {
            if (this._frameNumber % 8 === 0) {
                this.Splash(this._pointB);
            }
            if (this._frameNumber % 16 === 0) {
                EFFECTS.Burn(this._pointB.x, this._pointB.y);
            }
            this._frameNumber++;
        }
        
        return false;
    }

    public Splash(pos: Point): void {
        const targets = Targeting.getCreepsInRange(this._splash, pos, Targeting.getOldStyleTargets(-1));
        let totalDamage = 0;
        
        for (const key in targets) {
            const target = targets[key];
            const creep = target.creep as MonsterBase;
            const dist = target.dist as number;
            const damage = this._damage * 0.5 / this._splash * (this._splash - dist);
            totalDamage += damage;
            creep.modifyHealth(-damage);
        }
    }
}
