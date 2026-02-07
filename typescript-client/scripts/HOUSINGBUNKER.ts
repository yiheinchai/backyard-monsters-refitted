import Shape from 'openfl/display/Shape';
import Sprite from 'openfl/display/Sprite';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { TweenLite, Expo } from './gs/TweenLite';
import { ITargetable } from './com/monsters/interfaces/ITargetable';
import { CreepBase } from './com/monsters/monsters/creeps/CreepBase';
import { Bunker } from './Bunker';
import { popup_building } from './popup_building';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getTargeting(): any { return require("./Targeting").Targeting; }


/**
 * HOUSINGBUNKER - Housing bunker building for Inferno creatures
 * Converted from ActionScript to TypeScript
 */
export class HOUSINGBUNKER extends Bunker {
    public bragPopUp: popup_building;
    public _capacity: number;
    public _hasTargets: boolean;
    public _frameNumber: number;
    public _monsters: any;
    public _dispatchedMonsters: any[];
    public _targetCreeps: any[];
    public _targetFlyers: any[];
    public _tickNumber: number;
    public _isLogged: boolean;
    private _radiusGraphic: Shape;
    
    // Properties for compatibility with BUILDING15
    public _space: number = 0;
    public _housing: Record<string, any> = {};

    constructor() {
        super();
        this._type = 128;
        this._footprint = [new Rectangle(0, 0, 160, 160)];
        this._gridCost = [[new Rectangle(10, 10, 140, 20), 400], [new Rectangle(10, 30, 20, 120), 400], [new Rectangle(30, 130, 120, 20), 400], [new Rectangle(130, 30, 20, 30), 400], [new Rectangle(130, 100, 20, 30), 400]];
        this._frameNumber = 0;
        this._spoutPoint = new Point(0, 0);
        this._spoutHeight = 40;
        this._monsters = {};
        this._monstersDispatched = {};
        this._dispatchedMonsters = [];
        this._targetCreeps = [];
        this._targetFlyers = [];
        this.SetProps();
    }

    override StopMoveB(): void {
        super.StopMoveB();
        this.UpdateHousedCreatureTargets();
    }

    override Description(): void {
        super.Description();
        this._upgradeDescription = getKEYS().Get("bdg_housing_capacitydesc", {
            "v1": getGLOBAL().FormatNumber(this._buildingProps.capacity[this._lvl.Get() - 1]),
            "v2": getGLOBAL().FormatNumber(this._buildingProps.capacity[this._lvl.Get()])
        });
        if (this._recycleCosts != null) {
            this._recycleDescription = "<b>" + getKEYS().Get("bdg_housing_recycledesc") + "</b><br>" + this._recycleCosts;
        }
        getHOUSING().HousingSpace();
        if (!getBASE().isOutpost) {
            this._blockRecycle = false;
        }
        if (getHOUSING()._housingSpace.Get() - this._buildingProps.capacity[this._lvl.Get() - 1] < 0) {
            this._recycleDescription = "<font color=\"#CC0000\">" + getKEYS().Get("bdg_compound_recyclewarning") + "</font>";
            this._blockRecycle = true;
        }
    }

    override Constructed(): void {
        super.Constructed();
        getHOUSING().AddHouse(this);
        this.updateLocalProperties();
    }

    private updateLocalProperties(): void {
        if (this._lvl.Get() > 0) {
            this._capacity = this._buildingProps.capacity[this._lvl.Get() - 1];
            this._range = this._buildingProps.stats[this._lvl.Get() - 1].range;
        }
    }

    override Upgraded(): void {
        super.Upgraded();
        getHOUSING().HousingSpace();
        this.updateLocalProperties();
    }

    private CloseUpgradePopUp(param1: MouseEvent): void {
        this.bragPopUp.bPost.removeEventListener(MouseEvent.CLICK, this.CloseUpgradePopUp.bind(this));
        getPOPUPS().Next();
        getGLOBAL().CallJS("sendFeed", ["upgrade-ho-" + this._lvl.Get(), getKEYS().Get("pop_housingupgraded_streamtitle", {"v1": this._lvl.Get()}), getKEYS().Get("pop_housingupgraded_streambody"), "upgrade-housing.png"]);
    }

    private CloseConstructionPopUp(param1: MouseEvent): void {
        this.bragPopUp.bPost.removeEventListener(MouseEvent.CLICK, this.CloseConstructionPopUp.bind(this));
        getPOPUPS().Next();
        getGLOBAL().CallJS("sendFeed", ["build-wmb", getKEYS().Get("pop_bunkerbuilt_streamtitle"), getKEYS().Get("pop_bunkerbuilt_streambody"), "build-monsterbunker.png"]);
    }

    override RecycleC(): void {
        super.RecycleC();
        this.Removed();
        getHOUSING().HousingSpace();
        this.RelocateHousedCreatures();
    }

    override Destroyed(param1: boolean = true): void {
        super.Destroyed(param1);
        const _loc2_: boolean = getMapRoomManager().instance.isInMapRoom3;
        let _loc3_: number = 0;
        while (_loc3_ < this._creatures.length) {
            this._creatures[_loc3_].setHealth(_loc2_ ? this._creatures[_loc3_].health * 0.5 : 0);
            _loc3_++;
        }
        if (!_loc2_) {
            getHOUSING().Cull();
        }
    }

    private Removed(): void {
        this._capacity = 0;
        this._dispatchedMonsters = [];
        getHOUSING().RemoveHouse(this);
    }

    override Setup(param1: any): void {
        param1.t = this._type;
        super.Setup(param1);
        if (this.health > 10 && this.health < this.maxHealth && this.health % 1000 == 0) {
            this.setHealth(this.maxHealth);
        }
        if (this._countdownBuild.Get() == 0) {
            getHOUSING().AddHouse(this);
            getBASE()._buildingsBunkers["b" + this._id] = this;
            getBASE()._buildingsTowers["b" + this._id] = this;
        }
        this.updateLocalProperties();
    }

    public FindTargets(param1: number, param2: number = 1): void {
        this._hasTargets = false;
        if (this._lvl.Get() <= 0 && this.health <= 0) {
            this._targetCreeps = [];
            this._targetFlyers = [];
            return;
        }
        let _loc3_: any[] = getTargeting().getCreepsInRange(getGLOBAL()._buildingProps[127].stats[this._lvl.Get() - 1].range, this._position.add(new Point(0, this._footprint[0].height / 2)), getTargeting().getOldStyleTargets(0));
        this._targetCreeps = this.addTargetCreeps(param1, _loc3_, param2);
        if (this.canTargetAir()) {
            _loc3_ = getTargeting().getCreepsInRange(getGLOBAL()._buildingProps[127].stats[this._lvl.Get() - 1].range, this._position.add(new Point(0, this._footprint[0].height / 2)), getTargeting().getOldStyleTargets(2));
            this._targetFlyers = this.addTargetCreeps(param1, _loc3_, param2);
        } else {
            this._targetFlyers = [];
        }
    }

    private canTargetAir(): boolean {
        let _loc1_: number = 0;
        while (_loc1_ < this._creatures.length) {
            const _loc2_ = this._creatures[_loc1_];
            if (_loc2_._creatureID == "IC5" || _loc2_._creatureID == "IC7") {
                return true;
            }
            _loc1_++;
        }
        return false;
    }

    private addTargetCreeps(param1: number, param2: any[], param3: number): any[] {
        const _loc4_: any[] = [];
        if (param2.length > 0) {
            this.sortCreeps(param2, param3);
            let _loc5_: number = 0;
            while (_loc5_ < param2.length) {
                const _loc6_ = param2[_loc5_];
                const _loc7_ = param2[_loc5_];
                if (_loc5_ <= param1 && _loc7_._behaviour != "retreat") {
                    _loc4_.push({
                        "creep": _loc7_.creep,
                        "dist": _loc6_.dist,
                        "position": _loc6_.pos
                    });
                    this._hasTargets = true;
                }
                _loc5_++;
            }
        }
        return _loc4_;
    }

    private sortCreeps(param1: any[], param2: number): void {
        switch (param2) {
            case 1:
                param1.sort((a: any, b: any) => a.dist - b.dist);
                break;
            case 2:
                param1.sort((a: any, b: any) => b.dist - a.dist);
                break;
            case 3:
                param1.sort((a: any, b: any) => b.hp - a.hp);
                break;
            case 4:
                param1.sort((a: any, b: any) => a.hp - b.hp);
                break;
            default:
                throw new Error("invalid sorting type");
        }
    }

    private getUnusedCreatures(): any[] {
        const _loc1_: any[] = this._creatures.slice();
        const _loc2_: number = _loc1_.length;
        let _loc3_: number = _loc2_ - 1;
        while (_loc3_ >= 0) {
            if (this._dispatchedMonsters.indexOf(_loc1_[_loc3_]) >= 0) {
                _loc1_.splice(_loc3_, 1);
            }
            _loc3_--;
        }
        return _loc1_;
    }

    override TickAttack(): void {
        super.TickAttack();
        if (this.health > 0) {
            this._capacity = this._buildingProps.capacity[this._lvl.Get() - 1];
        }
        let _loc1_: any[] = this.getUnusedCreatures();
        let _loc2_: boolean = false;
        let _loc3_: number = 0;
        while (_loc3_ < this._targetCreeps.length) {
            if (this._targetCreeps[_loc3_].creep.health <= 0) {
                _loc2_ = true;
            }
            _loc3_++;
        }
        _loc3_ = 0;
        while (_loc3_ < this._targetFlyers.length) {
            if (this._targetFlyers[_loc3_].creep.health <= 0) {
                _loc2_ = true;
            }
            _loc3_++;
        }
        if (_loc2_) {
            this._targetCreeps = [];
            this._targetFlyers = [];
            this._hasTargets = false;
        }
        if (this._countdownUpgrade.Get() == 0 && ((!this._hasTargets || _loc2_) && this._frameNumber % 10 == 0 || this._frameNumber % 60 == 0)) {
            this.FindTargets(3);
        }
        ++this._tickNumber;
        if ((this._targetFlyers.length > 0 || this._targetCreeps.length > 0) && this._tickNumber % 30 == 0) {
            this._targetCreeps.sort((a: any, b: any) => a.dist - b.dist);
            this._targetFlyers.sort((a: any, b: any) => a.dist - b.dist);
            if (this._targetFlyers.length > 0) {
                let _loc7_: number = 0;
                while (_loc7_ < this._targetFlyers.length) {
                    const _loc5_ = this._targetFlyers[_loc7_].creep;
                    const _loc6_ = this.getInterceptor(_loc1_, _loc5_);
                    if (_loc6_) {
                        this.dispatchCreature(_loc6_, _loc5_);
                        _loc1_.splice(_loc1_.indexOf(_loc6_), 1);
                    }
                    _loc7_++;
                }
            }
            if (this._targetCreeps.length > 0) {
                const _loc8_: number = _loc1_.length;
                let _loc9_: number = _loc8_ - 1;
                while (_loc9_ >= 0) {
                    const _loc5_ = this._targetCreeps[0].creep;
                    const _loc6_ = _loc1_[_loc3_];
                    this.dispatchCreature(_loc6_, _loc5_);
                    _loc1_.splice(_loc3_, 1);
                    _loc9_--;
                }
            }
        }
    }

    private getInterceptor(param1: any[], param2: any): any {
        let _loc3_: number = 0;
        while (_loc3_ < param1.length) {
            const _loc4_ = param1[_loc3_];
            if (_loc4_._creatureID == "IC7" || _loc4_._creatureID == "IC5") {
                return _loc4_;
            }
            _loc3_++;
        }
        return null;
    }

    private dispatchCreature(param1: any, param2: any): void {
        let _loc3_: number = param2._tmpPoint.x - this._position.x;
        let _loc4_: number = param2._tmpPoint.y - this._position.y;
        const _loc5_: number = this._footprint[0].width;
        const _loc6_: number = this._footprint[0].height;
        if (_loc4_ <= 0) {
            _loc4_ = _loc6_ / 4;
            if (_loc3_ <= 0) {
                _loc3_ = _loc5_ / -3;
            } else {
                _loc3_ = _loc5_ / 2;
            }
        } else {
            _loc4_ = _loc6_ / 2;
            if (_loc3_ <= 0) {
                _loc3_ = _loc5_ / -4;
            } else {
                _loc3_ = _loc5_ / 2;
            }
        }
        const _loc7_: CreepBase = param1;
        if (_loc7_) {
            _loc7_._targetRotation = Math.random() * 360;
            _loc7_.changeModeDefend();
            _loc7_._targetCreep = param2;
            _loc7_._homeBunker = this;
            _loc7_._hasTarget = true;
            if (_loc7_._pathing == "direct") {
                _loc7_.graphic.alpha = 0;
                _loc7_._phase = 1;
            }
            _loc7_.WaypointTo(_loc7_._targetCreep._tmpPoint);
            _loc7_._targetPosition = _loc7_._targetCreep._tmpPoint;
            this._dispatchedMonsters.push(param1);
        }
    }

    override TickFast(param1: Event | null = null): void {
        ++this._frameNumber;
    }

    override modifyHealth(param1: number, param2: ITargetable | null = null): number {
        if (this.health <= 0) {
            getATTACK().Log("b" + this._id, "<font color=\"#990000\">" + getKEYS().Get("attack_log_%damaged", {
                "v1": this._lvl.Get(),
                "v2": getKEYS().Get(this._buildingProps.name),
                "v3": 100 - Math.floor(100 / this.maxHealth * this.health)
            }) + "</font>");
        }
        return super.modifyHealth(param1);
    }

    public Cull(): void {
        getHOUSING().Cull();
    }

    override Over(param1: MouseEvent): void {
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && this._lvl.Get() > 0 && this._countdownBuild.Get() == 0 && this._countdownFortify.Get() == 0 && this._countdownUpgrade.Get() == 0 && this.health > 0) {
            TweenLite.delayedCall(0.25, this.RangeIndicator.bind(this));
        }
    }

    private RangeIndicator(): void {
        const _loc1_: number = 16777215;
        this._radiusGraphic = new Shape();
        this._radiusGraphic.graphics.beginFill(16777215, 0.1);
        this._radiusGraphic.graphics.lineStyle(1, _loc1_, 0.25);
        const _loc2_: Sprite = new Sprite();
        const _loc3_: Point = this._position.add(new Point(0, this._footprint[0].height * 0.25));
        const _loc4_: Point = new Point(this._range * 2.8, this._range * 1.2);
        this._radiusGraphic.graphics.drawEllipse(0, 0, _loc4_.x, _loc4_.y);
        this._radiusGraphic.x = -(_loc4_.x * 0.5);
        this._radiusGraphic.y = -(_loc4_.y * 0.5);
        _loc2_.addChild(this._radiusGraphic);
        _loc2_.x = _loc3_.x;
        _loc2_.y = _loc3_.y;
        getMAP()._BUILDINGFOOTPRINTS.addChild(_loc2_);
        TweenLite.from(_loc2_, 0.25, {
            "alpha": 0.5,
            "scaleX": 0.25,
            "scaleY": 0,
            "delay": 0,
            "ease": Expo.easeOut
        });
        TweenLite.killDelayedCallsTo(this.RangeIndicator.bind(this));
    }

    override Out(param1: MouseEvent): void {
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && Boolean(this._radiusGraphic)) {
            if (this._radiusGraphic.parent) {
                this._radiusGraphic.parent.removeChild(this._radiusGraphic);
            }
            this._radiusGraphic = null!;
        }
        TweenLite.killDelayedCallsTo(this.RangeIndicator.bind(this));
    }

    public RemoveCreature(param1: string): void {
        if (!getMapRoomManager().instance.isInMapRoom3 || !getBASE().isMainYardOrInfernoMainYard) {
            --this._monsters[param1];
            if (this._monsters[param1] < 0) {
                this._monsters[param1] = 0;
            }
            if (getGLOBAL().player.monsterListByID(param1).numCreeps > 0) {
                getGLOBAL().player.monsterListByID(param1).add(-1);
            }
        }
        --this._monstersDispatched[param1];
        if (this._monstersDispatched[param1] < 0) {
            this._monstersDispatched[param1] = 0;
        }
        --this._monstersDispatchedTotal;
        if (this._monstersDispatchedTotal < 0) {
            this._monstersDispatchedTotal = 0;
        }
        getHOUSING().HousingSpace();
        getBASE().Save();
    }

    public GetTarget(param1: number = 0): any {
        let _loc2_: number = 0;
        if (this._hasTargets) {
            if (param1 > 0 && this._targetFlyers.length > 0) {
                _loc2_ = Math.floor(Math.random() * this._targetFlyers.length);
                if (_loc2_ > this._targetFlyers.length) {
                    _loc2_ = 2;
                }
                return this._targetFlyers[_loc2_].creep;
            }
            if (this._targetCreeps.length > 0) {
                _loc2_ = Math.floor(Math.random() * this._targetCreeps.length);
                if (_loc2_ > this._targetCreeps.length) {
                    _loc2_ = 2;
                }
                return this._targetCreeps[_loc2_].creep;
            }
            return null;
        }
        return null;
    }
}
