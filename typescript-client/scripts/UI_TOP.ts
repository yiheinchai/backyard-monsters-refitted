import DisplayObject from "openfl/display/DisplayObject";
import DisplayObjectContainer from "openfl/display/DisplayObjectContainer";
import Loader from "openfl/display/Loader";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";
import URLRequest from "openfl/net/URLRequest";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";

import { BaseBuff } from "./com/monsters/baseBuffs/BaseBuff";
import { BaseBuffHandler } from "./com/monsters/baseBuffs/BaseBuffHandler";
import { AutoBankBaseBuff } from "./com/monsters/baseBuffs/buffs/AutoBankBaseBuff";
import { BYMConfig } from "./com/monsters/configs/BYMConfig";
import { DealSpot } from "./com/monsters/dealspot/DealSpot";
import { ScrollSetV } from "./com/monsters/display/ScrollSetV";
import { EnumYardType } from "./com/monsters/enums/EnumYardType";
import { KOTHHUDGraphic } from "./com/monsters/kingOfTheHill/graphics/KOTHHUDGraphic";
import { InstanceManager } from "./com/monsters/managers/InstanceManager";
import { MapRoom3Cell } from "./com/monsters/maproom3/MapRoom3Cell";
import { DescentDebuffPopup } from "./com/monsters/maproom_inferno/views/DescentDebuffPopup";
import { MapRoomManager } from "./com/monsters/maproom_manager/MapRoomManager";
import { ChampionBase } from "./com/monsters/monsters/champions/ChampionBase";
import { SiegeWeapons } from "./com/monsters/siege/SiegeWeapons";
import { SubscriptionHandler } from "./com/monsters/subscriptions/SubscriptionHandler";
import { ResourceOutpost } from "./ResourceOutpost";
import { TweenLite, Elastic, Linear } from "./gs";
import { UI_TOP_CLIP } from "./UI_TOP_CLIP";
import { flingerLevel } from "./flingerLevel";
import { bubblepopup3 } from "./bubblepopup3";
import { bubblepopup4 } from "./bubblepopup4";
import { bubblepopupBuff } from "./bubblepopupBuff";
import { ui_buffIcon_CLIP } from "./ui_buffIcon_CLIP";
import { CREATUREBUTTON } from "./CREATUREBUTTON";
import { CHAMPIONBUTTON } from "./CHAMPIONBUTTON";
import { CATAPULTPOPUP } from "./CATAPULTPOPUP";
import { SIEGEWEAPONPOPUP } from "./SIEGEWEAPONPOPUP";
import { CHAMPIONCAGE } from "./CHAMPIONCAGE";
import { CREATURELOCKER } from "./CREATURELOCKER";
import { CREATURES } from "./CREATURES";
import { YARD_PROPS } from "./YARD_PROPS";
import { POWERUPS } from "./POWERUPS";
import { GLOBAL } from "./GLOBAL";
import { KEYS } from "./KEYS";
import { BASE } from "./BASE";
import { ATTACK } from "./ATTACK";
import { POPUPS } from "./POPUPS";
import { STORE } from "./STORE";
import { TUTORIAL } from "./TUTORIAL";
import { BUY } from "./BUY";
import { MAILBOX } from "./MAILBOX";
import { MAPROOM_DESCENT } from "./MAPROOM_DESCENT";
import { LOGGER } from "./LOGGER";

export class UI_TOP extends UI_TOP_CLIP {
    public static readonly CREATUREBUTTONOVER: string = "creatureButtonOver";

    public _popupWarning: bubblepopup4;
    public _popupBuff: bubblepopupBuff;
    public _creatureButtons: any[];
    public _creatureButtonsMC: flingerLevel;
    public _bubbleDo: DisplayObject;
    public _catapult: CATAPULTPOPUP;
    public _siegeweapon: SIEGEWEAPONPOPUP;
    public _buttonIcons: any[];
    public _descentDebuff: DescentDebuffPopup;
    public extraResourceRows: number = 0;
    public _dealspot: DealSpot;
    public _resourceUI: any;
    public _resourceR1: number;
    public _resourceR2: number;
    public _resourceR3: number;
    public _resourceR4: number;
    public _kothIcon: DisplayObject;
    public _daveClub: DisplayObject;

    private readonly _RESOURCEBAR_HEIGHT: number = 37;
    private m_creatureContainer: Sprite;
    private m_scrollBar: ScrollSetV;

    constructor() {
        super();
        let mode = GLOBAL.mode;
        
        switch (GLOBAL.mode) {
            case GLOBAL.e_BASE_MODE.BUILD:
            case GLOBAL.e_BASE_MODE.IBUILD:
                mode = GLOBAL.e_BASE_MODE.BUILD;
                break;
            case GLOBAL.e_BASE_MODE.ATTACK:
            case GLOBAL.e_BASE_MODE.IATTACK:
                mode = GLOBAL.e_BASE_MODE.ATTACK;
                break;
            case GLOBAL.e_BASE_MODE.WMATTACK:
            case GLOBAL.e_BASE_MODE.IWMATTACK:
                mode = GLOBAL.e_BASE_MODE.WMATTACK;
                break;
            case GLOBAL.e_BASE_MODE.VIEW:
            case GLOBAL.e_BASE_MODE.IVIEW:
                mode = GLOBAL.e_BASE_MODE.VIEW;
                break;
            case GLOBAL.e_BASE_MODE.HELP:
            case GLOBAL.e_BASE_MODE.IHELP:
                mode = GLOBAL.e_BASE_MODE.HELP;
                break;
            case GLOBAL.e_BASE_MODE.WMVIEW:
            case GLOBAL.e_BASE_MODE.IWMVIEW:
                mode = MapRoomManager.instance.isInMapRoom3 ? GLOBAL.e_BASE_MODE.ATTACK : GLOBAL.e_BASE_MODE.WMVIEW;
                break;
        }
        
        if (MapRoomManager.instance.isInMapRoom3 && (GLOBAL.mode === GLOBAL.e_BASE_MODE.VIEW || GLOBAL.mode === GLOBAL.e_BASE_MODE.WMVIEW)) {
            this.gotoAndStop(GLOBAL.e_BASE_MODE.ATTACK);
        } else {
            this.gotoAndStop(GLOBAL._loadmode);
        }
        
        if (GLOBAL._loadmode === GLOBAL.e_BASE_MODE.BUILD || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.IBUILD) {
            this.setupBuildMode();
        } else if (GLOBAL._loadmode === GLOBAL.e_BASE_MODE.ATTACK || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.WMATTACK || 
                   GLOBAL._loadmode === GLOBAL.e_BASE_MODE.IATTACK || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.IWMATTACK) {
            this.setupAttackMode();
        } else if (MapRoomManager.instance.isInMapRoom3 && (GLOBAL.mode === GLOBAL.e_BASE_MODE.VIEW || GLOBAL.mode === GLOBAL.e_BASE_MODE.WMVIEW)) {
            this.setupScoutMode();
        } else {
            this.DescentDebuffHide();
        }
        
        this.Update();
    }

    private setupBuildMode(): void {
        this.mc.mcPoints.addEventListener(MouseEvent.MOUSE_OVER, this.InfoShow.bind(this));
        this.mc.mcPoints.addEventListener(MouseEvent.MOUSE_OUT, this.InfoHide.bind(this));
        
        for (let i = 1; i < 5; i++) {
            this.mc["mcR" + i].mcHit.addEventListener(MouseEvent.MOUSE_OVER, this.StatsShow(i, false));
            this.mc["mcR" + i].mcHit.addEventListener(MouseEvent.MOUSE_OUT, this.StatsHide.bind(this));
            this.mc["mcR" + i].bAdd.addEventListener(MouseEvent.CLICK, this.Topup(i));
            this.mc["mcR" + i].bAdd.buttonMode = true;
            this.mc["mcR" + i].bAdd.mouseEnabled = true;
            this.mc["mcR" + i].bAdd.mouseChildren = false;
        }
        
        this._resourceUI = {};
        this._resourceUI.r1 = BASE._resources.r1.Get();
        this._resourceUI.r2 = BASE._resources.r2.Get();
        this._resourceUI.r3 = BASE._resources.r3.Get();
        this._resourceUI.r4 = BASE._resources.r4.Get();
        
        for (let i = 1; i <= 4; i++) {
            this.mc["mcR" + i]._resource = BASE._resources["r" + i].Get();
        }
        
        this.mc.mcR5.bAdd.txtAdd.autoSize = TextFieldAutoSize.LEFT;
        this.mc.mcR5.bAdd.txtAdd.htmlText = KEYS.Get("ui_topaddshiny");
        this.mc.mcR5.bAdd.mcBG.width = this.mc.mcR5.bAdd.txtAdd.width + 11;
        this.mc.mcR5.mcBG.width = 82 + this.mc.mcR5.bAdd.width;
        
        this.mc.mcR5.bAdd.addEventListener(MouseEvent.CLICK, (e: MouseEvent): void => {
            GLOBAL.Message(KEYS.Get("disabled_addshiny"));
        });
        this.mc.mcR5.bAdd.buttonMode = true;
        this.mc.mcR5.bAdd.mouseChildren = false;
        
        this.mc.mcOutposts.mcHit.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow.bind(this));
        this.mc.mcOutposts.mcHit.addEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide.bind(this));
        this.mc.mcOutposts.bNext.addEventListener(MouseEvent.CLICK, BASE.LoadNext);
        this.mc.mcOutposts.bNext.buttonMode = true;
        this.mc.mcOutposts.bNext.mouseEnabled = true;
        this.mc.mcOutposts.bNext.mouseChildren = false;
        
        this._buttonIcons = [];
        this.setupButtonIcons();
    }

    private setupButtonIcons(): void {
        const buttons = ["bInvite", "bGift", "bInbox", "bAlert"];
        const actions = ["invite", "gift", "inbox", "alert"];
        
        for (let i = 0; i < buttons.length; i++) {
            const btn = this.mc[buttons[i]];
            if (btn) {
                btn.buttonMode = true;
                btn.mouseChildren = false;
                btn.addEventListener(MouseEvent.CLICK, this.ButtonClick(actions[i]));
                btn.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow.bind(this));
                btn.addEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide.bind(this));
                this._buttonIcons.push(btn);
            }
        }
        
        if (this.mc.bEarn) {
            this.mc.bEarn.bAction.tLabel.htmlText = KEYS.Get("btn_earn");
            if (GLOBAL._flags.showFBCEarn === 1) {
                this.mc.bEarn.buttonMode = true;
                this.mc.bEarn.mouseChildren = false;
                this.mc.bEarn.addEventListener(MouseEvent.CLICK, this.ButtonClick("earn"));
                this.mc.bEarn.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow.bind(this));
                this.mc.bEarn.addEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide.bind(this));
            } else {
                this.mc.bEarn.mouseChildren = false;
                this.mc.bEarn.mouseEnabled = false;
                this.mc.bEarn.visible = false;
            }
        }
        
        if (this.mc.bDailyDeal) {
            this.mc.bDailyDeal.tLabel.htmlText = KEYS.Get("btn_dailydeal");
            if (GLOBAL._flags.showFBCDaily === 1) {
                this.mc.bDailyDeal.buttonMode = true;
                this.mc.bDailyDeal.mouseChildren = false;
                this.mc.bDailyDeal.addEventListener(MouseEvent.CLICK, this.ButtonClick("daily"));
                this.mc.bDailyDeal.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow.bind(this));
                this.mc.bDailyDeal.addEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide.bind(this));
            } else {
                this.mc.bDailyDeal.mouseChildren = false;
                this.mc.bDailyDeal.mouseEnabled = false;
                this.mc.bDailyDeal.visible = false;
            }
        }
    }

    private setupScoutMode(): void {
        this.setupAttackMode();
        if (!GLOBAL._attackersFlinger) {
            this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = KEYS.Get("no_flinger");
        } else {
            this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = BASE.isInfernoMainYardOrOutpost ? KEYS.Get("monster_limit") : KEYS.Get("attack_flingerbar");
        }
        this._creatureButtonsMC._mc._txtContainer.mcBar.visible = false;
        this._creatureButtonsMC._mc._txtContainer.tA.htmlText = "";
        
        for (let i = 1; i < 5; i++) {
            const mc = this.mc["mcR" + i];
            mc.visible = false;
        }
    }

    private setupAttackMode(): void {
        this._creatureButtonsMC = this.mc.addChild(new flingerLevel()) as flingerLevel;
        this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = KEYS.Get("txt_flinger_capacity");
        this._creatureButtonsMC._mc._txtContainer.mcBar.visible = true;
        this._creatureButtonsMC._mc._txtContainer.tA.htmlText = "0%";
        this._creatureButtonsMC.y = 180;
        this._creatureButtonsMC._mc.x = 2;
        this._creatureButtonsMC._mc.y = -6;
        this._creatureButtons = [];
        
        if (!GLOBAL._attackersFlinger) {
            this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = KEYS.Get("no_flinger");
            this._creatureButtonsMC._mc._txtContainer.tA.htmlText = "";
            this._creatureButtonsMC._mc._bottomBar.visible = false;
        } else {
            this.m_creatureContainer = new Sprite();
            this._creatureButtonsMC.addChild(this.m_creatureContainer);
            const result = this.setupChampionButtons(this.m_creatureContainer);
            this.setupCreatureButtons(this.m_creatureContainer, result[0], result[1]);
            
            if (this.m_creatureContainer.numChildren === 0) {
                this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = KEYS.Get("no_monsters");
                this._creatureButtonsMC._mc._bottomBar.visible = false;
            }
            
            const mask = new Sprite();
            mask.graphics.beginFill(0xFFFFFF, 1);
            mask.graphics.drawRect(0, 22, 200, GLOBAL._SCREEN.height - 476);
            mask.graphics.endFill();
            mask.mouseEnabled = false;
            mask.mouseChildren = false;
            this._creatureButtonsMC.addChild(mask);
            this.m_creatureContainer.mask = mask;
            
            this.m_scrollBar = new ScrollSetV(this.m_creatureContainer, mask, true);
            this.m_scrollBar.x = 202 - this.m_scrollBar.width;
            this.m_scrollBar.y = 22;
            this._creatureButtonsMC.addChild(this.m_scrollBar);
        }
        
        if (SiegeWeapons.availableWeapon != null && !BASE.isInfernoMainYardOrOutpost) {
            this._siegeweapon = new SIEGEWEAPONPOPUP();
            this.mc.addChild(this._siegeweapon);
            this._siegeweapon.x = 442;
            this._siegeweapon.y = 20;
            this._siegeweapon.Setup(!GLOBAL.isInAttackMode);
        }
        
        if (GLOBAL._attackersCatapult > 0 && !BASE.isInfernoMainYardOrOutpost) {
            this._catapult = new CATAPULTPOPUP();
            this.mc.addChild(this._catapult);
            this._catapult.x = 350;
            this._catapult.y = 20;
            this._catapult.Setup(!GLOBAL.isInAttackMode);
        }
    }

    private setupChampionButtons(container: DisplayObjectContainer): number[] {
        let count = 0;
        let total = 0;
        let hasNormal = false;
        let lastButton: MovieClip = null;
        
        for (let i = 0; i < GLOBAL._playerGuardianData.length; i++) {
            const guardian = GLOBAL._playerGuardianData[i];
            if (guardian && guardian.hp.Get() > 0) {
                const status = guardian.status || ChampionBase.k_CHAMPION_STATUS_NORMAL;
                if (status === ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                    if (hasNormal && guardian.t !== 5) {
                        LOGGER.Log("log", "User is initializing combat with more than one normal champ.");
                    } else if (GLOBAL._loadmode === GLOBAL.mode || (GLOBAL._loadmode !== GLOBAL.mode && !MAPROOM_DESCENT.DescentPassed)) {
                        if (guardian.t !== 5) {
                            hasNormal = true;
                        }
                        lastButton = container.addChild(new CHAMPIONBUTTON("G" + guardian.t, guardian.l.Get(), i, count, this._creatureButtonsMC)) as MovieClip;
                        lastButton.x = 14;
                        lastButton.y = 34 + count * 53;
                        lastButton.addEventListener(UI_TOP.CREATUREBUTTONOVER, this.sortCreatureButtons.bind(this));
                        this._creatureButtons.push(lastButton);
                        count++;
                        total++;
                    }
                }
            }
        }
        
        if (lastButton) {
            this._creatureButtonsMC._mc._bottomBar.y = Math.min(GLOBAL._SCREEN.height - 450, lastButton.y + lastButton.height - this._creatureButtonsMC._mc._bottomBar.height * 0.8);
        }
        
        return [count, total];
    }

    private setupCreatureButtons(container: DisplayObjectContainer, startIndex: number, total: number): void {
        const creatures = CREATURELOCKER._creatures;
        let lastButton: MovieClip = null;
        let index = startIndex;
        
        for (const key in creatures) {
            if (ATTACK._curCreaturesAvailable[key] && ATTACK._curCreaturesAvailable[key] > 0) {
                lastButton = container.addChild(new CREATUREBUTTON(key, index, this._creatureButtonsMC)) as MovieClip;
                lastButton.x = 14;
                lastButton.y = 34 + index * 53;
                if (MapRoomManager.instance.isInMapRoom2or3) {
                    lastButton.addEventListener(UI_TOP.CREATUREBUTTONOVER, this.sortCreatureButtons.bind(this));
                }
                this._creatureButtons.push(lastButton);
                index++;
            }
        }
        
        if (lastButton) {
            this._creatureButtonsMC._mc._bottomBar.y = Math.min(GLOBAL._SCREEN.height - 450, lastButton.y + lastButton.height - this._creatureButtonsMC._mc._bottomBar.height * 0.8);
        }
    }

    private sortCreatureButtons(e: Event): void {
        this._creatureButtonsMC.addChild(e.target as DisplayObject);
    }

    private InfoShow(e: MouseEvent): void {
        this.mc.mcPoints.gotoAndStop(2);
        const level = BASE.BaseLevel();
        this.mc.mcPoints.tInfo.htmlText = KEYS.Get("pop_experiencebar", {
            "v1": GLOBAL.FormatNumber(level.points),
            "v2": GLOBAL.FormatNumber(level.needed),
            "v3": level.level + 1
        });
    }

    private InfoHide(e: MouseEvent): void {
        this.mc.mcPoints.gotoAndStop(1);
    }

    public resize(rect: Rectangle): void {
        this.x = rect.x + 10;
        this.y = rect.y + 4;
        this.mcProtected.x = rect.width - 125;
        this.mcReinforcements.x = rect.width - 125;
        this.mcSpecialEvent.x = rect.width - 125;
        this.mcBuffHolder.x = rect.width - 200;
        
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) {
            this.mcZoom.x = rect.width - 38 - 24;
            this.mcFullscreen.x = rect.width - 38;
            this.mcSound.x = rect.width - 38 - 24;
            this.mcMusic.x = rect.width - 38;
            this.mcSave.x = rect.width - 38 - 24;
        } else {
            this.mcZoom.x = rect.width - 130;
            this.mcFullscreen.x = rect.width - 100;
            this.mcSound.x = rect.width - 70;
            this.mcMusic.x = rect.width - 40;
            this.mcSave.x = rect.width - 160;
        }
        
        if (this._descentDebuff) {
            this._descentDebuff.x = rect.width - 160;
        }
        
        if (this.m_creatureContainer) {
            const count = this._creatureButtons.length;
            for (let i = 0; i < count; i++) {
                this._creatureButtons[i].x = 14;
                this._creatureButtons[i].y = 34 + i * 53;
            }
            if (count > 0) {
                this._creatureButtonsMC._mc._bottomBar.y = Math.min(GLOBAL._SCREEN.height - 450, 
                    this._creatureButtons[count - 1].y + this._creatureButtons[count - 1].height - this._creatureButtonsMC._mc._bottomBar.height * 0.8);
            }
            
            const mask = this.m_creatureContainer.mask as Sprite;
            mask.graphics.clear();
            mask.graphics.beginFill(0xFFFFFF, 1);
            mask.graphics.drawRect(0, 22, 200, GLOBAL._SCREEN.height - 476);
            mask.graphics.endFill();
            this.m_creatureContainer.mask = mask;
            this.m_scrollBar.checkResize();
        }
    }

    public Update(): void {
        if (!GLOBAL._catchup) {
            if (GLOBAL._loadmode === GLOBAL.e_BASE_MODE.BUILD || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.IBUILD) {
                this.updateBuildMode();
            } else if (MapRoomManager.instance.isInMapRoom3 && (GLOBAL._loadmode === GLOBAL.e_BASE_MODE.VIEW || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.WMVIEW)) {
                this.updateScoutMode();
            } else if (GLOBAL._loadmode === GLOBAL.e_BASE_MODE.ATTACK || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.WMATTACK || 
                       GLOBAL._loadmode === GLOBAL.e_BASE_MODE.IATTACK || GLOBAL._loadmode === GLOBAL.e_BASE_MODE.IWMATTACK) {
                this.updateAttackMode();
            }
            
            const level = BASE.BaseLevel();
            this.SetPoints(level.lower, level.upper, level.needed, level.points, level.level, false);
        }
    }

    private updateBuildMode(): void {
        const r1 = BASE._resources.r1.Get();
        const r2 = BASE._resources.r2.Get();
        const r3 = BASE._resources.r3.Get();
        const r4 = BASE._resources.r4.Get();
        
        TweenLite.to(this.mc.mcR1, 0.5, { "_resource": r1, "onUpdate": () => this.UpdateTweenResourceText(1), "ease": Linear.easeNone, "overwrite": 1 });
        TweenLite.to(this.mc.mcR2, 0.5, { "_resource": r2, "onUpdate": () => this.UpdateTweenResourceText(2), "ease": Linear.easeNone, "overwrite": 1 });
        TweenLite.to(this.mc.mcR3, 0.5, { "_resource": r3, "onUpdate": () => this.UpdateTweenResourceText(3), "ease": Linear.easeNone, "overwrite": 1 });
        TweenLite.to(this.mc.mcR4, 0.5, { "_resource": r4, "onUpdate": () => this.UpdateTweenResourceText(4), "ease": Linear.easeNone, "overwrite": 1 });
        
        this.mc.mcR5.tR.htmlText = "<b>" + GLOBAL.FormatNumber(BASE._credits.Get()) + "</b>";
        
        if (MapRoomManager.instance.isInMapRoom2) {
            this.mc.mcOutposts.visible = true;
            this.mc.mcOutposts.tR.htmlText = GLOBAL._mapOutpost.length;
        } else {
            this.mc.mcOutposts.visible = false;
        }
        
        if (TUTORIAL._stage < 200) {
            this.mc.bInvite.visible = false;
            this.mc.bGift.visible = false;
            this.mc.bInbox.visible = false;
            this.mc.bAlert.visible = false;
            this.mc.mcR5.bAdd.visible = false;
            this.mc.bEarn.visible = false;
            this.mc.bDailyDeal.visible = false;
            for (let i = 1; i < 6; i++) {
                this.mc["mcR" + i].bAdd.visible = false;
            }
            this.SortButtonIcons();
        } else {
            this.mc.mcR5.bAdd.visible = true;
            this.mc.bEarn.visible = GLOBAL._flags.showFBCEarn === 1;
            this.mc.bDailyDeal.visible = GLOBAL._flags.showFBCDaily === 1;
            for (let i = 1; i < 6; i++) {
                if (!this.mc["mcR" + i].bAdd.visible) {
                    this.mc["mcR" + i].bAdd.visible = true;
                }
            }
            
            this.DisplayBuffs();
        }
    }

    private updateAttackMode(): void {
        for (let i = 1; i < 5; i++) {
            const mc = this.mc["mcR" + i];
            mc.tR.htmlText = "<b>" + GLOBAL.FormatNumber(ATTACK._loot["r" + i].Get()) + "</b>";
            mc.mcBar.visible = false;
        }
        
        for (let i = 0; i < this._creatureButtons.length; i++) {
            this._creatureButtons[i].Update();
        }
        
        let capacity = GLOBAL._buildingProps[4].capacity[GLOBAL._attackersFlinger - 1];
        if (MAPROOM_DESCENT.InDescent) {
            capacity = YARD_PROPS._yardProps[4].capacity[GLOBAL._attackersFlinger - 1];
        }
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_DECLAREWAR, "OFFENSE")) {
            capacity += capacity * 0.25;
        }
        
        let remaining = capacity;
        if (MapRoomManager.instance.isInMapRoom3 && ATTACK.USE_CUMULATIVE_FLINGER_CAPACITY) {
            remaining -= ATTACK._flungSpace.Get();
        }
        
        for (const key in ATTACK._flingerBucket) {
            const isGuardian = key.substr(0, 1) === "G";
            if (!MapRoomManager.instance.isInMapRoom3 && isGuardian) {
                remaining -= CHAMPIONCAGE.GetGuardianProperty(key.substr(0, 2), 1, "bucket");
            } else if (!isGuardian) {
                remaining -= CREATURES.GetProperty(key, "bucket") * ATTACK._flingerBucket[key].Get();
            }
        }
        
        this._creatureButtonsMC._mc._txtContainer.mcBar.width = 115 - 115 / capacity * remaining;
        
        if (MapRoomManager.instance.isInMapRoom3) {
            this._creatureButtonsMC._mc._txtContainer.mcBar.scaleX = (1 - remaining / capacity) * 1.2;
        } else {
            this._creatureButtonsMC._mc._txtContainer.mcBar.scaleX = (100 - 100 / capacity * remaining) / 100;
        }
        
        if (GLOBAL._attackersFlinger) {
            if (MapRoomManager.instance.isInMapRoom3) {
                this._creatureButtonsMC._mc._txtContainer.tA.width = 60;
                this._creatureButtonsMC._mc._txtContainer.tA.htmlText = (capacity - remaining).toString() + "/" + capacity.toString();
            } else {
                this._creatureButtonsMC._mc._txtContainer.tA.width = 56;
                this._creatureButtonsMC._mc._txtContainer.tA.htmlText = Math.min(100, Math.floor((1 - remaining / capacity) * 100)).toString() + "%";
            }
        }
        
        this.updateTimerDisplay();
    }

    private updateScoutMode(): void {
        for (let i = 1; i < 5; i++) {
            const mc = this.mc["mcR" + i];
            mc.tR.htmlText = "<b>" + GLOBAL.FormatNumber((GLOBAL._currentCell as MapRoom3Cell).attackCost[i - 1]) + "</b>";
            mc.mcBar.visible = false;
        }
        
        for (let i = 0; i < this._creatureButtons.length; i++) {
            this._creatureButtons[i].Update();
        }
        
        this.updateTimerDisplay();
    }

    private updateTimerDisplay(): void {
        if (GLOBAL.mode !== GLOBAL._loadmode) {
            if (ATTACK._countdown > 0) {
                this.mc.tMessage.htmlText = KEYS.Get("attack_ui_attacklock");
            } else {
                this.mc.tMessage.htmlText = KEYS.Get("attack_ui_attackends");
            }
        } else if (ATTACK._countdown > 0) {
            this.mc.tMessage.htmlText = KEYS.Get("attack_ui_flingerlock");
        } else {
            this.mc.tMessage.htmlText = KEYS.Get("attack_ui_attackends");
        }
        
        if (ATTACK._countdown > 30) {
            this.mc.tTime.htmlText = GLOBAL.ToTime(ATTACK._countdown, true);
        } else if (ATTACK._countdown > 0) {
            this.mc.tTime.htmlText = "<font color=\"#FF0000\">" + GLOBAL.ToTime(ATTACK._countdown, true) + "</font>";
        } else if (ATTACK._countdown > -120) {
            this.mc.tTime.htmlText = "<font color=\"#FFFFFF\">" + GLOBAL.ToTime(120 + ATTACK._countdown, true) + "</font>";
        } else {
            this.mc.tTime.htmlText = "<font color=\"#FFFFFF\">" + KEYS.Get("attack_ui_over") + "</font>";
        }
    }

    public UpdateTweenResourceText(n: number): void {
        const mc = this.mc["mcR" + n];
        const value = mc._resource;
        mc.tR.htmlText = "<b>" + GLOBAL.FormatNumber(value) + "</b>";
        let barWidth = 90 / BASE._resources["r" + n + "max"] * value;
        if (barWidth > 90) barWidth = 90;
        mc.mcBar.width = barWidth;
    }

    public Topup(n: number): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            const scrollPos = Math.min((n - 1) * 0.4, 1);
            if (BASE.isInfernoMainYardOrOutpost) {
                STORE.ShowB(2, scrollPos, ["BR" + n + "1I", "BR" + n + "2I", "BR" + n + "3I"]);
            } else {
                STORE.ShowB(2, scrollPos, ["BR" + n + "1", "BR" + n + "2", "BR" + n + "3"]);
            }
        };
    }

    public StatsShow(n: number, topup: boolean): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            let text: string;
            let lines: number;
            
            if (n < 5) {
                if (topup) {
                    text = "<b><font size=\"12\">" + KEYS.Get(GLOBAL._resourceNames[n - 1]) + "</font></b><br><b>" + KEYS.Get("bubble_topup") + "</b>";
                    lines = 2;
                } else if (MapRoomManager.instance.isInMapRoom2or3) {
                    text = KEYS.Get("pop_resource2", {
                        "v1": KEYS.Get(GLOBAL._resourceNames[n - 1]),
                        "v2": GLOBAL.FormatNumber(BASE._resources["r" + n + "max"]),
                        "v3": GLOBAL.FormatNumber(BASE._resources["r" + n + "Rate"]),
                        "v4": GLOBAL.FormatNumber(BASE.getEmpireResources(n))
                    });
                    lines = 4;
                } else {
                    text = "<b><font size=\"12\">" + KEYS.Get(GLOBAL._resourceNames[n - 1]) + "</font></b><br>" + KEYS.Get("pop_resource", {
                        "v1": GLOBAL.FormatNumber(BASE._resources["r" + n + "max"]),
                        "v2": GLOBAL.FormatNumber(BASE._resources["r" + n + "Rate"])
                    });
                    lines = 3;
                }
            } else {
                text = "<b>" + KEYS.Get("bubble_getshiny") + "</b>";
                lines = 2;
            }
            
            const mc = this.mc["mcR" + n];
            this.BubbleShow(mc.x + 135, mc.y + Math.floor(mc.height * 0.5), text, lines);
        };
    }

    public StatsHide(e: MouseEvent): void {
        this.BubbleHide();
    }

    public ButtonClick(label: string): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            if (label === "gift") {
                GLOBAL.Message(KEYS.Get("disabled_gifts"));
            } else if (label === "alert") {
                if (BASE._currentAttacks && BASE._currentAttacks.length > 0) {
                    for (const attack of BASE._currentAttacks) {
                        attack.seen = true;
                    }
                    BASE._attacksModified = true;
                    BASE.Save();
                }
                POPUPS.Show("alerts");
            } else if (label === "invite") {
                POPUPS.Invite();
            } else if (label === "inbox") {
                if (GLOBAL._flags.messaging === 1) {
                    MAILBOX.Show();
                } else {
                    GLOBAL.Message(KEYS.Get("disabled_mail"));
                }
            } else if (label === "daily") {
                BUY.Offers("daily");
            } else if (label === "earn") {
                GLOBAL.Message(KEYS.Get("discord_earn"));
            }
        };
    }

    public SortButtonIcons(startRow: number = 2, maxRows: number = 4, yOffset: number = 0): void {
        const xStart = 9;
        const yStart = 195;
        const colWidth = 67;
        const rowHeight = 55;
        
        let offset = yOffset;
        if (MapRoomManager.instance.isInMapRoom2) {
            offset += 35;
        }
        
        let col = 0;
        let row = 0;
        for (let i = 0; i < this._buttonIcons.length; i++) {
            if (this._buttonIcons[i].visible) {
                this._buttonIcons[i].x = xStart + col * colWidth;
                this._buttonIcons[i].y = yStart + offset;
                offset += rowHeight;
                if (row >= maxRows) {
                    row = 0;
                    offset = yOffset;
                    col++;
                }
                row++;
            }
        }
    }

    public DisplayBuffs(): void {
        const buffCount = POWERUPS.CheckPowers(null, "NORMAL");
        let childIndex = this.mcBuffHolder.numChildren;
        
        while (childIndex--) {
            this.mcBuffHolder.getChildAt(childIndex).removeEventListener(MouseEvent.ROLL_OVER, this.BuffShow.bind(this));
            this.mcBuffHolder.getChildAt(childIndex).removeEventListener(MouseEvent.ROLL_OUT, this.BuffHide.bind(this));
            this.mcBuffHolder.removeChildAt(childIndex);
        }
        
        if (buffCount > 0) {
            const powerups = POWERUPS.GetPowerups();
            let col = 0;
            let row = 0;
            
            for (const key in powerups) {
                if (POWERUPS._expireRealTime && powerups[key].endtime.Get() < GLOBAL.Timestamp()) {
                    this.BuffHide(null);
                    continue;
                }
                
                const icon = new ui_buffIcon_CLIP();
                icon.gotoAndStop(key);
                icon.name = key;
                icon.x = col * -36;
                icon.y = row * 36;
                col++;
                if (col >= 3) {
                    col = 0;
                    row++;
                }
                icon.addEventListener(MouseEvent.ROLL_OVER, this.BuffShow.bind(this));
                icon.addEventListener(MouseEvent.ROLL_OUT, this.BuffHide.bind(this));
                this.mcBuffHolder.addChild(icon);
            }
        } else {
            this.BuffHide(null);
        }
    }

    public BuffShow(e: MouseEvent): void {
        const target = e.currentTarget as MovieClip;
        const buff = BaseBuffHandler.instance.getBuffByName(target.name) as BaseBuff;
        if (!buff) return;
        
        const description = buff.description;
        let duration = "<b>" + KEYS.Get("buff_duration") + "</b>";
        
        if (POWERUPS.Timeleft(target.name) > 0) {
            duration += GLOBAL.ToTime(POWERUPS.Timeleft(target.name), true);
        } else {
            duration = "";
        }
        
        if (!this._popupBuff) {
            const popup = new bubblepopupBuff();
            this._popupBuff = this.addChild(popup) as bubblepopupBuff;
            popup.Setup(target.x + target.width / 2, target.y + target.height + 4, description, duration);
            popup.x = this.mcBuffHolder.x + (target.x + target.width / 2);
            popup.y = this.mcBuffHolder.y + (target.y + target.height + 4);
        } else {
            (this._popupBuff as bubblepopupBuff).Update(description, duration);
        }
    }

    public BuffHide(e: MouseEvent): void {
        if (this._popupBuff) {
            this.removeChild(this._popupBuff);
            this._popupBuff = null;
        }
    }

    public ButtonInfoShow(e: MouseEvent): void {
        let text: string = null;
        let x = e.target.x + 50;
        let y = e.target.y + 25;
        
        switch (e.target.name) {
            case "bInvite":
                text = KEYS.Get("pop_invite");
                break;
            case "bGift":
                text = POPUPS.QueueCount("gifts") > 0 ? KEYS.Get("pop_acceptgifts", { "v1": POPUPS.QueueCount("gifts") }) : KEYS.Get("pop_sendgifts");
                break;
            case "bInbox":
                text = KEYS.Get("pop_mailbox");
                break;
            case "bAlert":
                text = KEYS.Get("pop_alerts");
                break;
            case "mcHit":
                text = KEYS.Get("pop_outposts");
                x = e.target.parent.x + 140;
                y = e.target.parent.y + 20;
                break;
        }
        
        if (text != null) {
            this.BubbleShow(x, y, text);
        }
    }

    public ButtonInfoHide(e: MouseEvent): void {
        this.BubbleHide();
    }

    public DescentDebuffShow(): void {
        const shouldShow = (GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) && 
                           BASE.isInfernoMainYardOrOutpost && !MAPROOM_DESCENT.DescentPassed && 
                           (MAPROOM_DESCENT.DescentLevel > 6 && MAPROOM_DESCENT.DescentLevel < MAPROOM_DESCENT._descentLvlMax);
        
        if (this._descentDebuff) {
            this.DescentDebuffHide();
        }
        
        if (shouldShow) {
            this._descentDebuff = new DescentDebuffPopup();
            this._descentDebuff.Show(MAPROOM_DESCENT.DescentLevel);
        }
    }

    public DescentDebuffHide(): void {
        if (this._descentDebuff) {
            this._descentDebuff.Hide();
        }
    }

    private SetPoints(lower: number, upper: number, needed: number, points: number, level: number, animate: boolean): void {
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
            this.mc.mcPoints.mcLevel.text = level.toString();
            const barWidth = 200 / (upper - lower) * (points - lower);
            TweenLite.to(this.mc.mcPoints.mcBar, 0.6, { "width": barWidth, "ease": Elastic.easeInOut });
            
            if (animate) {
                this.mc.mcPoints.mcStar.scaleX = this.mc.mcPoints.mcStar.scaleY = 0.8;
                this.mc.mcPoints.mcStar.rotation = 180;
                TweenLite.to(this.mc.mcPoints.mcStar, 1, { "scaleX": 1, "scaleY": 1, "rotation": 0, "ease": Elastic.easeOut });
            }
        }
    }

    public BubbleShow(x: number, y: number, text: string, lines: number = 3): void {
        const bubble = new bubblepopup3();
        bubble.Setup(x, y, text, lines);
        bubble.Wobble();
        this._bubbleDo = this.addChild(bubble);
    }

    public BubbleHide(): void {
        if (this._bubbleDo && this._bubbleDo.parent) {
            this.removeChild(this._bubbleDo);
        }
    }

    public ClearSiegeWeapon(): void {
        if (this._siegeweapon && this._siegeweapon.parent) {
            this._siegeweapon.parent.removeChild(this._siegeweapon);
            this._siegeweapon = null;
        }
    }

    public validateSiegeWeapon(): boolean {
        if (this._siegeweapon == null) {
            return false;
        }
        const valid = this._siegeweapon.validate();
        if (!valid) {
            this.ClearSiegeWeapon();
        }
        return valid;
    }
}
