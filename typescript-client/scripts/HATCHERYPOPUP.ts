import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSet } from './com/monsters/display/ScrollSet';
import { TweenLite, Circ } from './gs/TweenLite';
import { HATCHERY } from './HATCHERY';
import { HATCHERYPOPUP_CLIP } from './HATCHERYPOPUP_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { POPUPSETTINGS } from './POPUPSETTINGS';

// Lazy imports to break circular dependency chains
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
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


/**
 * HATCHERYPOPUP - Hatchery popup for monster production
 * Converted from ActionScript to TypeScript
 */
export class HATCHERYPOPUP extends HATCHERYPOPUP_CLIP {
    public _hatchery: BUILDING13;
    public _monsterSlots: any[];
    private MONSTERSLOTSIZE: Rectangle;
    private _scrollSet: ScrollSet;
    private _scrollSetContainer: Sprite;
    public _guidePage: number = 1;

    constructor() {
        super();
        this.MONSTERSLOTSIZE = new Rectangle(0, 0, 65, 50);
        this.title_txt.htmlText = getKEYS().Get(getGLOBAL()._bHatchery._buildingProps.name);
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
        
        this._scrollSet = new ScrollSet();
        this._scrollSet.x = this.scroller.x;
        this._scrollSet.y = this.scroller.y;
        this._scrollSet.width = this.scroller.width;
        this._scrollSet.Init(this.monsterCanvas, this.monsterMask, ScrollSet.BROWN, this.monsterMask.y, this.monsterMask.height);
        this._scrollSet.AutoHideEnabled = false;
        this._scrollSet.isHiddenWhileUnnecessary = true;
        this._scrollSetContainer = new Sprite();
        this._scrollSetContainer.addChild(this._scrollSet);
        this.addChild(this._scrollSetContainer);
        this.scroller.visible = false;
        
        let _loc1_: number = 0;
        let _loc2_: number = 0;
        const _loc3_: number = 9;
        const _loc4_: number = 5;
        this._monsterSlots = [];
        const _loc5_: any[] = getCREATURELOCKER().GetSortedCreatures(true);
        const _loc6_: number = !getBASE().isInfernoMainYardOrOutpost ? getCREATURELOCKER().maxCreatures("above") : getCREATURELOCKER().maxCreatures("inferno");
        
        let _loc7_: number = 0;
        while (_loc7_ < _loc6_) {
            if (Boolean(_loc5_[_loc7_]) && _loc5_[_loc7_].blocked == true) {
                _loc2_++;
            } else {
                const _loc9_: number = Number(_loc5_[_loc7_].id.substr(_loc5_[_loc7_].id.indexOf("C") + 1));
                const _loc10_: MovieClip = new HatcheryMonsterIcon_CLIP();
                _loc10_.width = this.MONSTERSLOTSIZE.width;
                _loc10_.height = this.MONSTERSLOTSIZE.height;
                _loc10_.addEventListener(MouseEvent.MOUSE_OVER, this.MonsterInfo(_loc9_));
                _loc10_.x = _loc1_ % _loc3_ * (_loc10_.width + _loc4_);
                _loc10_.y = Math.floor(_loc1_ / _loc3_) * (_loc10_.height + _loc4_);
                this.monsterCanvas.addChild(_loc10_);
                this._monsterSlots.push(_loc10_);
                ImageCache.GetImageWithCallBack("monsters/" + _loc5_[_loc7_].id + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [_loc10_]);
                if (Boolean(getCREATURELOCKER()._lockerData[_loc5_[_loc7_].id]) && getCREATURELOCKER()._lockerData[_loc5_[_loc7_].id].t == 2) {
                    _loc10_.addEventListener(MouseEvent.MOUSE_DOWN, this.QueueAdd(_loc9_));
                    _loc10_.alpha = 1;
                    _loc10_.buttonMode = true;
                } else {
                    _loc10_.alpha = 0.5;
                    _loc10_.buttonMode = false;
                }
                _loc1_++;
            }
            _loc7_++;
        }
        
        (this.mcMonsterInfo as any).speed_txt.htmlText = "<b>" + getKEYS().Get("mon_att_speed") + "</b>";
        (this.mcMonsterInfo as any).health_txt.htmlText = "<b>" + getKEYS().Get("mon_att_health") + "</b>";
        (this.mcMonsterInfo as any).damage_txt.htmlText = "<b>" + getKEYS().Get("mon_att_damage") + "</b>";
        (this.mcMonsterInfo as any).goo_txt.htmlText = "<b>" + getKEYS().Get("mon_att_cost", {"v1": getKEYS().Get(getBRESOURCE().GetResourceNameKey(3))}) + "</b>";
        (this.mcMonsterInfo as any).housing_txt.htmlText = "<b>" + getKEYS().Get("mon_att_housing") + "</b>";
        (this.mcMonsterInfo as any).time_txt.htmlText = "<b>" + getKEYS().Get("mon_att_time") + "</b>";
        this.MonsterInfoB(1);
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] | null = null): void {
        const _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        if (param3 && param3[0]) {
            (param3[0] as any).mcImage.removeChildAt(0);
            (param3[0] as any).mcImage.addChild(_loc4_);
            (param3[0] as any).mcImage.visible = true;
        }
    }

    public MonsterInfo(param1: number): (param1?: MouseEvent) => void {
        const n: number = param1;
        const self = this;
        return function(param1?: MouseEvent): void {
            self.MonsterInfoB(n);
        };
    }

    public MonsterInfoB(creatureID: number): void {
        let currentCreature: string = "";
        let damageShown: number = 0;
        const creatureStringID: string = getBASE().isInfernoMainYardOrOutpost ? "IC" + creatureID : "C" + creatureID;
        const creature: any = getCREATURELOCKER()._creatures[creatureStringID];
        ImageCache.GetImageWithCallBack("monsters/" + creatureStringID + "-portrait.jpg", this.IconLoaded.bind(this), true, 1, "", [this.portrait1]);
        
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
        
        damageShown = getCREATURES().GetProperty(creatureStringID, "damage");
        TweenLite.to((this.mcMonsterInfo as any).bSpeed.mcBar, 0.4, {
            "width": 100 / speed * getCREATURES().GetProperty(creatureStringID, "speed"),
            "ease": Circ.easeInOut,
            "delay": 0
        });
        TweenLite.to((this.mcMonsterInfo as any).bHealth.mcBar, 0.4, {
            "width": 100 / health * getCREATURES().GetProperty(creatureStringID, "health"),
            "ease": Circ.easeInOut,
            "delay": 0.05
        });
        TweenLite.to((this.mcMonsterInfo as any).bDamage.mcBar, 0.4, {
            "width": 100 / damage * Math.abs(damageShown),
            "ease": Circ.easeInOut,
            "delay": 0.1
        });
        TweenLite.to((this.mcMonsterInfo as any).bTime.mcBar, 0.4, {
            "width": 100 / cTime * getCREATURES().GetProperty(creatureStringID, "cTime"),
            "ease": Circ.easeInOut,
            "delay": 0.15
        });
        TweenLite.to((this.mcMonsterInfo as any).bResource.mcBar, 0.4, {
            "width": 100 / cResource * getCREATURES().GetProperty(creatureStringID, "cResource"),
            "ease": Circ.easeInOut,
            "delay": 0.2
        });
        TweenLite.to((this.mcMonsterInfo as any).bStorage.mcBar, 0.4, {
            "width": 100 / cStorage * getCREATURES().GetProperty(creatureStringID, "cStorage"),
            "ease": Circ.easeInOut,
            "delay": 0.25
        });
        
        (this.mcMonsterInfo as any).tSpeed.htmlText = getKEYS().Get("mon_statsspeed", {"v1": getCREATURES().GetProperty(creatureStringID, "speed")});
        (this.mcMonsterInfo as any).tHealth.htmlText = getGLOBAL().FormatNumber(getCREATURES().GetProperty(creatureStringID, "health"));
        if (damageShown > 0) {
            (this.mcMonsterInfo as any).tDamage.htmlText = String(damageShown);
        } else {
            (this.mcMonsterInfo as any).tDamage.htmlText = -damageShown + " (" + getKEYS().Get("str_heal") + ")";
        }
        (this.mcMonsterInfo as any).tResource.htmlText = getKEYS().Get("mon_att_costvalue", {
            "v1": getGLOBAL().FormatNumber(getCREATURES().GetProperty(creatureStringID, "cResource")),
            "v2": getKEYS().Get(getBRESOURCE().GetResourceNameKey(3))
        });
        (this.mcMonsterInfo as any).tStorage.htmlText = getKEYS().Get("mon_att_housingvalue", {"v1": getCREATURES().GetProperty(creatureStringID, "cStorage")});
        (this.mcMonsterInfo as any).tTime.htmlText = getGLOBAL().ToTime(getCREATURES().GetProperty(creatureStringID, "cTime"), true);
        
        let level: number = 1;
        if (Boolean(getGLOBAL().player.m_upgrades[creatureStringID]) && getGLOBAL().player.m_upgrades[creatureStringID].level > 1) {
            level = Number(getGLOBAL().player.m_upgrades[creatureStringID].level);
        }
        (this.mcMonsterInfo as any).tDescription.htmlText = "<b>" + getKEYS().Get("hatcherypopup_level", {"v1": level}) + " " + getKEYS().Get(creature.name) + "</b><br>" + getKEYS().Get(creature.description);
        
        if (Boolean(getCREATURELOCKER()._lockerData[creatureStringID]) && getCREATURELOCKER()._lockerData[creatureStringID].t == 2) {
            (this.mcMonsterInfo as any).mcLocked.visible = false;
        } else {
            (this.mcMonsterInfo as any).mcLocked.tText.htmlText = getKEYS().Get(getBASE().isInfernoMainYardOrOutpost ? "incubator_unlockinlocker" : "hat_unlockinlocker", {
                "v1": getKEYS().Get(getCREATURELOCKER()._creatures[creatureStringID].name),
                "v2": getKEYS().Get(getGLOBAL()._bHatchery._buildingProps.name)
            });
            (this.mcMonsterInfo as any).mcLocked.visible = true;
        }
        this.MonsterInfoShow();
    }

    public MonsterInfoShow(): void {
        this.mcMonsterInfo.visible = true;
    }

    public MonsterInfoHide(param1: MouseEvent | null = null): void {
        this.mcMonsterInfo.visible = false;
    }

    public QueueAdd(param1: number): (param1?: MouseEvent) => void {
        const n: number = param1;
        const self = this;
        return function(param1?: MouseEvent): void {
            let _loc2_: string = getBASE().isInfernoMainYardOrOutpost ? "I" : "";
            _loc2_ += "C" + n;
            const _loc3_: number = 1 + self._hatchery._lvl.Get();
            if (!getBASE().Charge(4, getCREATURES().GetProperty(_loc2_, "cResource"), true)) {
                if (getBASE().isInfernoMainYardOrOutpost) {
                    getGLOBAL().Message("Not enough Magma.");
                } else {
                    getGLOBAL().Message(getKEYS().Get("hat_notenoughgoo"));
                }
                return;
            }
            if (Boolean(getCREATURELOCKER()._lockerData[_loc2_]) && getCREATURELOCKER()._lockerData[_loc2_].t == 2) {
                const _loc4_: any[] = self._hatchery._monsterQueue;
                let _loc5_: number = 0;
                while (_loc5_ < _loc4_.length) {
                    if (_loc4_[_loc5_][0] == _loc2_ && _loc4_[_loc5_][1] < 20) {
                        ++_loc4_[_loc5_][1];
                        self.Charge(_loc2_);
                        self.RenderQueue();
                        return;
                    }
                    _loc5_++;
                }
                if (_loc4_.length > 0 && _loc4_[_loc4_.length - 1][0] == _loc2_) {
                    if (_loc4_[_loc4_.length - 1][1] < 20) {
                        ++_loc4_[_loc4_.length - 1][1];
                        self.Charge(_loc2_);
                    } else if (_loc4_.length < _loc3_) {
                        _loc4_.push([_loc2_, 1]);
                        self.Charge(_loc2_);
                    } else {
                        getSOUNDS().Play("error1");
                    }
                } else {
                    if (_loc4_.length < _loc3_) {
                        _loc4_.push([_loc2_, 1]);
                        self.Charge(_loc2_);
                    } else {
                        getSOUNDS().Play("error1");
                    }
                    if (!self._hatchery._inProduction) {
                        self._hatchery.StartProduction();
                    }
                    getBASE().Save();
                }
                self.RenderQueue();
            }
        };
    }

    private Charge(param1: string): void {
        getBASE().Charge(4, getCREATURES().GetProperty(param1, "cResource"));
        getResourcePackages().Create(getBASE().isInfernoMainYardOrOutpost ? 8 : 4, this._hatchery, getCREATURES().GetProperty(param1, "cResource"), true);
        getBASE().Save();
    }

    public QueueRemove(param1: number): (param1?: MouseEvent) => void {
        const n: number = param1;
        const self = this;
        return function(param1?: MouseEvent): void {
            let _loc2_: string = "";
            if (n > 0) {
                const _loc3_: any[] = self._hatchery._monsterQueue;
                if (_loc3_.length >= n) {
                    _loc2_ = _loc3_[n - 1][0];
                    --_loc3_[n - 1][1];
                    if (_loc3_[n - 1][1] <= 0) {
                        _loc3_.splice(n - 1, 1);
                    }
                    getBASE().Fund(4, getCREATURES().GetProperty(_loc2_, "cResource"));
                    getBASE().Save();
                } else {
                    getSOUNDS().Play("error1");
                }
            } else if (self._hatchery._inProduction !== "") {
                getBASE().Fund(4, getCREATURES().GetProperty(self._hatchery._inProduction, "cResource"));
                self._hatchery.StartProduction();
            }
            self.RenderQueue();
        };
    }

    public RenderQueue(): void {
        let _loc4_: number = 0;
        let _loc5_: number = 0;
        const _loc1_: number = 2 + this._hatchery._lvl.Get();
        const _loc2_: any[] = this._hatchery._monsterQueue;
        let _loc3_: number = 0;
        while (_loc3_ < _loc2_.length) {
            ImageCache.GetImageWithCallBack("monsters/" + _loc2_[_loc3_][0] + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [(this as any)["slot" + (_loc3_ + 1)]]);
            (this as any)["mcCount" + (_loc3_ + 1)].visible = true;
            (this as any)["mcCount" + (_loc3_ + 1)].tCounter.text = _loc2_[_loc3_][1];
            _loc3_++;
        }
        _loc3_ = _loc2_.length;
        while (_loc3_ < _loc1_ - 1) {
            (this as any)["slot" + (_loc3_ + 1)].mcImage.visible = false;
            (this as any)["slot" + (_loc3_ + 1)].mcLoading.visible = false;
            (this as any)["mcCount" + (_loc3_ + 1)].visible = false;
            _loc3_++;
        }
        _loc3_ = _loc1_ - 1;
        while (_loc3_ < 4) {
            (this as any)["slot" + (_loc3_ + 1)].tLabel.htmlText = "<font color=\"#CC0000\">" + getKEYS().Get("hat_slot_upgrade", {"v1": getKEYS().Get(getGLOBAL()._bHatchery._buildingProps.name)}) + "</font>";
            (this as any)["slot" + (_loc3_ + 1)].mcImage.visible = false;
            (this as any)["slot" + (_loc3_ + 1)].mcLoading.visible = false;
            (this as any)["mcCount" + (_loc3_ + 1)].visible = false;
            _loc3_++;
        }
        if (this._hatchery._inProduction) {
            this.bFinish.gotoAndStop(2);
            (this.bFinish as any).Enabled = true;
            ImageCache.GetImageWithCallBack("monsters/" + this._hatchery._inProduction + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [this.slot0]);
            _loc4_ = getCREATURES().GetProperty(this._hatchery._inProduction, "cTime");
            _loc5_ = 100 / _loc4_ * this._hatchery._countdownProduce.Get();
            if (_loc5_ < 0) {
                _loc5_ = 0;
            }
            this.bProgress.mcBar.width = 100 - _loc5_;
            if (this._hatchery._countdownProduce.Get() > 0) {
                this.tProgress.htmlText = "<b>" + getGLOBAL().ToTime(this._hatchery._countdownProduce.Get(), true) + "</b>";
            } else {
                this.tProgress.htmlText = "<b>" + getKEYS().Get("hat_status_waiting") + "</b>";
            }
            this.bProgress.visible = true;
            this.tProgress.visible = true;
            if (getTUTORIAL()._currentStage < 200 || getGLOBAL()._hatcheryOverdrivePower.Get() == 10) {
                this.bSpeedup.gotoAndStop(1);
            } else {
                this.bSpeedup.gotoAndStop(2);
            }
        } else {
            this.bFinish.gotoAndStop(1);
            (this.bFinish as any).Enabled = false;
            this.slot0.mcImage.visible = false;
            this.slot0.mcLoading.visible = false;
            this.bProgress.visible = false;
            this.tProgress.visible = false;
            this.bSpeedup.gotoAndStop(1);
        }
    }

    public Setup(param1: BUILDING13): void {
        this._hatchery = param1;
        const _loc2_: number = 2 + this._hatchery._lvl.Get();
        let _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            (this as any)["slot" + _loc3_].addEventListener(MouseEvent.MOUSE_DOWN, this.QueueRemove(_loc3_));
            (this as any)["slot" + _loc3_].addEventListener(MouseEvent.MOUSE_OVER, this.ShowRemove((this as any)["mcRemove" + _loc3_]));
            (this as any)["slot" + _loc3_].addEventListener(MouseEvent.MOUSE_OUT, this.HideRemove((this as any)["mcRemove" + _loc3_]));
            (this as any)["slot" + _loc3_].buttonMode = true;
            _loc3_++;
        }
        _loc3_ = _loc2_;
        while (_loc3_ < 5) {
            (this as any)["slot" + _loc3_].gotoAndStop(1);
            _loc3_++;
        }
        _loc3_ = 0;
        while (_loc3_ < 5) {
            (this as any)["mcRemove" + _loc3_].visible = false;
            (this as any)["mcRemove" + _loc3_].mouseEnabled = false;
            _loc3_++;
        }
        this.MonsterInfoHide();
        this.Update();
    }

    public ShowRemove(param1: MovieClip): (param1: MouseEvent) => void {
        const n: MovieClip = param1;
        return function(param1: MouseEvent): void {
            n.visible = true;
        };
    }

    public HideRemove(param1: MovieClip): (param1: MouseEvent) => void {
        const n: MovieClip = param1;
        return function(param1: MouseEvent): void {
            n.visible = false;
        };
    }

    public Update(): void {
        let _loc4_: boolean = false;
        let _loc5_: any[] | null = null;
        this.RenderQueue();
        const _loc1_: any[] = this._hatchery._monsterQueue;
        let _loc2_: any[] = [];
        const _loc3_: number = 1 + this._hatchery._lvl.Get();
        if (_loc1_.length == 0 && !this._hatchery._inProduction) {
            _loc2_ = [1, "<font color=\"#CC0000\"><b>" + getKEYS().Get("hat_nothinginproduction") + "</b></font> " + getKEYS().Get("hat_producing_message")];
        } else if (this._hatchery._canFunction) {
            if (this._hatchery._productionStage.Get() == 2 && this._hatchery._inProduction && !getHOUSING().HousingStore(this._hatchery._inProduction, new Point(this._hatchery._mc.x, this._hatchery._mc.y), true)) {
                _loc2_ = [2, getKEYS().Get(getBASE().isInfernoMainYardOrOutpost ? "incubator_needhousing" : "hat_needhousing")];
            } else {
                _loc2_ = [1, "<b>" + getKEYS().Get("hat_producing_monsters", {"v1": getKEYS().Get(getCREATURELOCKER()._creatures[this._hatchery._inProduction].name)}) + "</b>"];
                _loc4_ = true;
                if (_loc1_.length < _loc3_) {
                    _loc4_ = false;
                } else {
                    for (const _loc5_item of _loc1_) {
                        _loc5_ = _loc5_item;
                        if (_loc5_[1] < 20) {
                            _loc4_ = false;
                        }
                    }
                }
                if (!_loc4_) {
                    _loc2_[1] += " " + getKEYS().Get("hat_producing_message");
                } else {
                    _loc2_[1] += " " + getKEYS().Get("hat_queuefull");
                }
            }
        } else {
            _loc2_ = [2, getKEYS().Get("hat_damaged")];
        }
        if (_loc2_[0] == 1) {
            this.mcMessage.gotoAndStop(1);
        } else {
            this.mcMessage.gotoAndStop(2);
        }
        (this.mcMessage as any).tA.htmlText = _loc2_[1];
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

    public Help(param1: MouseEvent | null = null): void {
        const _loc2_: number = 4;
        this._guidePage += 1;
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

    private FinishNow(param1: MouseEvent): void {
        let _loc2_: any[] | null = null;
        let _loc3_: string = "";
        let _loc4_: any = null;
        let _loc5_: string = "";
        if (!(this.bFinish as any).Enabled) {
            return;
        }
        if (Boolean(this._hatchery) && this._hatchery._finishCost.Get() > 0) {
            if (getBASE()._credits.Get() >= this._hatchery._finishCost.Get()) {
                _loc2_ = [];
                _loc4_ = this._hatchery._finishQueue;
                for (_loc5_ in _loc4_) {
                    if (_loc4_[_loc5_] > 0) {
                        _loc3_ = getKEYS().Get(getCREATURELOCKER()._creatures[_loc5_].name);
                        _loc2_.push([_loc4_[_loc5_], _loc3_]);
                    }
                }
                getGLOBAL().Array2String(_loc2_);
                if (this._hatchery._finishAll) {
                    getGLOBAL().Message(getKEYS().Get("msg_finishqueue", {
                        "v1": getGLOBAL().Array2String(_loc2_),
                        "v2": this._hatchery._finishCost.Get()
                    }), getKEYS().Get("str_finishnow"), this.DoFinish.bind(this));
                } else {
                    getGLOBAL().Message(getKEYS().Get("msg_fillhousing", {
                        "v1": getGLOBAL().Array2String(_loc2_),
                        "v2": this._hatchery._finishCost.Get()
                    }), getKEYS().Get("str_finishnow"), this.DoFinish.bind(this));
                }
            } else {
                getPOPUPS().DisplayGetShiny(param1);
            }
        } else if (this._hatchery._finishCost.Get() <= 0) {
            getGLOBAL().Message(getKEYS().Get(getBASE().isInfernoMainYardOrOutpost ? "msg_compoundfull" : "msg_housingfull"));
        }
    }

    private DoFinish(): void {
        this._hatchery.FinishNow();
    }

    public Hide(param1: MouseEvent | null = null): void {
        HATCHERY.Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
