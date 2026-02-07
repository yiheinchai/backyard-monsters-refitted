import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import DisplayObject from 'openfl/display/DisplayObject';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import NetStatusEvent from 'openfl/events/NetStatusEvent';
import TimerEvent from 'openfl/events/TimerEvent';
import Video from 'openfl/media/Video';
import NetStream from 'openfl/net/NetStream';
import Timer from 'openfl/utils/Timer';
import { TweenLite, Circ } from './gs';
import { ImageCache } from './com/monsters/display/ImageCache';
import { KOTHHandler } from './com/monsters/kingOfTheHill/KOTHHandler';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { ReplayableEventHandler } from './com/monsters/replayableEvents/ReplayableEventHandler';
import { VideoUtils } from './com/monsters/utils/VideoUtils';
import { GUARDIANCAGEPOPUP_CLIP } from './GUARDIANCAGEPOPUP_CLIP';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { bubblepopupDownBuff } from './bubblepopupDownBuff';

// Lazy imports to break circular dependency chains
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getBASE(): any { return require("./BASE").BASE; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


export class CHAMPIONCAGEPOPUP extends GUARDIANCAGEPOPUP_CLIP {
    public static _page: number = 0;
    public static _kothEnabled: boolean = false;
    public static page1Assets: any[];
    public static page2Assets: any[];
    public static page3Assets: any[];
    public static pagesArr: any[];
    public static statsArr: any[];
    public static buffsArr: any[];
    public static kothStatsArr: any[];
    public static kothArr0: any[];
    public static kothArr1: any[];
    public static kothArr2: any[];
    public static feedIcons: any[];
    private static statsStringsArr: any[];
    private static buffsStringsArr: any[];
    public static _maxSpeed: number = 4;
    public static _maxHealth: number = 250000;
    public static _maxDamage: number = 9600;
    public static _maxBuff: number = 100;
    public static _maxLevel: number = 6;
    public static _isFeed: boolean = false;
    public static _useBonusIndicators: boolean = false;
    public static _bCage: CHAMPIONCAGE;

    private guard: ChampionBase;
    private guardType: number;
    private guardLevel: number;
    private guardID: string;
    private foodBonus: number;
    private totalFeeds: number;
    private currFeeds: number;
    private koth: ChampionBase;
    private kothType: number;
    private kothLevel: number;
    private kothWins: number;
    private kothPowerLevel: number;
    private kothID: string;
    private kothBonus: number;
    private kothAbilities: number;
    public kothTimeCurrent: number;
    public kothTimeLeft: number;
    public kothTimeStart: number;
    public kothTimeEnd: number;
    public kothTimeLength: number = 604800;
    public kothLootCurrent: number;
    public kothLootMax: number;
    public kothLootThresholds: any[];
    private _timer: Timer;
    private _videoStream: NetStream;
    private _currentVideoURL: string;
    private _currentPreviewUrl: string;
    private _kothPreviewURL: string = "monsters/G5_L6-150.png";
    private _kothVideoURL: string = "assets/koth/Krallen_200x200.flv";
    private _kothToolTip1: DisplayObject;
    private _kothToolTip2: DisplayObject;
    private _kothToolTipAbility1: DisplayObject;
    private _kothToolTipAbility2: DisplayObject;
    private readonly _PREVIEW_WIDTH: number = 200;
    private readonly _PREVIEW_HEIGHT: number = 200;
    private _DOES_PLAY_VIDEO: boolean = false;
    private readonly _KOTH_AWARD_GOAL: number = 1000000000;
    private readonly _KOTH_AWARD_ABILITY1: number = 1500000000;
    private readonly _KOTH_AWARD_ABILITY2: number = 2000000000;

    constructor() {
        super();
        this._timer = new Timer(1000);
        this.tTitle.htmlText = getKEYS().Get("gcage_title");
        CHAMPIONCAGEPOPUP._bCage = getGLOBAL()._bCage as CHAMPIONCAGE;
        CHAMPIONCAGEPOPUP.page1Assets = [this.mcImage, this.tEvoStage, this.damage_txt, this.tDamage, this.bDamage, this.health_txt, this.tHealth, this.bHealth, this.speed_txt, this.tSpeed, this.bSpeed, this.buff_txt, this.tBuff, this.bBuff, this.tEvoDesc, this.tHP, this.barHP, this.bHeal];
        CHAMPIONCAGEPOPUP.page2Assets = [this.barDNA, this.barDNA_bg, this.barDNA_mask, this.mcCurrGuardian, this.mcNextGuardian, this.tNextFeed, this.tFeedsFrom, this.mcInstant, this.mcFeed1, this.mcFeed2, this.gFeedBG, this.bEvolve, this.bFeedTimer, this.tNextFeedTitle];
        CHAMPIONCAGEPOPUP.page3Assets = [this.p3_mcImage, this.p3_tDescription, this.p3_tDescription2, this.p3_tKothLevel, this.p3_gRankBG, this.p3_damage_txt, this.p3_health_txt, this.p3_speed_txt, this.p3_buff_txt, this.p3_abilities_txt, this.p3_tDamage, this.p3_tHealth, this.p3_tSpeed, this.p3_tBuff, this.p3_bDamage, this.p3_bHealth, this.p3_bSpeed, this.p3_bBuff, this.p3_mcAbility1, this.p3_bTimeleft, this.p3_tTimeleft, this.p3_tLootLeft, this.p3_bLootLeft, this.p3_bHP, this.p3_tHP, this.p3_bHeal, this.p3_mcLootMark1, this.p3_mcLootMark2, this.p3_timeleft_txt, this.p3_looted_txt];
        CHAMPIONCAGEPOPUP.pagesArr = [CHAMPIONCAGEPOPUP.page1Assets, CHAMPIONCAGEPOPUP.page2Assets, CHAMPIONCAGEPOPUP.page3Assets];
        CHAMPIONCAGEPOPUP.statsArr = [this.damage_txt, this.tDamage, this.bDamage, this.health_txt, this.tHealth, this.bHealth, this.speed_txt, this.tSpeed, this.bSpeed, this.buff_txt, this.tBuff, this.bBuff];
        CHAMPIONCAGEPOPUP.buffsArr = [this.damage_txt2, this.tDamage2, this.bDamage2, this.health_txt2, this.tHealth2, this.bHealth2, this.speed_txt2, this.tSpeed2, this.bSpeed2, this.buff_txt2, this.tBuff2, this.bBuff2, this.tBuffDesc, this.day1, this.day2, this.day3];
        CHAMPIONCAGEPOPUP.kothArr0 = [this.p3_mcImage, this.p3_tDescription, this.p3_gRankBG, this.p3_bTimeleft, this.p3_tTimeleft, this.p3_tLootLeft, this.p3_bLootLeft, this.p3_mcLootMark1, this.p3_mcLootMark2, this.p3_timeleft_txt, this.p3_looted_txt];
        CHAMPIONCAGEPOPUP.kothArr1 = [this.p3_tDescription2];
        CHAMPIONCAGEPOPUP.kothArr2 = [this.p3_tKothLevel, this.p3_damage_txt, this.p3_health_txt, this.p3_speed_txt, this.p3_buff_txt, this.p3_abilities_txt, this.p3_tDamage, this.p3_tHealth, this.p3_tSpeed, this.p3_tBuff, this.p3_bDamage, this.p3_bHealth, this.p3_bSpeed, this.p3_bBuff, this.p3_mcAbility1, this.p3_bHP, this.p3_tHP, this.p3_bHeal];
        CHAMPIONCAGEPOPUP.feedIcons = [this.mcFeed1, this.mcFeed2];
        CHAMPIONCAGEPOPUP.kothStatsArr = [this.p3_damage_txt, this.p3_health_txt, this.p3_speed_txt, this.p3_buff_txt, this.p3_abilities_txt, this.p3_tDamage, this.p3_tHealth, this.p3_tSpeed, this.p3_tBuff, this.p3_bDamage, this.p3_bHealth, this.p3_bSpeed, this.p3_bBuff, this.p3_mcAbility1];
        this.Setup(0);
        this.mcCurrGuardian.stop();
        this.mcNextGuardian.stop();
        this.kothLootThresholds = [];
        this.kothLootThresholds.push(Number(KOTHHandler.instance.lootThresholds[1]));
        this.kothLootThresholds.push(Number(KOTHHandler.instance.lootThresholds[0]));
        this.kothLootCurrent = 0;
        this.kothLootMax = this.kothLootThresholds[this.kothLootThresholds.length - 1];
        this.kothTimeEnd = KOTHHandler.instance.timeToReset + ReplayableEventHandler.currentTime;
        this.kothTimeStart = this.kothTimeEnd - KOTHHandler.instance.timePerRound;
        this.kothTimeLeft = this.kothTimeEnd - ReplayableEventHandler.currentTime;
    }

    public static FeedClick(param1: MouseEvent): void {
        CHAMPIONCAGEPOPUP._bCage.FeedGuardian(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), false);
        getCHAMPIONCAGE().Hide(param1);
    }

    public Setup(param1: number = 0): void {
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            if (getGLOBAL()._bCage) {
                this.UpdateVars();
                this.b1.SetupKey("btn_champion", false, 0, 0);
                this.b1.addEventListener(MouseEvent.CLICK, this.SwitchClick(0));
                this.b2.SetupKey("btn_evolution", false, 0, 0);
                if (this.guardLevel == 6) {
                    this.b2.SetupKey("btn_dailyfeed", false, 0, 0);
                }
                this.b2.addEventListener(MouseEvent.CLICK, this.SwitchClick(1));
                if (CHAMPIONCAGEPOPUP._kothEnabled) {
                    this.b3.SetupKey("btn_krallen");
                    this.b3.addEventListener(MouseEvent.CLICK, this.SwitchClick(2));
                } else {
                    this.b3.visible = false;
                    this.b3.mouseEnabled = false;
                }
                this.tTitle.mouseEnabled = this.tEvoStage.mouseEnabled = false;
                this._timer.addEventListener(TimerEvent.TIMER, this.onTick.bind(this));
                this._timer.start();
                this.Switch(param1);
            } else {
                getGLOBAL().Message(getKEYS().Get("cage_notbuilt"));
            }
        }
    }

    public addKothListeners(): void {
        if (!this.p3_mcLootMark2.check.visible) {
            this.p3_mcLootMark2.addEventListener(MouseEvent.ROLL_OVER, this.onOverKothTooltip.bind(this));
            this.p3_mcLootMark2.addEventListener(MouseEvent.ROLL_OUT, this.onOutKothTooltip.bind(this));
        }
        this.p3_bHeal.addEventListener(MouseEvent.CLICK, this.kothHealClick.bind(this));
        this.p3_mcAbility1.addEventListener(MouseEvent.ROLL_OVER, this.onKothAbilityOver.bind(this));
        this.p3_mcAbility1.addEventListener(MouseEvent.ROLL_OUT, this.onKothAbilityOut.bind(this));
    }

    public removeKothListeners(): void {
        this.p3_mcLootMark1.removeEventListener(MouseEvent.ROLL_OVER, this.onOverKothTooltip.bind(this));
        this.p3_mcLootMark2.removeEventListener(MouseEvent.ROLL_OVER, this.onOverKothTooltip.bind(this));
        this.p3_mcLootMark1.removeEventListener(MouseEvent.ROLL_OUT, this.onOutKothTooltip.bind(this));
        this.p3_mcLootMark2.removeEventListener(MouseEvent.ROLL_OUT, this.onOutKothTooltip.bind(this));
        this.p3_bHeal.removeEventListener(MouseEvent.CLICK, this.kothHealClick.bind(this));
        this.p3_mcAbility1.removeEventListener(MouseEvent.ROLL_OVER, this.onKothAbilityOver.bind(this));
        this.p3_mcAbility1.removeEventListener(MouseEvent.ROLL_OUT, this.onKothAbilityOut.bind(this));
    }

    public onOverKothTooltip(param1: MouseEvent = null): void {
        this.addKothTooltip(param1.target as MovieClip);
    }

    public onOutKothTooltip(param1: MouseEvent = null): void {
        this.removeKothTooltip(param1.target as MovieClip);
    }

    public onKothAbilityOver(param1: MouseEvent = null): void {
        this.addKothAbilityTooltip(param1.target as MovieClip);
    }

    public onKothAbilityOut(param1: MouseEvent = null): void {
        this.removeKothAbilityTooltip(param1.target as MovieClip);
    }

    public addKothTooltip(param1: MovieClip): void {
        let _loc4_: MovieClip = null;
        let _loc5_: bubblepopupDownBuff = null;
        let _loc2_: string = "";
        const _loc3_: string = "";
        switch (param1) {
            case this.p3_mcLootMark1:
                _loc2_ = getKEYS().Get("krallenquota1_tooltip", { "v1": getGLOBAL().FormatNumber(this.kothLootThresholds[0]) });
                _loc4_ = this.p3_mcLootMark1;
                break;
            case this.p3_mcLootMark2:
                _loc2_ = getKEYS().Get("krallenquota2_tooltip", { "v1": getGLOBAL().FormatNumber(this.kothLootThresholds[1]) });
                _loc4_ = this.p3_mcLootMark2;
                break;
            default:
                return;
        }
        if (this._kothToolTip1 || this._kothToolTip2) {
            this.removeKothTooltip(_loc4_);
        }
        _loc5_ = new bubblepopupDownBuff();
        if (_loc4_ == this.p3_mcLootMark1) {
            this._kothToolTip1 = this.addChild(_loc5_);
        }
        if (_loc4_ == this.p3_mcLootMark2) {
            this._kothToolTip2 = this.addChild(_loc5_);
        }
        _loc5_.Setup(_loc4_.x + _loc4_.width / 2, _loc4_.y + _loc4_.height + 4, _loc2_, _loc3_);
        _loc5_.x = 0 + (_loc4_.x + _loc4_.width / 2) - 2;
        _loc5_.y = 0 + (_loc4_.y - _loc4_.height + 4);
        _loc5_.Resize(60);
    }

    public removeKothTooltip(param1: MovieClip = null): void {
        if (param1 == this.p3_mcLootMark1 && this._kothToolTip1) {
            this.removeChild(this._kothToolTip1);
            this._kothToolTip1 = null;
        } else if (param1 == this.p3_mcLootMark2 && this._kothToolTip2) {
            this.removeChild(this._kothToolTip2);
            this._kothToolTip2 = null;
        } else if (param1 == null) {
            if (this._kothToolTip1) {
                this.removeChild(this._kothToolTip1);
                this._kothToolTip1 = null;
            }
            if (this._kothToolTip2) {
                this.removeChild(this._kothToolTip2);
                this._kothToolTip2 = null;
            }
        }
    }

    public addKothAbilityTooltip(param1: MovieClip): void {
        let _loc4_: MovieClip = null;
        let _loc2_: string = "";
        const _loc3_: string = "";
        switch (param1) {
            case this.p3_mcAbility1:
                if (this.kothPowerLevel >= 2) {
                    _loc2_ = getKEYS().Get("krallen_lootbuffactive_tooltip");
                } else {
                    _loc2_ = getKEYS().Get("krallen_lootbuff_tooltip", { "v1": getGLOBAL().FormatNumber(this.kothLootThresholds[1]) });
                }
                _loc4_ = this.p3_mcAbility1;
                if (this._kothToolTipAbility1 || this._kothToolTipAbility2) {
                    this.removeKothAbilityTooltip(_loc4_);
                }
                const _loc5_: bubblepopupDownBuff = new bubblepopupDownBuff();
                if (_loc4_ == this.p3_mcAbility1) {
                    this._kothToolTipAbility1 = this.addChild(_loc5_);
                }
                _loc5_.Setup(_loc4_.x + _loc4_.width / 2, _loc4_.y + _loc4_.height + 4, _loc2_, _loc3_);
                _loc5_.x = 0 + (_loc4_.x + _loc4_.width / 2) - 2;
                _loc5_.y = 0 + (_loc4_.y - _loc4_.height / 4);
                return;
            default:
                return;
        }
    }

    public removeKothAbilityTooltip(param1: MovieClip = null): void {
        if (param1 == this.p3_mcAbility1 && this._kothToolTipAbility1) {
            this.removeChild(this._kothToolTipAbility1);
            this._kothToolTipAbility1 = null;
        } else if (param1 == null) {
            if (this._kothToolTipAbility1) {
                this.removeChild(this._kothToolTipAbility1);
                this._kothToolTipAbility1 = null;
            }
        }
    }

    public onTick(param1: TimerEvent): void {
        this.update();
    }

    public UpdateVars(): void {
        if (getCREATURES()._guardian) {
            this.guard = getCREATURES()._guardian;
            this.guardType = getCREATURES()._guardian._type;
            this.guardLevel = getCREATURES()._guardian._level.Get();
            this.foodBonus = getCREATURES()._guardian._foodBonus.Get();
            this.guardID = getCREATURES()._guardian._creatureID;
            this.totalFeeds = getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.guardLevel, "feedCount");
            this.currFeeds = getCREATURES()._guardian._feeds.Get();
        }
        if (getCREATURES()._krallen) {
            this.koth = getCREATURES()._krallen;
            this.kothType = getCREATURES()._krallen._type;
            this.kothLevel = getCREATURES()._krallen._level.Get();
            this.kothWins = KOTHHandler.instance.wins;
            this.kothBonus = getCREATURES()._krallen._powerLevel.Get();
            this.kothPowerLevel = getCREATURES()._krallen._powerLevel.Get();
            this.kothID = getCREATURES()._krallen._creatureID;
        }
    }

    public Switch(param1: number = 0): void {
        // Implementation continues - this is a very large method
        CHAMPIONCAGEPOPUP._page = param1;
        this.UpdateVars();
        this.mcInstant.bAction.removeEventListener(MouseEvent.CLICK, this.InstantClick.bind(this));
        this.mcInstant.bAction.removeEventListener(MouseEvent.CLICK, this.EvolveClick.bind(this));
        this.bEvolve.removeEventListener(MouseEvent.CLICK, CHAMPIONCAGEPOPUP.FeedClick);
        this.bHeal.removeEventListener(MouseEvent.CLICK, this.HealClick.bind(this));
        // Page switching logic
        for (let _loc2_ = 0; _loc2_ < CHAMPIONCAGEPOPUP.pagesArr.length; _loc2_++) {
            if (_loc2_ == param1) {
                for (let _loc4_ = 0; _loc4_ < CHAMPIONCAGEPOPUP.pagesArr[_loc2_].length; _loc4_++) {
                    CHAMPIONCAGEPOPUP.pagesArr[_loc2_][_loc4_].visible = true;
                    if (CHAMPIONCAGEPOPUP.pagesArr[_loc2_][_loc4_] instanceof MovieClip) {
                        CHAMPIONCAGEPOPUP.pagesArr[_loc2_][_loc4_].enabled = true;
                    }
                }
            } else {
                for (let _loc5_ = 0; _loc5_ < CHAMPIONCAGEPOPUP.pagesArr[_loc2_].length; _loc5_++) {
                    CHAMPIONCAGEPOPUP.pagesArr[_loc2_][_loc5_].visible = false;
                    if (CHAMPIONCAGEPOPUP.pagesArr[_loc2_][_loc5_] instanceof MovieClip) {
                        CHAMPIONCAGEPOPUP.pagesArr[_loc2_][_loc5_].enabled = false;
                    }
                }
            }
        }
        // Hide buffs
        for (let _loc3_ = 0; _loc3_ < CHAMPIONCAGEPOPUP.buffsArr.length; _loc3_++) {
            CHAMPIONCAGEPOPUP.buffsArr[_loc3_].visible = false;
        }
        // Reset buff widths
        for (let i = 1; i <= 3; i++) {
            this.bDamage["mcBuff" + i].width = 0;
            this.bHealth["mcBuff" + i].width = 0;
            this.bSpeed["mcBuff" + i].width = 0;
            this.bBuff["mcBuff" + i].width = 0;
        }
        if (getCREATURES()._guardian) {
            if (param1 == 0) {
                this.UpdatePortrait();
                this.UpdateStats();
                this.bHeal.SetupKey("btn_healchampion", false, 0, 0);
                if (getCREATURES()._guardian.health >= getCREATURES()._guardian.maxHealth) {
                    this.bHeal.Enabled = false;
                } else {
                    this.bHeal.Enabled = true;
                    this.bHeal.addEventListener(MouseEvent.CLICK, this.HealClick.bind(this));
                }
            } else if (param1 == 1) {
                this.UpdateDNA();
                this.UpdateStats();
            }
        }
        this.b1.Highlight = param1 == 0;
        this.b2.Highlight = param1 == 1;
        this.b3.Highlight = param1 == 2;
        this.window.gotoAndStop(param1 + 1);
        if (param1 == 2) {
            this.addKothListeners();
        } else {
            this.removeKothTooltip();
            this.removeKothAbilityTooltip();
            this.removeKothListeners();
        }
    }

    private hasKoth(): boolean {
        for (let i = 0; i < getGLOBAL()._playerGuardianData.length; i++) {
            if (getGLOBAL()._playerGuardianData[i].t == 5) return true;
        }
        return false;
    }

    private getKothThreshold(param1: number = 1): number {
        return Number(this.kothLootThresholds[Math.min(Math.max(param1 - 1, 0), this.kothLootThresholds.length - 1)]);
    }

    private addVideo(): void {
        const _loc1_: Video = new Video(this._PREVIEW_WIDTH, this._PREVIEW_HEIGHT);
        this._videoStream = VideoUtils.getVideoStream(_loc1_, this._kothVideoURL);
        VideoUtils.loopStream(this._videoStream);
        (this.p3_mcImage as any).videoCanvas.addChild(_loc1_);
        _loc1_.x = 25;
        _loc1_.y = -20;
    }

    protected update(): void {
        if (CHAMPIONCAGEPOPUP._page == 2 && CHAMPIONCAGEPOPUP._kothEnabled) {
            if (!this._DOES_PLAY_VIDEO) {
                if (this._currentPreviewUrl != this._kothPreviewURL) {
                    this._currentPreviewUrl = this._kothPreviewURL;
                    (this.p3_mcImage as any).videoCanvas.visible = false;
                    (this.p3_mcImage as any).imageCanvas.visible = true;
                    ImageCache.GetImageWithCallBack(this._kothPreviewURL, this.onPreviewImageLoaded.bind(this), true, 1, "", [(this.p3_mcImage as any).imageCanvas]);
                }
            }
            this.UpdateStats();
            this.UpdatePortrait();
        }
    }

    private onPreviewImageLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        if (param1 != this._currentPreviewUrl) return;
        const _loc4_: MovieClip = param3[0];
        if (_loc4_) {
            while (_loc4_.numChildren > 0) {
                _loc4_.removeChildAt(0);
            }
            const _loc5_: Bitmap = new Bitmap(param2);
            _loc5_.x = 50;
            _loc4_.addChild(_loc5_);
            _loc4_.visible = true;
        }
    }

    protected onErrorLoadingVideo(param1: any): void {}

    private onStreamNetStatus(param1: NetStatusEvent): void {
        if (param1.info.code == "NetStream.Play.Stop") {
            this._videoStream.seek(0);
        }
    }

    private UpdatePortrait(): void {
        const UpdatePortraitIcon = (param1: string, param2: BitmapData): void => {
            this.mcImage.addChild(new Bitmap(param2));
        };
        if (getCREATURES()._guardian) {
            if (this.mcImage) {
                while (this.mcImage.numChildren) {
                    this.mcImage.removeChildAt(0);
                }
            }
            ImageCache.GetImageWithCallBack("monsters/G" + getCREATURES()._guardian._type + "_L" + getCREATURES()._guardian._level.Get() + "-250.png", UpdatePortraitIcon);
        }
    }

    private FeedIconLoaded(param1: string, param2: BitmapData): void {
        CHAMPIONCAGEPOPUP.feedIcons[0].mcImage.addChild(new Bitmap(param2));
        CHAMPIONCAGEPOPUP.feedIcons[0].mcImage.width = 30;
        CHAMPIONCAGEPOPUP.feedIcons[0].mcImage.height = 27;
    }

    private FeedIconLoaded2(param1: string, param2: BitmapData): void {
        CHAMPIONCAGEPOPUP.feedIcons[1].mcImage.addChild(new Bitmap(param2));
        CHAMPIONCAGEPOPUP.feedIcons[1].mcImage.width = 30;
        CHAMPIONCAGEPOPUP.feedIcons[1].mcImage.height = 27;
    }

    private UpdateDNA(): void {
        if (getCREATURES()._guardian) {
            if (this.mcCurrGuardian.numChildren == 0) {
                ImageCache.loadImageAndAddChild("monsters/G" + getCREATURES()._guardian._type + "_L" + getCREATURES()._guardian._level.Get() + "-150.png", this.mcCurrGuardian);
                ImageCache.loadImageAndAddChild("monsters/G" + getCREATURES()._guardian._type + "_L" + (getCREATURES()._guardian._level.Get() + 1) + "-150G.png", this.mcNextGuardian);
            }
            const _loc2_: number = -517;
            const _loc3_: number = 222;
            const _loc4_: number = this.currFeeds / this.totalFeeds;
            this.barDNA_mask.x = _loc2_ + _loc4_ * _loc3_;
            const _loc5_: number = getCREATURES()._guardian._feedTime.Get();
            if (_loc5_ < getGLOBAL().Timestamp()) {
                this.tNextFeedTitle.htmlText = "<b>" + getKEYS().Get("gcage_hungry") + "</b>";
                this.tNextFeed.htmlText = getGLOBAL().ToTime(_loc5_ + getCHAMPIONCAGE().STARVETIMER - getGLOBAL().Timestamp());
            } else {
                this.tNextFeedTitle.htmlText = "<b>" + getKEYS().Get("gcage_nextFeedIn") + "</b>";
                this.tNextFeed.htmlText = getGLOBAL().ToTime(getCREATURES()._guardian._feedTime.Get() - getGLOBAL().Timestamp());
            }
            this.tFeedsFrom.htmlText = Math.max(0, this.totalFeeds - this.currFeeds) + getKEYS().Get("gcage_feedsFromEvo");
        }
    }

    private UpdateStats(): void {
        this.UpdateVars();
        if (getCREATURES()._guardian) {
            this.tEvoStage.htmlText = "<b>" + getKEYS().Get("gcage_evo") + "</b> Stage " + getCREATURES()._guardian._level.Get();
            this.damage_txt.htmlText = "<b>" + getKEYS().Get("gcage_labelDamage") + "</b>";
            this.health_txt.htmlText = "<b>" + getKEYS().Get("gcage_labelHealth") + "</b>";
            this.speed_txt.htmlText = "<b>" + getKEYS().Get("gcage_labelSpeed") + "</b>";
            this.buff_txt.htmlText = "<b>" + getKEYS().Get("gcage_labelBuff") + "</b>";
            
            let _loc1_ = getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.guardLevel, "damage");
            let _loc2_ = getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.guardLevel, "health");
            let _loc3_ = getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.guardLevel, "speed");
            let _loc4_ = getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.guardLevel, "buffs") * 100;
            
            if (this.foodBonus > 0) {
                _loc1_ += getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.foodBonus, "bonusDamage");
                _loc2_ += getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.foodBonus, "bonusHealth");
                _loc3_ += getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.foodBonus, "bonusSpeed");
                _loc4_ += getCHAMPIONCAGE().GetGuardianProperty(this.guardID, this.foodBonus, "bonusBuffs") * 100;
            }
            
            const _loc9_ = Math.floor(_loc3_ * 10) / 10;
            this.tDamage.htmlText = "" + _loc1_;
            this.tHealth.htmlText = "" + _loc2_;
            this.tSpeed.htmlText = "" + _loc9_;
            this.tBuff.htmlText = "" + Math.floor(_loc4_) + "%";
            this.tHP.htmlText = Math.floor(this.guard.health) + " / " + Math.floor(this.guard.maxHealth);
            
            TweenLite.to(this.bDamage.mcBar, 0.4, { "width": 100 / CHAMPIONCAGEPOPUP._maxDamage * _loc1_, "ease": Circ.easeInOut });
            TweenLite.to(this.bHealth.mcBar, 0.4, { "width": 100 / CHAMPIONCAGEPOPUP._maxHealth * _loc2_, "ease": Circ.easeInOut });
            TweenLite.to(this.bSpeed.mcBar, 0.4, { "width": 100 / CHAMPIONCAGEPOPUP._maxSpeed * _loc3_, "ease": Circ.easeInOut });
            TweenLite.to(this.bBuff.mcBar, 0.4, { "width": 100 / CHAMPIONCAGEPOPUP._maxBuff * _loc4_, "ease": Circ.easeInOut });
            
            (this.barHP as any).mcBar.width = 100 / this.guard.maxHealth * Math.max(1, this.guard.health);
        }
    }

    public Tick(): void {
        if (!getCREATURES()._guardian) return;
        const _loc1_: number = getCREATURES()._guardian._feedTime.Get();
        if (_loc1_ < getGLOBAL().Timestamp()) {
            if (CHAMPIONCAGEPOPUP._page == 1) this.Switch(1);
            this.tNextFeedTitle.htmlText = "<b>" + getKEYS().Get("gcage_hungry") + "</b>";
            this.tNextFeed.htmlText = getGLOBAL().ToTime(_loc1_ + getCHAMPIONCAGE().STARVETIMER - getGLOBAL().Timestamp());
            (this.bFeedTimer as any).mcBar.width = 0;
        } else {
            this.tNextFeedTitle.htmlText = "<b>" + getKEYS().Get("gcage_nextFeedIn") + "</b>";
            this.tNextFeed.htmlText = getGLOBAL().ToTime(getCREATURES()._guardian._feedTime.Get() - getGLOBAL().Timestamp());
        }
        this.UpdateStats();
        if (getCREATURES()._guardian.health >= getCREATURES()._guardian.maxHealth) {
            this.bHeal.removeEventListener(MouseEvent.CLICK, this.HealClick.bind(this));
            this.bHeal.Enabled = false;
        }
    }

    public SwitchClick(param1: number): (e: MouseEvent) => void {
        const page = param1;
        return (param1: MouseEvent = null): void => {
            this.Switch(page);
        };
    }

    public HealClick(param1: MouseEvent): void {
        if (getCREATURES()._guardian.health < getCREATURES()._guardian.maxHealth) {
            getCHAMPIONCAGE().HealGuardian();
        }
        this.Switch(0);
    }

    public kothHealClick(param1: MouseEvent = null): void {
        if (getCREATURES()._krallen && getCREATURES()._krallen.health < getCREATURES()._krallen.maxHealth) {
            getCHAMPIONCAGE().HealGuardian(5);
        }
        this.Switch(2);
    }

    public EvolveClick(param1: MouseEvent): void {
        let _loc2_: number = 0;
        if (getCREATURES()._guardian._level.Get() < 6) {
            _loc2_ = getCHAMPIONCAGE().GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), "feedShiny");
            _loc2_ *= 2;
            _loc2_ *= getCHAMPIONCAGE().GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), "feedCount") - getCREATURES()._guardian._feeds.Get();
            this.EvolveClickB();
        } else if (getCREATURES()._guardian._level.Get() == 6) {
            _loc2_ = getCHAMPIONCAGE().GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._foodBonus.Get(), "bonusFeedShiny");
            _loc2_ *= 2;
            this.EvolveClickB();
        }
    }

    public EvolveClickB(): void {
        if (getCREATURES()._guardian._level.Get() < 6) {
            let _loc1_ = getCHAMPIONCAGE().GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), "feedShiny");
            _loc1_ *= 2;
            _loc1_ *= getCHAMPIONCAGE().GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), "feedCount") - getCREATURES()._guardian._feeds.Get();
            if (getBASE()._credits.Get() < _loc1_) {
                getPOPUPS().DisplayGetShiny();
                return;
            }
            getCREATURES()._guardian.levelSet(getCREATURES()._guardian._level.Get() + 1, _loc1_);
            getBASE().Purchase("IEV", _loc1_, "cage");
            getCHAMPIONCAGE().Hide();
            getBASE().Save(0, false, true);
        }
    }

    public InstantClick(param1: MouseEvent): void {
        const _loc2_ = getCREATURES()._guardian._feedTime.Get() < getGLOBAL().Timestamp();
        if (getCREATURES()._guardian._level.Get() <= 6) {
            CHAMPIONCAGEPOPUP._bCage.FeedGuardian(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), true, !_loc2_);
            getCHAMPIONCAGE().Hide(param1);
        }
    }

    public CantFeedClick(param1: MouseEvent): void {
        if (getCREATURES()._guardian._level.Get() <= 6 && getCREATURES()._guardian._foodBonus.Get() < 3) {
            getGLOBAL().Message(getKEYS().Get("gcage_msgNotHungry"));
        } else if (getCREATURES()._guardian._level.Get() == 6 && getCREATURES()._guardian._foodBonus.Get() >= 3) {
            getGLOBAL().Message(getKEYS().Get("gcage_msgFullBuff"));
        }
    }

    public CantInstantClick(param1: MouseEvent): void {
        getGLOBAL().Message(getKEYS().Get("gcage_msgFullBuff"));
    }

    public Hide(param1: MouseEvent = null): void {
        getCHAMPIONCAGE().Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
