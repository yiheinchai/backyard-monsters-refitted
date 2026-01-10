import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSet } from './com/monsters/display/ScrollSet';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { MonsterBase } from './com/monsters/monsters/MonsterBase';
import { CreepInfo } from './com/monsters/player/CreepInfo';
import { MonsterData } from './com/monsters/player/MonsterData';
import { Player } from './com/monsters/player/Player';
import { PersistantJuiceAllPopup } from './com/monsters/ui/popups/PersistantJuiceAllPopup';
import { HousingPersistentPopup_CLIP } from './HousingPersistentPopup_CLIP';
import { HousingPersistentMonsterBar } from './HousingPersistentMonsterBar';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { KEYS } from './KEYS';
import { HOUSING } from './HOUSING';
import { CREATURES } from './CREATURES';
import { CREATURELOCKER } from './CREATURELOCKER';
import { STORE } from './STORE';
import { POPUPS } from './POPUPS';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { SOUNDS } from './SOUNDS';
import { MESSAGE } from './MESSAGE';
import { BUILDING15 } from './BUILDING15';
import { HOUSINGBUNKER } from './HOUSINGBUNKER';
import { BFOUNDATION } from './BFOUNDATION';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { INFERNOPORTAL } from './INFERNOPORTAL';

export class HousingPersistentPopup extends HousingPersistentPopup_CLIP {
    public _juiceList: any;
    public m_monsterBarList: any;
    private m_bunkerIDList: any[];
    public _scroller: ScrollSet;
    private m_strLastSelectedJuiced: string = "";
    private m_nJuiceAmount: number = 0;
    private m_bShownPopup: boolean = false;
    private m_JuiceAllPopup: PersistantJuiceAllPopup;
    private readonly k_juiceAllPopupLimit: number = 5;
    private readonly k_offsetY: number = 51;
    private readonly k_offsetTextY: number = 25;
    private readonly k_titlesX: number = 15;
    private readonly k_aBit: number = 8;

    constructor() {
        super();
        this._juiceList = {};
        this.m_monsterBarList = {};
        this.m_bunkerIDList = [];

        if (!BASE.isInfernoMainYardOrOutpost) {
            this.bTransfer.SetupKey("btn_ascendmonsters");
            this.bTransfer.addEventListener(MouseEvent.CLICK, this.ascend.bind(this));
        } else {
            this.bTransfer.visible = false;
        }

        this.bJuice.SetupKey("mh_nomonsters_btn");
        this.bJuice.addEventListener(MouseEvent.CLICK, this.juiceCheck.bind(this));
        this.bClear.SetupKey("btn_clear");
        this.bClear.addEventListener(MouseEvent.CLICK, this.selectNone.bind(this));
        this.bHealAll.SetupKey("btn_housing_heal_all");
        this.bHealAll.Highlight = true;
        this.bHealAll.addEventListener(MouseEvent.CLICK, this.healInstantAllShinyCheck.bind(this));
        this.tHealthText.htmlText = "<b>" + KEYS.Get("mh_health_column_label") + "</b>";
        this.tCapacityText.htmlText = "<b>" + KEYS.Get("mh_capacity_column_label") + "</b>";

        if (GLOBAL._bJuicer) {
            this.tJuicingText.htmlText = KEYS.Get("mh_juicing_txt");
        } else {
            this.tJuicingText.htmlText = "";
            this.bJuice.visible = false;
            this.bClear.visible = false;
        }

        this.tTitleHealing.htmlText = KEYS.Get("mh_healing_section_label");
        this.tTitleHealing.visible = false;
        this.tTitleHousing.htmlText = KEYS.Get("mh_housing_section_label");
        this.tTitleBunkers.htmlText = KEYS.Get("mh_bunkers_section_label");
        this.tTitleBunkers.visible = false;
        this.m_bgWhite.x = this.m_bgWhite.y = 0;
        this.m_bgWhite.height = 0;
        this.monsterContainer.addChild(this.m_bgWhite);
        this.gotoAndStop(1);
        this._juiceList = {};

        const creaturesList = this.getHousableCreatures();
        for (let _loc1_ = 0; _loc1_ < creaturesList.length; _loc1_++) {
            const _loc10_ = String(creaturesList[_loc1_].id);
            const _loc11_ = new HousingPersistentMonsterBar(_loc10_);
            _loc11_.x = 0;
            _loc11_.y = _loc1_ * this.k_offsetY;
            _loc11_.mouseChildren = true;
            this.monsterContainer.addChild(_loc11_);
            this.m_monsterBarList[_loc10_] = _loc11_;

            let _loc12_ = 0;
            if (_loc10_.substr(0, 1) != "B") {
                _loc12_ = GLOBAL.player.monsterListByID(_loc10_).numHousedCreeps;
                ImageCache.GetImageWithCallBack("monsters/" + _loc10_ + "-medium.jpg", this.iconLoaded.bind(this), true, 1, "", [_loc11_.mcIcon]);
                _loc11_.tName.htmlText = "<b>" + KEYS.Get(CREATURELOCKER._creatures[_loc10_].name) + "</b> x" + _loc12_;
            } else {
                ImageCache.GetImageWithCallBack("monsters/bunker-medium.jpg", this.iconLoaded.bind(this), true, 1, "", [_loc11_.mcIcon]);
                _loc11_.tName.htmlText = "<b>" + KEYS.Get("#b_monsterbunker#") + "</b>";
            }
            _loc11_.m_healthBar.mcBar.width = HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth * GLOBAL.player.curHealthByID(_loc10_) / GLOBAL.player.totalHealthByID(_loc10_);
            _loc11_.m_capacityBar.mcBar.width = HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth * GLOBAL.player.getStorageByID(_loc10_) / HOUSING._housingCapacity.Get();
            _loc11_.m_capacityBar.mcBarGrey.width = _loc11_.m_capacityBar.mcBar.width;
            _loc11_.tCapacityText.htmlText = "<b>" + GLOBAL.player.getStorageByID(_loc10_) + "</b>";
            _loc11_.tHealStatusText.htmlText = "";
            if (GLOBAL.player.checkQueued(_loc10_)) {
                this.setHealMode(_loc11_);
            } else {
                this.setNormalMode(_loc11_);
            }
            _loc11_.buttonMode = false;
        }

        this.tCapacityText.x = 320;
        this.tHealthText.x = 145;
        this.tCapacityText.y = this.tHealthText.y = this.k_aBit;
        this.monsterContainer.addChild(this.tHealthText);
        this.monsterContainer.addChild(this.tCapacityText);
        this.tTitleBunkers.x = this.tTitleHousing.x = this.tTitleHealing.x = this.k_titlesX;
        this.tTitleBunkers.y = this.tTitleHousing.y = this.tTitleHealing.y = this.k_aBit;
        this.monsterContainer.addChild(this.tTitleHealing);
        this.monsterContainer.addChild(this.tTitleHousing);
        this.monsterContainer.addChild(this.tTitleBunkers);
        this.m_line.visible = false;
        this.monsterContainer.addChild(this.m_line);
        this.mcStorage.mcBarB.width = 535 / HOUSING._housingCapacity.Get() * HOUSING._housingUsed.Get();
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
            this.capacity_desc_txt.htmlText = "<b>" + KEYS.Get("compound_capacity_desc") + "</b>";
            this.tAscendText.htmlText = "";
        } else {
            this.title_txt.htmlText = KEYS.Get("mh_title");
            this.capacity_desc_txt.htmlText = "<b>" + KEYS.Get("mh_capacity_desc") + "</b>";
            this.tAscendText.htmlText = "";
        }
        this.Update();
        this.reorganize();
    }

    private numHurtCreeps(param1: string): number {
        const _loc2_ = GLOBAL.player.monsterListByID(param1).numHousedCreeps;
        return _loc2_ - _loc2_ * (GLOBAL.player.curHealthByID(param1) / GLOBAL.player.totalHealthByID(param1));
    }

    private refundResourcesEvent(param1: MouseEvent = null): void {
        const _loc2_ = (param1.target.parent as HousingPersistentMonsterBar).m_creatureID;
        GLOBAL.player.refundResources(_loc2_, true);
        this.healQueueRemove(param1.target.parent as HousingPersistentMonsterBar);
    }

    private attemptHeal(param1: MouseEvent = null): void {
        const _loc2_ = (param1.target.parent as HousingPersistentMonsterBar).m_creatureID;
        const _loc3_ = GLOBAL.player.getResourceCostByID(_loc2_);
        const _loc4_ = _loc2_.substr(0, 1) == "I" && !BASE.isInfernoMainYardOrOutpost;
        this.selectNone();
        if (BASE.Charge(4, _loc3_, true, _loc4_)) {
            BASE.Charge(4, _loc3_, false, _loc4_);
            this.healQueueAdd(param1.target.parent as HousingPersistentMonsterBar);
        } else {
            const _loc5_ = _loc4_ ? BASE._iresources.r4.Get() : BASE._resources.r4.Get();
            const resourceCost = _loc3_ - _loc5_;
            const _loc6_ = GLOBAL.getShinyCostFromResourceAmt(resourceCost);
            const _loc7_ = GLOBAL.player.getNumToHealByResourceCost(_loc2_, _loc5_).num;
            const _loc8_ = _loc2_.substr(0, 1) == "B" ? "msg_moreresourcesheal" : (_loc2_.substr(0, 1) == "I" ? "msg_moremagmaheal2" : "msg_moreresourcesheal2");
            let _loc9_: MESSAGE;
            if (_loc7_) {
                if ((param1.target.parent as HousingPersistentMonsterBar).m_creatureID.substr(0, 1) == "B") {
                    _loc9_ = GLOBAL.Message(KEYS.Get(_loc8_, {
                        "v1": GLOBAL.FormatNumber(resourceCost),
                        "v2": GLOBAL.FormatNumber(_loc6_)
                    }), KEYS.Get("buildoptions_shiny", { "v1": _loc6_ }), this.startHealWithShiny.bind(this), [param1.target.parent as HousingPersistentMonsterBar]);
                } else {
                    _loc9_ = GLOBAL.Message(KEYS.Get(_loc8_, {
                        "v1": _loc7_,
                        "v2": GLOBAL.FormatNumber(resourceCost),
                        "v3": GLOBAL.FormatNumber(_loc6_)
                    }), KEYS.Get("buildoptions_shiny", { "v1": _loc6_ }), this.startHealWithShiny.bind(this), [param1.target.parent as HousingPersistentMonsterBar], KEYS.Get("btn_healmon", { "v1": _loc7_ }), this.healPartialWithGoo.bind(this), [param1.target.parent as HousingPersistentMonsterBar]);
                }
            } else {
                _loc9_ = GLOBAL.Message(KEYS.Get(_loc8_, {
                    "v1": _loc7_,
                    "v2": GLOBAL.FormatNumber(resourceCost),
                    "v3": GLOBAL.FormatNumber(_loc6_)
                }), KEYS.Get("buildoptions_shiny", { "v1": _loc6_ }), this.startHealWithShiny.bind(this), [param1.target.parent as HousingPersistentMonsterBar]);
            }
            _loc9_.bAction.Highlight = true;
        }
    }

    private healPartialWithGoo(param1: HousingPersistentMonsterBar): void {
        const _loc2_ = param1.m_creatureID;
        const _loc3_ = _loc2_.substr(0, 1) == "I" && !BASE.isInfernoMainYardOrOutpost;
        const _loc4_ = _loc3_ ? BASE._iresources.r4.Get() : BASE._resources.r4.Get();
        const _loc6_ = GLOBAL.player.getNumToHealByResourceCost(_loc2_, _loc4_);
        if (!_loc6_.num) {
            return;
        }
        GLOBAL.player.queuePartialHeal(_loc2_, _loc6_.num);
        BASE.Charge(4, _loc4_ - _loc6_.resoLeft, false, _loc3_);
        this.setHealMode(param1);
        this.updateHealAllButton();
        BASE.SaveB();
    }

    private startHealWithShiny(param1: HousingPersistentMonsterBar): void {
        const _loc2_ = param1.getResourceCostInShiny();
        const _loc3_ = param1.m_creatureID.substr(0, 1) == "I" && !BASE.isInfernoMainYardOrOutpost;
        if (BASE._pendingPurchase.length == 0) {
            if (_loc2_ > BASE._credits.Get()) {
                POPUPS.DisplayGetShiny();
            } else {
                BASE.Charge(4, _loc3_ ? BASE._iresources.r4.Get() : BASE._resources.r4.Get(), false, _loc3_);
                this.healQueueAdd(param1);
                if (_loc2_ > 0) {
                    BASE.Purchase("MHTOPUP", _loc2_, "HousingPersistentPopup.startHealWithShiny");
                }
            }
        }
    }

    private healInstantAllShinyCheck(param1: MouseEvent = null): void {
        const _loc2_ = this.getAllShinyCost();
        if (BASE._pendingPurchase.length == 0) {
            if (_loc2_ > BASE._credits.Get()) {
                POPUPS.DisplayGetShiny();
            } else {
                this.healAll();
                if (_loc2_ > 0) {
                    BASE.Purchase("HAM", _loc2_, "HousingPersistentPopup.healInstantAllShinyCheck");
                }
            }
        }
    }

    private healInstantShinyCheck(param1: MouseEvent = null): void {
        const _loc2_ = param1.target.parent as HousingPersistentMonsterBar;
        const _loc3_ = _loc2_.getTimeCost();
        if (BASE._pendingPurchase.length == 0) {
            if (_loc3_ > BASE._credits.Get()) {
                POPUPS.DisplayGetShiny();
            } else {
                this.healInstant(_loc2_);
                if (_loc3_ > 0) {
                    BASE.Purchase("HSM", _loc3_, "HousingPersistentPopup.healInstantShinyCheck");
                }
            }
        }
    }

    private healQueueRemove(param1: HousingPersistentMonsterBar): void {
        GLOBAL.player.queueRemove(param1.m_creatureID);
        this.setNormalMode(param1);
        this.updateHealAllButton();
    }

    private healQueueAdd(param1: HousingPersistentMonsterBar): void {
        GLOBAL.player.queueHeal(param1.m_creatureID);
        this.setHealMode(param1);
        this.updateHealAllButton();
        BASE.SaveB();
    }

    private setHealMode(param1: HousingPersistentMonsterBar): void {
        param1.gotoAndStop(HousingPersistentMonsterBar.k_HealFrame);
        param1.bFinish.Setup(KEYS.Get("btn_housing_finish", { "v1": param1.getTimeCost() }));
        param1.bFinish.buttonMode = true;
        param1.bFinish.Highlight = true;
        param1.bFinish.addEventListener(MouseEvent.CLICK, this.healInstantShinyCheck.bind(this));
        param1.bCancel.SetupKey("btn_cancel");
        param1.bCancel.addEventListener(MouseEvent.CLICK, this.refundResourcesEvent.bind(this));
        param1.bCancel.buttonMode = true;
        param1.m_shine.visible = false;
        this.reorganize();
    }

    private setNormalMode(param1: HousingPersistentMonsterBar): void {
        param1.gotoAndStop(HousingPersistentMonsterBar.k_NormalFrame);
        param1.bHeal.SetupKey("btn_mh_heal");
        if (param1.m_healthBar.mcBar.width == HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth) {
            param1.bHeal.buttonMode = false;
            param1.bHeal.Enabled = false;
        } else {
            param1.bHeal.Enabled = true;
            param1.bHeal.buttonMode = true;
            param1.bHeal.addEventListener(MouseEvent.CLICK, this.attemptHeal.bind(this));
        }
        if (param1.m_creatureID.substr(0, 1) != "B") {
            param1.bJuice.SetupKey("bunker_btn_juice");
            param1.bJuice.buttonMode = param1.bJuice.Enabled = GLOBAL._bJuicer != null;
            param1.bJuice.addEventListener(MouseEvent.CLICK, this.juicerAdd.bind(this));
        } else {
            param1.bJuice.visible = false;
        }
        param1.tHealStatusText.htmlText = "";
        param1.m_shine.visible = false;
        this.reorganize();
    }

    private reorganize(): void {
        let _loc2_ = 0;
        const _loc3_: any[] = [];
        let _loc4_ = false;
        const _loc5_ = GLOBAL.player.healQueue;
        const _loc6_ = _loc5_.length;

        for (const _loc7_ in this.m_monsterBarList) {
            this.m_monsterBarList[_loc7_].y = -1;
            if (!GLOBAL.player.numCreepsByID(_loc7_)) {
                this.monsterContainer.removeChild(this.m_monsterBarList[_loc7_]);
                delete this.m_monsterBarList[_loc7_];
            }
            if (_loc7_.substr(0, 1) == "B") {
                _loc3_[_loc7_] = this.m_monsterBarList[_loc7_];
            }
        }

        for (let _loc10_ = 0; _loc10_ < _loc6_; _loc10_++) {
            if (this.m_monsterBarList[_loc5_[_loc10_]]) {
                _loc4_ = true;
                this.m_monsterBarList[_loc5_[_loc10_]].tHealStatusText.htmlText = KEYS.Get("btn_housing_waiting");
                if (!_loc2_) {
                    _loc2_ += this.k_offsetTextY;
                }
                this.m_monsterBarList[_loc5_[_loc10_]].y = _loc2_;
                _loc2_ += this.k_offsetY;
                if (_loc10_ == 0) {
                    this.m_monsterBarList[_loc5_[_loc10_]].updateTimer();
                    this.m_monsterBarList[_loc5_[_loc10_]].m_shine.play();
                    this.m_monsterBarList[_loc5_[_loc10_]].m_shine.visible = true;
                }
            }
        }

        if (_loc4_) {
            if (this.m_monsterBarList[_loc5_[_loc6_ - 1]]) {
                this.m_bgWhite.height = this.m_monsterBarList[_loc5_[_loc6_ - 1]].y + this.k_offsetY + this.k_aBit;
            }
        } else {
            this.m_bgWhite.height = 0;
        }

        this.tTitleBunkers.visible = false;
        this.tTitleHealing.visible = _loc4_;
        this.tTitleHousing.y = _loc2_ + this.k_aBit;
        _loc2_ += this.k_offsetTextY;

        for (const _loc7_ in this.m_monsterBarList) {
            if (this.m_monsterBarList[_loc7_].y < 0 && _loc7_.substr(0, 1) != "B") {
                this.m_monsterBarList[_loc7_].y = _loc2_;
                _loc2_ += this.k_offsetY;
            }
        }

        this.tTitleBunkers.y = _loc2_ + this.k_aBit;
        _loc2_ += this.k_offsetTextY;

        for (const _loc7_ in _loc3_) {
            if (this.m_monsterBarList[_loc7_].y < 0) {
                this.tTitleBunkers.visible = true;
                this.m_monsterBarList[_loc7_].y = _loc2_;
                _loc2_ += this.k_offsetY;
            }
        }

        if (this.monsterContainer.y < this.monsterContainerMask.height / 2 - this.monsterContainer.height) {
            this.monsterContainer.y = this.monsterContainerMask.height / 2 - this.monsterContainer.height;
        }
    }

    public tickVisualHeal(): void {
        const _loc1_ = GLOBAL.player.healQueue.length ? GLOBAL.player.healQueue[0] : "";
        for (const _loc2_ in this.m_monsterBarList) {
            this.m_monsterBarList[_loc2_].m_healthBar.mcBar.width = HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth * GLOBAL.player.curHealthByID(_loc2_) / GLOBAL.player.totalHealthByID(_loc2_);
            if (_loc2_ == _loc1_) {
                this.m_monsterBarList[_loc2_].updateTimer();
            }
            if (this.m_monsterBarList[_loc2_].currentFrame == HousingPersistentMonsterBar.k_HealFrame && !GLOBAL.player.checkQueued(_loc2_)) {
                this.setNormalMode(this.m_monsterBarList[_loc2_]);
            }
        }
    }

    private getAllShinyCost(): number {
        let _loc1_ = 0;
        for (const _loc2_ in this.m_monsterBarList) {
            _loc1_ += this.m_monsterBarList[_loc2_].getTimeCost(true);
            _loc1_ += this.m_monsterBarList[_loc2_].getResourceCostInShiny();
        }
        return _loc1_;
    }

    private updateHealAllButton(): void {
        const _loc1_ = this.getAllShinyCost();
        this.bHealAll.Setup(KEYS.Get("btn_housing_heal_all", { "v1": _loc1_ }));
        if (_loc1_) {
            this.bHealAll.Enabled = true;
            this.bHealAll.enabled = true;
            this.bHealAll.Highlight = true;
        } else {
            this.bHealAll.Enabled = false;
            this.bHealAll.enabled = false;
            this.bHealAll.Highlight = false;
        }
    }

    public Update(): void {
        this.getHousableCreatures();
        this.tickVisualHeal();
        this.updateHealAllButton();
        HOUSING.HousingSpace();
        let _loc3_ = 0;
        for (const _loc2_ in this._juiceList) {
            _loc3_ += CREATURES.GetProperty(_loc2_, "cStorage") * this._juiceList[_loc2_];
        }
        HOUSING._housingUsed.Add(-_loc3_);
        const _loc6_ = Math.round(100 / HOUSING._housingCapacity.Get() * HOUSING._housingUsed.Get());
        this.mcStorage.mcBar.width = 535 / HOUSING._housingCapacity.Get() * HOUSING._housingUsed.Get();
        this.tStorage.htmlText = "<b>" + GLOBAL.FormatNumber(HOUSING._housingUsed.Get()) + " / " + GLOBAL.FormatNumber(HOUSING._housingCapacity.Get()) + " (" + _loc6_ + "%)</b>";

        if (GLOBAL._bJuicer) {
            _loc3_ = 0;
            let _loc4_ = 0;
            for (const _loc2_ in this._juiceList) {
                _loc3_ += this._juiceList[_loc2_];
                let _loc7_ = 0.6;
                if (GLOBAL._bJuicer._lvl.Get() == 2) {
                    _loc7_ = 0.8;
                }
                if (GLOBAL._bJuicer._lvl.Get() == 3) {
                    _loc7_ = 1;
                }
                _loc4_ += Math.ceil(CREATURES.GetProperty(_loc2_, "cResource") * _loc7_) * this._juiceList[_loc2_];
            }
            if (_loc3_ > 0) {
                this.bJuice.Enabled = true;
                this.bJuice.Highlight = true;
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
                this.bJuice.Highlight = false;
                this.bJuice.SetupKey("mh_nomonsters_btn");
            }
        }
        this._scroller.Update();
    }

    public healInstant(param1: HousingPersistentMonsterBar): void {
        GLOBAL.player.healInstantSingleByID(param1.m_creatureID);
    }

    private healAll(): void {
        GLOBAL.player.healInstantAll();
        for (const _loc2_ in this.m_monsterBarList) {
            const _loc1_ = this.m_monsterBarList[_loc2_];
            if (_loc1_.bHeal) {
                _loc1_.bHeal.buttonMode = false;
                _loc1_.bHeal.Enabled = false;
                _loc1_.bHeal.removeEventListener(MouseEvent.CLICK, this.attemptHeal.bind(this));
            }
        }
    }

    public juicerAdd(param1: MouseEvent = null): void {
        const _loc2_ = param1.target.parent as HousingPersistentMonsterBar;
        const _loc3_ = _loc2_.m_creatureID;
        if (!GLOBAL._bJuicer) {
            GLOBAL.Message(KEYS.Get("msg_nojuicer"));
            return;
        }
        if (GLOBAL._bJuicer._countdownUpgrade.Get() == 0) {
            if (GLOBAL._bJuicer.health > GLOBAL._bJuicer.maxHealth * 0.5) {
                if (GLOBAL.player.monsterListByID(_loc3_) && GLOBAL.player.monsterListByID(_loc3_).numHousedCreeps - (this._juiceList[_loc3_] || 0) > 0) {
                    if (!this._juiceList[_loc3_]) {
                        this._juiceList[_loc3_] = 0;
                    }
                    ++this._juiceList[_loc3_];
                    if (_loc3_ != this.m_strLastSelectedJuiced) {
                        this.m_strLastSelectedJuiced = _loc3_;
                        this.m_nJuiceAmount = 0;
                        this.m_bShownPopup = false;
                    }
                    ++this.m_nJuiceAmount;
                    if (!this.m_bShownPopup && this.m_nJuiceAmount >= this.k_juiceAllPopupLimit) {
                        this.m_JuiceAllPopup = new PersistantJuiceAllPopup();
                        this.m_JuiceAllPopup.setup(this.m_strLastSelectedJuiced, this.juiceAllByType.bind(this), this.closeJuiceAll.bind(this));
                        POPUPS.Add(this.m_JuiceAllPopup, POPUPS.k_CENTER);
                        this.m_bShownPopup = true;
                    }
                }
                const _loc4_ = GLOBAL.player.monsterListByID(_loc3_).numHousedCreeps - (this._juiceList[_loc3_] || 0);
                _loc2_.m_capacityBar.mcBar.width = HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth * (_loc4_ * CREATURES.GetProperty(_loc3_, "cStorage")) / HOUSING._housingCapacity.Get();
                if (!_loc4_) {
                    _loc2_.bJuice.Enabled = false;
                    _loc2_.bJuice.buttonMode = false;
                }
                this.Update();
            } else {
                GLOBAL.Message(KEYS.Get("msg_juicerdamaged"));
            }
        } else {
            GLOBAL.Message(KEYS.Get("msg_juicerupgrading"));
        }
    }

    public juiceCheck(param1: MouseEvent = null): void {
        if (!this.bJuice.Enabled) {
            return;
        }
        let _loc2_ = "";
        let _loc3_ = 0;
        let _loc5_ = 0;
        let _loc6_ = 0;
        const _loc7_ = GLOBAL.player;

        for (const _loc10_ in this._juiceList) {
            let _loc4_ = this._juiceList[_loc10_];
            _loc3_ += _loc4_;
            const _loc9_ = _loc7_.monsterListByID(_loc10_).m_creeps;
            const _loc8_ = _loc9_.length;
            for (let _loc13_ = 0; _loc13_ < _loc8_ && _loc4_; _loc13_++) {
                if (!_loc9_[_loc13_].ownerID) {
                    if (_loc9_[_loc13_].self) {
                        _loc4_--;
                        if (_loc10_.substr(0, 1) == "I") {
                            _loc6_ += CREATURES.GetProperty(_loc10_, "cResource") * (_loc9_[_loc13_].health / CREATURES.GetProperty(_loc10_, "health"));
                        } else {
                            _loc5_ += CREATURES.GetProperty(_loc10_, "cResource") * (_loc9_[_loc13_].health / CREATURES.GetProperty(_loc10_, "health"));
                        }
                    }
                }
            }
        }

        let _loc11_ = 0.6;
        if (GLOBAL._bJuicer._lvl.Get() == 2) {
            _loc11_ = 0.8;
        } else if (GLOBAL._bJuicer._lvl.Get() == 3) {
            _loc11_ = 1;
        }
        _loc6_ = Math.floor(_loc11_ * _loc6_);
        _loc5_ = Math.floor(_loc11_ * _loc5_);

        if (_loc5_ && _loc6_) {
            _loc2_ = KEYS.Get("msg_juiceboth", {
                "v1": _loc3_,
                "v2": GLOBAL.FormatNumber(_loc5_),
                "v3": GLOBAL.FormatNumber(_loc6_)
            });
        } else if (_loc5_) {
            _loc2_ = KEYS.Get("msg_juicegoo", {
                "v1": _loc3_,
                "v2": GLOBAL.FormatNumber(_loc5_)
            });
        } else if (_loc6_) {
            _loc2_ = KEYS.Get("msg_juicemagma", {
                "v1": _loc3_,
                "v2": GLOBAL.FormatNumber(_loc6_)
            });
        }
        const _loc12_ = GLOBAL.Message(_loc2_, KEYS.Get("btn_juicemonsters"), this.juice.bind(this), null);
        _loc12_.bAction.Highlight = true;
    }

    public juice(param1: MouseEvent = null): void {
        const _loc6_: any[] = [];
        const _loc7_ = InstanceManager.getInstancesByClass(BASE.isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15);
        for (const _loc4_ of _loc7_) {
            _loc6_.push(_loc4_);
        }
        for (const _loc2_ in this._juiceList) {
            const _loc8_ = this._juiceList[_loc2_];
            for (let _loc9_ = 0; _loc9_ < _loc8_; _loc9_++) {
                GLOBAL.player.monsterListByID(_loc2_).juiceCreep();
                --this._juiceList[_loc2_];
            }
        }
        this.mcStorage.mcBarB.width = this.mcStorage.mcBar.width;
        this.updateCapacityBars();
        this.tickVisualHeal();
        this.reorganize();
        this._juiceList = {};
        HOUSING.HousingSpace();
        BASE.Save();
    }

    private updateCapacityBars(): void {
        for (const _loc3_ in this.m_monsterBarList) {
            const _loc2_ = this.m_monsterBarList[_loc3_];
            if (_loc3_.substr(0, 1) != "B") {
                const _loc1_ = GLOBAL.player.monsterListByID(_loc3_).numHousedCreeps;
                _loc2_.tName.htmlText = "<b>" + KEYS.Get(CREATURELOCKER._creatures[_loc3_].name) + "</b> x" + _loc1_;
            } else {
                _loc2_.tName.htmlText = "<b>" + KEYS.Get("#b_monsterbunker#") + "</b>";
            }
            if (_loc2_.currentFrame == HousingPersistentMonsterBar.k_NormalFrame) {
                _loc2_.bJuice.Enabled = true;
                _loc2_.bJuice.buttonMode = true;
            }
            _loc2_.m_capacityBar.mcBar.width = HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth * GLOBAL.player.getStorageByID(_loc3_) / HOUSING._housingCapacity.Get();
            _loc2_.m_capacityBar.mcBarGrey.width = _loc2_.m_capacityBar.mcBar.width;
            _loc2_.tCapacityText.htmlText = "<b>" + GLOBAL.player.getStorageByID(_loc3_) + "</b>";
        }
    }

    public getHousableCreatures(): any[] {
        let _loc1_ = 0;
        const _loc2_: any[] = [];
        let _loc3_: any[] = [];
        const _loc4_ = GLOBAL.player.monsterList;
        const _loc5_ = _loc4_.length;

        for (let _loc6_ = 0; _loc6_ < _loc5_; _loc6_++) {
            const _loc7_ = CREATURELOCKER._creatures[_loc4_[_loc6_].m_creatureID];
            if (_loc7_ && !_loc7_.blocked && _loc4_[_loc6_].numHousedCreeps) {
                _loc7_.id = _loc4_[_loc6_].m_creatureID;
                _loc2_.push(_loc7_);
            }
            if (_loc4_[_loc6_].numBunkeredCreeps) {
                _loc1_ = _loc4_[_loc6_].m_creeps.length;
                for (let _loc8_ = 0; _loc8_ < _loc1_; _loc8_++) {
                    if (_loc4_[_loc6_].m_creeps[_loc8_].ownerID) {
                        if (!this.m_bunkerIDList[_loc4_[_loc6_].m_creeps[_loc8_].ownerID]) {
                            this.m_bunkerIDList[_loc4_[_loc6_].m_creeps[_loc8_].ownerID] = 1;
                            const newObj: any = {};
                            newObj.id = "B" + _loc4_[_loc6_].m_creeps[_loc8_].ownerID;
                            newObj.index = 300;
                            _loc2_.push(newObj);
                        }
                    }
                }
            }
        }
        _loc2_.sort((a: any, b: any) => a.index - b.index);
        if (_loc2_.length > 0) {
            _loc3_ = _loc3_.concat(_loc2_);
        }
        return _loc3_;
    }

    public selectNone(param1: MouseEvent = null): void {
        this._juiceList = {};
        this.bJuice.SetupKey("mh_nomonsters_btn");
        this.bJuice.Enabled = false;
        this.bJuice.Highlight = false;
        this.updateCapacityBars();
        this.Update();
        this.m_bShownPopup = false;
        this.m_nJuiceAmount = 0;
        this.m_strLastSelectedJuiced = "";
        if (this.m_JuiceAllPopup) {
            POPUPS.Remove(this.m_JuiceAllPopup);
        }
        this.m_JuiceAllPopup = null;
    }

    public closeJuiceAll(param1: MouseEvent): void {
        if (this.m_JuiceAllPopup) {
            POPUPS.Remove(this.m_JuiceAllPopup);
        }
        this.m_JuiceAllPopup = null;
    }

    public iconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        const _loc4_ = new Bitmap(param2);
        _loc4_.smoothing = true;
        param3[0].mcImage.addChild(_loc4_);
        param3[0].mcImage.visible = true;
        param3[0].mcLoading.visible = false;
    }

    public ascend(param1: MouseEvent = null): void {
        if (!MAPROOM_DESCENT.DescentPassed) {
            GLOBAL.Message(KEYS.Get("mh_ascension_noinf"));
        } else {
            SOUNDS.Play("click1");
            this.Hide();
            INFERNOPORTAL.AscendMonsters();
        }
    }

    protected juiceAllByType(param1: string): void {
        this._juiceList[param1] = GLOBAL.player.monsterListByID(param1).numHousedCreeps;
        this.m_strLastSelectedJuiced = "";
        this.m_nJuiceAmount = 0;
        this.m_bShownPopup = false;
        const _loc2_ = GLOBAL.player.monsterListByID(param1).numHousedCreeps - this._juiceList[param1];
        this.m_monsterBarList[param1].m_capacityBar.mcBar.width = HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth * (_loc2_ * CREATURES.GetProperty(param1, "cStorage")) / HOUSING._housingCapacity.Get();
        this.m_monsterBarList[param1].bJuice.Enabled = false;
        this.m_monsterBarList[param1].bJuice.buttonMode = false;
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
