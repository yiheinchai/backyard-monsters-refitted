import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import AsyncErrorEvent from "openfl/events/AsyncErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import NetStatusEvent from "openfl/events/NetStatusEvent";
import SecurityErrorEvent from "openfl/events/SecurityErrorEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Video from "openfl/media/Video";
import NetConnection from "openfl/net/NetConnection";
import NetStream from "openfl/net/NetStream";
import TextField from "openfl/text/TextField";
import Timer from "openfl/utils/Timer";

import { ImageCache } from "../display/ImageCache";
import { ScrollSet } from "../display/ScrollSet";
import { SiegeWeapon } from "./weapons/SiegeWeapon";
import { SiegeBuilding } from "./SiegeBuilding";
import { SiegeBuildingPopup_ListItem_CLIP } from "../../../SiegeBuildingPopup_ListItem_CLIP";
import { SiegeWeaponProperty } from "./SiegeWeaponProperty";
import { SIEGEBUILDINGPOPUP_CLIP } from "../../../SIEGEBUILDINGPOPUP_CLIP";

import { creatureBarAdv } from "../../../creatureBarAdv";
import { icon_costs } from "../../../icon_costs";

// Lazy imports to break circular dependency chains
function getSiegeWeapons(): any { return require("./SiegeWeapons").SiegeWeapons; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }


/**
 * SiegeBuildingPopup - Siege building popup UI for lab and factory.
 */
export class SiegeBuildingPopup extends SIEGEBUILDINGPOPUP_CLIP {
    private _scrollSet: ScrollSet | null = null;
    private _scrollSetContainer: Sprite | null = null;
    private _statLabels: Array<TextField> = [];
    private _statBarTexts: Array<TextField> = [];
    private _statBars: Array<creatureBarAdv> = [];
    private _siegeWeaponRows: Array<SiegeBuildingPopup_ListItem_CLIP> = [];
    private _resourceCosts: Array<icon_costs> = [];
    private _tab: string = "";
    private _currentWeapon: SiegeWeapon | null = null;
    private _maxStatBarWidth: number = 0;
    private _maxTimeBarWidth: number = 0;
    private _currentPreviewUrl: string = "";
    private _timer: Timer;
    private _videoStream: NetStream | null = null;
    private _currentVideoURL: string = "";
    private readonly _PREVIEW_WIDTH: number = 400;
    private readonly _PREVIEW_HEIGHT: number = 175;
    private readonly _DOES_PLAY_VIDEO: boolean = true;

    constructor(tab: string, weaponID: string | null = null) {
        super();
        this._timer = new Timer(1000);
        if (weaponID) {
            this._currentWeapon = getSiegeWeapons().getWeapon(weaponID);
        }
        this._tab = tab;
        this._siegeWeaponRows = [];
        this._scrollSet = new ScrollSet();
        this._scrollSet.x = this.scroller.x;
        this._scrollSet.y = this.scroller.y;
        this._scrollSet.width = this.scroller.width;
        this._scrollSet.Init(this.weaponContainer_mc, this.weaponContainer_mask, ScrollSet.BROWN, this.weaponContainer_mask.y, this.weaponContainer_mask.height);
        this._scrollSet.AutoHideEnabled = false;
        this._scrollSet.isHiddenWhileUnnecessary = true;
        this._scrollSetContainer = new Sprite();
        this._scrollSetContainer.addChild(this._scrollSet);
        this.addChild(this._scrollSetContainer);
        this.scroller.visible = false;
        this.mcTime.mcBar2.visible = false;
        this.tab_siegelab.addEventListener(MouseEvent.CLICK, this.SwitchToLab.bind(this));
        this.tab_siegelab.Setup();
        this.title_siegelab.htmlText = getKEYS().Get("b_siegeworks_title");
        this.title_siegelab.mouseEnabled = false;
        this.tab_siegefactory.addEventListener(MouseEvent.CLICK, this.SwitchToFactory.bind(this));
        this.tab_siegefactory.Setup();
        this.title_siegefactory.htmlText = getKEYS().Get("b_siegefactory_title");
        this.title_siegefactory.mouseEnabled = false;
        this._statLabels = [this.stat1_label, this.stat2_label, this.stat3_label];
        this._statBarTexts = [this.stat1_bartxt, this.stat2_bartxt, this.stat3_bartxt];
        this._statBars = [this.stat1_bar, this.stat2_bar, this.stat3_bar];
        this._resourceCosts = [this.mcResources.mcR1, this.mcResources.mcR2, this.mcResources.mcR3, this.mcResources.mcTime];
        for (let i = 0; i < this._statBars.length; i++) {
            this._statBars[i].mcBar2.gotoAndStop(3);
        }
        this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, this.DoInstant.bind(this), false, 0, true);
        this.mcInstant.gCoin.mouseEnabled = false;
        this.mcInstant.bAction.Highlight = true;
        this.mcResources.bAction.addEventListener(MouseEvent.CLICK, this.DoResources.bind(this));
        this.bCancel.addEventListener(MouseEvent.CLICK, this.CancelAction.bind(this));
        this.bCancel.SetupKey("btn_cancel");
        this.bMap.addEventListener(MouseEvent.CLICK, this.OpenMap.bind(this));
        this.bMap.SetupKey("btn_openmap");
        this._maxStatBarWidth = this.stat1_bar.width / this.stat1_bar.scaleX;
        this._maxTimeBarWidth = this.mcTime.width / this.mcTime.scaleX;
        this._timer.addEventListener(TimerEvent.TIMER, this.onTick.bind(this));
        this._timer.start();
        const video = new Video(this._PREVIEW_WIDTH, this._PREVIEW_HEIGHT);
        this._videoStream = this.LoadVideo(video);
        this.videoCanvas_mc.container.addChild(video);
        this.Update();
    }

    private LoadVideo(video: Video, url: string | null = null): NetStream {
        const connection = new NetConnection();
        connection.addEventListener(AsyncErrorEvent.ASYNC_ERROR, this.onErrorLoadingVideo.bind(this));
        connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.onErrorLoadingVideo.bind(this));
        connection.connect(null);
        const stream = new NetStream(connection);
        stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, this.onErrorLoadingVideo.bind(this));
        stream.addEventListener(NetStatusEvent.NET_STATUS, this.onStreamNetStatus.bind(this));
        stream.client = { "onMetaData": this.onErrorLoadingVideo.bind(this) };
        if (url) {
            stream.play(url);
        }
        video.attachNetStream(stream);
        return stream;
    }

    protected onErrorLoadingVideo(event: any): void {
    }

    private onStreamNetStatus(event: NetStatusEvent): void {
        if (event.info.code === "NetStream.Play.Stop") {
            this._videoStream!.seek(0);
        }
    }

    public Update(): void {
        let allWeapons: Array<SiegeWeapon> = [];
        getSiegeWeapons().addCurrentWeapons(allWeapons);
        if (this._tab === "factory") {
            let i = 0;
            let newlen = allWeapons.length;
            while (i < newlen) {
                if (allWeapons[i].level <= 0) {
                    allWeapons[i] = allWeapons[newlen - 1];
                    newlen--;
                } else {
                    i++;
                }
            }
            allWeapons.length = newlen;
        }
        allWeapons.sort((a, b) => a.weaponID < b.weaponID ? -1 : 1);
        this.HideAll();
        this.tab_siegelab.Highlight = this._tab === "lab";
        this.tab_siegefactory.Highlight = this._tab === "factory";
        this.window.gotoAndStop(this._tab === "lab" ? 1 : 2);
        if (this._tab === "lab" && (!getGLOBAL()._bSiegeLab || getGLOBAL()._bSiegeLab.isBuilding)) {
            this.tNotice.htmlText = getKEYS().Get("msg_siegeworks_notbuilt");
            this.tNotice.visible = true;
        } else if (this._tab === "factory" && (!getGLOBAL()._bSiegeFactory || getGLOBAL()._bSiegeFactory.isBuilding)) {
            this.tNotice.htmlText = getKEYS().Get("msg_siegefactory_notbuilt");
            this.tNotice.visible = true;
        } else if (this._tab === "lab" && getGLOBAL()._bSiegeLab.isUpgrading) {
            this.tNotice.htmlText = getKEYS().Get("msg_sworks_upgrading");
            this.tNotice.visible = true;
        } else if (this._tab === "factory" && getGLOBAL()._bSiegeFactory.isUpgrading) {
            this.tNotice.htmlText = getKEYS().Get("msg_sfactory_upgrading");
            this.tNotice.visible = true;
        } else if (this._tab === "lab" && (getGLOBAL()._bSiegeLab && getGLOBAL()._bSiegeLab.health < getGLOBAL()._bSiegeLab.maxHealth * 0.5)) {
            this.tNotice.htmlText = getKEYS().Get("msg_sworks_damaged", { "v1": getGLOBAL()._bSiegeLab.name });
            this.tNotice.visible = true;
        } else if (this._tab === "factory" && (getGLOBAL()._bSiegeFactory && getGLOBAL()._bSiegeFactory.health < getGLOBAL()._bSiegeFactory.maxHealth * 0.5)) {
            this.tNotice.htmlText = getKEYS().Get("msg_sfactory_damaged", { "v1": getGLOBAL()._bSiegeFactory.name });
            this.tNotice.visible = true;
        } else if (allWeapons.length <= 0) {
            this.tNotice.htmlText = getKEYS().Get("msg_siegefactory_noweapon");
            this.tNotice.visible = true;
        } else {
            let resetCurrentWeapon = true;
            for (const weapon of allWeapons) {
                if (weapon === this._currentWeapon) {
                    resetCurrentWeapon = false;
                }
            }
            if (!this._currentWeapon || resetCurrentWeapon) {
                this._currentWeapon = allWeapons[0];
            }
            if (this._DOES_PLAY_VIDEO) {
                if (this._currentVideoURL !== this._currentWeapon.video) {
                    this._videoStream!.close();
                    this._currentVideoURL = this._currentWeapon.video;
                    this._videoStream!.play(getGLOBAL()._storageURL + this._currentWeapon.video);
                }
            } else if (this._currentPreviewUrl !== this._currentWeapon.videopreview) {
                this._currentPreviewUrl = this._currentWeapon.videopreview;
                this.videoCanvas_mc.container.visible = false;
                ImageCache.GetImageWithCallBack(this._currentWeapon.videopreview, this.onPreviewImageLoaded.bind(this), true, 1, "", [this.videoCanvas_mc.container]);
            }
            this.UpdateShowList(allWeapons);
            this.UpdateShowCurrentWeapon();
        }
        if (!this.mcInstant.bAction.mouseEnabled && !getBASE()._saving) {
            this.mcInstant.bAction.Enabled = true;
            this.mcInstant.bAction.mouseEnabled = true;
        }
    }

    private HideAll(): void {
        for (let i = 0; i < 3; i++) {
            this._statLabels[i].visible = false;
            this._statBarTexts[i].visible = false;
            this._statBars[i].visible = false;
        }
        this.mcInstant.visible = false;
        this.mcResources.visible = false;
        this.mcTimeTxt.visible = false;
        this.mcTime.visible = false;
        this.bCancel.visible = false;
        this.tTitle.visible = false;
        this.tTitleReady.visible = false;
        this.tDesc.visible = false;
        this.tWarning.visible = false;
        this.tNotice.visible = false;
        this.weaponContainer_mc.visible = false;
        this.weaponContainer_frame.visible = false;
        this.weaponContainer_mask.visible = false;
        this._scrollSetContainer!.visible = false;
        this.videoCanvas_mc.visible = false;
        this.bMap.visible = false;
    }

    private UpdateShowList(weapons: Array<SiegeWeapon>): void {
        let rowIndex = 0;
        for (let i = 0; i < weapons.length; i++) {
            if (rowIndex >= this._siegeWeaponRows.length) {
                this._siegeWeaponRows.push(new SiegeBuildingPopup_ListItem_CLIP());
                this.weaponContainer_mc.addChild(this._siegeWeaponRows[rowIndex]);
                this._siegeWeaponRows[rowIndex].y = this._siegeWeaponRows[0].height * rowIndex;
                this._siegeWeaponRows[rowIndex].addEventListener(MouseEvent.CLICK, this.onClickListItem.bind(this));
                this._siegeWeaponRows[rowIndex].mouseChildren = false;
                this._siegeWeaponRows[rowIndex].buttonMode = true;
                this._siegeWeaponRows[rowIndex].buttonMode = true;
            }
            const row = this._siegeWeaponRows[rowIndex];
            row.tLabel.htmlText = "<b>" + weapons[i].name + "</b>";
            row.gotoAndStop(this._currentWeapon === weapons[i] ? 2 : 1);
            row.siegeWeapon = weapons[i];
            ImageCache.GetImageWithCallBack(row.siegeWeapon.icon, this.onIconImageLoaded.bind(this), true, 1, "", [row.mcImage]);
            if (this._tab === "lab" && getGLOBAL()._bSiegeLab && getGLOBAL()._bSiegeLab.IsUpgrading(weapons[i])) {
                if (weapons[i].level <= 0) {
                    row.tDescription.htmlText = getKEYS().Get("msg_unlocking");
                    row.tDescription.visible = true;
                } else {
                    row.tDescription.visible = false;
                }
                const timeLeft = getGLOBAL()._bSiegeLab.UpgradeTimeLeft(weapons[i]);
                const timeTotal = getGLOBAL()._bSiegeLab.UpgradeTimeTotal(weapons[i]);
                row.mcTime.mcBar.width = (1 - timeLeft / timeTotal) * (row.mcTime.width / row.mcTime.scaleX);
                row.tTime.htmlText = getGLOBAL().ToTime(timeLeft);
                row.mcTime.visible = true;
                row.tTime.visible = true;
            } else if (this._tab === "factory" && getGLOBAL()._bSiegeFactory && getGLOBAL()._bSiegeFactory.IsUpgrading(weapons[i])) {
                row.tDescription.visible = false;
                const timeLeft = getGLOBAL()._bSiegeFactory.UpgradeTimeLeft(weapons[i]);
                const timeTotal = getGLOBAL()._bSiegeFactory.UpgradeTimeTotal(weapons[i]);
                row.mcTime.mcBar.width = (1 - timeLeft / timeTotal) * (row.mcTime.width / row.mcTime.scaleX);
                row.tTime.htmlText = getGLOBAL().ToTime(timeLeft);
                row.mcTime.visible = true;
                row.tTime.visible = true;
            } else {
                if (this._tab === "lab" && row.siegeWeapon.level <= 0) {
                    row.tDescription.htmlText = getKEYS().Get("msg_locked");
                    row.tDescription.visible = true;
                } else {
                    row.tDescription.visible = false;
                }
                row.mcTime.visible = false;
                row.tTime.visible = false;
            }
            if (this._tab === "factory" && row.siegeWeapon.quantity > 0) {
                row.tReady.htmlText = getKEYS().Get("msg_ready");
                row.tReady.visible = true;
            } else {
                row.tReady.visible = false;
            }
            if (this._tab === "lab" && row.siegeWeapon.level >= SiegeWeapon.MAX_LEVEL) {
                row.tReady.htmlText = "<b>" + getKEYS().Get("msg_fullyupgraded") + "</b>";
                row.tReady.visible = true;
            }
            if (row.tDescription.visible) {
                for (let j = 0; j < SiegeWeapon.MAX_LEVEL; j++) {
                    (row["star" + (j + 1)] as MovieClip).visible = false;
                }
            } else {
                for (let j = 0; j < SiegeWeapon.MAX_LEVEL; j++) {
                    const star = row["star" + (j + 1)] as MovieClip;
                    star.gotoAndStop(j < weapons[i].level ? "on" : "off");
                    star.visible = true;
                }
            }
            rowIndex++;
        }
        this._scrollSet!.ContainerHeight = this._siegeWeaponRows[0].height * rowIndex;
        while (rowIndex < this._siegeWeaponRows.length) {
            this.weaponContainer_mc.removeChild(this._siegeWeaponRows.pop()!);
        }
        this.weaponContainer_mc.visible = true;
        this.weaponContainer_frame.visible = true;
        this.weaponContainer_mask.visible = true;
        this._scrollSetContainer!.visible = true;
        this._scrollSet!.Update();
    }

    private onClickListItem(event: MouseEvent): void {
        const row = event.currentTarget as SiegeBuildingPopup_ListItem_CLIP;
        this._currentWeapon = row.siegeWeapon;
        this.Update();
    }

    private onPreviewImageLoaded(path: string, bitmapData: BitmapData, params: Array<any> | null = null): void {
        if (path !== this._currentPreviewUrl) {
            return;
        }
        const container = params ? params[0] as MovieClip : null;
        if (container) {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
            const bmp = new Bitmap(bitmapData);
            bmp.width = this._PREVIEW_WIDTH;
            bmp.height = this._PREVIEW_HEIGHT;
            container.addChild(bmp);
            container.visible = true;
        }
    }

    private onIconImageLoaded(path: string, bitmapData: BitmapData, params: Array<any> | null = null): void {
        const container = params ? params[0] as MovieClip : null;
        if (container) {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
            const bmp = new Bitmap(bitmapData);
            bmp.width = bmp.height = 50;
            container.addChild(bmp);
            container.visible = true;
        }
    }

    private UpdateShowCurrentWeapon(): void {
        this.tTitle.htmlText = "<b>" + this._currentWeapon!.name + "</b>";
        if (this._currentWeapon!.quantity > 0 && this._tab === "factory") {
            this.tTitleReady.htmlText = getKEYS().Get("msg_ready");
            this.tTitleReady.visible = true;
        } else {
            this.tTitleReady.visible = false;
        }
        this.tDesc.htmlText = this._currentWeapon!.description;
        this.videoCanvas_mc.visible = true;
        this.tTitle.visible = true;
        this.tDesc.visible = true;
        const properties = this._currentWeapon!.getProperties();
        for (let i = 0; i < 3 && i < properties.length; i++) {
            this._statLabels[i].htmlText = "<b>" + properties[i].label + "</b>";
            this._statLabels[i].visible = true;
            if (this._currentWeapon!.level === 0) {
                this._statBarTexts[i].htmlText = getGLOBAL().FormatNumber(properties[i].getValueForLevel(this._currentWeapon!.level + 1));
                this._statBars[i].mcBar.width = 0;
                this._statBars[i].mcBar2.width = properties[i].getProgressForLevel(this._currentWeapon!.level + 1) * this._maxStatBarWidth;
            } else if (this._tab === "lab") {
                if (this._currentWeapon!.level >= SiegeWeapon.MAX_LEVEL) {
                    this._statBars[i].mcBar.width = properties[i].getProgressForLevel(SiegeWeapon.MAX_LEVEL) * this._maxStatBarWidth;
                    this._statBarTexts[i].htmlText = getGLOBAL().FormatNumber(properties[i].getValueForLevel(SiegeWeapon.MAX_LEVEL));
                    this._statBars[i].mcBar2.width = 0;
                } else {
                    this._statBars[i].mcBar.width = properties[i].getProgressForLevel(this._currentWeapon!.level) * this._maxStatBarWidth;
                    const currentVal = properties[i].getValueForLevel(this._currentWeapon!.level);
                    const diff = properties[i].getValueForLevel(this._currentWeapon!.level + 1) - currentVal;
                    if (diff < 0) {
                        this._statBarTexts[i].htmlText = getGLOBAL().FormatNumber(currentVal) + " (" + getGLOBAL().FormatNumber(diff) + ")";
                    } else if (diff > 0) {
                        this._statBarTexts[i].htmlText = getGLOBAL().FormatNumber(currentVal) + " (+" + getGLOBAL().FormatNumber(diff) + ")";
                    } else {
                        this._statBarTexts[i].htmlText = getGLOBAL().FormatNumber(currentVal);
                    }
                    this._statBars[i].mcBar2.width = properties[i].getProgressForLevel(this._currentWeapon!.level + 1) * this._maxStatBarWidth;
                }
            } else {
                this._statBars[i].mcBar.width = properties[i].getProgressForLevel(this._currentWeapon!.level) * this._maxStatBarWidth;
                this._statBarTexts[i].htmlText = getGLOBAL().FormatNumber(properties[i].getValueForLevel(this._currentWeapon!.level));
                this._statBars[i].mcBar2.width = 0;
            }
            this._statBarTexts[i].visible = true;
            this._statBars[i].visible = true;
        }
        if (this._tab === "lab") {
            this.UpdateShowCurrentWeaponLab();
        } else if (this._tab === "factory") {
            this.UpdateShowCurrentWeaponFactory();
        }
    }

    private UpdateShowCurrentWeaponLab(): void {
        if (getGLOBAL()._bSiegeLab.IsUpgrading(this._currentWeapon!)) {
            const timeLeft = getGLOBAL()._bSiegeLab.UpgradeTimeLeft(this._currentWeapon!);
            const timeTotal = getGLOBAL()._bSiegeLab.UpgradeTimeTotal(this._currentWeapon!);
            const progress = 1 - timeLeft / timeTotal;
            const instantCost = getGLOBAL()._bSiegeLab.getInstantUpgradeCost(this._currentWeapon!.weaponID);
            this.mcInstant.bAction.Setup(getKEYS().Get("btn_finishnow"));
            this.mcInstant.tDescription.htmlText = "<b>" + getKEYS().Get("siege_shiny", { "v1": instantCost }) + "</b>";
            this.mcTimeTxt.htmlText = "<b>" + getGLOBAL().ToTime(timeLeft, true, false) + "</b>";
            this.mcTime.mcBar.width = this._maxTimeBarWidth * progress;
            this.mcTimeTxt.visible = true;
            this.mcTime.visible = true;
            this.bCancel.visible = true;
            this.mcInstant.visible = true;
        } else if (this._currentWeapon!.level < SiegeWeapon.MAX_LEVEL) {
            if (getGLOBAL()._bSiegeLab.upgradingWeapon) {
                this.tWarning.htmlText = getKEYS().Get("msg_oneweaponupgrade", { "v1": getGLOBAL()._bSiegeLab.upgradingWeapon.name });
                this.tWarning.visible = true;
            } else if (getGLOBAL()._bSiegeLab._lvl.Get() - 1 < this._currentWeapon!.level) {
                this.tWarning.htmlText = getKEYS().Get("msg_upgraderequiredlevel", {
                    "v1": getGLOBAL()._bSiegeLab.name,
                    "v2": this._currentWeapon!.level + 1
                });
                this.tWarning.visible = true;
            } else {
                this.mcInstant.bAction.Setup(getKEYS().Get("btn_useshiny", { "v1": this._currentWeapon!.instantUpgradeCost }));
                if (this._currentWeapon!.level === 0) {
                    this.mcInstant.tDescription.htmlText = "<b>" + getKEYS().Get("msg_unlockinstant") + "</b>";
                    this.mcResources.bAction.SetupKey("btn_startunlocking");
                } else {
                    this.mcInstant.tDescription.htmlText = "<b>" + getKEYS().Get("msg_upgradeinstant") + "</b>";
                    this.mcResources.bAction.SetupKey("btn_startupgrade");
                }
                this.mcInstant.visible = true;
                this.UpdateShowCurrentCosts();
            }
        }
    }

    private UpdateShowCurrentWeaponFactory(): void {
        if (getGLOBAL()._bSiegeFactory.IsUpgrading(this._currentWeapon!)) {
            const timeLeft = getGLOBAL()._bSiegeFactory.UpgradeTimeLeft(this._currentWeapon!);
            const timeTotal = getGLOBAL()._bSiegeFactory.UpgradeTimeTotal(this._currentWeapon!);
            const progress = 1 - timeLeft / timeTotal;
            const instantCost = getGLOBAL()._bSiegeFactory.getInstantUpgradeCost(this._currentWeapon!.weaponID);
            this.mcInstant.bAction.Setup("<b>" + getKEYS().Get("btn_finishnow") + "</b>");
            this.mcInstant.tDescription.htmlText = "<b>" + getKEYS().Get("siege_shiny", { "v1": instantCost }) + "</b>";
            this.mcTimeTxt.htmlText = "<b>" + getGLOBAL().ToTime(timeLeft, true, false) + "</b>";
            this.mcTime.mcBar.width = this._maxTimeBarWidth * progress;
            this.mcTimeTxt.visible = true;
            this.mcTime.visible = true;
            this.bCancel.visible = true;
            this.mcInstant.visible = true;
        } else if (this._currentWeapon!.quantity > 0) {
            this.bMap.visible = true;
        } else if (getGLOBAL()._bSiegeFactory.upgradingWeapon) {
            this.tWarning.htmlText = getKEYS().Get("msg_oneweapon", { "v1": getGLOBAL()._bSiegeFactory.upgradingWeapon.name });
            this.tWarning.visible = true;
        } else if (getSiegeWeapons().availableWeapon) {
            this.tWarning.htmlText = getKEYS().Get("msg_oneweapon", { "v1": getSiegeWeapons().availableWeapon.name });
            this.tWarning.visible = true;
        } else {
            this.mcInstant.bAction.Setup("<b>" + getKEYS().Get("btn_useshiny", { "v1": this._currentWeapon!.instantBuildCost }) + "</b>");
            this.mcInstant.tDescription.htmlText = "<b>" + getKEYS().Get("msg_buildinstant") + "</b>";
            this.mcResources.bAction.SetupKey("btn_startbuilding");
            this.mcInstant.visible = true;
            this.UpdateShowCurrentCosts();
        }
    }

    public UpdateShowCurrentCosts(): void {
        const costIds: Array<string> = [];
        const costs = this._tab === "factory" ? this._currentWeapon!.buildCosts : this._currentWeapon!.upgradeCosts;
        for (const id in costs) {
            costIds.push(id);
        }
        costIds.sort((a, b) => {
            return a === "time" ? 1 : (b === "time" ? -1 : (a < b ? -1 : 1));
        });
        let j = 0;
        for (let i = 0; i < costIds.length && j < this._resourceCosts.length; i++) {
            const id = costIds[i];
            if (costs[id] > 0) {
                this._resourceCosts[j].gotoAndStop(getGLOBAL().getResourceFrame(id, true));
                this._resourceCosts[j].tTitle.htmlText = "<b>" + getGLOBAL().getResourceName(id, true) + "</b>";
                let text: string;
                if (id === "time") {
                    text = getGLOBAL().ToTime(costs[id], true, false);
                } else {
                    text = getGLOBAL().FormatNumber(costs[id]);
                }
                if (Boolean(getBASE()._iresources[id]) && getBASE()._iresources[id].Get() < costs[id]) {
                    text = "<b><font color='#FF0000'>" + text + "</font></b>";
                } else {
                    text = "<b>" + text + "</b>";
                }
                this._resourceCosts[j].tValue.htmlText = text;
                this._resourceCosts[j].visible = true;
                j++;
            }
        }
        while (j < this._resourceCosts.length) {
            this._resourceCosts[j].visible = false;
            j++;
        }
        this.mcResources.visible = true;
    }

    public Hide(): void {
        this._timer.stop();
        SiegeBuilding.Hide();
        this._videoStream!.close();
    }

    private DoInstant(event: MouseEvent | null = null): void {
        if (this._tab === "lab") {
            if (getGLOBAL()._bSiegeLab.HasEnoughShinyToUpgrade(this._currentWeapon!)) {
                getGLOBAL()._bSiegeLab.InstantUpgrade(this._currentWeapon!.weaponID);
                this.mcInstant.bAction.Enabled = false;
                this.mcInstant.bAction.mouseEnabled = false;
            } else {
                getPOPUPS().DisplayGetShiny();
            }
        } else if (this._tab === "factory") {
            if (getGLOBAL()._bSiegeFactory.HasEnoughShinyToUpgrade(this._currentWeapon!)) {
                getGLOBAL()._bSiegeFactory.InstantUpgrade(this._currentWeapon!.weaponID);
                this.mcInstant.bAction.Enabled = false;
                this.mcInstant.bAction.mouseEnabled = false;
            } else {
                getPOPUPS().DisplayGetShiny();
            }
        }
        this.Update();
    }

    private DoResources(event: MouseEvent): void {
        if (this._tab === "lab") {
            if (!this._currentWeapon!.hasResourcesToUpgrade) {
                if (!this._currentWeapon!.hasCapacityToUpgrade) {
                    getGLOBAL().Message("<b>" + getKEYS().Get("msg_morepodsunlock") + "</b>");
                } else {
                    getGLOBAL().Message(getKEYS().Get("buildoptions_err_moreresources", {
                        "v1": getGLOBAL().FormatNumber(this._currentWeapon!.numResourcesToUpgradeNeeded),
                        "v2": getGLOBAL().FormatNumber(this._currentWeapon!.instantUpgradeResourceCost)
                    }), getKEYS().Get("btn_getresources"), this._currentWeapon!.buyResourcesAndUpgrade);
                }
            } else {
                getGLOBAL()._bSiegeLab.StartUpgradingWeapon(this._currentWeapon!.weaponID);
            }
        } else if (this._tab === "factory") {
            if (!this._currentWeapon!.hasResourcesToBuild) {
                if (!this._currentWeapon!.hasCapacityToBuild) {
                    getGLOBAL().Message("<b>" + getKEYS().Get("msg_morepodsunlock") + "</b>");
                } else {
                    getGLOBAL().Message(getKEYS().Get("buildoptions_err_moreresources", {
                        "v1": getGLOBAL().FormatNumber(this._currentWeapon!.numResourcesToBuildNeeded),
                        "v2": getGLOBAL().FormatNumber(this._currentWeapon!.instantBuildResourceCost)
                    }), getKEYS().Get("btn_getresources"), this._currentWeapon!.buyResourcesAndBuild);
                }
            } else {
                getGLOBAL()._bSiegeFactory.StartUpgradingWeapon(this._currentWeapon!.weaponID);
            }
        }
        this.Update();
    }

    private CancelAction(event: MouseEvent): void {
        const ActuallyCancel = (): void => {
            if (this._tab === "lab") {
                getGLOBAL()._bSiegeLab.CancelUpgradingWeapon(this._currentWeapon!.weaponID);
            } else if (this._tab === "factory") {
                getGLOBAL()._bSiegeFactory.CancelUpgradingWeapon(this._currentWeapon!.weaponID);
            }
            this.Update();
        };
        if (this._tab === "lab") {
            getGLOBAL().Message(getKEYS().Get("msg_upgrade_confirmcancel", { "v1": this._currentWeapon!.name }), getKEYS().Get("msg_stopupgrading_btn"), ActuallyCancel);
        } else if (this._tab === "factory") {
            getGLOBAL().Message(getKEYS().Get("msg_build_confirmcancel", { "v1": this._currentWeapon!.name }), getKEYS().Get("btn_stopbuilding"), ActuallyCancel);
        }
    }

    private OpenMap(event: MouseEvent): void {
        getGLOBAL().ShowMap();
        this.Hide();
    }

    private SwitchToLab(event: MouseEvent): void {
        this._tab = "lab";
        this.Update();
    }

    private SwitchToFactory(event: MouseEvent): void {
        this._tab = "factory";
        this.Update();
    }

    public onTick(event: TimerEvent): void {
        this.Update();
    }
}
