import MovieClip from "openfl/display/MovieClip";
import Shape from "openfl/display/Shape";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { TweenLite } from "../../../gs/TweenLite";
import { Expo, Quad } from "../../../gs/easing";
import { ScrollSet } from "../display/ScrollSet";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { UI_BOTTOM } from "../ui/UI_BOTTOM";
import { MISSIONS_ITEM } from "./MISSIONS_ITEM";
import { UI_MISSIONMENU_CLIP } from "../../../UI_MISSIONMENU_CLIP";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { QUESTS } from "../../../QUESTS";
import { SOUNDS } from "../../../SOUNDS";
import { TUTORIAL } from "../../../TUTORIAL";

/**
 * UI_MISSIONMENU - Mission/quest menu UI.
 */
export class UI_MISSIONMENU extends UI_MISSIONMENU_CLIP {
    private _counter: number = 0;
    private _prioritycounter: number = 0;
    private _CollectedMissions: Record<string, boolean> = {};
    private _CompletedMissions: Record<string, boolean> = {};
    private _PriorityMissions: Record<string, boolean> = {};
    private _ActiveMissions: Array<MISSIONS_ITEM> = [];
    private _Container: Sprite | null = null;
    private _Missions: MovieClip | null = null;
    private _PriorityContainer: Sprite | null = null;
    private _Priority: MovieClip | null = null;
    private _PriorityMask: Shape | null = null;
    private _ScrollBar: ScrollSet | null = null;
    private _numDisplayItems: number = 10;
    private _numDisplaySlots: number = 4;
    private _numPinnedItems: number = 1;
    private _UI_OffsetY: number = 10;
    private _ItemPaddingY: number = 2;
    public _Width: number = 380;
    public _Height: number = 208;
    private _seperatePriorities: boolean = true;
    private _animating: boolean = false;
    private _windowState: number = 1;
    public _alertsCounter: number = 0;
    public _disableMissions: boolean = false;
    private _skinTag: number = 1;
    public _enabled: boolean = false;
    public _maximized: boolean = false;
    public _open: boolean = true;
    private _skinnedElements: Array<any> = [];
    private _originProps: Record<string, number> = {};
    private _maxProps: Record<string, number> = {};
    private _openProps: Record<string, number> = {};
    private _closeProps: Record<string, number> = {};
    private _chatWidthDefault: Record<string, number> = {};

    constructor() {
        super();
        this._skinnedElements = [];
        this._originProps = {
            "screenHeight": 240,
            "screenWidth": 400
        };
        this._maxProps = {
            "screenHeight": 470,
            "maskHeight": 470 - 12,
            "y": -(470 + 30),
            "scrollerY": -470,
            "scrollHeight": 470 - 16,
            "footerY": -12
        };
        this._openProps = {
            "screenHeight": 240,
            "maskHeight": 136,
            "y": -178,
            "scrollerY": -148,
            "scrollHeight": 120,
            "footerY": -12
        };
        this._closeProps = {
            "screenHeight": 114,
            "maskHeight": 105,
            "y": 0,
            "scrollerY": 30,
            "scrollHeight": 105,
            "footerY": 27
        };
        this._chatWidthDefault = {
            "sizeW": 380,
            "headerW": 380,
            "headerX": -5,
            "titleTxtX": 70,
            "alertX": 220,
            "arrowUpX": 343,
            "arrowUpY": 16,
            "arrowDownX": 325,
            "arrowDownY": 13,
            "borderW": 380,
            "mcMaskW": 348,
            "tOutputW": 330,
            "mcScreenW": 350,
            "inputWoodBgW": 380,
            "inputTxtBgW": 310,
            "inputTxtW": 310,
            "sendBtnX": 331,
            "scrollerX": 347,
            "ignoreBtnX": 315
        };
        this.frame.tTitle.htmlText = KEYS.Get("quests_title");
        this._CollectedMissions = {};
        this._CompletedMissions = {};
        this._PriorityMissions = {};
        this._ActiveMissions = [];
        this._skinnedElements = [this.frame.border, this.frame.header, this.frame.mcScreen.canvas, this.footer];
        if (GLOBAL.StatGet("missionmin") === 1) {
            this._open = false;
            this._maximized = false;
            this._enabled = true;
        } else {
            this._open = true;
            this._maximized = false;
        }
        this.frame.mcMask.height = this._numDisplaySlots * (32 + this._ItemPaddingY);
        this._Container = new Sprite();
        this._Container.x = this.frame.mcScreen.x;
        this._Container.y = this.frame.mcScreen.y;
        this._Container.mask = this.frame.mcMask;
        this.frame.addChild(this._Container);
        this._Missions = new MovieClip();
        this._Container.addChild(this._Missions);
        this._ScrollBar = new ScrollSet();
        this.frame.addChild(this._ScrollBar);
        this._ScrollBar.Init(this._Container, this.frame.mcMask, 0, 30, this.frame.mcMask.height);
        this._ScrollBar.x = 380 - 16 - 16;
        this._ScrollBar.y = 30;
        this._ScrollBar.AutoHideEnabled = false;
        this._PriorityMask = new Shape();
        this._PriorityMask.graphics.lineStyle();
        this._PriorityMask.graphics.beginFill(0xFFFFFF, 1);
        this._PriorityMask.graphics.drawRect(0, 0, 380 - 16 - 16, this._numPinnedItems * (32 + this._ItemPaddingY * (this._numPinnedItems - 1)));
        this._PriorityMask.graphics.endFill();
        this._PriorityMask.x = this.footer.x + 16;
        this._PriorityMask.y = this.footer.y + 5;
        this.addChild(this._PriorityMask);
        this._PriorityContainer = new Sprite();
        this._PriorityContainer.x = this._PriorityMask.x;
        this._PriorityContainer.y = this._PriorityMask.y;
        this._PriorityContainer.mask = this._PriorityMask;
        this.addChild(this._PriorityContainer);
        this._Priority = new MovieClip();
        this._PriorityContainer.addChild(this._Priority);
        this.CheckMissionsStatus();
        this.frame.arrowUp.addEventListener(MouseEvent.MOUSE_DOWN, this.toggleHide.bind(this));
        this.frame.arrowUp.mouseChildren = false;
        this.frame.arrowUp.buttonMode = true;
        this.frame.arrowUp.useHandCursor = true;
        this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
        this.frame.arrowUp.visible = false;
        this.frame.arrowDown.mouseChildren = false;
        this.frame.arrowDown.buttonMode = true;
        this.frame.arrowDown.useHandCursor = true;
        this.frame.arrowDown.gotoAndStop("on" + this._skinTag);
        this.frame.arrowDown.enabled = false;
        this.frame.arrowDown.visible = false;
        this.frame.mcToggle.addEventListener(MouseEvent.MOUSE_DOWN, this.OnDisableClick.bind(this));
        this.frame.mcToggle.mouseChildren = false;
        this.frame.mcToggle.buttonMode = true;
        this.frame.mcToggle.useHandCursor = true;
        this.frame.mcToggle.gotoAndStop(this._enabled ? "on" + this._skinTag : "close" + this._skinTag);
        this.frame.mcToggle.visible = TUTORIAL.hasFinished;
        this.toggleHide();
    }

    public Skin(): void {
        let skinIndex = 1;
        if (GLOBAL.InfernoMode()) {
            skinIndex = 2;
        }
        this._skinTag = skinIndex;
        for (let i = 0; i < this._skinnedElements.length; i++) {
            this._skinnedElements[i].gotoAndStop(skinIndex);
        }
        this.frame.mcToggle.gotoAndStop(this._enabled ? "on" + this._skinTag : "close" + this._skinTag);
        this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
        this.frame.arrowDown.gotoAndStop("on" + this._skinTag);
    }

    public Update(): void {
        this.Skin();
        if (!this.frame.mcToggle.visible && GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
            this.frame.mcToggle.visible = TUTORIAL.hasFinished;
        }
        if (GLOBAL._catchup) {
            return;
        }
        if (!this._open) {
            return;
        }
        this.CheckMissionsStatus();
    }

    public AddItem(missionID: string, isPriority: boolean = false): number {
        const quest = QUESTS._quests[missionID];
        if (!quest.block) {
            const item = new MISSIONS_ITEM(missionID);
            if (isPriority) {
                this._Priority!.addChild(item);
                item.y = (item._Height + this._ItemPaddingY) * this._prioritycounter;
                item.bg.gotoAndStop("shiny" + this._skinTag);
            } else {
                this._Missions!.addChild(item);
                item.y = (item._Height + this._ItemPaddingY) * this._counter;
            }
            if (this._counter % 2 === 0) {
                item.bg.gotoAndStop("off" + this._skinTag);
            } else {
                item.bg.gotoAndStop("on" + this._skinTag);
            }
            if (isPriority) {
                item.bg.gotoAndStop("shiny" + this._skinTag);
                item.bg.height = item._Height;
            }
            this._ActiveMissions.push(item);
            return 1;
        }
        return 0;
    }

    public CheckMissionsStatus(): void {
        if (!GLOBAL.isAtHome()) {
            this._disableMissions = true;
        } else if (MapRoomManager.instance.isInMapRoom2or3 && MapRoomManager.instance.isOpen) {
            this._disableMissions = true;
        } else {
            this._disableMissions = false;
        }
        if (this._disableMissions) {
            this.RefreshMissions(this._disableMissions);
            return;
        }
        if (!this._open) {
            return;
        }
        let needsRebuild = false;
        if (QUESTS._completed) {
            for (const missionKey in QUESTS._quests) {
                const missionId = String(QUESTS._quests[missionKey].id);
                if (QUESTS._completed[missionId]) {
                    if (QUESTS._completed[missionId] === 1) {
                        if (!(missionKey in this._CompletedMissions) && !this._CompletedMissions[missionId]) {
                            this._CompletedMissions[missionId] = true;
                            needsRebuild = true;
                        }
                    } else if (QUESTS._completed[missionId] === 2) {
                        if (!(missionKey in this._CollectedMissions) && !this._CollectedMissions[missionId]) {
                            this._CollectedMissions[missionId] = true;
                            needsRebuild = true;
                        }
                    }
                }
            }
            if (needsRebuild && this._open) {
                this.RebuildContainer();
            }
        }
    }

    public Clear(): void {
        if (Boolean(this._Container) && Boolean(this._Missions)) {
            this._Container!.removeChild(this._Missions!);
            this._Missions = new MovieClip();
            this._Container!.addChild(this._Missions);
        }
        if (Boolean(this._PriorityContainer) && Boolean(this._Priority)) {
            this._PriorityContainer!.removeChild(this._Priority!);
            this._Priority = new MovieClip();
            this._PriorityContainer!.addChild(this._Priority);
        }
        this._ActiveMissions = [];
        this._counter = 0;
        this._prioritycounter = 0;
    }

    private RebuildContainer(): void {
        const completedMissions: Array<any> = [];
        const availableMissions: Array<any> = [];
        const priorityMissions: Array<any> = [];
        this.Clear();
        if (QUESTS._completed) {
            for (const missionKey in QUESTS._quests) {
                const missionId = String(QUESTS._quests[missionKey].id);
                if (QUESTS._completed[missionId] && QUESTS._completed[missionId] === 1 && (!QUESTS._quests[missionKey].prereq || QUESTS._completed[QUESTS._quests[missionKey].prereq] === 2)) {
                    completedMissions.push({
                        "missionID": missionKey,
                        "order": QUESTS._quests[missionKey].order
                    });
                }
            }
            completedMissions.sort((a, b) => a.order - b.order);
        }
        for (const missionKey in QUESTS._quests) {
            const missionId = String(QUESTS._quests[missionKey].id);
            if (!QUESTS._completed[missionId] && (!QUESTS._quests[missionKey].prereq || QUESTS._completed[QUESTS._quests[missionKey].prereq] === 2)) {
                availableMissions.push({
                    "missionID": missionKey,
                    "order": QUESTS._quests[missionKey].order
                });
                if (QUESTS._quests[missionKey].priority === 1) {
                    priorityMissions.push({
                        "missionID": missionKey,
                        "order": QUESTS._quests[missionKey].order
                    });
                }
            }
            availableMissions.sort((a, b) => a.order - b.order);
            if (priorityMissions.length > 1) {
                priorityMissions.sort((a, b) => a.order - b.order);
            }
        }
        if (priorityMissions.length < 1 && GLOBAL.mode === GLOBAL._loadmode) {
            this.frame.mcMask.height = (this._numDisplaySlots + 1) * (32 + this._ItemPaddingY);
        } else {
            this.frame.mcMask.height = this._numDisplaySlots * (32 + this._ItemPaddingY);
        }
        this._ScrollBar!.Update();
        this.frame.y = this._openProps.y;
        this.footer.y = this._openProps.footerY;
        // Add completed missions
        for (let i = 0; i < completedMissions.length; i++) {
            this._counter += this.AddItem(completedMissions[i].missionID);
        }
        // Add priority missions
        for (let i = 0; i < priorityMissions.length; i++) {
            if (!(this._seperatePriorities && this._prioritycounter >= this._numPinnedItems)) {
                this._prioritycounter += this.AddItem(priorityMissions[i].missionID, true);
            }
        }
        const startCounter = this._counter;
        // Add available missions
        for (let i = 0; i < availableMissions.length; i++) {
            let shouldAdd = true;
            if (this._numDisplayItems === 0 || this._counter - startCounter < this._numDisplayItems) {
                if (this._seperatePriorities) {
                    for (let j = 0; j < this._prioritycounter; j++) {
                        if (priorityMissions[j].missionID === availableMissions[i].missionID) {
                            shouldAdd = false;
                        }
                    }
                }
                if (shouldAdd) {
                    this._counter += this.AddItem(availableMissions[i].missionID);
                }
            }
        }
        this.addChild(this._ScrollBar!);
        this._ScrollBar!.Update();
    }

    public RefreshMissions(disabled: boolean = false): void {
        for (let i = 0; i < this._ActiveMissions.length; i++) {
            (this._ActiveMissions[i] as MISSIONS_ITEM).Init(disabled);
        }
    }

    private toggleHide(event: MouseEvent | null = null): void {
        let targetProps: Record<string, number> | null = null;
        this.CheckMissionsStatus();
        let maximize = false;
        let minimize = false;
        if (event !== null) {
            if (event.currentTarget === this.frame.arrowUp) {
                if (this._maximized) {
                    maximize = false;
                } else {
                    maximize = true;
                }
            }
            if (event.currentTarget === this.frame.mcToggle) {
                if (this._open) {
                    maximize = false;
                    this._maximized = false;
                } else {
                    maximize = true;
                    this._maximized = false;
                }
            }
        }
        if (this._animating) {
            return;
        }
        if (!this._open) {
            if (BASE.isInfernoMainYardOrOutpost) {
                SOUNDS.Play("iquestshow");
            } else {
                SOUNDS.Play("click1");
            }
        } else if (BASE.isInfernoMainYardOrOutpost) {
            SOUNDS.Play("iquesthide");
        } else {
            SOUNDS.Play("close");
        }
        const duration = 0.5;
        if (event === null) {
            if (this._open) {
                targetProps = this._openProps;
            } else {
                targetProps = this._closeProps;
            }
            this._maximized = false;
            this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
            this.frame.arrowDown.gotoAndStop("off" + this._skinTag);
            this.frame.arrowUp.buttonMode = true;
            this.frame.arrowDown.buttonMode = false;
        } else if (this._maximized && this._open) {
            if (!(!maximize && !minimize)) {
                return;
            }
            targetProps = this._openProps;
            this._maximized = false;
            this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
            this.frame.arrowDown.gotoAndStop("on" + this._skinTag);
            this.frame.arrowUp.buttonMode = true;
            this.frame.arrowDown.buttonMode = true;
            GLOBAL.StatSet("missionmin", 0);
        } else if (this._open) {
            if (!maximize) {
                targetProps = this._closeProps;
                this._maximized = false;
                this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
                this.frame.arrowDown.gotoAndStop("off" + this._skinTag);
                this.frame.arrowUp.buttonMode = true;
                this.frame.arrowDown.buttonMode = false;
                GLOBAL.StatSet("missionmin", 1);
            } else if (maximize) {
                targetProps = this._maxProps;
                this._maximized = true;
                this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
                this.frame.arrowDown.gotoAndStop("on" + this._skinTag);
                this.frame.arrowUp.buttonMode = true;
                this.frame.arrowDown.buttonMode = false;
                GLOBAL.StatSet("missionmin", 0);
            } else if (minimize) {
                return;
            }
        } else if (!this._open) {
            if (!(maximize || minimize)) {
                return;
            }
            targetProps = this._openProps;
            this._maximized = false;
            this.frame.arrowUp.gotoAndStop("on" + this._skinTag);
            this.frame.arrowDown.gotoAndStop("on" + this._skinTag);
            this.frame.arrowUp.buttonMode = true;
            this.frame.arrowDown.buttonMode = true;
            GLOBAL.StatSet("missionmin", 0);
        }
        if (targetProps === null) {
            return;
        }
        this._ScrollBar!.visible = false;
        TweenLite.to(this.frame, duration, {
            "y": targetProps.y,
            "onUpdate": this.toggleOnUpdate.bind(this),
            "onComplete": this.toggleVisibleB.bind(this)
        });
        TweenLite.to(this.frame.mcScreen, duration, { "height": targetProps.screenHeight });
        TweenLite.to(this.frame.mcMask, duration, { "height": targetProps.maskHeight });
        TweenLite.to(this._ScrollBar, duration, { "y": targetProps.scrollerY });
        this._animating = true;
        this._open = targetProps !== this._closeProps;
        if (this._open) {
            if (!this._counter) {
                this.RebuildContainer();
                this.CheckMissionsStatus();
            }
            this.RefreshMissions(this._disableMissions);
            TweenLite.to(this.footer, duration, {
                "y": targetProps.footerY,
                "autoAlpha": 1,
                "ease": Expo.easeOut
            });
            TweenLite.to(this._PriorityMask, duration, {
                "autoAlpha": 1,
                "ease": Expo.easeOut
            });
            TweenLite.to(this._PriorityContainer, duration, {
                "autoAlpha": 1,
                "ease": Expo.easeOut
            });
        } else {
            TweenLite.to(this.footer, duration, {
                "y": targetProps.footerY,
                "autoAlpha": 0,
                "ease": Quad.easeIn
            });
            TweenLite.to(this._PriorityMask, duration, {
                "autoAlpha": 0,
                "ease": Expo.easeOut
            });
            TweenLite.to(this._PriorityContainer, duration, {
                "autoAlpha": 0,
                "ease": Expo.easeOut
            });
        }
    }

    private toggleOnUpdate(): void {
        UI_BOTTOM.Resize();
    }

    private toggleVisibleB(): void {
        this._animating = false;
        const props = this._maximized ? this._maxProps : this._openProps;
        this._ScrollBar!.Update();
        this._ScrollBar!.visible = this._Container!.height > this.frame.mcMask.height;
        this._PriorityMask!.x = this.footer.x + 16;
        this._PriorityMask!.y = this.footer.y + 5;
        this._PriorityContainer!.x = this._PriorityMask!.x;
        this._PriorityContainer!.y = this._PriorityMask!.y;
        if (!this._open) {
            this._ScrollBar!.visible = false;
        } else {
            this._ScrollBar!.visible = true;
            this._ScrollBar!.ScrollTo(0, true);
        }
        UI_BOTTOM.Resize();
    }

    private OnDisableClick(event: MouseEvent | null = null): void {
        if (event && event.currentTarget === this.frame.mcToggle && TUTORIAL.hasFinished) {
            this._enabled = !this._enabled;
        }
        if (TUTORIAL.hasFinished) {
            if (!this._enabled) {
                this._open = false;
            } else {
                this._open = true;
            }
            this.frame.mcToggle.gotoAndStop(this._enabled ? "on" + this._skinTag : "close" + this._skinTag);
            this.toggleHide(event);
        }
    }

    public Resize(): void {
        this.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - this._Width;
        this.y = GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - 30;
        if (this._open) {
            this.CheckMissionsStatus();
            this.RefreshMissions(this._disableMissions);
        }
    }
}
