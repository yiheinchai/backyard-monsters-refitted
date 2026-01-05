
import { BTOWER } from './BTOWER';
import { Targeting } from './Targeting'; // Stub needed
import { GLOBAL } from './GLOBAL';
import { QUEUE } from './QUEUE';
import { KEYS } from './KEYS';
import { BuildingOverlay } from './BuildingOverlay'; // Stub needed
import { SOUNDS } from './SOUNDS';
import { ATTACK } from './ATTACK';
import { BASE } from './BASE';
import { POPUPS } from './POPUPS';
import { GRID } from './GRID';
// import { Vacuum } from './com/monsters/siege/weapons/Vacuum'; // Stub needed in future
// import { VacuumHose } from './com/monsters/siege/weapons/VacuumHose'; // Stub needed in future
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import MovieClip from 'openfl/display/MovieClip';
import Shape from 'openfl/display/Shape';
import GlowFilter from 'openfl/filters/GlowFilter';

// Stubbing external libs
const TweenLite: any = { to: () => {} };

export class INFERNOQUAKETOWER extends BTOWER {
    public static readonly UNDERHALL_ID: number = 999;
    public static readonly TYPE: number = 129;

    private _shouldAnimate: boolean;

    constructor() {
        super();
        this._type = 129;
        this._top = 40;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [
            [new Rectangle(0, 0, 70, 70), 10],
            [new Rectangle(10, 10, 50, 50), 200]
        ];
        this.SetProps();
        this.Props();
        this.attackFlags = Targeting.getOldStyleTargets(-1);
    }

    public PlaceB(): void {
        super.PlaceB();
        this._origin = new Point(this._mc.x, this._mc.y);
    }

    public FollowMouseB(param1: Event = null): void {
        super.FollowMouseB(param1);
        this._origin = new Point(this._mc.x, this._mc.y);
    }

    public StopMoveB(): void {
        super.StopMoveB();
        this._origin = new Point(this._mc.x, this._mc.y);
    }

    public TickFast(param1: Event = null): void {
        super.TickFast(param1);
        if (this._shake > 0) {
            this._mc.x = this._origin.x - 2 + Math.random() * 4;
            this._mc.y = this._origin.y - 2 + Math.random() * 4;
            this._mcBase.x = this._origin.x - 1 + Math.random() * 2;
            this._mcBase.y = this._origin.y - 1 + Math.random() * 2;
            this._shake--;
            if (this._shake == 0) {
                this._mc.x = this._origin.x;
                this._mc.y = this._origin.y;
                this._mcBase.x = this._origin.x;
                this._mcBase.y = this._origin.y;
            }
        }
    }

    public Update(param1: boolean = false): void {
        if (GLOBAL._render || param1) {
            if (this._repairing == 1) {
                // repair logic
            } else if (this._countdownBuild.Get() > 0) {
                // build logic
            }
            // ...
            if (this._class != "mushroom") {
                BuildingOverlay.Update(this, param1);
            }
            if (this.health <= 0) {
                this.Render("destroyed");
            } else if (this.health < this.maxHealth * 0.5) {
                this.Render("damaged");
            } else {
                this.Render("");
            }
        }
    }

    public TickAttack(): void {
        if (this.health <= 0) {
            this._animTick = 0;
            return;
        }
        if (this._shouldAnimate) {
            this._frameNumber++;
            if (this._frameNumber % 6 == 0 || this._animTick >= this._animFrames - 4) {
                this.AnimFrame(false);
                if (this._animTick < this._animFrames) {
                    if (this._animTick == this._animFrames - 6) {
                        SOUNDS.Play("quake", !this.isJard ? 0.8 : 0.4);
                    }
                    this._animTick++;
                } else {
                    this._shouldAnimate = false;
                    this.DelayedFire();
                }
            }
        } else {
            super.TickAttack();
        }
    }

    public Fire(param1: any): void {
        if (this.health <= 0) return;
        this._shouldAnimate = true;
        this._animTick = 0;
        super.Fire(param1);
    }

    private DelayedFire(): void {
        let _loc1_: number = 1;
        let _loc2_: number = 1;
         // logic for overrides
         this.Quake(Math.floor(this.damage * _loc1_ * _loc2_));
         if (!this.isJard) {
             let _loc3_ = new QuakeGraphic(20, this._range * 2);
             if (_loc3_.graphic) {
                 _loc3_.graphic.y += this._top;
                 this._mc.addChild(_loc3_.graphic);
             }
         }
         this._origin = new Point(this._mc.x, this._mc.y);
         this._shake = 10;
    }

    private Quake(param1: number): void {
        // Quake damage logic
        // ATTACK.Damage(...)
    }

    private GetCreepsInRange(): any[] {
        // stub
        return [];
    }
}

class QuakeGraphic {
    public graphic: Shape | null;

    constructor(param1: number, param2: number) {
        this.graphic = new Shape();
        this.graphic.graphics.lineStyle(0.3, 0x6666CC, 0.5);
        this.graphic.graphics.drawEllipse(-param1, -param1 / 2, param1 * 2, param1);
        // ... drawing ...
        let _loc3_: GlowFilter = new GlowFilter(0x3399CC, 1, 20, 20, 5 + Math.random() * 5, 1, false, false);
        this.graphic.filters = [_loc3_];
        
        TweenLite.to(this.graphic, 1, {
            "width": param2 * 2,
            "height": param2,
            "alpha": 0,
            "onComplete": this.onComplete.bind(this)
        });
    }

    private onComplete(): void {
        if (this.graphic && this.graphic.parent) {
            this.graphic.parent.removeChild(this.graphic);
        }
        this.graphic = null;
    }
}
