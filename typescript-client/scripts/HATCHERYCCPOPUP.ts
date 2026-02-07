import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";

import { ImageCache } from "./com/monsters/display/ImageCache";
import { ScrollSet } from "./com/monsters/display/ScrollSet";
import { SubscriptionHandler } from "./com/monsters/subscriptions/SubscriptionHandler";
import { TweenLite } from "./gs/TweenLite";
import { Circ } from "./gs/easing/Circ";

import { HATCHERYCC } from "./HATCHERYCC";
import { HATCHERYCCPOPUP_CLIP } from "./HATCHERYCCPOPUP_CLIP";
import { HatcheryCCMonsterIcon_CLIP } from "./HatcheryCCMonsterIcon_CLIP";
import { POPUPSETTINGS } from "./POPUPSETTINGS";
import { frame } from "./frame";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBRESOURCE(): any { return require("./BRESOURCE").BRESOURCE; }
function getBUILDING13(): any { return require("./BUILDING13").BUILDING13; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getResourcePackages(): any { return require("./ResourcePackages").ResourcePackages; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSTORE(): any { return require("./STORE").STORE; }


export class HATCHERYCCPOPUP extends HATCHERYCCPOPUP_CLIP {
    private _tick: number = 0;
    private _monsterID: string = "";
    private _monsterIndex: number = 0;
    private _scrollSet: ScrollSet;
    private _scrollSetContainer: Sprite;
    public _monsterSlots: any[];
    public _guidePage: number = 1;

    constructor() {
        super();
        
        let _loc1_: string = null;
        let _loc5_: number = 0;
        let _loc7_: any[] = null;
        let _loc9_: number = 0;
        let _loc10_: MovieClip = null;
        let _loc11_: MovieClip = null;
        let _loc12_: MovieClip = null;
        
        this.setupSubscriptions(HATCHERYCC.queueLimit > HATCHERYCC.DEFAULT_QUEUE_LIMIT);
        
        (this.bSpeedup as any).tName.htmlText = "<b>" + getKEYS().Get("btn_speedup") + "</b>";
        this.bSpeedup.mouseChildren = false;
        
        if (!getBASE().isInfernoMainYardOrOutpost) {
            this.bSpeedup.addEventListener(MouseEvent.CLICK, getSTORE().Show(3, 2, ["HOD", "HOD2", "HOD3"]));
        } else {
            this.bSpeedup.addEventListener(MouseEvent.CLICK, getSTORE().Show(3, 2, ["HODI", "HOD2I", "HOD3I"]));
        }
        this.bSpeedup.buttonMode = true;
        
        (this.bFinish as any).tName.htmlText = "<b>" + getKEYS().Get("str_finishnow") + "</b>";
        this.bFinish.mouseChildren = false;
        this.bFinish.addEventListener(MouseEvent.CLICK, this.FinishNow.bind(this));
        this.bFinish.buttonMode = true;
        
        (this.bTopup as any).tName.htmlText = "<b>" + getKEYS().Get("btn_topup2") + "</b>";
        this.bTopup.mouseChildren = false;
        
        if (!getBASE().isInfernoMainYardOrOutpost) {
            this.bTopup.addEventListener(MouseEvent.CLICK, getSTORE().Show(2, 4, ["BR41", "BR42", "BR43"]));
        } else {
            this.bTopup.addEventListener(MouseEvent.CLICK, getSTORE().Show(2, 4, ["BR41I", "BR42I", "BR43I"]));
        }
        this.bTopup.buttonMode = true;
        
        this._scrollSet = new ScrollSet();
        this._scrollSet.x = this.scroller.x;
        this._scrollSet.y = this.scroller.y;
        this._scrollSet.width = this.scroller.width;
        this._scrollSet.Init(this.monsterCanvas, this.monsterMask, ScrollSet.BROWN, this.monsterMask.y, this.monsterMask.height, 20, 10);
        this._scrollSet.AutoHideEnabled = false;
        this._scrollSet.isHiddenWhileUnnecessary = true;
        
        this._scrollSetContainer = new Sprite();
        this._scrollSetContainer.addChild(this._scrollSet);
        this.addChild(this._scrollSetContainer);
        this.scroller.visible = false;
        
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        const _loc4_: Point = new Point(10, 14);
        _loc5_ = 5;
        const _loc6_: number = 5;
        this._monsterSlots = [];
        
        _loc7_ = getCREATURELOCKER().GetSortedCreatures(true);
        let _loc8_: number = !getBASE().isInfernoMainYardOrOutpost ? getCREATURELOCKER().maxCreatures("above") : getCREATURELOCKER().maxCreatures("inferno");
        
        if (!getBASE().isInfernoMainYardOrOutpost && HATCHERYCC.doesShowInfernoCreeps) {
            _loc8_ = getCREATURELOCKER().maxCreatures();
        }
        
        _loc9_ = 0;
        while (_loc9_ < _loc7_.length) {
            _loc1_ = String(_loc7_[_loc9_].id);
            
            if (getCREATURELOCKER()._creatures && getCREATURELOCKER()._creatures[_loc1_] && getCREATURELOCKER()._creatures[_loc1_].blocked == true) {
                _loc3_++;
            } else {
                _loc10_ = new HatcheryCCMonsterIcon_CLIP();
                (_loc10_ as any).id = _loc1_;
                _loc10_.x = _loc4_.x + _loc2_ % _loc5_ * ((_loc10_ as any).mcMonster.width + _loc6_);
                _loc10_.y = _loc4_.y + Math.floor(_loc2_ / _loc5_) * ((_loc10_ as any).mcMonster.height + _loc6_);
                
                _loc11_ = (_loc10_ as any).mcMonster;
                _loc11_.addEventListener(MouseEvent.MOUSE_OVER, this.MonsterInfo(_loc7_[_loc9_].id) as (arg0: unknown) => void);
                this.monsterCanvas.addChild(_loc10_);
                this._monsterSlots.push(_loc10_);
                
                _loc11_.addEventListener(MouseEvent.MOUSE_OVER, this.MonsterInfo(_loc7_[_loc9_].id) as (arg0: unknown) => void);
                _loc11_.addEventListener(MouseEvent.MOUSE_DOWN, this.QueueAdd(_loc7_[_loc9_].id) as (arg0: unknown) => void);
                _loc11_.buttonMode = true;
                
                ImageCache.GetImageWithCallBack("monsters/" + _loc1_ + "-medium.jpg", this.MonsterIconLoaded.bind(this), true, 1, "", [_loc11_]);
                
                _loc12_ = (_loc10_ as any).mcLevel;
                if (getGLOBAL().player.m_upgrades[_loc1_] && getGLOBAL().player.m_upgrades[_loc1_].level > 1) {
                    _loc12_.visible = true;
                    (_loc12_ as any).tLevel.htmlText = "<b>" + getGLOBAL().player.m_upgrades[_loc1_].level + "</b>";
                } else {
                    _loc12_.visible = false;
                }
                
                if (!(getCREATURELOCKER()._lockerData[_loc1_] && getCREATURELOCKER()._lockerData[_loc1_].t == 2)) {
                    _loc11_.alpha = 0.75;
                    _loc12_.visible = false;
                }
                _loc2_++;
            }
            _loc9_++;
        }
        
        _loc9_ = 1;
        while (_loc9_ <= 5) {
            (this as any)["hatchery" + _loc9_].gotoAndStop("idle");
            (this as any)["hatcheryRemove" + _loc9_].visible = false;
            (this as any)["hatchery" + _loc9_].addEventListener(MouseEvent.MOUSE_OVER, this.ShowRemove((this as any)["hatcheryRemove" + _loc9_]));
            (this as any)["hatchery" + _loc9_].addEventListener(MouseEvent.MOUSE_OUT, this.HideRemove((this as any)["hatcheryRemove" + _loc9_]));
            (this as any)["hatchery" + _loc9_].addEventListener(MouseEvent.MOUSE_DOWN, this.StopProduction(_loc9_));
            (this as any)["hatchery" + _loc9_].buttonMode = true;
            _loc9_++;
        }
        
        this.title_txt.htmlText = getKEYS().Get("hcc_title");
        (this.mcMonsterInfo as any).speed_txt.htmlText = "<b>" + getKEYS().Get("mon_att_speed") + "</b>";
        (this.mcMonsterInfo as any).health_txt.htmlText = "<b>" + getKEYS().Get("mon_att_health") + "</b>";
        (this.mcMonsterInfo as any).damage_txt.htmlText = "<b>" + getKEYS().Get("mon_att_damage") + "</b>";
        (this.mcMonsterInfo as any).goo_txt.htmlText = "<b>" + getKEYS().Get("mon_att_cost", { "v1": getKEYS().Get(getBRESOURCE().GetResourceNameKey(3)) }) + "</b>";
        (this.mcMonsterInfo as any).housing_txt.htmlText = "<b>" + getKEYS().Get("mon_att_housing") + "</b>";
        (this.mcMonsterInfo as any).time_txt.htmlText = "<b>" + getKEYS().Get("mon_att_time") + "</b>";
        
        this.hatlabel1_txt.htmlText = "<b>" + getKEYS().Get("hcc_hatcherynum", { "v1": 1 }) + "</b>";
        this.hatlabel2_txt.htmlText = "<b>" + getKEYS().Get("hcc_hatcherynum", { "v1": 2 }) + "</b>";
        this.hatlabel3_txt.htmlText = "<b>" + getKEYS().Get("hcc_hatcherynum", { "v1": 3 }) + "</b>";
        this.hatlabel4_txt.htmlText = "<b>" + getKEYS().Get("hcc_hatcherynum", { "v1": 4 }) + "</b>";
        this.hatlabel5_txt.htmlText = "<b>" + getKEYS().Get("hcc_hatcherynum", { "v1": 5 }) + "</b>";
        
        this.tHousingLabel.htmlText = "<b>" + getKEYS().Get("hcc_housingspace") + "</b>";
        this.tGooLabel.htmlText = "<b>" + getKEYS().Get("hcc_goousage") + "</b>";
        
        this.addEventListener(MouseEvent.MOUSE_UP, this.ClearEvents.bind(this));
        (this.mcFrame as frame).Setup(true, null);
    }

    protected setupSubscriptions(param1: boolean): void {
        if (param1) {
            this.gotoAndStop("v1");
            this.mcSlotsGoldFrame.visible = true;
            this.mcSlotsGoldFrame.mouseEnabled = false;
            
            if (HATCHERYCC.doesShowInfernoCreeps) {
                this.gotoAndStop("v2");
                this.tMagmaLabel.htmlText = "<b>" + getKEYS().Get("hcc_magmausage") + "</b>";
                (this.bTopupMagma as any).tName.htmlText = "<b>" + getKEYS().Get("btn_topup2") + "</b>";
                this.bTopupMagma.buttonMode = true;
                this.bTopupMagma.gotoAndStop(1);
                this.bTopupMagma.addEventListener(MouseEvent.CLICK, getSTORE().Show(2, 4, ["BR41I", "BR42I", "BR43I"]));
            }
        } else {
            this.gotoAndStop("v1");
            this.mcSlotsGoldFrame.visible = false;
        }
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        const _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        (this as any)[param3[0] + param3[1]].mcImage.addChild(_loc4_);
        (this as any)[param3[0] + param3[1]].mcImage.visible = true;
        (this as any)[param3[0] + param3[1]].mcLoading.visible = false;
    }

    public MonsterIconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        const _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        param3[0].mcImage.addChild(_loc4_);
        param3[0].mcImage.visible = true;
        param3[0].mcLoading.visible = false;
    }

    public MonsterInfo(param1: string): Function {
        const n: string = param1;
        return (param1: MouseEvent = null): void => {
            this.MonsterInfoB(n);
        };
    }

    public MonsterInfoB(creatureID: string): void {
        let currentCreature: string = null;
        let damageShown: number = 0;
        const creature: any = getCREATURELOCKER()._creatures[creatureID];
        let speed: number = 0;
        let health: number = 0;
        let damage: number = 0;
        let cTime: number = 0;
        let cResource: number = 0;
        let cStorage: number = 0;
        
        for (currentCreature in getCREATURELOCKER()._creatures) {
            if (getCREATURES().GetProperty(currentCreature, "speed") > speed) {
                speed = getCREATURES().GetProperty(currentCreature, "speed");
            }
            if (getCREATURES().GetProperty(currentCreature, "health") > health) {
                health = getCREATURES().GetProperty(currentCreature, "health");
            }
            if (getCREATURES().GetProperty(currentCreature, "damage") > damage) {
                damage = getCREATURES().GetProperty(currentCreature, "damage");
            }
            if (getCREATURES().GetProperty(currentCreature, "cTime") > cTime) {
                cTime = getCREATURES().GetProperty(currentCreature, "cTime");
            }
            if (getCREATURES().GetProperty(currentCreature, "cResource") > cResource) {
                cResource = getCREATURES().GetProperty(currentCreature, "cResource");
            }
            if (getCREATURES().GetProperty(currentCreature, "cStorage") > cStorage) {
                cStorage = getCREATURES().GetProperty(currentCreature, "cStorage");
            }
        }
        
        damageShown = getCREATURES().GetProperty(creatureID, "damage");
        
        TweenLite.to((this.mcMonsterInfo as any).bSpeed.mcBar, 0.4, {
            "width": 100 / speed * getCREATURES().GetProperty(creatureID, "speed"),
            "ease": Circ.easeInOut,
            "delay": 0
        });
        TweenLite.to((this.mcMonsterInfo as any).bHealth.mcBar, 0.4, {
            "width": 100 / health * getCREATURES().GetProperty(creatureID, "health"),
            "ease": Circ.easeInOut,
            "delay": 0.05
        });
        TweenLite.to((this.mcMonsterInfo as any).bDamage.mcBar, 0.4, {
            "width": 100 / damage * Math.abs(damageShown),
            "ease": Circ.easeInOut,
            "delay": 0.1
        });
        TweenLite.to((this.mcMonsterInfo as any).bResource.mcBar, 0.4, {
            "width": 100 / cResource * getCREATURES().GetProperty(creatureID, "cResource"),
            "ease": Circ.easeInOut,
            "delay": 0.15
        });
        TweenLite.to((this.mcMonsterInfo as any).bStorage.mcBar, 0.4, {
            "width": 100 / cStorage * getCREATURES().GetProperty(creatureID, "cStorage"),
            "ease": Circ.easeInOut,
            "delay": 0.2
        });
        TweenLite.to((this.mcMonsterInfo as any).bTime.mcBar, 0.4, {
            "width": 100 / cTime * getCREATURES().GetProperty(creatureID, "cTime"),
            "ease": Circ.easeInOut,
            "delay": 0.25
        });
        
        (this.mcMonsterInfo as any).tSpeed.htmlText = getKEYS().Get("mon_statsspeed", { "v1": getCREATURES().GetProperty(creatureID, "speed") });
        (this.mcMonsterInfo as any).tHealth.htmlText = getGLOBAL().FormatNumber(getCREATURES().GetProperty(creatureID, "health"));
        
        if (damageShown > 0) {
            (this.mcMonsterInfo as any).tDamage.htmlText = String(damageShown);
        } else {
            (this.mcMonsterInfo as any).tDamage.htmlText = -damageShown + " (" + getKEYS().Get("str_heal") + ")";
        }
        
        const v2: string = (creature.id.charAt(0) == "I")
            ? getKEYS().Get(getBRESOURCE().GetResourceNameKey(7))
            : getKEYS().Get(getBRESOURCE().GetResourceNameKey(3));
        
        (this.mcMonsterInfo as any).tResource.htmlText = getKEYS().Get("mon_att_costvalue", {
            "v1": getGLOBAL().FormatNumber(getCREATURES().GetProperty(creatureID, "cResource")),
            "v2": v2
        });
        (this.mcMonsterInfo as any).tStorage.htmlText = getKEYS().Get("mon_att_housingvalue", { "v1": getCREATURES().GetProperty(creatureID, "cStorage") });
        (this.mcMonsterInfo as any).tTime.htmlText = getGLOBAL().ToTime(getCREATURES().GetProperty(creatureID, "cTime"), true);
        
        let level: number = 1;
        if (getGLOBAL().player.m_upgrades[creatureID] && getGLOBAL().player.m_upgrades[creatureID].level > 1) {
            level = Number(getGLOBAL().player.m_upgrades[creatureID].level);
        }
        
        (this.mcMonsterInfo as any).tDescription.htmlText = "<b>" + getKEYS().Get("hatcherypopup_level", { "v1": level }) + " " + getKEYS().Get(creature.name) + "</b><br>" + getKEYS().Get(creature.description);
        
        if (getCREATURELOCKER()._lockerData[creatureID] && getCREATURELOCKER()._lockerData[creatureID].t == 2) {
            (this.mcMonsterInfo as any).mcLocked.visible = false;
        } else {
            (this.mcMonsterInfo as any).mcLocked.tText.htmlText = "<b>" + getKEYS().Get("hat_unlockinlocker", { "v1": getKEYS().Get(getCREATURELOCKER()._creatures[creatureID].name) }) + "</b>";
            (this.mcMonsterInfo as any).mcLocked.visible = true;
        }
        
        this.MonsterInfoShow();
    }

    public MonsterInfoShow(): void {
        this.mcMonsterInfo.visible = true;
    }

    public MonsterInfoHide(param1: MouseEvent = null): void {
        this.mcMonsterInfo.visible = false;
    }

    public QueueAdd(param1: string): Function {
        const targetID: string = param1;
        return (param1: MouseEvent = null): void => {
            if (!SubscriptionHandler.instance.isSubscriptionActive && SubscriptionHandler.isEnabledForAll && getBASE().isInfernoCreep(targetID)) {
                SubscriptionHandler.instance.showPromoPopup();
                return;
            }
            this._tick = 0;
            this._monsterID = targetID;
            this.QueueAddTick();
            this.addEventListener(Event.ENTER_FRAME, this.QueueAddTick.bind(this));
        };
    }

    private QueueAddTick(param1: Event = null): void {
        let _loc4_: any[] = null;
        this._tick += 1;
        
        if (this._tick < HATCHERYCC.queueLimit && this._tick != 1) {
            return;
        }
        
        const _loc2_: string = this._monsterID;
        const _loc3_: number = 7;
        
        if (!getBASE().Charge(4, getCREATURES().GetProperty(_loc2_, "cResource"), true, getBASE().isInfernoCreep(_loc2_))) {
            return;
        }
        
        if (getCREATURELOCKER()._lockerData[_loc2_] && getCREATURELOCKER()._lockerData[_loc2_].t == 2) {
            _loc4_ = getGLOBAL()._bHatcheryCC._monsterQueue;
            
            if (_loc4_.length > 0 && _loc4_[_loc4_.length - 1][0] == _loc2_) {
                if (_loc4_[_loc4_.length - 1][1] < HATCHERYCC.queueLimit) {
                    ++_loc4_[_loc4_.length - 1][1];
                    this.Charge(_loc2_);
                } else if (_loc4_.length < _loc3_) {
                    _loc4_.push([_loc2_, 1]);
                    this.Charge(_loc2_);
                } else {
                    getSOUNDS().Play("error1");
                }
            } else if (_loc4_.length < _loc3_) {
                _loc4_.push([_loc2_, 1]);
                this.Charge(_loc2_);
            } else {
                getSOUNDS().Play("error1");
            }
            
            this.Update();
            getGLOBAL()._bHatcheryCC.Tick(1);
        }
    }

    private FinishNow(param1: MouseEvent): void {
        let _loc2_: any[] = null;
        let _loc3_: string = null;
        let _loc4_: any = null;
        let _loc5_: string = null;
        
        if (!(this.bFinish as any).Enabled) {
            return;
        }
        
        if (getGLOBAL()._bHatcheryCC && getGLOBAL()._bHatcheryCC._finishCost.Get() > 0) {
            if (getBASE()._credits.Get() >= getGLOBAL()._bHatcheryCC._finishCost.Get()) {
                _loc2_ = [];
                _loc4_ = getGLOBAL()._bHatcheryCC._finishQueue;
                
                for (_loc5_ in _loc4_) {
                    if (_loc4_[_loc5_] > 0) {
                        _loc3_ = getKEYS().Get(getCREATURELOCKER()._creatures[_loc5_].name);
                        _loc2_.push([_loc4_[_loc5_], _loc3_]);
                    }
                }
                
                getGLOBAL().Array2String(_loc2_);
                
                if (getGLOBAL()._bHatcheryCC._finishAll) {
                    getGLOBAL().Message(getKEYS().Get("msg_finishqueue", {
                        "v1": getGLOBAL().Array2String(_loc2_),
                        "v2": getGLOBAL()._bHatcheryCC._finishCost.Get()
                    }), getKEYS().Get("str_finishnow"), this.DoFinish.bind(this));
                } else {
                    getGLOBAL().Message(getKEYS().Get("msg_fillhousing", {
                        "v1": getGLOBAL().Array2String(_loc2_),
                        "v2": getGLOBAL()._bHatcheryCC._finishCost.Get()
                    }), getKEYS().Get("str_finishnow"), this.DoFinish.bind(this));
                }
            } else {
                getPOPUPS().DisplayGetShiny(param1);
            }
        } else if (getGLOBAL()._bHatcheryCC._finishCost.Get() <= 0) {
            getGLOBAL().Message(getKEYS().Get("msg_housingfull"));
        }
    }

    private DoFinish(): void {
        getGLOBAL()._bHatcheryCC.FinishNow();
    }

    private Charge(param1: string): void {
        const _loc2_: boolean = getBASE().isInfernoCreep(param1);
        getBASE().Charge(4, getCREATURES().GetProperty(param1, "cResource"), false, _loc2_);
        getResourcePackages().Create(_loc2_ ? 8 : 4, getGLOBAL()._bHatcheryCC, getCREATURES().GetProperty(param1, "cResource"), true);
        getBASE().Save();
    }

    public QueueRemove(param1: number): Function {
        const n: number = param1;
        return (param1: MouseEvent = null): void => {
            this._tick = 0;
            this._monsterIndex = n;
            this.QueueRemoveTick();
            this.addEventListener(Event.ENTER_FRAME, this.QueueRemoveTick.bind(this));
        };
    }

    private QueueRemoveTick(param1: Event = null): void {
        this._tick += 1;
        
        if (this._tick < HATCHERYCC.queueLimit && this._tick != 1) {
            return;
        }
        
        const _loc2_: any[] = getGLOBAL()._bHatcheryCC._monsterQueue;
        
        if (_loc2_.length >= this._monsterIndex) {
            getBASE().Fund(4, getCREATURES().GetProperty(_loc2_[this._monsterIndex - 1][0], "cResource"), false, null, getBASE().isInfernoCreep(_loc2_[this._monsterIndex - 1][0]));
            --_loc2_[this._monsterIndex - 1][1];
            
            if (_loc2_[this._monsterIndex - 1][1] <= 0) {
                _loc2_.splice(this._monsterIndex - 1, 1);
            }
            
            getBASE().Save();
        } else {
            getSOUNDS().Play("error1");
        }
        
        this.Update();
    }

    private ClearEvents(param1: MouseEvent): void {
        this.removeEventListener(Event.ENTER_FRAME, this.QueueAddTick.bind(this));
        this.removeEventListener(Event.ENTER_FRAME, this.QueueRemoveTick.bind(this));
    }

    public StopProduction(param1: number): Function {
        const n: number = param1;
        return (param1: MouseEvent = null): void => {
            let _loc4_: any = undefined;
            let _loc2_: number = 1;
            const _loc3_: any = getInstanceManager().getInstancesByClass(getBUILDING13());
            
            for (_loc4_ of _loc3_) {
                if (_loc4_._inProduction != "" && _loc2_ == n) {
                    getBASE().Fund(4, getCREATURES().GetProperty(_loc4_._inProduction, "cResource"), false, null, getBASE().isInfernoCreep(_loc4_._inProduction));
                    _loc4_._inProduction = "";
                    _loc4_.ResetProduction();
                }
                _loc2_++;
            }
            this.Update();
        };
    }

    public RenderQueue(): void {
        let _loc9_: BUILDING13 = null;
        let _loc10_: number = 0;
        const _loc1_: number = 7;
        const _loc2_: any[] = getGLOBAL()._bHatcheryCC._monsterQueue;
        let _loc3_: number = 1;
        
        while (_loc3_ <= _loc1_) {
            (this as any)["slot" + _loc3_].mcImage.visible = false;
            (this as any)["slot" + _loc3_].mcLoading.visible = false;
            (this as any)["mcCount" + _loc3_].visible = false;
            _loc3_++;
        }
        
        _loc3_ = 1;
        while (_loc3_ <= _loc2_.length) {
            (this as any)["slot" + _loc3_].mcImage.visible = false;
            (this as any)["slot" + _loc3_].mcLoading.visible = true;
            ImageCache.GetImageWithCallBack("monsters/" + _loc2_[_loc3_ - 1][0] + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", ["slot", _loc3_]);
            (this as any)["mcCount" + _loc3_].visible = true;
            (this as any)["mcCount" + _loc3_].tCounter.text = _loc2_[_loc3_ - 1][1];
            _loc3_++;
        }
        
        getHOUSING().HousingSpace();
        let _loc4_: number = 0;
        let _loc5_: number = 100 / getHOUSING()._housingCapacity.Get() * getHOUSING()._housingUsed.Get();
        (this.mcStorage as any).mcBar.width = 535 / getHOUSING()._housingCapacity.Get() * getHOUSING()._housingUsed.Get();
        
        let _loc6_: string = "<b>" + getGLOBAL().FormatNumber(getHOUSING()._housingUsed.Get()) + " / " + getGLOBAL().FormatNumber(getHOUSING()._housingCapacity.Get()) + "</b>";
        let _loc7_: number = 0;
        const _loc8_: any = getInstanceManager().getInstancesByClass(getBUILDING13());
        
        for (_loc9_ of _loc8_) {
            if (_loc9_._inProduction) {
                _loc7_ += getCREATURES().GetProperty(_loc9_._inProduction, "cStorage");
            }
        }
        
        _loc10_ = 0;
        while (_loc10_ < _loc2_.length) {
            _loc7_ += getCREATURES().GetProperty(_loc2_[_loc10_][0], "cStorage") * _loc2_[_loc10_][1];
            _loc10_++;
        }
        
        if (_loc7_ > 0) {
            (this.bFinish as any).Enabled = true;
            if (HATCHERYCC.doesShowInfernoCreeps) {
                this.bFinish.gotoAndStop(3);
            } else {
                this.bFinish.gotoAndStop(2);
            }
        } else {
            (this.bFinish as any).Enabled = false;
            this.bFinish.gotoAndStop(1);
        }
        
        if (HATCHERYCC.doesShowInfernoCreeps) {
            _loc6_ += "   ";
        } else {
            _loc6_ += "<br>";
        }
        
        if (_loc7_ > 0 && getGLOBAL()._hatcheryOverdrivePower.Get() < 10) {
            this.bSpeedup.gotoAndStop(2);
            _loc6_ += '<font size="9">' + getKEYS().Get("hcc_queuedup", { "v1": getGLOBAL().FormatNumber(getHOUSING()._housingUsed.Get() + _loc7_) });
            
            if (getHOUSING()._housingUsed.Get() + _loc7_ == getHOUSING()._housingCapacity.Get()) {
                _loc6_ += " " + getKEYS().Get("hcc_queuedfull");
            }
            if (getHOUSING()._housingUsed.Get() + _loc7_ > getHOUSING()._housingCapacity.Get()) {
                _loc6_ += " " + getKEYS().Get("hcc_queuedover");
            }
        } else {
            this.bSpeedup.gotoAndStop(1);
            _loc6_ += '<font size="9">' + getKEYS().Get("hcc_queuedup", { "v1": getGLOBAL().FormatNumber(getHOUSING()._housingUsed.Get() + _loc7_) });
            
            if (getHOUSING()._housingUsed.Get() + _loc7_ == getHOUSING()._housingCapacity.Get()) {
                _loc6_ += " " + getKEYS().Get("hcc_queuedfull");
            }
            if (getHOUSING()._housingUsed.Get() + _loc7_ > getHOUSING()._housingCapacity.Get()) {
                _loc6_ += " " + getKEYS().Get("hcc_queuedover");
            }
        }
        
        _loc5_ = 535 / getHOUSING()._housingCapacity.Get() * (getHOUSING()._housingUsed.Get() + _loc7_);
        if (_loc5_ > 535) {
            _loc5_ = 535;
        }
        (this.mcStorage as any).mcBarB.width = _loc5_;
        this.txtStorage.htmlText = _loc6_;
        
        let _loc11_: number = Number(getBASE()._resources.r4.Get());
        _loc10_ = 0;
        while (_loc10_ < _loc2_.length) {
            _loc11_ -= getCREATURES().GetProperty(_loc2_[_loc10_][0], "cResource") * _loc2_[_loc10_][1];
            _loc10_++;
        }
        
        (this.mcGoo as any).mcBarB.width = 1;
        _loc5_ = 100 / getBASE()._resources.r4max * getBASE()._resources.r4.Get();
        if (_loc5_ > 100) {
            _loc5_ = 100;
        }
        (this.mcGoo as any).mcBar.width = _loc5_;
        this.txtGoo.htmlText = "<b>" + getKEYS().Get("hat_gooremaining", { "v1": getGLOBAL().FormatNumber(getBASE()._resources.r4.Get()) }) + "</b>";
        this.bTopup.gotoAndStop(1);
        
        if (getBASE()._resources.r4.Get() < getBASE()._resources.r4max * 0.1) {
            this.bTopup.gotoAndStop(2);
        }
        
        if (HATCHERYCC.doesShowInfernoCreeps) {
            _loc11_ = Number(getBASE()._iresources.r4.Get());
            _loc10_ = 0;
            while (_loc10_ < _loc2_.length) {
                _loc11_ -= getCREATURES().GetProperty(_loc2_[_loc10_][0], "cResource") * _loc2_[_loc10_][1];
                _loc10_++;
            }
            
            (this.mcMagma as any).mcBarB.width = 1;
            _loc5_ = 100 / getBASE()._iresources.r4max * getBASE()._iresources.r4.Get();
            if (_loc5_ > 100) {
                _loc5_ = 100;
            }
            (this.mcMagma as any).mcBar.width = _loc5_;
            this.txtMagma.htmlText = "<b>" + getKEYS().Get("hat_magmaremaining", { "v1": getGLOBAL().FormatNumber(getBASE()._iresources.r4.Get()) }) + "</b>";
            this.bTopupMagma.gotoAndStop(1);
            
            if (getBASE()._iresources.r4.Get() < getBASE()._iresources.r4max * 0.1) {
                this.bTopupMagma.gotoAndStop(2);
            }
        }
    }

    public Setup(): void {
        const _loc1_: number = 7;
        let _loc2_: number = 1;
        
        while (_loc2_ <= _loc1_) {
            (this as any)["slot" + _loc2_].addEventListener(MouseEvent.MOUSE_DOWN, this.QueueRemove(_loc2_));
            (this as any)["slot" + _loc2_].addEventListener(MouseEvent.MOUSE_OVER, this.ShowRemove((this as any)["mcRemove" + _loc2_]));
            (this as any)["slot" + _loc2_].addEventListener(MouseEvent.MOUSE_OUT, this.HideRemove((this as any)["mcRemove" + _loc2_]));
            (this as any)["slot" + _loc2_].buttonMode = true;
            
            if (HATCHERYCC.queueLimit > HATCHERYCC.DEFAULT_QUEUE_LIMIT) {
                (this as any)["slot" + _loc2_].gotoAndStop(2);
            } else {
                (this as any)["slot" + _loc2_].gotoAndStop(1);
            }
            
            (this as any)["mcRemove" + _loc2_].visible = false;
            (this as any)["mcRemove" + _loc2_].mouseEnabled = false;
            (this as any)["mcRemove" + _loc2_].mouseChildren = false;
            _loc2_++;
        }
        
        _loc2_ = 1;
        while (_loc2_ <= 5) {
            (this as any)["hatcheryRemove" + _loc2_].visible = false;
            (this as any)["hatcheryRemove" + _loc2_].mouseEnabled = false;
            (this as any)["hatcheryRemove" + _loc2_].mouseChildren = false;
            _loc2_++;
        }
        
        this.MonsterInfoHide();
        this.Update();
    }

    public ShowRemove(param1: MovieClip): Function {
        const n: MovieClip = param1;
        return (param1: MouseEvent): void => {
            n.visible = true;
        };
    }

    public HideRemove(param1: MovieClip): Function {
        const n: MovieClip = param1;
        return (param1: MouseEvent): void => {
            n.visible = false;
        };
    }

    public Update(): void {
        let _loc4_: MovieClip = null;
        let _loc8_: BUILDING13 = null;
        let _loc9_: number = 0;
        let _loc11_: string = null;
        let _loc12_: number = 0;
        let _loc13_: number = 0;
        
        this.RenderQueue();
        
        const _loc1_: any[] = getGLOBAL()._bHatcheryCC._monsterQueue;
        const _loc2_: any[] = [];
        let _loc3_: number = 1;
        const _loc5_: any[] = [];
        let _loc6_: number = 0;
        
        while (_loc6_ < this._monsterSlots.length) {
            _loc11_ = String(this._monsterSlots[_loc6_].id);
            
            if (!SubscriptionHandler.instance.isSubscriptionActive && SubscriptionHandler.isEnabledForAll && getBASE().isInfernoCreep(_loc11_)) {
                this._monsterSlots[_loc6_].mcMonster.alpha = 0.5;
                this._monsterSlots[_loc6_].mcLevel.alpha = 0.5;
            } else if (!getBASE().Charge(4, getCREATURES().GetProperty(_loc11_, "cResource"), true, getBASE().isInfernoCreep(_loc11_))) {
                this._monsterSlots[_loc6_].mcMonster.alpha = 0.5;
                this._monsterSlots[_loc6_].mcLevel.alpha = 0.5;
            } else {
                this._monsterSlots[_loc6_].mcMonster.alpha = 1;
                this._monsterSlots[_loc6_].mcLevel.alpha = 1;
            }
            _loc6_++;
        }
        
        const _loc7_: any = getInstanceManager().getInstancesByClass(getBUILDING13());
        
        for (_loc8_ of _loc7_) {
            _loc4_ = (this as any)["hatchery" + _loc3_];
            _loc4_.mouseEnabled = false;
            (_loc4_ as any).tLabel.text = "";
            (_loc4_ as any).mcImage.visible = false;
            (_loc4_ as any).mcLoading.visible = false;
            (this as any)["bProgress" + _loc3_].visible = false;
            (this as any)["tProgress" + _loc3_].visible = false;
            (this as any)["hatcheryRemove" + _loc3_].visible = false;
            
            if (_loc8_._countdownBuild.Get() > 0) {
                (_loc4_ as any).mcImage.visible = false;
                (_loc4_ as any).mcLoading.visible = false;
                (_loc4_ as any).tLabel.htmlText = '<font color="#CC0000">' + getKEYS().Get("hat_slot_construction") + "</font>";
            } else if (_loc8_._countdownUpgrade.Get() > 0) {
                (_loc4_ as any).mcImage.visible = false;
                (_loc4_ as any).mcLoading.visible = false;
                (_loc4_ as any).tLabel.htmlText = '<font color="#CC0000">' + getKEYS().Get("hat_slot_upgrading") + "</font>";
            } else if (_loc8_._inProduction && _loc8_._inProduction != "") {
                (_loc4_ as any).mcLoading.visible = true;
                ImageCache.GetImageWithCallBack("monsters/" + _loc8_._inProduction + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", ["hatchery", _loc3_]);
                _loc12_ = Number(getCREATURELOCKER()._creatures[_loc8_._inProduction].props.cTime);
                _loc13_ = 100 / _loc12_ * _loc8_._countdownProduce.Get();
                if (_loc13_ < 0) {
                    _loc13_ = 0;
                }
                (this as any)["bProgress" + _loc3_].mcBar.width = 100 - _loc13_;
                
                if (_loc8_._countdownProduce.Get() > 0 && _loc8_._hasResources) {
                    (this as any)["tProgress" + _loc3_].htmlText = "<b>" + getGLOBAL().ToTime(_loc8_._countdownProduce.Get(), true) + "</b>";
                } else if (_loc8_._productionStage.Get() == 2 && _loc8_._inProduction) {
                    (this as any)["tProgress" + _loc3_].htmlText = "<b>" + getKEYS().Get("hat_status_nospace") + "</b>";
                } else if (_loc8_._productionStage.Get() == 3 && _loc8_._taken.Get() == 0) {
                    if (getBASE().isInfernoMainYardOrOutpost) {
                        (this as any)["tProgress" + _loc3_].htmlText = "<b>No Magma</b>";
                    } else {
                        (this as any)["tProgress" + _loc3_].htmlText = "<b>" + getKEYS().Get("hat_status_nogoo") + "</b>";
                    }
                } else {
                    (this as any)["tProgress" + _loc3_].htmlText = "<b>" + getKEYS().Get("hat_status_waiting") + "</b>";
                }
                
                (this as any)["bProgress" + _loc3_].visible = true;
                (this as any)["tProgress" + _loc3_].visible = true;
            } else {
                (_loc4_ as any).mcImage.visible = false;
                (_loc4_ as any).mcLoading.visible = false;
                (this as any)["bProgress" + _loc3_].visible = false;
                (this as any)["tProgress" + _loc3_].visible = false;
            }
            _loc3_++;
        }
        
        _loc9_ = 5;
        if (getBASE().isOutpost) {
            _loc9_ = 2;
        }
        
        let _loc10_: number = _loc3_;
        while (_loc10_ <= 5) {
            _loc4_ = (this as any)["hatchery" + _loc10_];
            
            if (_loc10_ <= _loc9_) {
                _loc4_.visible = true;
                (_loc4_ as any).tLabel.htmlText = '<font color="#CC0000">' + getKEYS().Get("hat_slot_buildanother") + "</font>";
                (_loc4_ as any).mcLoading.visible = false;
                (this as any)["hatcheryBG" + _loc10_].visible = true;
                (this as any)["hatlabel" + _loc10_ + "_txt"].visible = true;
                (this as any)["bProgress" + _loc10_].visible = false;
                (this as any)["tProgress" + _loc10_].visible = false;
                (this as any)["hatcheryRemove" + _loc10_].visible = false;
            } else {
                _loc4_.visible = false;
                (this as any)["hatlabel" + _loc10_ + "_txt"].visible = false;
                (this as any)["hatcheryBG" + _loc10_].visible = false;
                (this as any)["hatcheryBG" + _loc10_].visible = false;
                (this as any)["bProgress" + _loc10_].visible = false;
                (this as any)["tProgress" + _loc10_].visible = false;
                (this as any)["hatcheryRemove" + _loc10_].visible = false;
            }
            _loc10_++;
        }
        
        if (getGLOBAL()._hatcheryOverdrive > 0) {
            (this.mcOverdrive as any).t.htmlText = "<b>" + getKEYS().Get("hat_xoverdrive", {
                "v1": getGLOBAL()._hatcheryOverdrivePower.Get(),
                "v2": getGLOBAL().ToTime(getGLOBAL()._hatcheryOverdrive)
            }) + "</b>";
            this.mcOverdrive.visible = true;
        } else {
            this.mcOverdrive.visible = false;
        }
        
        this._scrollSet.Update();
    }

    public Help(param1: MouseEvent = null): void {
        const _loc2_: number = 9;
        this._guidePage += 1;
        
        if (this._guidePage == 3) {
            this._guidePage = 4;
        }
        if (this._guidePage > _loc2_) {
            this._guidePage = 1;
        }
        
        this.gotoAndStop(this._guidePage);
        
        if (this._guidePage > 1) {
            this.txtGuide.htmlText = getKEYS().Get("hcc_tut_" + (this._guidePage - 1));
            if (this._guidePage == 2) {
                this.bContinue.addEventListener(MouseEvent.CLICK, this.Help.bind(this));
                this.bContinue.SetupKey("btn_continue");
            }
        }
    }

    public Hide(param1: MouseEvent = null): void {
        HATCHERYCC.Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
