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
import { BASE } from './BASE';
import { BRESOURCE } from './BRESOURCE';
import { BUILDING13 } from './BUILDING13';
import { CREATURELOCKER } from './CREATURELOCKER';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { HATCHERY } from './HATCHERY';
import { HATCHERYPOPUP_CLIP } from './HATCHERYPOPUP_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { HOUSING } from './HOUSING';
import { KEYS } from './KEYS';
import { POPUPS } from './POPUPS';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { ResourcePackages } from './ResourcePackages';
import { SOUNDS } from './SOUNDS';
import { STORE } from './STORE';
import { TUTORIAL } from './TUTORIAL';

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
        this.title_txt.htmlText = KEYS.Get(GLOBAL._bHatchery._buildingProps.name);
        this.bSpeedup.tName.htmlText = "<b>" + KEYS.Get("btn_speedup") + "</b>";
        this.bSpeedup.mouseChildren = false;
        if (!BASE.isInfernoMainYardOrOutpost) {
            this.bSpeedup.addEventListener(MouseEvent.CLICK, STORE.Show(3, 2, ["HOD", "HOD2", "HOD3"]));
        } else {
            this.bSpeedup.addEventListener(MouseEvent.CLICK, STORE.Show(3, 2, ["HODI", "HOD2I", "HOD3I"]));
        }
        this.bSpeedup.buttonMode = true;
        this.bFinish.tName.htmlText = "<b>" + KEYS.Get("str_finishnow") + "</b>";
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
        const _loc5_: any[] = CREATURELOCKER.GetSortedCreatures(true);
        const _loc6_: number = !BASE.isInfernoMainYardOrOutpost ? CREATURELOCKER.maxCreatures("above") : CREATURELOCKER.maxCreatures("inferno");
        
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
                if (Boolean(CREATURELOCKER._lockerData[_loc5_[_loc7_].id]) && CREATURELOCKER._lockerData[_loc5_[_loc7_].id].t == 2) {
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
        
        this.mcMonsterInfo.speed_txt.htmlText = "<b>" + KEYS.Get("mon_att_speed") + "</b>";
        this.mcMonsterInfo.health_txt.htmlText = "<b>" + KEYS.Get("mon_att_health") + "</b>";
        this.mcMonsterInfo.damage_txt.htmlText = "<b>" + KEYS.Get("mon_att_damage") + "</b>";
        this.mcMonsterInfo.goo_txt.htmlText = "<b>" + KEYS.Get("mon_att_cost", {"v1": KEYS.Get(BRESOURCE.GetResourceNameKey(3))}) + "</b>";
        this.mcMonsterInfo.housing_txt.htmlText = "<b>" + KEYS.Get("mon_att_housing") + "</b>";
        this.mcMonsterInfo.time_txt.htmlText = "<b>" + KEYS.Get("mon_att_time") + "</b>";
        this.MonsterInfoB(1);
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] | null = null): void {
        const _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        if (param3 && param3[0]) {
            param3[0].mcImage.removeChildAt(0);
            param3[0].mcImage.addChild(_loc4_);
            param3[0].mcImage.visible = true;
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
        const creatureStringID: string = BASE.isInfernoMainYardOrOutpost ? "IC" + creatureID : "C" + creatureID;
        const creature: any = CREATURELOCKER._creatures[creatureStringID];
        ImageCache.GetImageWithCallBack("monsters/" + creatureStringID + "-portrait.jpg", this.IconLoaded.bind(this), true, 1, "", [this.portrait1]);
        
        let speed: number = 0;
        let health: number = 0;
        let damage: number = 0;
        let cTime: number = 0;
        let cResource: number = 0;
        let cStorage: number = 0;
        
        for (currentCreature in CREATURELOCKER._creatures) {
            if (CREATURES.GetProperty(currentCreature, "speed") > speed) {
                speed = CREATURES.GetProperty(currentCreature, "speed");
            }
            if (CREATURES.GetProperty(currentCreature, "health") > health) {
                health = CREATURES.GetProperty(currentCreature, "health");
            }
            if (CREATURES.GetProperty(currentCreature, "damage") > damage) {
                damage = CREATURES.GetProperty(currentCreature, "damage");
            }
            if (CREATURES.GetProperty(currentCreature, "cTime") > cTime) {
                cTime = CREATURES.GetProperty(currentCreature, "cTime");
            }
            if (CREATURES.GetProperty(currentCreature, "cResource") > cResource) {
                cResource = CREATURES.GetProperty(currentCreature, "cResource");
            }
            if (CREATURES.GetProperty(currentCreature, "cStorage") > cStorage) {
                cStorage = CREATURES.GetProperty(currentCreature, "cStorage");
            }
        }
        
        damageShown = CREATURES.GetProperty(creatureStringID, "damage");
        TweenLite.to(this.mcMonsterInfo.bSpeed.mcBar, 0.4, {
            "width": 100 / speed * CREATURES.GetProperty(creatureStringID, "speed"),
            "ease": Circ.easeInOut,
            "delay": 0
        });
        TweenLite.to(this.mcMonsterInfo.bHealth.mcBar, 0.4, {
            "width": 100 / health * CREATURES.GetProperty(creatureStringID, "health"),
            "ease": Circ.easeInOut,
            "delay": 0.05
        });
        TweenLite.to(this.mcMonsterInfo.bDamage.mcBar, 0.4, {
            "width": 100 / damage * Math.abs(damageShown),
            "ease": Circ.easeInOut,
            "delay": 0.1
        });
        TweenLite.to(this.mcMonsterInfo.bTime.mcBar, 0.4, {
            "width": 100 / cTime * CREATURES.GetProperty(creatureStringID, "cTime"),
            "ease": Circ.easeInOut,
            "delay": 0.15
        });
        TweenLite.to(this.mcMonsterInfo.bResource.mcBar, 0.4, {
            "width": 100 / cResource * CREATURES.GetProperty(creatureStringID, "cResource"),
            "ease": Circ.easeInOut,
            "delay": 0.2
        });
        TweenLite.to(this.mcMonsterInfo.bStorage.mcBar, 0.4, {
            "width": 100 / cStorage * CREATURES.GetProperty(creatureStringID, "cStorage"),
            "ease": Circ.easeInOut,
            "delay": 0.25
        });
        
        this.mcMonsterInfo.tSpeed.htmlText = KEYS.Get("mon_statsspeed", {"v1": CREATURES.GetProperty(creatureStringID, "speed")});
        this.mcMonsterInfo.tHealth.htmlText = GLOBAL.FormatNumber(CREATURES.GetProperty(creatureStringID, "health"));
        if (damageShown > 0) {
            this.mcMonsterInfo.tDamage.htmlText = String(damageShown);
        } else {
            this.mcMonsterInfo.tDamage.htmlText = -damageShown + " (" + KEYS.Get("str_heal") + ")";
        }
        this.mcMonsterInfo.tResource.htmlText = KEYS.Get("mon_att_costvalue", {
            "v1": GLOBAL.FormatNumber(CREATURES.GetProperty(creatureStringID, "cResource")),
            "v2": KEYS.Get(BRESOURCE.GetResourceNameKey(3))
        });
        this.mcMonsterInfo.tStorage.htmlText = KEYS.Get("mon_att_housingvalue", {"v1": CREATURES.GetProperty(creatureStringID, "cStorage")});
        this.mcMonsterInfo.tTime.htmlText = GLOBAL.ToTime(CREATURES.GetProperty(creatureStringID, "cTime"), true);
        
        let level: number = 1;
        if (Boolean(GLOBAL.player.m_upgrades[creatureStringID]) && GLOBAL.player.m_upgrades[creatureStringID].level > 1) {
            level = Number(GLOBAL.player.m_upgrades[creatureStringID].level);
        }
        this.mcMonsterInfo.tDescription.htmlText = "<b>" + KEYS.Get("hatcherypopup_level", {"v1": level}) + " " + KEYS.Get(creature.name) + "</b><br>" + KEYS.Get(creature.description);
        
        if (Boolean(CREATURELOCKER._lockerData[creatureStringID]) && CREATURELOCKER._lockerData[creatureStringID].t == 2) {
            this.mcMonsterInfo.mcLocked.visible = false;
        } else {
            this.mcMonsterInfo.mcLocked.tText.htmlText = KEYS.Get(BASE.isInfernoMainYardOrOutpost ? "incubator_unlockinlocker" : "hat_unlockinlocker", {
                "v1": KEYS.Get(CREATURELOCKER._creatures[creatureStringID].name),
                "v2": KEYS.Get(GLOBAL._bHatchery._buildingProps.name)
            });
            this.mcMonsterInfo.mcLocked.visible = true;
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
            let _loc2_: string = BASE.isInfernoMainYardOrOutpost ? "I" : "";
            _loc2_ += "C" + n;
            const _loc3_: number = 1 + self._hatchery._lvl.Get();
            if (!BASE.Charge(4, CREATURES.GetProperty(_loc2_, "cResource"), true)) {
                if (BASE.isInfernoMainYardOrOutpost) {
                    GLOBAL.Message("Not enough Magma.");
                } else {
                    GLOBAL.Message(KEYS.Get("hat_notenoughgoo"));
                }
                return;
            }
            if (Boolean(CREATURELOCKER._lockerData[_loc2_]) && CREATURELOCKER._lockerData[_loc2_].t == 2) {
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
                        SOUNDS.Play("error1");
                    }
                } else {
                    if (_loc4_.length < _loc3_) {
                        _loc4_.push([_loc2_, 1]);
                        self.Charge(_loc2_);
                    } else {
                        SOUNDS.Play("error1");
                    }
                    if (!self._hatchery._inProduction) {
                        self._hatchery.StartProduction();
                    }
                    BASE.Save();
                }
                self.RenderQueue();
            }
        };
    }

    private Charge(param1: string): void {
        BASE.Charge(4, CREATURES.GetProperty(param1, "cResource"));
        ResourcePackages.Create(BASE.isInfernoMainYardOrOutpost ? 8 : 4, this._hatchery, CREATURES.GetProperty(param1, "cResource"), true);
        BASE.Save();
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
                    BASE.Fund(4, CREATURES.GetProperty(_loc2_, "cResource"));
                    BASE.Save();
                } else {
                    SOUNDS.Play("error1");
                }
            } else if (self._hatchery._inProduction !== "") {
                BASE.Fund(4, CREATURES.GetProperty(self._hatchery._inProduction, "cResource"));
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
            (this as any)["slot" + (_loc3_ + 1)].tLabel.htmlText = "<font color=\"#CC0000\">" + KEYS.Get("hat_slot_upgrade", {"v1": KEYS.Get(GLOBAL._bHatchery._buildingProps.name)}) + "</font>";
            (this as any)["slot" + (_loc3_ + 1)].mcImage.visible = false;
            (this as any)["slot" + (_loc3_ + 1)].mcLoading.visible = false;
            (this as any)["mcCount" + (_loc3_ + 1)].visible = false;
            _loc3_++;
        }
        if (this._hatchery._inProduction) {
            this.bFinish.gotoAndStop(2);
            this.bFinish.Enabled = true;
            ImageCache.GetImageWithCallBack("monsters/" + this._hatchery._inProduction + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [this.slot0]);
            _loc4_ = CREATURES.GetProperty(this._hatchery._inProduction, "cTime");
            _loc5_ = 100 / _loc4_ * this._hatchery._countdownProduce.Get();
            if (_loc5_ < 0) {
                _loc5_ = 0;
            }
            this.bProgress.mcBar.width = 100 - _loc5_;
            if (this._hatchery._countdownProduce.Get() > 0) {
                this.tProgress.htmlText = "<b>" + GLOBAL.ToTime(this._hatchery._countdownProduce.Get(), true) + "</b>";
            } else {
                this.tProgress.htmlText = "<b>" + KEYS.Get("hat_status_waiting") + "</b>";
            }
            this.bProgress.visible = true;
            this.tProgress.visible = true;
            if (TUTORIAL._currentStage < 200 || GLOBAL._hatcheryOverdrivePower.Get() == 10) {
                this.bSpeedup.gotoAndStop(1);
            } else {
                this.bSpeedup.gotoAndStop(2);
            }
        } else {
            this.bFinish.gotoAndStop(1);
            this.bFinish.Enabled = false;
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
            _loc2_ = [1, "<font color=\"#CC0000\"><b>" + KEYS.Get("hat_nothinginproduction") + "</b></font> " + KEYS.Get("hat_producing_message")];
        } else if (this._hatchery._canFunction) {
            if (this._hatchery._productionStage.Get() == 2 && this._hatchery._inProduction && !HOUSING.HousingStore(this._hatchery._inProduction, new Point(this._hatchery._mc.x, this._hatchery._mc.y), true)) {
                _loc2_ = [2, KEYS.Get(BASE.isInfernoMainYardOrOutpost ? "incubator_needhousing" : "hat_needhousing")];
            } else {
                _loc2_ = [1, "<b>" + KEYS.Get("hat_producing_monsters", {"v1": KEYS.Get(CREATURELOCKER._creatures[this._hatchery._inProduction].name)}) + "</b>"];
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
                    _loc2_[1] += " " + KEYS.Get("hat_producing_message");
                } else {
                    _loc2_[1] += " " + KEYS.Get("hat_queuefull");
                }
            }
        } else {
            _loc2_ = [2, KEYS.Get("hat_damaged")];
        }
        if (_loc2_[0] == 1) {
            this.mcMessage.gotoAndStop(1);
        } else {
            this.mcMessage.gotoAndStop(2);
        }
        this.mcMessage.tA.htmlText = _loc2_[1];
        if (GLOBAL._hatcheryOverdrive > 0) {
            this.mcOverdrive.t.htmlText = "<b>" + KEYS.Get("hat_xoverdrive", {
                "v1": GLOBAL._hatcheryOverdrivePower.Get(),
                "v2": GLOBAL.ToTime(GLOBAL._hatcheryOverdrive)
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
            this.txtGuide.htmlText = KEYS.Get("hcc_tut_" + (this._guidePage - 1));
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
        if (!this.bFinish.Enabled) {
            return;
        }
        if (Boolean(this._hatchery) && this._hatchery._finishCost.Get() > 0) {
            if (BASE._credits.Get() >= this._hatchery._finishCost.Get()) {
                _loc2_ = [];
                _loc4_ = this._hatchery._finishQueue;
                for (_loc5_ in _loc4_) {
                    if (_loc4_[_loc5_] > 0) {
                        _loc3_ = KEYS.Get(CREATURELOCKER._creatures[_loc5_].name);
                        _loc2_.push([_loc4_[_loc5_], _loc3_]);
                    }
                }
                GLOBAL.Array2String(_loc2_);
                if (this._hatchery._finishAll) {
                    GLOBAL.Message(KEYS.Get("msg_finishqueue", {
                        "v1": GLOBAL.Array2String(_loc2_),
                        "v2": this._hatchery._finishCost.Get()
                    }), KEYS.Get("str_finishnow"), this.DoFinish.bind(this));
                } else {
                    GLOBAL.Message(KEYS.Get("msg_fillhousing", {
                        "v1": GLOBAL.Array2String(_loc2_),
                        "v2": this._hatchery._finishCost.Get()
                    }), KEYS.Get("str_finishnow"), this.DoFinish.bind(this));
                }
            } else {
                POPUPS.DisplayGetShiny(param1);
            }
        } else if (this._hatchery._finishCost.Get() <= 0) {
            GLOBAL.Message(KEYS.Get(BASE.isInfernoMainYardOrOutpost ? "msg_compoundfull" : "msg_housingfull"));
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
