import MovieClip from 'openfl/display/MovieClip';
import Shape from 'openfl/display/Shape';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import GlowFilter from 'openfl/filters/GlowFilter';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { TweenLite } from 'gs/TweenLite';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import { BTOWER } from './BTOWER';
import { popup_building } from './popup_building';

// Lazy imports to break circular dependency chains
function getBuildingOverlay(): any { return require("./com/monsters/display/BuildingOverlay").BuildingOverlay; }
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getVacuum(): any { return require("./com/monsters/siege/weapons/Vacuum").Vacuum; }
function getVacuumHose(): any { return require("./com/monsters/siege/weapons/VacuumHose").VacuumHose; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getGRID(): any { return require("./GRID").GRID; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getQUEUE(): any { return require("./QUEUE").QUEUE; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getTargeting(): any { return require("./Targeting").Targeting; }


class QuakeGraphic {
    public graphic: Shape;

    constructor(param1: number, param2: number) {
        this.graphic = new Shape();
        this.graphic.graphics.lineStyle(0.3, 6710988, 0.5);
        this.graphic.graphics.drawEllipse(-param1, -param1 / 2, param1 * 2, param1);
        this.graphic.graphics.drawEllipse(-param1 * 0.8, -param1 / 2.5, param1 * 1.6, param1 * 0.8);
        this.graphic.graphics.drawEllipse(-param1 * 0.6, -param1 / 3.333333, param1 * 1.2, param1 * 0.6);
        const _loc3_ = new GlowFilter(3379402, 1, 20, 20, 5 + Math.random() * 5, 1, false, false);
        this.graphic.filters = [_loc3_];
        TweenLite.to(this.graphic, 1, {
            "width": param2 * 2,
            "height": param2,
            "alpha": 0,
            "onComplete": this.onComplete.bind(this)
        });
    }

    private onComplete(): void {
        this.graphic.parent.removeChild(this.graphic);
        this.graphic.filters = [];
        this.graphic = null;
    }
}

export class INFERNOQUAKETOWER extends BTOWER {
    public static readonly UNDERHALL_ID: number = 999;
    public static readonly TYPE: number = 129;
    private _shouldAnimate: boolean;

    constructor() {
        super();
        this._type = 129;
        this._top = 40;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this.SetProps();
        this.Props();
        this.attackFlags = getTargeting().getOldStyleTargets(-1);
        
        // Override FollowMouseB
        const parentFollowMouseB = this.FollowMouseB;
        this.FollowMouseB = (param1: Event = null): void => {
            parentFollowMouseB(param1);
            this._origin = new Point(this._mc.x, this._mc.y);
        };
    }

    public override PlaceB(): void {
        super.PlaceB();
        this._origin = new Point(this._mc.x, this._mc.y);
    }

    public override StopMoveB(): void {
        super.StopMoveB();
        this._origin = new Point(this._mc.x, this._mc.y);
    }

    public override TickFast(param1: Event = null): void {
        super.TickFast(param1);
        if (this._shake > 0) {
            this._mc.x = this._origin.x - 2 + Math.random() * 4;
            this._mc.y = this._origin.y - 2 + Math.random() * 4;
            this._mcBase.x = this._origin.x - 1 + Math.random() * 2;
            this._mcBase.y = this._origin.y - 1 + Math.random() * 2;
            --this._shake;
            if (this._shake == 0) {
                this._mc.x = this._origin.x;
                this._mc.y = this._origin.y;
                this._mcBase.x = this._origin.x;
                this._mcBase.y = this._origin.y;
            }
        }
    }

    public override Update(param1: boolean = false): void {
        if (getGLOBAL()._render || param1) {
            const _loc3_: any[] = [];
            if (this._repairing == 1) {
                const _loc5_ = this._lvl.Get() == 0 ? 0 : Math.floor(this._lvl.Get() - 1);
                const _loc4_ = Math.ceil(this.maxHealth / Math.min(3600, this._buildingProps.repairTime[_loc5_]));
                this._repairTime = Math.floor(this.maxHealth - this.health) / _loc4_;
                getQUEUE().Update("building" + this._id, getKEYS().Get("ui_worker_stacktitle_repairing"), getGLOBAL().ToTime(this._repairTime, true));
            } else if (this._countdownBuild.Get() > 0) {
                getQUEUE().Update("building" + this._id, getKEYS().Get("ui_worker_stacktitle_building"), getGLOBAL().ToTime(this._countdownBuild.Get(), true));
            } else if (this._countdownUpgrade.Get() > 0) {
                getQUEUE().Update("building" + this._id, getKEYS().Get("ui_worker_stacktitle_upgrading"), getGLOBAL().ToTime(this._countdownUpgrade.Get(), true));
            } else if (this._countdownFortify.Get() > 0) {
                getQUEUE().Update("building" + this._id, getKEYS().Get("ui_worker_stacktitle_fortifying"), getGLOBAL().ToTime(this._countdownFortify.Get(), true));
            }
            if (this._class != "mushroom") {
                getBuildingOverlay().Update(this, param1);
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

    public override TickAttack(): void {
        if (this.health <= 0) {
            this._animTick = 0;
            return;
        }
        if (this._shouldAnimate) {
            ++this._frameNumber;
            if (this._frameNumber % 6 == 0 || this._animTick >= this._animFrames - 4) {
                this.AnimFrame(false);
                if (this._animTick < this._animFrames) {
                    if (this._animTick == this._animFrames - 6) {
                        getSOUNDS().Play("quake", !this.isJard ? 0.8 : 0.4);
                    }
                    ++this._animTick;
                } else {
                    this._shouldAnimate = false;
                    this.DelayedFire();
                }
            }
        } else {
            super.TickAttack();
        }
    }

    public override Fire(param1: IAttackable): void {
        if (this.health <= 0) {
            return;
        }
        this._shouldAnimate = true;
        this._animTick = 0;
        super.Fire(param1);
    }

    private DelayedFire(): void {
        let _loc1_ = 1;
        let _loc2_ = 1;
        if (getGLOBAL()._towerOverdrive && getGLOBAL()._towerOverdrive.Get() >= getGLOBAL().Timestamp()) {
            _loc2_ = 1.25;
        }
        if (this.isJard) {
            this._jarHealth.Add(-Math.floor(this.damage * 3 * _loc1_ * _loc2_));
            getATTACK().Damage(this._mc.x, this._mc.y + this._top, this.damage * 3 * _loc1_ * _loc2_);
            if (this._jarHealth.Get() <= 0) {
                this.KillJar();
            }
        } else {
            this.Quake(Math.floor(this.damage * _loc1_ * _loc2_));
            const _loc3_ = new QuakeGraphic(20, this._range * 2);
            _loc3_.graphic.y += this._top;
            this._mc.addChild(_loc3_.graphic);
        }
        this._origin = new Point(this._mc.x, this._mc.y);
        this._shake = 10;
    }

    private Quake(param1: number): void {
        let _loc7_ = 0;
        const _loc6_ = this.GetCreepsInRange();
        for (const _loc8_ in _loc6_) {
            const _loc2_ = _loc6_[_loc8_];
            const _loc3_ = _loc2_.creep as MonsterBase;
            const _loc4_ = Number(_loc2_.dist);
            let _loc5_ = param1 / this._range * (this._range - _loc4_);
            if (_loc5_ < param1 / 3) {
                _loc5_ = param1 / 3;
            }
            if (_loc5_ > _loc3_.health) {
                _loc5_ = _loc3_.health;
            }
            _loc7_ += _loc5_;
            _loc3_.modifyHealth(-_loc5_);
        }
        const _loc9_ = getVacuum().getHose();
        if (_loc9_ && getGLOBAL().QuickDistance(this._position, new Point(_loc9_.x, _loc9_.y)) < this._range) {
            let _loc5_ = param1 / this._range * (this._range - getGLOBAL().QuickDistance(this._position, getGLOBAL().townHall._position));
            _loc9_.modifyHealth(-_loc5_);
            _loc7_ += _loc5_;
        }
        getATTACK().Damage(this._mc.x, this._mc.y - this._top, _loc7_);
    }

    private GetCreepsInRange(): any[] {
        return getTargeting().getCreepsInRange(this._range, this._position.add(new Point(0, this._footprint[0].height / 2)), this.attackFlags);
    }

    public override Upgraded(): void {
        super.Upgraded();
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && !getBASE().isInfernoMainYardOrOutpost) {
            const _loc1_ = new popup_building();
            _loc1_.tA.htmlText = "<b>" + getKEYS().Get("pop_tupgraded_title", {
                "v1": getKEYS().Get(this._buildingProps.name),
                "v2": this._lvl.Get()
            }) + "</b>";
            _loc1_.tB.htmlText = getKEYS().Get("pop_tupgraded_body", { "v1": getKEYS().Get(this._buildingProps.name) });
            _loc1_.bPost.SetupKey("btn_brag");
            _loc1_.bPost.addEventListener(MouseEvent.CLICK, this.UpgradedBrag.bind(this));
            _loc1_.bPost.Highlight = true;
            getPOPUPS().Push(_loc1_, null, null, null, "build.v2.png");
        }
    }

    private UpgradedBrag(param1: MouseEvent): void {
        getGLOBAL().CallJS("sendFeed", ["build-" + String(this._buildingProps.name).toLowerCase(), getKEYS().Get("upgrade_quaketower_streamtitle", { "v1": this._lvl.Get() }), getKEYS().Get("upgrade_quaketower_streambody"), "quests/quake_tower.png"]);
        getPOPUPS().Next();
    }

    public override Constructed(): void {
        super.Constructed();
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && !getBASE().isInfernoMainYardOrOutpost) {
            const _loc1_ = new popup_building();
            _loc1_.tA.htmlText = "<b>" + getKEYS().Get("pop_tupgraded_title", {
                "v1": getKEYS().Get(this._buildingProps.name),
                "v2": this._lvl.Get()
            }) + "</b>";
            _loc1_.tB.htmlText = getKEYS().Get("pop_tbuild_body", { "v1": getKEYS().Get(this._buildingProps.name) });
            _loc1_.bPost.SetupKey("btn_brag");
            _loc1_.bPost.addEventListener(MouseEvent.CLICK, this.ConstructedBrag.bind(this));
            _loc1_.bPost.Highlight = true;
            getPOPUPS().Push(_loc1_, null, null, null, "build.v2.png");
        }
    }

    private ConstructedBrag(param1: MouseEvent): void {
        getGLOBAL().CallJS("sendFeed", ["build-" + String(this._buildingProps.name).toLowerCase(), getKEYS().Get("build_quaketower_streamtitle"), getKEYS().Get("build_quaketower_streambody"), "quests/quake_tower.png"]);
        getPOPUPS().Next();
    }

    public override Setup(param1: any): void {
        param1.t = this._type;
        super.Setup(param1);
        this._origin = new Point(this._mc.x, this._mc.y);
        this._animRandomStart = false;
    }

    public override Export(): any {
        const _loc1_ = super.Export();
        const _loc2_ = getGRID().FromISO(this._origin.x, this._origin.y);
        _loc1_.X = _loc2_.x;
        _loc1_.Y = _loc2_.y;
        return _loc1_;
    }
}
