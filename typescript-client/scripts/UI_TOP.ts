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
import { MapRoom3Cell } from "./com/monsters/maproom3/MapRoom3Cell";
import { DescentDebuffPopup } from "./com/monsters/maproom_inferno/views/DescentDebuffPopup";
import { ChampionBase } from "./com/monsters/monsters/champions/ChampionBase";
import { SubscriptionHandler } from "./com/monsters/subscriptions/SubscriptionHandler";
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
import { YARD_PROPS } from "./YARD_PROPS";
import { POWERUPS } from "./POWERUPS";
import { MAILBOX } from "./MAILBOX";
import { MAPROOM_DESCENT } from "./MAPROOM_DESCENT";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getSiegeWeapons(): any { return require("./com/monsters/siege/SiegeWeapons").SiegeWeapons; }
function getResourceOutpost(): any { return require("./ResourceOutpost").ResourceOutpost; }
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getBASE(): any { return require("./BASE").BASE; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getBUY(): any { return require("./BUY").BUY; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


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
        let mode = getGLOBAL().mode;
        
        switch (getGLOBAL().mode) {
            case getGLOBAL().e_BASE_MODE.BUILD:
            case getGLOBAL().e_BASE_MODE.IBUILD:
                mode = getGLOBAL().e_BASE_MODE.BUILD;
                break;
            case getGLOBAL().e_BASE_MODE.ATTACK:
            case getGLOBAL().e_BASE_MODE.IATTACK:
                mode = getGLOBAL().e_BASE_MODE.ATTACK;
                break;
            case getGLOBAL().e_BASE_MODE.WMATTACK:
            case getGLOBAL().e_BASE_MODE.IWMATTACK:
                mode = getGLOBAL().e_BASE_MODE.WMATTACK;
                break;
            case getGLOBAL().e_BASE_MODE.VIEW:
            case getGLOBAL().e_BASE_MODE.IVIEW:
                mode = getGLOBAL().e_BASE_MODE.VIEW;
                break;
            case getGLOBAL().e_BASE_MODE.HELP:
            case getGLOBAL().e_BASE_MODE.IHELP:
                mode = getGLOBAL().e_BASE_MODE.HELP;
                break;
            case getGLOBAL().e_BASE_MODE.WMVIEW:
            case getGLOBAL().e_BASE_MODE.IWMVIEW:
                mode = getMapRoomManager().instance.isInMapRoom3 ? getGLOBAL().e_BASE_MODE.ATTACK : getGLOBAL().e_BASE_MODE.WMVIEW;
                break;
        }
        
        if (getMapRoomManager().instance.isInMapRoom3 && (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.VIEW || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMVIEW)) {
            this.gotoAndStop(getGLOBAL().e_BASE_MODE.ATTACK);
        } else {
            this.gotoAndStop(getGLOBAL()._loadmode);
        }
        
        if (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IBUILD) {
            this.setupBuildMode();
        } else if (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.WMATTACK || 
                   getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IATTACK || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IWMATTACK) {
            this.setupAttackMode();
        } else if (getMapRoomManager().instance.isInMapRoom3 && (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.VIEW || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMVIEW)) {
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
        this._resourceUI.r1 = getBASE()._resources.r1.Get();
        this._resourceUI.r2 = getBASE()._resources.r2.Get();
        this._resourceUI.r3 = getBASE()._resources.r3.Get();
        this._resourceUI.r4 = getBASE()._resources.r4.Get();
        
        for (let i = 1; i <= 4; i++) {
            this.mc["mcR" + i]._resource = getBASE()._resources["r" + i].Get();
        }
        
        this.mc.mcR5.bAdd.txtAdd.autoSize = TextFieldAutoSize.LEFT;
        this.mc.mcR5.bAdd.txtAdd.htmlText = getKEYS().Get("ui_topaddshiny");
        this.mc.mcR5.bAdd.mcBG.width = this.mc.mcR5.bAdd.txtAdd.width + 11;
        this.mc.mcR5.mcBG.width = 82 + this.mc.mcR5.bAdd.width;
        
        this.mc.mcR5.bAdd.addEventListener(MouseEvent.CLICK, (e: MouseEvent): void => {
            getGLOBAL().Message(getKEYS().Get("disabled_addshiny"));
        });
        this.mc.mcR5.bAdd.buttonMode = true;
        this.mc.mcR5.bAdd.mouseChildren = false;
        
        this.mc.mcOutposts.mcHit.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow.bind(this));
        this.mc.mcOutposts.mcHit.addEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide.bind(this));
        this.mc.mcOutposts.bNext.addEventListener(MouseEvent.CLICK, getBASE().LoadNext);
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
            this.mc.bEarn.bAction.tLabel.htmlText = getKEYS().Get("btn_earn");
            if (getGLOBAL()._flags.showFBCEarn === 1) {
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
            this.mc.bDailyDeal.tLabel.htmlText = getKEYS().Get("btn_dailydeal");
            if (getGLOBAL()._flags.showFBCDaily === 1) {
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
        if (!getGLOBAL()._attackersFlinger) {
            this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = getKEYS().Get("no_flinger");
        } else {
            this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = getBASE().isInfernoMainYardOrOutpost ? getKEYS().Get("monster_limit") : getKEYS().Get("attack_flingerbar");
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
        this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = getKEYS().Get("txt_flinger_capacity");
        this._creatureButtonsMC._mc._txtContainer.mcBar.visible = true;
        this._creatureButtonsMC._mc._txtContainer.tA.htmlText = "0%";
        this._creatureButtonsMC.y = 180;
        this._creatureButtonsMC._mc.x = 2;
        this._creatureButtonsMC._mc.y = -6;
        this._creatureButtons = [];
        
        if (!getGLOBAL()._attackersFlinger) {
            this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = getKEYS().Get("no_flinger");
            this._creatureButtonsMC._mc._txtContainer.tA.htmlText = "";
            this._creatureButtonsMC._mc._bottomBar.visible = false;
        } else {
            this.m_creatureContainer = new Sprite();
            this._creatureButtonsMC.addChild(this.m_creatureContainer);
            const result = this.setupChampionButtons(this.m_creatureContainer);
            this.setupCreatureButtons(this.m_creatureContainer, result[0], result[1]);
            
            if (this.m_creatureContainer.numChildren === 0) {
                this._creatureButtonsMC._mc._txtContainer.flinger_txt.htmlText = getKEYS().Get("no_monsters");
                this._creatureButtonsMC._mc._bottomBar.visible = false;
            }
            
            const mask = new Sprite();
            mask.graphics.beginFill(0xFFFFFF, 1);
            mask.graphics.drawRect(0, 22, 200, getGLOBAL()._SCREEN.height - 476);
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
        
        if (getSiegeWeapons().availableWeapon != null && !getBASE().isInfernoMainYardOrOutpost) {
            this._siegeweapon = new SIEGEWEAPONPOPUP();
            this.mc.addChild(this._siegeweapon);
            this._siegeweapon.x = 442;
            this._siegeweapon.y = 20;
            this._siegeweapon.Setup(!getGLOBAL().isInAttackMode);
        }
        
        if (getGLOBAL()._attackersCatapult > 0 && !getBASE().isInfernoMainYardOrOutpost) {
            this._catapult = new CATAPULTPOPUP();
            this.mc.addChild(this._catapult);
            this._catapult.x = 350;
            this._catapult.y = 20;
            this._catapult.Setup(!getGLOBAL().isInAttackMode);
        }
    }

    private setupChampionButtons(container: DisplayObjectContainer): number[] {
        let count = 0;
        let total = 0;
        let hasNormal = false;
        let lastButton: MovieClip = null;
        
        for (let i = 0; i < getGLOBAL()._playerGuardianData.length; i++) {
            const guardian = getGLOBAL()._playerGuardianData[i];
            if (guardian && guardian.hp.Get() > 0) {
                const status = guardian.status || ChampionBase.k_CHAMPION_STATUS_NORMAL;
                if (status === ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                    if (hasNormal && guardian.t !== 5) {
                        getLOGGER().Log("log", "User is initializing combat with more than one normal champ.");
                    } else if (getGLOBAL()._loadmode === getGLOBAL().mode || (getGLOBAL()._loadmode !== getGLOBAL().mode && !MAPROOM_DESCENT.DescentPassed)) {
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
            this._creatureButtonsMC._mc._bottomBar.y = Math.min(getGLOBAL()._SCREEN.height - 450, lastButton.y + lastButton.height - this._creatureButtonsMC._mc._bottomBar.height * 0.8);
        }
        
        return [count, total];
    }

    private setupCreatureButtons(container: DisplayObjectContainer, startIndex: number, total: number): void {
        const creatures = getCREATURELOCKER()._creatures;
        let lastButton: MovieClip = null;
        let index = startIndex;
        
        for (const key in creatures) {
            if (getATTACK()._curCreaturesAvailable[key] && getATTACK()._curCreaturesAvailable[key] > 0) {
                lastButton = container.addChild(new CREATUREBUTTON(key, index, this._creatureButtonsMC)) as MovieClip;
                lastButton.x = 14;
                lastButton.y = 34 + index * 53;
                if (getMapRoomManager().instance.isInMapRoom2or3) {
                    lastButton.addEventListener(UI_TOP.CREATUREBUTTONOVER, this.sortCreatureButtons.bind(this));
                }
                this._creatureButtons.push(lastButton);
                index++;
            }
        }
        
        if (lastButton) {
            this._creatureButtonsMC._mc._bottomBar.y = Math.min(getGLOBAL()._SCREEN.height - 450, lastButton.y + lastButton.height - this._creatureButtonsMC._mc._bottomBar.height * 0.8);
        }
    }

    private sortCreatureButtons(e: Event): void {
        this._creatureButtonsMC.addChild(e.target as DisplayObject);
    }

    private InfoShow(e: MouseEvent): void {
        this.mc.mcPoints.gotoAndStop(2);
        const level = getBASE().BaseLevel();
        this.mc.mcPoints.tInfo.htmlText = getKEYS().Get("pop_experiencebar", {
            "v1": getGLOBAL().FormatNumber(level.points),
            "v2": getGLOBAL().FormatNumber(level.needed),
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
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
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
                this._creatureButtonsMC._mc._bottomBar.y = Math.min(getGLOBAL()._SCREEN.height - 450, 
                    this._creatureButtons[count - 1].y + this._creatureButtons[count - 1].height - this._creatureButtonsMC._mc._bottomBar.height * 0.8);
            }
            
            const mask = this.m_creatureContainer.mask as Sprite;
            mask.graphics.clear();
            mask.graphics.beginFill(0xFFFFFF, 1);
            mask.graphics.drawRect(0, 22, 200, getGLOBAL()._SCREEN.height - 476);
            mask.graphics.endFill();
            this.m_creatureContainer.mask = mask;
            this.m_scrollBar.checkResize();
        }
    }

    public Update(): void {
        if (!getGLOBAL()._catchup) {
            if (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IBUILD) {
                this.updateBuildMode();
            } else if (getMapRoomManager().instance.isInMapRoom3 && (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.VIEW || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.WMVIEW)) {
                this.updateScoutMode();
            } else if (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.WMATTACK || 
                       getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IATTACK || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IWMATTACK) {
                this.updateAttackMode();
            }
            
            const level = getBASE().BaseLevel();
            this.SetPoints(level.lower, level.upper, level.needed, level.points, level.level, false);
        }
    }

    private updateBuildMode(): void {
        const r1 = getBASE()._resources.r1.Get();
        const r2 = getBASE()._resources.r2.Get();
        const r3 = getBASE()._resources.r3.Get();
        const r4 = getBASE()._resources.r4.Get();
        
        TweenLite.to(this.mc.mcR1, 0.5, { "_resource": r1, "onUpdate": () => this.UpdateTweenResourceText(1), "ease": Linear.easeNone, "overwrite": 1 });
        TweenLite.to(this.mc.mcR2, 0.5, { "_resource": r2, "onUpdate": () => this.UpdateTweenResourceText(2), "ease": Linear.easeNone, "overwrite": 1 });
        TweenLite.to(this.mc.mcR3, 0.5, { "_resource": r3, "onUpdate": () => this.UpdateTweenResourceText(3), "ease": Linear.easeNone, "overwrite": 1 });
        TweenLite.to(this.mc.mcR4, 0.5, { "_resource": r4, "onUpdate": () => this.UpdateTweenResourceText(4), "ease": Linear.easeNone, "overwrite": 1 });
        
        this.mc.mcR5.tR.htmlText = "<b>" + getGLOBAL().FormatNumber(getBASE()._credits.Get()) + "</b>";
        
        if (getMapRoomManager().instance.isInMapRoom2) {
            this.mc.mcOutposts.visible = true;
            this.mc.mcOutposts.tR.htmlText = getGLOBAL()._mapOutpost.length;
        } else {
            this.mc.mcOutposts.visible = false;
        }
        
        if (getTUTORIAL()._stage < 200) {
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
            this.mc.bEarn.visible = getGLOBAL()._flags.showFBCEarn === 1;
            this.mc.bDailyDeal.visible = getGLOBAL()._flags.showFBCDaily === 1;
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
            mc.tR.htmlText = "<b>" + getGLOBAL().FormatNumber(getATTACK()._loot["r" + i].Get()) + "</b>";
            mc.mcBar.visible = false;
        }
        
        for (let i = 0; i < this._creatureButtons.length; i++) {
            this._creatureButtons[i].Update();
        }
        
        let capacity = getGLOBAL()._buildingProps[4].capacity[getGLOBAL()._attackersFlinger - 1];
        if (MAPROOM_DESCENT.InDescent) {
            capacity = YARD_PROPS._yardProps[4].capacity[getGLOBAL()._attackersFlinger - 1];
        }
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_DECLAREWAR, "OFFENSE")) {
            capacity += capacity * 0.25;
        }
        
        let remaining = capacity;
        if (getMapRoomManager().instance.isInMapRoom3 && getATTACK().USE_CUMULATIVE_FLINGER_CAPACITY) {
            remaining -= getATTACK()._flungSpace.Get();
        }
        
        for (const key in getATTACK()._flingerBucket) {
            const isGuardian = key.substr(0, 1) === "G";
            if (!getMapRoomManager().instance.isInMapRoom3 && isGuardian) {
                remaining -= getCHAMPIONCAGE().GetGuardianProperty(key.substr(0, 2), 1, "bucket");
            } else if (!isGuardian) {
                remaining -= getCREATURES().GetProperty(key, "bucket") * getATTACK()._flingerBucket[key].Get();
            }
        }
        
        this._creatureButtonsMC._mc._txtContainer.mcBar.width = 115 - 115 / capacity * remaining;
        
        if (getMapRoomManager().instance.isInMapRoom3) {
            this._creatureButtonsMC._mc._txtContainer.mcBar.scaleX = (1 - remaining / capacity) * 1.2;
        } else {
            this._creatureButtonsMC._mc._txtContainer.mcBar.scaleX = (100 - 100 / capacity * remaining) / 100;
        }
        
        if (getGLOBAL()._attackersFlinger) {
            if (getMapRoomManager().instance.isInMapRoom3) {
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
            mc.tR.htmlText = "<b>" + getGLOBAL().FormatNumber((getGLOBAL()._currentCell as MapRoom3Cell).attackCost[i - 1]) + "</b>";
            mc.mcBar.visible = false;
        }
        
        for (let i = 0; i < this._creatureButtons.length; i++) {
            this._creatureButtons[i].Update();
        }
        
        this.updateTimerDisplay();
    }

    private updateTimerDisplay(): void {
        if (getGLOBAL().mode !== getGLOBAL()._loadmode) {
            if (getATTACK()._countdown > 0) {
                this.mc.tMessage.htmlText = getKEYS().Get("attack_ui_attacklock");
            } else {
                this.mc.tMessage.htmlText = getKEYS().Get("attack_ui_attackends");
            }
        } else if (getATTACK()._countdown > 0) {
            this.mc.tMessage.htmlText = getKEYS().Get("attack_ui_flingerlock");
        } else {
            this.mc.tMessage.htmlText = getKEYS().Get("attack_ui_attackends");
        }
        
        if (getATTACK()._countdown > 30) {
            this.mc.tTime.htmlText = getGLOBAL().ToTime(getATTACK()._countdown, true);
        } else if (getATTACK()._countdown > 0) {
            this.mc.tTime.htmlText = "<font color=\"#FF0000\">" + getGLOBAL().ToTime(getATTACK()._countdown, true) + "</font>";
        } else if (getATTACK()._countdown > -120) {
            this.mc.tTime.htmlText = "<font color=\"#FFFFFF\">" + getGLOBAL().ToTime(120 + getATTACK()._countdown, true) + "</font>";
        } else {
            this.mc.tTime.htmlText = "<font color=\"#FFFFFF\">" + getKEYS().Get("attack_ui_over") + "</font>";
        }
    }

    public UpdateTweenResourceText(n: number): void {
        const mc = this.mc["mcR" + n];
        const value = mc._resource;
        mc.tR.htmlText = "<b>" + getGLOBAL().FormatNumber(value) + "</b>";
        let barWidth = 90 / getBASE()._resources["r" + n + "max"] * value;
        if (barWidth > 90) barWidth = 90;
        mc.mcBar.width = barWidth;
    }

    public Topup(n: number): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            const scrollPos = Math.min((n - 1) * 0.4, 1);
            if (getBASE().isInfernoMainYardOrOutpost) {
                getSTORE().ShowB(2, scrollPos, ["BR" + n + "1I", "BR" + n + "2I", "BR" + n + "3I"]);
            } else {
                getSTORE().ShowB(2, scrollPos, ["BR" + n + "1", "BR" + n + "2", "BR" + n + "3"]);
            }
        };
    }

    public StatsShow(n: number, topup: boolean): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            let text: string;
            let lines: number;
            
            if (n < 5) {
                if (topup) {
                    text = "<b><font size=\"12\">" + getKEYS().Get(getGLOBAL()._resourceNames[n - 1]) + "</font></b><br><b>" + getKEYS().Get("bubble_topup") + "</b>";
                    lines = 2;
                } else if (getMapRoomManager().instance.isInMapRoom2or3) {
                    text = getKEYS().Get("pop_resource2", {
                        "v1": getKEYS().Get(getGLOBAL()._resourceNames[n - 1]),
                        "v2": getGLOBAL().FormatNumber(getBASE()._resources["r" + n + "max"]),
                        "v3": getGLOBAL().FormatNumber(getBASE()._resources["r" + n + "Rate"]),
                        "v4": getGLOBAL().FormatNumber(getBASE().getEmpireResources(n))
                    });
                    lines = 4;
                } else {
                    text = "<b><font size=\"12\">" + getKEYS().Get(getGLOBAL()._resourceNames[n - 1]) + "</font></b><br>" + getKEYS().Get("pop_resource", {
                        "v1": getGLOBAL().FormatNumber(getBASE()._resources["r" + n + "max"]),
                        "v2": getGLOBAL().FormatNumber(getBASE()._resources["r" + n + "Rate"])
                    });
                    lines = 3;
                }
            } else {
                text = "<b>" + getKEYS().Get("bubble_getshiny") + "</b>";
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
                getGLOBAL().Message(getKEYS().Get("disabled_gifts"));
            } else if (label === "alert") {
                if (getBASE()._currentAttacks && getBASE()._currentAttacks.length > 0) {
                    for (const attack of getBASE()._currentAttacks) {
                        attack.seen = true;
                    }
                    getBASE()._attacksModified = true;
                    getBASE().Save();
                }
                getPOPUPS().Show("alerts");
            } else if (label === "invite") {
                getPOPUPS().Invite();
            } else if (label === "inbox") {
                if (getGLOBAL()._flags.messaging === 1) {
                    MAILBOX.Show();
                } else {
                    getGLOBAL().Message(getKEYS().Get("disabled_mail"));
                }
            } else if (label === "daily") {
                getBUY().Offers("daily");
            } else if (label === "earn") {
                getGLOBAL().Message(getKEYS().Get("discord_earn"));
            }
        };
    }

    public SortButtonIcons(startRow: number = 2, maxRows: number = 4, yOffset: number = 0): void {
        const xStart = 9;
        const yStart = 195;
        const colWidth = 67;
        const rowHeight = 55;
        
        let offset = yOffset;
        if (getMapRoomManager().instance.isInMapRoom2) {
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
                if (POWERUPS._expireRealTime && powerups[key].endtime.Get() < getGLOBAL().Timestamp()) {
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
        let duration = "<b>" + getKEYS().Get("buff_duration") + "</b>";
        
        if (POWERUPS.Timeleft(target.name) > 0) {
            duration += getGLOBAL().ToTime(POWERUPS.Timeleft(target.name), true);
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
                text = getKEYS().Get("pop_invite");
                break;
            case "bGift":
                text = getPOPUPS().QueueCount("gifts") > 0 ? getKEYS().Get("pop_acceptgifts", { "v1": getPOPUPS().QueueCount("gifts") }) : getKEYS().Get("pop_sendgifts");
                break;
            case "bInbox":
                text = getKEYS().Get("pop_mailbox");
                break;
            case "bAlert":
                text = getKEYS().Get("pop_alerts");
                break;
            case "mcHit":
                text = getKEYS().Get("pop_outposts");
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
        const shouldShow = (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) && 
                           getBASE().isInfernoMainYardOrOutpost && !MAPROOM_DESCENT.DescentPassed && 
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
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
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

    /**
     * Shows an overcharge warning popup at the specified resource row
     * @param row The resource row number to show the warning at
     */
    public OverchargeShow(row: number): void {
        if (!this._popupWarning) {
            this._popupWarning = this.addChild(new bubblepopup4()) as bubblepopup4;
        }
        this._popupWarning.tA.htmlText = getBASE().isInfernoMainYardOrOutpost ? getKEYS().Get("inf_ui_needmoreroom") : getKEYS().Get("ui_needmoreroom");
        this._popupWarning.x = 150;
        this._popupWarning.y = 20 + 41 * row;
        this._popupWarning.Wobble();
    }

    /**
     * Hides the overcharge warning popup
     */
    public OverchargeHide(): void {
        if (this._popupWarning) {
            this.removeChild(this._popupWarning);
            this._popupWarning = null;
        }
    }

    /**
     * Deselect bomb/attack mode
     */
    public BombDeselect(): void {
        // Empty implementation - placeholder for bomb deselection
    }

    /**
     * Deselect monster selection mode
     */
    public MonsterDeselect(): void {
        for (const key in getATTACK()._flingerBucket) {
            if (getATTACK()._flingerBucket[key] && getATTACK()._flingerBucket[key].Get() > 0) {
                (getATTACK()._curCreaturesAvailable[key] as any).Add(getATTACK()._flingerBucket[key].Get());
                getATTACK()._flingerBucket[key].Set(0);
            }
        }
        getATTACK().BucketUpdate();
        for (let i = 0; i < this._creatureButtons.length; i++) {
            this._creatureButtons[i].Update();
        }
    }

    /**
     * Add an icon to the UI (e.g., KOTH icon)
     */
    public addIcon(icon: DisplayObject): void {
        if (this.mc && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            icon.x = 222;
            icon.y = 0;
            this._kothIcon = this.mc.addChild(icon);
            (this.mc as any).mcR5.x = 284;
            (this.mc as any).bEarn.x = 415;
            (this.mc as any).bDealSpot.x = 502;
            (this.mc as any).bDailyDeal.x = 493;
        }
    }

    /**
     * Remove an icon from the UI
     */
    public removeIcon(icon: DisplayObject): void {
        if (this.mc && this.mc.contains(icon)) {
            this.mc.removeChild(icon);
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
                (this.mc as any).mcR5.x = 227;
                (this.mc as any).bEarn.x = 358;
                (this.mc as any).bDailyDeal.x = 436;
                (this.mc as any).bDealSpot.x = 445;
            }
        }
        if (this._kothIcon) {
            if (this._kothIcon.parent) {
                this._kothIcon.parent.removeChild(this._kothIcon);
            }
            this._kothIcon = null;
        }
    }

    /**
     * Add a resource bar to the UI
     */
    public addResourceBar(bar: DisplayObject): void {
        let targetMC: MovieClip | null = null;
        if (this.mc && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && !getBASE().isInfernoMainYardOrOutpost) {
            if (getMapRoomManager().instance.isInMapRoom2) {
                targetMC = (this.mc as any).mcOutposts;
            } else {
                targetMC = (this.mc as any).mcR4;
            }
            if (targetMC) {
                bar.x = -4;
                bar.y = targetMC.y + 37;
                targetMC.addChild(bar);
            }
        }
    }

    /**
     * Clear all event listeners and UI components
     */
    public Clear(): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            if ((this.mc as any).mcPoints) {
                (this.mc as any).mcPoints.removeEventListener(MouseEvent.MOUSE_OVER, this.InfoShow);
                (this.mc as any).mcPoints.removeEventListener(MouseEvent.MOUSE_OUT, this.InfoHide);
            }
            for (let i = 1; i < 5; i++) {
                const mcR = (this.mc as any)["mcR" + i];
                if (mcR) {
                    if (mcR.mcHit) {
                        mcR.mcHit.removeEventListener(MouseEvent.MOUSE_OVER, this.StatsShow(i, false));
                        mcR.mcHit.removeEventListener(MouseEvent.MOUSE_OUT, this.StatsHide);
                    }
                    if (mcR.bAdd) {
                        mcR.bAdd.removeEventListener(MouseEvent.CLICK, this.Topup(i));
                    }
                }
            }
            const mcR5 = (this.mc as any).mcR5;
            if (mcR5 && mcR5.bAdd) {
                mcR5.bAdd.removeEventListener(MouseEvent.CLICK, getBUY().Show);
            }
            const mcOutposts = (this.mc as any).mcOutposts;
            if (mcOutposts && mcOutposts.mcHit && mcOutposts.bNext) {
                mcOutposts.mcHit.removeEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow);
                mcOutposts.mcHit.removeEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide);
                mcOutposts.bNext.removeEventListener(MouseEvent.CLICK, getBASE().LoadNext);
            }
            const bInvite = (this.mc as any).bInvite;
            if (bInvite) {
                bInvite.removeEventListener(MouseEvent.CLICK, this.ButtonClick("invite"));
                bInvite.removeEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfoShow);
                bInvite.removeEventListener(MouseEvent.MOUSE_OUT, this.ButtonInfoHide);
            }
        }
    }

    /**
     * Setup the UI based on current game mode
     */
    public Setup(): void {
        const mode = getGLOBAL().mode;
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.IBUILD) {
            const onImageLoad = (e: Event): void => {
                (this.mc as any).mcPic.mcBG.addChild(loader);
                if (getGLOBAL()._flags.viximo || getGLOBAL()._flags.kongregate) {
                    loader.width = loader.height = 50;
                }
            };
            const LoadImageError = (e: IOErrorEvent): void => {
                // Error loading image
            };
            if (getBASE()._ownerName) {
                if (getBASE()._ownerName.toLowerCase().charAt(getBASE()._ownerName.length - 1) === "s") {
                    (this.mc as any).mcPoints.tName.htmlText = getKEYS().Get("uitop_yardownershort", { v1: getBASE()._ownerName.toUpperCase() });
                } else {
                    (this.mc as any).mcPoints.tName.htmlText = getKEYS().Get("uitop_yardownerlong", { v1: getBASE()._ownerName.toUpperCase() });
                }
            } else if (getGLOBAL().mode === getGLOBAL()._loadmode) {
                (this.mc as any).mcPoints.tName.htmlText = getKEYS().Get("uitop_backyardmonsters");
            } else {
                (this.mc as any).mcPoints.tName.htmlText = getKEYS().Get("uitop_backyardmonstersinferno");
            }
            const loader = new Loader();
            loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
            loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
            if (getGLOBAL()._loadmode === "wmattack" || getGLOBAL()._loadmode === "wmview" || getGLOBAL()._loadmode === "iwmattack" || getGLOBAL()._loadmode === "iwmview") {
                loader.load(new URLRequest(getGLOBAL()._storageURL + getBASE()._ownerPic));
            } else if (!getGLOBAL()._flags.viximo || !getGLOBAL()._flags.kongregate) {
                loader.load(new URLRequest(getBASE()._ownerPic));
            } else {
                loader.load(new URLRequest("http://graph.facebook.com/" + getBASE()._loadedFBID + "/picture"));
            }
        } else if (getGLOBAL().mode === getGLOBAL()._loadmode) {
            (this.mc as any).mcPoints.tName.htmlText = getKEYS().Get("uitop_backyardmonsters");
        } else {
            (this.mc as any).mcPoints.tName.htmlText = getKEYS().Get("uitop_backyardmonstersinferno");
        }
    }
}
