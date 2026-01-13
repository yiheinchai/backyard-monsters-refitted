import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSet } from './com/monsters/display/ScrollSet';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { MonsterBase } from './com/monsters/monsters/MonsterBase';
import { BASE } from './BASE';
import { BFOUNDATION } from './BFOUNDATION';
import { BUILDING15 } from './BUILDING15';
import { CREATURELOCKER } from './CREATURELOCKER';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { HOUSING } from './HOUSING';
import { HOUSINGBUNKER } from './HOUSINGBUNKER';
import { HOUSINGPOPUP_CLIP } from './HOUSINGPOPUP_CLIP';
import { HousingPopupMonster_CLIP } from './HousingPopupMonster_CLIP';
import { INFERNOPORTAL } from './INFERNOPORTAL';
import { KEYS } from './KEYS';
import { MAP } from './MAP';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { SOUNDS } from './SOUNDS';

/**
 * HOUSINGPOPUP - Housing popup for monster storage and juicing
 * Converted from ActionScript to TypeScript
 */
export class HOUSINGPOPUP extends HOUSINGPOPUP_CLIP {
    public _juiceList: any;
    public _creatureList: any;
    public _creatureData: any;
    public _scroller: ScrollSet;

    constructor() {
        super();
        this._juiceList = {};
        this._creatureList = {};
        this._creatureData = {};
        
        if (GLOBAL._bJuicer) {
            this.gotoAndStop(2);
            this.bJuice.SetupKey("mh_nomonsters_btn");
            this.bJuice.Enabled = false;
            this.bJuice.addEventListener(MouseEvent.CLICK, this.Juice.bind(this));
            this.bAll.SetupKey("mh_selectall_btn");
            this.bAll.addEventListener(MouseEvent.CLICK, this.SelectAll.bind(this));
            this.bCancel.SetupKey("mh_cancel_btn");
            this.bCancel.Enabled = false;
            this.bCancel.addEventListener(MouseEvent.CLICK, this.SelectNone.bind(this));
        } else {
            this.gotoAndStop(1);
        }
        
        this._juiceList = {};
        if (MAPROOM_DESCENT.DescentPassed && BASE.isMainYard) {
            this.bAscend.visible = true;
            this.bAscend.Enabled = true;
            this.bAscend.SetupKey("btn_ascendmonsters");
            this.bAscend.addEventListener(MouseEvent.CLICK, this.Ascend.bind(this));
        } else {
            this.ascend_desc_txt.visible = false;
            this.bAscend.visible = false;
            this.bAscend.Enabled = false;
        }
        
        const _loc2_: number = 3;
        let _loc1_: number = 0;
        const _loc6_: number = 215;
        const _loc7_: number = 40;
        const _loc12_: any[] = this.GetHousableCreatures();
        
        _loc1_ = 0;
        while (_loc1_ < _loc12_.length) {
            const _loc13_: number = Number(_loc12_[_loc1_].id.substring(_loc12_[_loc1_].id.indexOf("C") + 1));
            const _loc14_: string = String(_loc12_[_loc1_].id);
            const _loc15_: HousingPopupMonster_CLIP = new HousingPopupMonster_CLIP();
            _loc15_.x = _loc1_ * _loc6_ % (_loc2_ * _loc6_);
            const _loc5_: number = _loc1_ / _loc2_;
            _loc15_.y = _loc5_ * _loc7_;
            _loc15_.mouseChildren = false;
            this.monsterContainer.addChild(_loc15_);
            this._creatureList["m" + _loc14_] = _loc15_;
            ImageCache.GetImageWithCallBack("monsters/" + _loc14_ + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [_loc15_.mcIcon]);
            _loc15_.tName.htmlText = "<b>" + KEYS.Get(CREATURELOCKER._creatures[_loc14_].name) + "</b>";
            if (GLOBAL._bJuicer) {
                _loc15_.addEventListener(MouseEvent.CLICK, this.JuicerAdd(_loc14_));
                _loc15_.buttonMode = true;
                _loc15_.mouseChildren = false;
            }
            _loc1_++;
        }
        
        this._scroller = new ScrollSet();
        this._scroller.x = 310;
        this._scroller.y = -145;
        this._scroller.width = 21;
        this._scroller.AutoHideEnabled = false;
        this._scroller.isHiddenWhileUnnecessary = true;
        this.addChild(this._scroller);
        this.monsterContainer.mask = this.monsterContainerMask;
        this._scroller.Init(this.monsterContainer as Sprite, this.monsterContainerMask as MovieClip, 0, -145, 240, 30);
        
        if (BASE.isInfernoMainYardOrOutpost) {
            this.title_txt.htmlText = KEYS.Get("mhi_title");
        } else {
            this.title_txt.htmlText = KEYS.Get("mh_title");
        }
        if (BASE.isInfernoMainYardOrOutpost) {
            this.capacity_desc_txt.htmlText = "<b>" + KEYS.Get("compound_capacity_desc") + "</b>";
        } else {
            this.capacity_desc_txt.htmlText = "<b>" + KEYS.Get("mh_capacity_desc") + "</b>";
        }
        if (GLOBAL._bJuicer) {
            this.juicefooter_desc_txt.htmlText = KEYS.Get("mh_juicefooter_desc");
        } else {
            this.footer_desc_txt.htmlText = KEYS.Get(BASE.isInfernoMainYardOrOutpost ? "hb_footer_desc" : "mh_footer_desc");
        }
        if (MAPROOM_DESCENT.DescentPassed) {
            this.ascend_desc_txt.htmlText = KEYS.Get("mh_ascension_desc");
        } else {
            this.ascend_desc_txt.htmlText = KEYS.Get("mh_ascension_noinf");
        }
        this.Update();
    }

    public GetHousableCreatures(): any[] {
        this._creatureData = {};
        const _loc1_: any[] = [];
        const _loc2_: any[] = [];
        let _loc3_: any[] = [];
        const _loc4_: any = CREATURELOCKER.GetCreatures("above");
        const _loc5_: boolean = !BASE.isInfernoMainYardOrOutpost;
        
        if (_loc5_) {
            for (const _loc8_ in _loc4_) {
                const _loc9_: any = CREATURELOCKER._creatures[_loc8_];
                if (!_loc9_.blocked) {
                    _loc9_.id = _loc8_;
                    _loc1_.push(_loc9_);
                    this._creatureData[_loc8_] = _loc9_;
                }
            }
            _loc1_.sort((a: any, b: any) => a.index - b.index);
        }
        
        const _loc6_: any = CREATURELOCKER.GetCreatures("inferno");
        const _loc7_: boolean = MAPROOM_DESCENT.DescentPassed;
        if (_loc7_) {
            for (const _loc10_ in _loc6_) {
                const _loc11_: any = CREATURELOCKER._creatures[_loc10_];
                if (!_loc11_.blocked) {
                    _loc11_.id = _loc10_;
                    _loc2_.push(_loc11_);
                    this._creatureData[_loc10_] = _loc11_;
                }
            }
            _loc2_.sort((a: any, b: any) => a.index - b.index);
        }
        
        if (_loc1_.length > 0) {
            _loc3_ = _loc3_.concat(_loc1_);
        }
        if (_loc2_.length > 0) {
            _loc3_ = _loc3_.concat(_loc2_);
        }
        return _loc3_;
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] | null = null): void {
        const _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        if (param3 && param3[0]) {
            param3[0].mcImage.addChild(_loc4_);
            param3[0].mcImage.visible = true;
            param3[0].mcLoading.visible = false;
        }
    }

    public Update(): void {
        let _loc1_: string = "";
        let _loc2_: string = "";
        let _loc3_: number = 0;
        let _loc4_: number = 0;
        let _loc6_: boolean = false;
        
        this.GetHousableCreatures();
        HOUSING.HousingSpace();
        
        _loc3_ = 0;
        for (_loc2_ in this._juiceList) {
            _loc3_ += CREATURELOCKER._creatures[_loc2_].props.cStorage * this._juiceList[_loc2_];
        }
        HOUSING._housingUsed.Add(-_loc3_);
        
        const _loc7_: number = Math.round(100 / Number(HOUSING._housingCapacity.Get()) * Number(HOUSING._housingUsed.Get()));
        (this.mcStorage as any).mcBar.width = 535 / HOUSING._housingCapacity.Get() * HOUSING._housingUsed.Get();
        (this.mcStorage as any).mcBarB.width = 1;
        this.tStorage.htmlText = "<b>" + GLOBAL.FormatNumber(HOUSING._housingUsed.Get()) + " / " + GLOBAL.FormatNumber(HOUSING._housingCapacity.Get()) + " (" + _loc7_ + "%)</b>";
        
        for (const _loc8_ in this._creatureData) {
            const _loc11_: number = Number(_loc8_.substring(_loc8_.indexOf("C") + 1));
            _loc1_ = _loc8_;
            _loc6_ = _loc1_.substring(0, 2) == "IC";
            if (!(_loc6_ && !MAPROOM_DESCENT.DescentPassed)) {
                if (!_loc6_ && !CREATURELOCKER._lockerData[_loc1_]) {
                    if (BASE.isInfernoMainYardOrOutpost) {
                        this._creatureList["m" + _loc1_].tInfo.htmlText = KEYS.Get("compound_item_locked");
                    } else {
                        this._creatureList["m" + _loc1_].tInfo.htmlText = KEYS.Get("mh_item_locked");
                    }
                } else if (!_loc6_ && CREATURELOCKER._lockerData[_loc1_].t == 1) {
                    this._creatureList["m" + _loc1_].tInfo.htmlText = KEYS.Get("mh_item_unlocking");
                    this._creatureList["m" + _loc1_].alpha = 0.5;
                } else {
                    this._creatureList["m" + _loc1_].tInfo.htmlText = KEYS.Get("mh_item_0housed");
                    this._creatureList["m" + _loc1_].alpha = 0.5;
                }
            }
        }
        
        const _loc9_: number = Number(GLOBAL.player.monsterList.length);
        let _loc10_: number = 0;
        while (_loc10_ < _loc9_) {
            _loc2_ = GLOBAL.player.monsterList[_loc10_].m_creatureID;
            const _loc12_: number = GLOBAL.player.monsterList[_loc10_].numCreeps;
            if (this._creatureList["m" + _loc2_]) {
                if (_loc12_ > 0) {
                    const _loc5_: any = CREATURELOCKER._creatures[_loc2_];
                    if (Boolean(this._juiceList[_loc2_]) && this._juiceList[_loc2_] > 0) {
                        this._creatureList["m" + _loc2_].tInfo.htmlText = "<font color=\"#FF0000\">" + KEYS.Get("mh_selectedforjuicing", {
                            "v1": this._juiceList[_loc2_],
                            "v2": GLOBAL.FormatNumber(_loc12_)
                        }) + "</font>";
                    } else {
                        this._creatureList["m" + _loc2_].tInfo.htmlText = KEYS.Get("mh_item_cost", {
                            "v1": GLOBAL.FormatNumber(_loc12_),
                            "v2": GLOBAL.FormatNumber(CREATURES.GetProperty(_loc2_, "cStorage") * _loc12_)
                        });
                    }
                    this._creatureList["m" + _loc2_].alpha = 1;
                }
            }
            _loc10_++;
        }
        
        if (GLOBAL._bJuicer) {
            _loc3_ = 0;
            _loc4_ = 0;
            for (_loc2_ in this._juiceList) {
                _loc6_ = _loc2_.substring(0, 2) == "IC";
                if (!_loc6_) {
                    _loc3_ += this._juiceList[_loc2_];
                    let _loc14_: number = 0.6;
                    if (GLOBAL._bJuicer._lvl.Get() == 2) {
                        _loc14_ = 0.8;
                    }
                    if (GLOBAL._bJuicer._lvl.Get() == 3) {
                        _loc14_ = 1;
                    }
                    _loc4_ += Math.ceil(CREATURES.GetProperty(_loc2_, "cResource") * _loc14_) * this._juiceList[_loc2_];
                }
            }
            if (_loc3_ > 0) {
                this.bJuice.Enabled = true;
                this.bJuice.Highlight = true;
                this.bCancel.Enabled = true;
                if (_loc3_ == 1) {
                    this.bJuice.Setup(KEYS.Get("mh_juicemonsterX_btn", {
                        "v1": _loc3_,
                        "v2": GLOBAL.FormatNumber(_loc4_)
                    }));
                } else {
                    this.bJuice.Setup(KEYS.Get("mh_juicemonstersX_btn", {
                        "v1": _loc3_,
                        "v2": GLOBAL.FormatNumber(_loc4_)
                    }));
                }
            } else {
                this.bJuice.Enabled = false;
                this.bCancel.Enabled = false;
            }
            if (HOUSING._housingUsed.Get() == 0) {
                this.bAll.Enabled = false;
            } else {
                this.bAll.Enabled = true;
            }
        }
        this._scroller.Update();
    }

    public JuicerAdd(param1: string): (param1?: MouseEvent) => void {
        const n: string = param1;
        const isInfernoType: boolean = n.substring(0, 2) == "IC";
        const self = this;
        return function(param1?: MouseEvent): void {
            if (isInfernoType) {
                GLOBAL.Message(KEYS.Get("msg_juicernoinferno"));
                return;
            }
            if (GLOBAL._bJuicer._countdownUpgrade.Get() == 0) {
                if (GLOBAL._bJuicer.health > GLOBAL._bJuicer.maxHealth * 0.5) {
                    if (Boolean(GLOBAL.player.monsterListByID(n)) && GLOBAL.player.monsterListByID(n).numCreeps - Number(self._juiceList[n]) > 0) {
                        if (!self._juiceList[n]) {
                            self._juiceList[n] = 0;
                        }
                        ++self._juiceList[n];
                    }
                    self.Update();
                } else {
                    GLOBAL.Message(KEYS.Get("msg_juicerdamaged"));
                }
            } else {
                GLOBAL.Message(KEYS.Get("msg_juicerupgrading"));
            }
        };
    }

    public Juice(param1: MouseEvent | null = null): void {
        let _loc2_: string = "";
        const _loc6_: BFOUNDATION[] = [];
        const _loc7_: BFOUNDATION[] = InstanceManager.getInstancesByClass(BASE.isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15);
        for (const _loc4_ of _loc7_) {
            _loc6_.push(_loc4_);
        }
        for (_loc2_ in this._juiceList) {
            GLOBAL.player.monsterListByID(_loc2_).add(-this._juiceList[_loc2_]);
            for (const _loc5_ of Object.values(CREATURES._creatures)) {
                if (this._juiceList[_loc2_] > 0) {
                    if (_loc5_._creatureID == _loc2_ && _loc5_._behaviour != "juice") {
                        _loc5_.changeModeJuice();
                        --this._juiceList[_loc2_];
                    }
                }
            }
            let _loc8_: number = 0;
            while (_loc8_ < this._juiceList[_loc2_]) {
                const _loc4_: BFOUNDATION = _loc6_[Math.floor(Math.random() * _loc6_.length)];
                CREATURES.Spawn(_loc2_, MAP._BUILDINGTOPS, "juice", new Point(_loc4_.x, _loc4_.y).add(new Point(-60 + Math.random() * 135, 65 + Math.random() * 50)), Math.random() * 360);
                _loc8_++;
            }
        }
        this._juiceList = {};
        HOUSING.HousingSpace();
        BASE.Save();
        HOUSING.Hide();
    }

    public SelectAll(param1: MouseEvent | null = null): void {
        if (GLOBAL._bJuicer._countdownUpgrade.Get() == 0) {
            this._juiceList = {};
            const _loc2_: number = Number(GLOBAL.player.monsterList.length);
            let _loc4_: number = 0;
            while (_loc4_ < _loc2_) {
                const _loc3_: string = GLOBAL.player.monsterList[_loc4_].m_creatureID;
                const _loc5_: boolean = _loc3_.substring(0, 2) == "IC";
                if (GLOBAL.player.monsterList[_loc4_].numCreeps > 0 && !_loc5_) {
                    this._juiceList[_loc3_] = GLOBAL.player.monsterList[_loc4_].numCreeps;
                }
                _loc4_++;
            }
            this.Update();
        } else {
            GLOBAL.Message(KEYS.Get("msg_juicerupgrading"));
        }
    }

    public SelectNone(param1: MouseEvent | null = null): void {
        this._juiceList = {};
        this.bJuice.SetupKey("mh_nomonsters_btn");
        this.bJuice.Enabled = false;
        this.bJuice.Highlight = false;
        this.Update();
    }

    public Ascend(param1: MouseEvent | null = null): void {
        SOUNDS.Play("click1");
        this.Hide();
        INFERNOPORTAL.AscendMonsters();
    }

    public Hide(): void {
        HOUSING.Hide();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
