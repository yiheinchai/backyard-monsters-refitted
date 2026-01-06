import { Bitmap } from 'openfl/display/Bitmap';
import { BitmapData } from 'openfl/display/BitmapData';
import { MovieClip } from 'openfl/display/MovieClip';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { Point } from 'openfl/geom/Point';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSet } from './com/monsters/display/ScrollSet';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { CreepInfo } from './com/monsters/player/CreepInfo';
import { MonsterBunkerPopup_Persistent_CLIP } from './MonsterBunkerPopup_Persistent_CLIP';
import { MonsterBunkerPopup_TransferBtnA_CLIP_Persistant } from './MonsterBunkerPopup_TransferBtnA_CLIP_Persistant';
import { MonsterBunkerPopup_TransferBtnB_CLIP_Persistant } from './MonsterBunkerPopup_TransferBtnB_CLIP_Persistant';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { HOUSING } from './HOUSING';
import { KEYS } from './KEYS';
import { CREATURES } from './CREATURES';
import { CREATURELOCKER } from './CREATURELOCKER';
import { MONSTERBUNKER } from './MONSTERBUNKER';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { SOUNDS } from './SOUNDS';
import { GRID } from './GRID';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { BFOUNDATION } from './BFOUNDATION';

export class PersistentMonsterBunker extends MonsterBunkerPopup_Persistent_CLIP {
    private static readonly kBarWidth: number = 535;

    private m_bunker: any = null;
    private _capacity: number = 0;
    private _selected: any;
    private _scrollerA: ScrollSet;
    private _scrollerB: ScrollSet;
    private _guidePage: number = 0;

    private readonly BUNKERABLE_MONSTERS: any = {
        "IC1": 1, "IC2": 1, "IC3": 1, "IC4": 1, "IC5": 1, "IC6": 1, "IC7": 1, "IC8": 1,
        "C1": 1, "C2": 1, "C3": 1, "C4": 1, "C5": 1, "C6": 1, "C7": 1, "C8": 1,
        "C9": 1, "C10": 1, "C11": 1, "C12": 1, "C13": 1, "C17": 1
    };

    constructor() {
        super();
        this.m_bunker = GLOBAL._selectedBuilding;
        this._capacity = GLOBAL._buildingProps[21].capacity[this.m_bunker._lvl.Get() - 1];
        this._selected = {};
        this.transferCanvasA.mask = this.transferCanvasAmask;
        this.transferCanvasB.mask = this.transferCanvasBmask;
        const _loc2_ = 267;
        this._scrollerA = new ScrollSet();
        this._scrollerA.AutoHideEnabled = false;
        this._scrollerA.width = 16;
        this._scrollerA.x = -50;
        this._scrollerA.y = -102;
        this.addChild(this._scrollerA);
        this._scrollerA.Init(this.transferCanvasA, this.transferCanvasAmask, 0, this._scrollerA.y, _loc2_);
        this._scrollerB = new ScrollSet();
        this._scrollerB.AutoHideEnabled = false;
        this._scrollerB.width = 16;
        this._scrollerB.x = 300;
        this._scrollerB.y = -102;
        this.addChild(this._scrollerB);
        this._scrollerB.Init(this.transferCanvasB, this.transferCanvasBmask, 0, this._scrollerB.y, _loc2_);
        this.title_txt.htmlText = KEYS.Get("bunker_title");
        this.tCapacity.htmlText = "<b>" + KEYS.Get("bunker_word") + "</b>";
        this.tHousing.htmlText = "<b>" + KEYS.Get("bunker_all_monsters") + "</b>";
        const _loc3_ = HOUSING._housingUsed.Get();
        const _loc4_ = HOUSING._housingCapacity.Get();
        const _loc5_ = Math.floor(_loc3_ * 100 / _loc4_);
        this.tHoused.htmlText = "<b>" + KEYS.Get("bunker_capacity2") + " " + GLOBAL.FormatNumber(_loc3_) + " / " + GLOBAL.FormatNumber(_loc4_) + " (" + _loc5_ + "%)<b>";
        this.mcHousing.mcBar.width = PersistentMonsterBunker.kBarWidth * (_loc3_ / _loc4_);
        this.mcHousing.mcBarB.width = 0;
        this.Update();
    }

    public InitTransferBarAListeners(param1: MovieClip): void {
        param1.bAdd.addEventListener(MouseEvent.CLICK, this.SelectAdd.bind(this));
        param1.bAdd.Setup(">>");
        param1.bAdd.buttonMode = true;
    }

    public InitTransferBarBListeners(param1: MovieClip): void {
        param1.bRemove.addEventListener(MouseEvent.CLICK, this.ReturnMonsterId.bind(this));
        param1.bRemove.Setup("&lt;&lt;");
        param1.bRemove.buttonMode = true;
    }

    public RemoveTransferBarListeners(param1: MovieClip): void {
        if (param1 instanceof MonsterBunkerPopup_TransferBtnA_CLIP_Persistant) {
            param1.bAdd.removeEventListener(MouseEvent.CLICK, this.SelectAdd.bind(this));
        } else if (param1 instanceof MonsterBunkerPopup_TransferBtnB_CLIP_Persistant) {
            param1.bRemove.removeEventListener(MouseEvent.CLICK, this.ReturnMonsterId.bind(this));
        }
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        const _loc4_ = new Bitmap(param2);
        _loc4_.smoothing = true;
        param3[0].mcImage.addChild(_loc4_);
        param3[0].mcLoading.visible = false;
    }

    private CanBunkerFromHousing(param1: string): boolean {
        let _loc2_ = false;
        if (this.BUNKERABLE_MONSTERS[param1] && GLOBAL.player.monsterListByID(param1).numHealthyHousedCreeps > 0) {
            _loc2_ = true;
        }
        return _loc2_;
    }

    private ClearTransferCanvas(param1: MovieClip = null): void {
        const _loc2_: MovieClip[] = [];
        switch (param1) {
            case this.transferCanvasA:
                _loc2_.push(this.transferCanvasA);
                break;
            case this.transferCanvasB:
                _loc2_.push(this.transferCanvasB);
                break;
            default:
                _loc2_.push(this.transferCanvasA);
                _loc2_.push(this.transferCanvasB);
        }
        for (let _loc3_ = 0; _loc3_ < _loc2_.length; _loc3_++) {
            while (_loc2_[_loc3_].numChildren) {
                if (_loc2_[_loc3_].getChildAt(0) instanceof MovieClip) {
                    this.RemoveTransferBarListeners(_loc2_[_loc3_].getChildAt(0) as MovieClip);
                }
                _loc2_[_loc3_].removeChildAt(0);
            }
        }
    }

    public Update(): void {
        let _loc1_: string = null;
        let _loc2_: string = null;
        let _loc10_: number = 0;
        let _loc3_ = 0;
        let _loc4_ = 0;
        let _loc5_ = 0;

        this.ClearTransferCanvas(this.transferCanvasA);
        let _loc9_ = 1;
        const _loc18_ = HOUSING.GetHousingCreatures();

        for (let _loc8_ = 0; _loc8_ < _loc18_.length; _loc8_++) {
            _loc1_ = String(_loc18_[_loc8_].id);
            if (this.CanBunkerFromHousing(_loc1_)) {
                const _loc20_ = new MonsterBunkerPopup_TransferBtnA_CLIP_Persistant();
                ImageCache.GetImageWithCallBack("monsters/" + _loc1_ + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [_loc20_.mcIcon]);
                let _loc21_ = String(CREATURELOCKER._creatures[_loc1_].name);
                if (_loc1_ == "IC8") {
                    _loc21_ = "#m_k_wormzer#";
                }
                _loc20_.tName.htmlText = "<b>" + KEYS.Get(_loc21_) + "</b>";
                _loc20_.id = _loc1_;
                _loc20_._id = _loc1_.substring(_loc1_.indexOf("C") + 1);
                _loc20_.index = _loc1_.substring(_loc1_.indexOf("C") + 1);
                _loc10_ = GLOBAL.player.monsterListByID(_loc1_).numHealthyHousedCreeps;
                if (_loc10_ == 0) {
                    _loc20_.tHoused.htmlText = "<font color=\"#FF0000\">" + KEYS.Get("bunker_housed", { "v1": 0 }) + "</font>";
                } else {
                    _loc20_.tHoused.htmlText = "<font color=\"#000000\">" + KEYS.Get("bunker_housed", { "v1": _loc10_ }) + "</font>";
                }
                _loc20_.bAdd.Enabled = _loc10_ != 0;
                _loc20_.tSize.text = CREATURES.GetProperty(_loc1_, "cStorage", 0, true).toString();
                _loc20_.x = 0;
                _loc20_.y = (_loc9_ - 1) * _loc20_.height;
                this.InitTransferBarAListeners(_loc20_);
                this.transferCanvasA.addChild(_loc20_);
                _loc9_ += 1;
            }
        }

        if (_loc9_ == 1) {
            this.tNoMonsters.htmlText = KEYS.Get("mr3_bunker_empty");
        } else {
            this.tNoMonsters.htmlText = "";
        }

        _loc9_ = 0;
        for (_loc2_ in this._selected) {
            _loc9_ += this._selected[_loc2_].Get();
        }
        for (_loc2_ in this.m_bunker._monsters) {
            _loc4_ += CREATURES.GetProperty(_loc2_, "cStorage", 0, true) * this.m_bunker._monsters[_loc2_].length;
        }
        this.m_bunker._used = _loc4_;
        for (_loc2_ in this._selected) {
            _loc5_ += CREATURES.GetProperty(_loc2_, "cStorage", 0, true) * this._selected[_loc2_].Get();
        }

        const _loc19_ = 100 / this._capacity * (_loc4_ + _loc5_);
        this.mcStorage.mcBar.width = 0;
        this.mcStorage.mcBarB.width = 535 / this._capacity * (_loc4_ + _loc5_);

        if (_loc4_ + _loc5_ >= this._capacity) {
            if (this.m_bunker._lvl.Get() < 3) {
                this.tStored.htmlText = KEYS.Get("bunker_full_2");
            } else {
                this.tStored.htmlText = "<b>" + KEYS.Get("bunker_full") + "</b>";
            }
        } else {
            this.tStored.htmlText = "<b>" + KEYS.Get("bunker_capacity2") + " " + GLOBAL.FormatNumber(_loc4_ + _loc5_) + " / " + GLOBAL.FormatNumber(this._capacity) + " (" + _loc19_ + "%)</b>";
        }

        this.ClearTransferCanvas(this.transferCanvasB);
        _loc9_ = 1;
        for (_loc2_ in this.m_bunker._monsters) {
            const _loc22_ = this.m_bunker._monsters[_loc2_].length;
            if (_loc22_ > 0) {
                const _loc7_ = CREATURELOCKER._creatures[_loc2_];
                const _loc23_ = new MonsterBunkerPopup_TransferBtnB_CLIP_Persistant();
                _loc23_.id = _loc2_;
                _loc23_._id = _loc2_.substr(1);
                _loc23_.index = _loc2_.substr(1);
                _loc23_.tName.htmlText = "<b>" + KEYS.Get(CREATURELOCKER._creatures[_loc2_].name) + "</b>";
                _loc23_.tHoused.htmlText = KEYS.Get("bunker_bunkered", { "v1": _loc22_ });
                ImageCache.GetImageWithCallBack("monsters/" + _loc2_ + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [_loc23_.mcIcon]);
                _loc23_.bRemove.Enabled = _loc22_ != 0;
                _loc23_.tSize.text = CREATURES.GetProperty(_loc2_, "cStorage", 0, true).toString();
                _loc23_.x = 0;
                _loc23_.y = (_loc9_ - 1) * _loc23_.height;
                this.InitTransferBarBListeners(_loc23_);
                this.transferCanvasB.addChild(_loc23_);
                _loc9_ += 1;
            }
        }
        this.UpdateScrollers();
    }

    private UpdateScrollers(param1: boolean = false): void {
        if (this._scrollerA) {
            this._scrollerA.Update();
        }
        if (this._scrollerB) {
            this._scrollerB.Update();
        }
        if (param1) {
            this._scrollerA.ScrollTo(0, true);
            this._scrollerA.Update();
            this._scrollerB.ScrollTo(0, true);
            this._scrollerB.Update();
        }
    }

    private SelectAdd(param1: MouseEvent = null): void {
        SOUNDS.Play("click1");
        const _loc2_ = String(param1.target.parent.id);
        if (_loc2_ && this.CheckID(_loc2_)) {
            this.BunkerStore(_loc2_);
            this.Update();
        }
    }

    private CheckID(param1: string): boolean {
        let _loc6_: string = null;
        const _loc2_ = param1.substring(0, 2) == "IC";
        let _loc3_ = 0;
        let _loc4_ = 0;
        let _loc5_ = 0;

        for (_loc6_ in this.m_bunker._monsters) {
            _loc4_ += CREATURES.GetProperty(_loc6_, "cStorage", 0, true) * this.m_bunker._monsters[_loc6_].length;
        }
        for (_loc6_ in this._selected) {
            _loc5_ += CREATURES.GetProperty(_loc6_, "cStorage", 0, true) * this._selected[_loc6_].Get();
        }

        if (CREATURELOCKER._creatures[param1].props.cStorage.length > 1) {
            _loc5_ += CREATURELOCKER._creatures[param1].props.cStorage[CREATURELOCKER._creatures[param1].level];
        } else {
            _loc5_ += CREATURELOCKER._creatures[param1].props.cStorage;
        }

        if (_loc4_ + _loc5_ > this._capacity) {
            return false;
        }

        if (GLOBAL.player.monsterListByID(param1) && GLOBAL.player.monsterListByID(param1).numHealthyHousedCreeps > 0) {
            _loc3_ = GLOBAL.player.monsterListByID(param1).numHealthyHousedCreeps;
        }

        if (this._selected[param1]) {
            _loc3_ -= this._selected[param1].Get();
        }

        if (_loc3_ > 0) {
            return true;
        }
        return false;
    }

    private BunkerStore(param1: string): void {
        let _loc3_: BFOUNDATION = null;
        let _loc5_: any = undefined;
        let _loc6_: any = undefined;
        let _loc7_: CreepInfo = null;
        const _loc2_: any[] = [];

        for (_loc3_ of BASE._buildingsHousing) {
            _loc2_.push(_loc3_);
        }

        InstanceManager.getInstancesByClass(HOUSING);
        const _loc4_ = CREATURELOCKER._creatures[param1].props.cStorage;

        if (GLOBAL.player.monsterListByID(param1) && _loc4_ <= this.m_bunker._capacity - this.m_bunker._used) {
            _loc5_ = null;
            for (_loc6_ of CREATURES._creatures) {
                if (_loc6_._creatureID == param1 && (_loc6_._behaviour == "housing" || _loc6_._behaviour == "pen")) {
                    _loc5_ = _loc6_;
                    break;
                }
            }

            if (_loc5_) {
                _loc5_._homeBunker = this.m_bunker;
                _loc5_.changeModeBunker();
                _loc7_ = GLOBAL.player.monsterListByID(param1).reserve(this.m_bunker._id);
                if (_loc7_) {
                    if (this.m_bunker._monsters[param1] && this.m_bunker._monsters[param1].length > 0) {
                        this.m_bunker._monsters[param1].push(_loc7_);
                        this.m_bunker._used += _loc4_;
                        if (this.m_bunker._monstersDispatched[param1]) {
                            this.m_bunker._monstersDispatched[param1] += 1;
                        } else {
                            this.m_bunker._monstersDispatched[param1] = 1;
                        }
                    } else {
                        this.m_bunker._monsters[param1] = [];
                        this.m_bunker._monsters[param1].push(_loc7_);
                        this.m_bunker._monstersDispatched[param1] = 1;
                    }
                    ++this.m_bunker._monstersDispatchedTotal;
                }
            }
            this.Update();
            HOUSING.HousingSpace();
        }
    }

    private ReturnMonsterId(param1: MouseEvent): void {
        SOUNDS.Play("click1");
        this.bunkerRemove(param1.target.parent.id);
    }

    private bunkerRemove(param1: string): void {
        let _loc5_: BFOUNDATION = null;
        let _loc6_: Point = null;
        const _loc2_ = GLOBAL.player.monsterListByID(param1).release(this.m_bunker._id);

        if (_loc2_) {
            const _loc3_ = this.m_bunker._monsters[param1].length;
            for (let _loc4_ = 0; _loc4_ < _loc3_; _loc4_++) {
                if (this.m_bunker._monsters[param1][_loc4_] == _loc2_) {
                    this.m_bunker._monsters[param1].splice(_loc4_, 1);
                    break;
                }
            }
            --this.m_bunker._monstersDispatched[param1];
            if (this.m_bunker._monstersDispatched[param1] < 0) {
                this.m_bunker._monstersDispatched[param1] = 0;
            }
            --this.m_bunker._monstersDispatchedTotal;
            if (this.m_bunker._monstersDispatchedTotal < 0) {
                this.m_bunker._monstersDispatchedTotal = 0;
            }

            if (_loc2_.self) {
                if (_loc2_.self._house) {
                    _loc5_ = _loc2_.self._house;
                } else {
                    _loc5_ = HOUSING.getClosestHouseToPoint(new Point(_loc2_.self.x, _loc2_.self.y));
                }
                _loc2_.self._targetCenter = GRID.FromISO(_loc5_.x, _loc5_.y);
                _loc2_.self.changeModeHousing();
            } else {
                _loc6_ = new Point(this.m_bunker._mc.x - 10 + Math.random() * 20, this.m_bunker._mc.y - 10 + Math.random() * 20);
                _loc2_.self = HOUSING.createAndHouseCreep(param1, _loc6_);
            }
        }
        this.Update();
    }

    public GetBunkerCreatures(): any[] {
        let _loc9_: string = null;
        let _loc10_: any = null;
        let _loc11_: string = null;
        let _loc12_: any = null;
        const _loc1_: any = {};
        const _loc2_: any[] = [];
        const _loc3_: any[] = [];
        let _loc4_: any[] = [];
        const _loc5_ = CREATURELOCKER.GetCreatures("above");
        const _loc6_ = !BASE.isInfernoMainYardOrOutpost;

        if (_loc6_) {
            for (_loc9_ in _loc5_) {
                _loc10_ = CREATURELOCKER._creatures[_loc9_];
                if (!_loc10_.blocked) {
                    _loc10_.id = _loc9_;
                    _loc2_.push(_loc10_);
                    _loc1_[_loc9_] = _loc10_;
                }
            }
            _loc2_.sort((a: any, b: any) => a.index - b.index);
        }

        const _loc7_ = CREATURELOCKER.GetCreatures("inferno");
        const _loc8_ = MAPROOM_DESCENT.DescentPassed;

        if (_loc8_) {
            for (_loc11_ in _loc7_) {
                _loc12_ = CREATURELOCKER._creatures[_loc11_];
                if (!_loc12_.blocked) {
                    _loc12_.id = _loc11_;
                    _loc3_.push(_loc12_);
                    _loc1_[_loc11_] = _loc12_;
                }
            }
            _loc3_.sort((a: any, b: any) => a.index - b.index);
        }

        if (_loc2_.length > 0) {
            _loc4_ = _loc4_.concat(_loc2_);
        }
        if (_loc3_.length > 0) {
            _loc4_ = _loc4_.concat(_loc3_);
        }
        return _loc4_;
    }

    public Help(param1: MouseEvent = null): void {
        this._guidePage += 1;
        const _loc2_ = KEYS.Get("bunker_tut_" + this._guidePage);
        if (this._guidePage <= 3) {
            this.gotoAndStop(2);
            this.txtGuide.htmlText = _loc2_;
            if (this._guidePage == 1) {
                this.bContinue.addEventListener(MouseEvent.CLICK, this.Help.bind(this));
                this.bContinue.SetupKey("btn_continue");
            }
        } else {
            this._guidePage = 0;
            this.gotoAndStop(1);
        }
    }

    public Hide(param1: MouseEvent = null): void {
        MONSTERBUNKER.Hide(param1);
        BASE.Save();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
