import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { SecNum } from './com/cc/utils/SecNum';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { BFOUNDATION } from './BFOUNDATION';
import { CHAMPIONCHAMBERPOPUP } from './CHAMPIONCHAMBERPOPUP';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { BASE } from './BASE';
import { MAP } from './MAP';
import { GRID } from './GRID';
import { SOUNDS } from './SOUNDS';
import { POPUPS } from './POPUPS';
import { LOGGER } from './LOGGER';
import { popup_monster } from './popup_monster';
import { JSON as JSONUtil } from './JSON';

/**
 * CHAMPIONCHAMBER - Champion chamber building for freezing/thawing champions
 * Converted from ActionScript to TypeScript
 */
export class CHAMPIONCHAMBER extends BFOUNDATION {
    public static readonly TYPE: number = 119;
    public static _open: boolean = false;
    public static _popup: CHAMPIONCHAMBERPOPUP | null = null;

    public _frozen: any[] = [];

    constructor() {
        super();
        this._frozen = [];
        this._type = 119;
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this.SetProps();
    }

    public static HasFrozen(param1: number): boolean {
        let _loc2_: CHAMPIONCHAMBER;
        let _loc3_: number = 0;
        if (GLOBAL._bChamber) {
            _loc2_ = GLOBAL._bChamber as CHAMPIONCHAMBER;
            _loc3_ = 0;
            while (_loc3_ < _loc2_._frozen.length) {
                if (_loc2_._frozen[_loc3_].t == param1) {
                    return true;
                }
                _loc3_++;
            }
        }
        return false;
    }

    public static Show(): void {
        let _loc2_: number = 0;
        const _loc1_: CHAMPIONCHAMBER = GLOBAL._bChamber as CHAMPIONCHAMBER;
        if (CREATURES._guardian == null && (_loc1_ && _loc1_._frozen.length == 0)) {
            GLOBAL.Message(KEYS.Get("msg_chamber_nochamp"));
            return;
        }
        let _loc3_: number = 0;
        while (_loc3_ < BASE._guardianData.length) {
            _loc2_ = BASE._guardianData[_loc3_].status ? Number(BASE._guardianData[_loc3_].status) : ChampionBase.k_CHAMPION_STATUS_NORMAL;
            if (BASE._guardianData[_loc3_] && _loc2_ == ChampionBase.k_CHAMPION_STATUS_NORMAL && CREATURES._guardian == null) {
                GLOBAL._bCage.SpawnGuardian(BASE._guardianData[_loc3_].l.Get(), BASE._guardianData[_loc3_].fd, BASE._guardianData[_loc3_].ft, BASE._guardianData[_loc3_].t, BASE._guardianData[_loc3_].hp.Get(), BASE._guardianData[_loc3_].nm, BASE._guardianData[_loc3_].fb.Get(), BASE._guardianData[_loc3_].pl.Get());
            }
            _loc3_++;
        }
        if (!CHAMPIONCHAMBER._open) {
            CHAMPIONCHAMBER._open = true;
            GLOBAL.BlockerAdd();
            CHAMPIONCHAMBER._popup = GLOBAL._layerWindows.addChild(new CHAMPIONCHAMBERPOPUP()) as CHAMPIONCHAMBERPOPUP;
            CHAMPIONCHAMBER._popup.Center();
            CHAMPIONCHAMBER._popup.ScaleUp();
        }
    }

    public static Hide(): void {
        if (CHAMPIONCHAMBER._open) {
            GLOBAL.BlockerRemove();
            SOUNDS.Play("close");
            BASE.BuildingDeselect();
            CHAMPIONCHAMBER._open = false;
            if (CHAMPIONCHAMBER._popup) {
                GLOBAL._layerWindows.removeChild(CHAMPIONCHAMBER._popup);
                CHAMPIONCHAMBER._popup = null;
            }
        }
    }

    public override PlaceB(): void {
        super.PlaceB();
        GLOBAL._bChamber = this;
    }

    public override Constructed(): void {
        super.Constructed();
        GLOBAL._bChamber = this;
    }

    public override Recycle(): void {
        if (this._frozen && this._frozen.length > 0) {
            GLOBAL.Message(KEYS.Get("bdg_chamber_recycle"));
        } else {
            GLOBAL._bChamber = null;
            super.Recycle();
        }
    }

    public FreezeGuardian(): void {
        let _loc1_: number = 0;
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        if (CREATURES._guardian) {
            if (CREATURES._guardian.health < CREATURES._guardian.maxHealth) {
                GLOBAL.Message(KEYS.Get("bdg_chamber_injured"));
                return;
            }
            if (CREATURES._guardian._feedTime.Get() < GLOBAL.Timestamp()) {
                GLOBAL.Message(KEYS.Get("bdg_chamber_hungry"));
                return;
            }
            _loc1_ = 0;
            _loc2_ = 0;
            while (_loc2_ < BASE._guardianData.length) {
                if (BASE._guardianData[_loc2_].t == CREATURES._guardian._type) {
                    _loc1_ = _loc2_;
                    break;
                }
                _loc2_++;
            }
            LOGGER.Stat([69, BASE._guardianData[_loc1_].t, BASE._guardianData[_loc1_].l.Get()]);
            BASE._guardianData[_loc1_].ft -= GLOBAL.Timestamp();
            CREATURES._guardian.export();
            CREATURES._guardian.changeModeFreeze();
            this._frozen.push(BASE._guardianData[_loc1_]);
            BASE._guardianData[_loc1_].status = ChampionBase.k_CHAMPION_STATUS_FROZEN;
            BASE._guardianData[_loc1_].log += "," + ChampionBase.k_CHAMPION_STATUS_FROZEN.toString();
            if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
                _loc3_ = GLOBAL.getPlayerGuardianIndex(CREATURES._guardian._type);
                if (_loc3_ != -1 && GLOBAL._playerGuardianData[_loc3_] != BASE._guardianData[_loc1_]) {
                    GLOBAL._playerGuardianData[_loc3_].status = ChampionBase.k_CHAMPION_STATUS_FROZEN;
                    GLOBAL._playerGuardianData[_loc3_].log += "," + ChampionBase.k_CHAMPION_STATUS_FROZEN.toString();
                    GLOBAL._playerGuardianData[_loc3_].ft -= GLOBAL.Timestamp();
                }
            }
            CREATURES._guardian = null;
            BASE.Save();
        }
    }

    public ThawGuardian(param1: number): void {
        let i: number;
        let p: Point;
        let level: number = 0;
        let target: Point;
        let newFrozen: any[];
        let j: number = 0;
        let spawnClass: any;
        let obj: any;
        let mc: popup_monster;
        const type: number = param1;
        
        if (this.health < this.maxHealth) {
            GLOBAL.Message(KEYS.Get("bdg_chamber_damaged"));
            return;
        }
        if (CREATURES._guardian) {
            GLOBAL.Message(KEYS.Get("bdg_chamber_freeze"));
            return;
        }
        
        i = 0;
        while (i < this._frozen.length) {
            if (this._frozen[i].t == type) {
                p = new Point(this.x, this.y + 80);
                level = Number(this._frozen[i].l.Get());
                target = GRID.FromISO(GLOBAL._bCage.x, GLOBAL._bCage.y + 20);
                newFrozen = [];
                j = 0;
                while (j < this._frozen.length) {
                    if (i != j) {
                        newFrozen.push(this._frozen[j]);
                    }
                    j++;
                }
                spawnClass = CHAMPIONCAGE.getGuardianSpawnClass(type);
                CREATURES._guardian = new spawnClass("cage", p, 0, target, true, this, this._frozen[i].l.Get(), this._frozen[i].fd, this._frozen[i].ft + GLOBAL.Timestamp(), this._frozen[i].t, this._frozen[i].hp.Get(), this._frozen[i].fb.Get(), this._frozen[i].pl.Get());
                for (obj of BASE._guardianData) {
                    if (obj.t == type) {
                        obj.status = ChampionBase.k_CHAMPION_STATUS_NORMAL;
                        obj.log += "," + ChampionBase.k_CHAMPION_STATUS_NORMAL.toString();
                        break;
                    }
                }
                for (obj of GLOBAL._playerGuardianData) {
                    if (obj.t == type) {
                        obj.status = ChampionBase.k_CHAMPION_STATUS_NORMAL;
                        obj.log += "," + ChampionBase.k_CHAMPION_STATUS_NORMAL.toString();
                        break;
                    }
                }
                CREATURES._guardian.export();
                CREATURES._guardian.changeModeCage();
                if (!BYMConfig.instance.RENDERER_ON) {
                    MAP._BUILDINGTOPS.addChild(CREATURES._guardian.graphic);
                }
                this._frozen = newFrozen;
                if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
                    const StreamPost = (st: string, sd: string, im: string): (param1: MouseEvent | null) => void => {
                        return (param1: MouseEvent | null = null): void => {
                            GLOBAL.CallJS("sendFeed", ["unlock-end", st, sd, im, 0]);
                            POPUPS.Next();
                        };
                    };
                    mc = new popup_monster();
                    mc.bSpeedup.SetupKey("btn_warnyourfriends");
                    mc.bSpeedup.addEventListener(MouseEvent.CLICK, StreamPost(KEYS.Get("chamber_thawstreamtitle", {"v1": CHAMPIONCAGE._guardians["G" + type].name}), KEYS.Get("chamber_thawstreamdesc", {"v1": CHAMPIONCAGE._guardians["G" + type].name}), "G" + type + "_L6-90.png"));
                    mc.bSpeedup.Highlight = true;
                    mc.bAction.visible = false;
                    mc.tText.htmlText = KEYS.Get("chamber_thawstreamdesc", {"v1": CHAMPIONCAGE._guardians["G" + type].name});
                    POPUPS.Push(mc, null, null, null, "G" + type + "_L" + level + "-150.png");
                }
                LOGGER.Stat([70, CREATURES._guardian._type, CREATURES._guardian._level.Get()]);
                BASE.Save();
                break;
            }
            i++;
        }
    }

    public override Setup(param1: any): void {
        let _loc2_: any;
        let _loc3_: any[];
        let _loc4_: Map<number, boolean>;
        let _loc5_: any;
        let _loc6_: any;
        let _loc7_: number = 0;
        let _loc8_: number = 0;
        super.Setup(param1);
        if (param1.fz) {
            _loc3_ = JSONUtil.decode(param1.fz) as any[];
            this._frozen = [];
            _loc4_ = new Map<number, boolean>();
            _loc5_ = null;
            _loc8_ = 0;
            while (_loc8_ < _loc3_.length) {
                _loc6_ = _loc3_[_loc8_];
                for (_loc2_ of BASE._guardianData) {
                    if (_loc2_.t == _loc6_.t) {
                        _loc5_ = _loc2_;
                        break;
                    }
                }
                if (_loc5_ == null) {
                    _loc5_ = {};
                    if (_loc6_.nm) {
                        _loc5_.nm = _loc6_.nm;
                    }
                    _loc5_.t = _loc6_.t;
                    if (_loc6_.ft) {
                        _loc5_.ft = _loc6_.ft;
                    }
                    if (_loc6_.fd) {
                        _loc5_.fd = _loc6_.fd;
                    } else {
                        _loc5_.fd = 0;
                    }
                    if (_loc6_.l) {
                        _loc5_.l = new SecNum(_loc6_.l);
                    } else {
                        _loc5_.l = new SecNum(0);
                    }
                    if (_loc6_.hp) {
                        _loc5_.hp = new SecNum(_loc6_.hp);
                    } else {
                        _loc5_.hp = new SecNum(0);
                    }
                    if (_loc6_.fb) {
                        _loc5_.fb = new SecNum(_loc6_.fb);
                    } else {
                        _loc5_.fb = new SecNum(0);
                    }
                    if (_loc6_.pl) {
                        _loc5_.pl = new SecNum(_loc6_.pl);
                    } else {
                        _loc5_.pl = new SecNum(0);
                    }
                    _loc5_.status = ChampionBase.k_CHAMPION_STATUS_FROZEN;
                    _loc5_.log = ChampionBase.k_CHAMPION_STATUS_FROZEN.toString();
                    BASE._guardianData.push(_loc5_);
                    if (GLOBAL.getPlayerGuardianIndex(_loc5_.t) == -1) {
                        GLOBAL._playerGuardianData.push(_loc5_);
                    }
                }
                _loc4_.set(_loc5_.t, true);
                if (_loc5_.status == ChampionBase.k_CHAMPION_STATUS_FROZEN) {
                    this._frozen.push(_loc5_);
                }
                _loc5_ = null;
                _loc8_++;
            }
            for (_loc2_ of BASE._guardianData) {
                if (_loc2_.status == ChampionBase.k_CHAMPION_STATUS_FROZEN && !_loc4_.get(_loc2_.t)) {
                    this._frozen.push(_loc2_);
                }
            }
        } else {
            for (_loc2_ of BASE._guardianData) {
                if (_loc2_.status == ChampionBase.k_CHAMPION_STATUS_FROZEN) {
                    this._frozen.push(_loc2_);
                }
            }
        }
    }

    public override Export(): any {
        let _loc4_: any;
        let _loc6_: any;
        const _loc1_: any = super.Export();
        let _loc2_: boolean = false;
        const _loc3_: any[] = [];
        let _loc5_: number = 0;
        while (_loc5_ < this._frozen.length) {
            for (_loc4_ of BASE._guardianData) {
                if (_loc4_.t == this._frozen[_loc5_].t) {
                    _loc2_ = true;
                    break;
                }
            }
            if (!_loc2_) {
                _loc4_ = null;
            }
            _loc6_ = {};
            if (this._frozen[_loc5_].nm) {
                _loc6_.nm = this._frozen[_loc5_].nm;
            }
            if (this._frozen[_loc5_].t) {
                _loc6_.t = this._frozen[_loc5_].t;
            }
            if (this._frozen[_loc5_].hp) {
                _loc6_.hp = this._frozen[_loc5_].hp.Get();
            } else {
                _loc6_.hp = 0;
            }
            if (this._frozen[_loc5_].l) {
                _loc6_.l = this._frozen[_loc5_].l.Get();
            }
            if (this._frozen[_loc5_].ft) {
                _loc6_.ft = this._frozen[_loc5_].ft;
            }
            if (this._frozen[_loc5_].fd) {
                _loc6_.fd = this._frozen[_loc5_].fd;
            } else {
                _loc6_.fd = 0;
            }
            if (this._frozen[_loc5_].fb) {
                _loc6_.fb = this._frozen[_loc5_].fb.Get();
            } else {
                _loc6_.fb = 0;
            }
            if (this._frozen[_loc5_].pl) {
                if (this._frozen[_loc5_].pl instanceof SecNum) {
                    _loc6_.pl = this._frozen[_loc5_].pl.Get();
                } else {
                    _loc6_.pl = this._frozen[_loc5_].pl;
                }
            } else {
                _loc6_.pl = 0;
            }
            _loc6_.status = _loc4_ ? ChampionBase.k_CHAMPION_STATUS_MIGRATED : ChampionBase.k_CHAMPION_STATUS_FROZEN;
            _loc6_.log = _loc4_ ? _loc4_.log : ChampionBase.k_CHAMPION_STATUS_FROZEN.toString();
            _loc3_.push(_loc6_);
            _loc5_++;
        }
        _loc1_.fz = JSONUtil.encode(_loc3_);
        return _loc1_;
    }
}
