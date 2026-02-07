import MovieClip from "openfl/display/MovieClip";
import StageDisplayState from "openfl/display/StageDisplayState";
import TextField from "openfl/text/TextField";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";
import TextFormat from "openfl/text/TextFormat";
import TextFormatAlign from "openfl/text/TextFormatAlign";

import { ABTest } from "./com/cc/tests/ABTest";
import { Chat } from "./com/monsters/chat/Chat";
import { TweenLite, Back, Elastic } from "./gs";
import { UI_TOP } from "./UI_TOP";
import { UI_VISITOR } from "./UI_VISITOR";
import { UI_WARNING } from "./UI_WARNING";
import { UI_BOTTOM } from "./com/monsters/ui/UI_BOTTOM";
import { UI_WORKERS } from "./UI_WORKERS";
import { UI_BAITERSCAREAWAY } from "./UI_BAITERSCAREAWAY";
import { UI_WILDMONSTERBAR } from "./UI_WILDMONSTERBAR";
import { SPECIALEVENT_WM1 } from "./SPECIALEVENT_WM1";

// Lazy imports to break circular dependency chains
function getBUILDINGINFO(): any { return require("./BUILDINGINFO").BUILDINGINFO; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getBASE(): any { return require("./BASE").BASE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }


export class UI2 {
    public static _top: UI_TOP;
    public static _visitor: UI_VISITOR;
    public static _warning: UI_WARNING;
    public static _tutorial: MovieClip;
    public static _bottomName: string;
    public static _scareAway: UI_BAITERSCAREAWAY;
    public static _showTop: boolean;
    public static _showBottom: boolean;
    public static _showWarning: boolean;
    public static _scrollMap: boolean;
    public static _showProtected: boolean;
    public static _wildMonsterBar: UI_WILDMONSTERBAR;
    private static _timers: any[] = [];
    public static _debugWarningTxt: TextField;
    public static _debugWarningTxtVal: string = "DEBUG MODE";
    public static activeEvent: any;

    constructor() {}

    public static Setup(): void {
        UI2.activeEvent = getSPECIALEVENT().getActiveSpecialEvent();

        UI2._tutorial = getGLOBAL()._layerUI.addChild(new MovieClip()) as MovieClip;
        UI2._top = getGLOBAL()._layerUI.addChild(new UI_TOP()) as UI_TOP;
        UI2._warning = getGLOBAL()._layerUI.addChild(new UI_WARNING()) as UI_WARNING;
        
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.IBUILD) {
            UI2._visitor = getGLOBAL()._layerUI.addChild(new UI_VISITOR()) as UI_VISITOR;
        } else {
            UI2._visitor = null;
        }
        
        UI2._top.mc.x = 0;
        UI2._top.mc.y = 4;
        UI2._showTop = true;
        UI2._showBottom = false;
        UI2._showProtected = false;
        UI2._showWarning = false;
        UI_BOTTOM.Setup();
        
        if (getBASE().isMainYardOrInfernoMainYard) {
            UI_WORKERS.Setup();
        }
        
        UI2._top.Setup();
        
        if (Chat.flagsShouldChatExist() && Chat._bymChat._open) {
            Chat.initChat();
        }
        if (Chat.flagsShouldChatDisplay()) {
            Chat.setChatPosition(getGLOBAL()._layerUI, 10, 300);
        }
        
        UI2._timers = [];
        UI2._timers.push(UI2._top.mcProtected);
        UI2._timers.push(UI2._top.mcReinforcements);
        
        if (!getGLOBAL()._flags.viximo && !getGLOBAL()._flags.kongregate) {
            UI2._timers.push(UI2._top.mcSpecialEvent);
            if (getGLOBAL()._countryCode !== "ph") {
                UI2._top.mcSpecialEvent.buttonMode = true;
                UI2._top.mcSpecialEvent.mouseChildren = false;
                UI2._top.mcSpecialEvent.addEventListener(MouseEvent.CLICK, UI2.activeEvent.TimerClicked);
            }
        }
        
        if (getGLOBAL()._aiDesignMode) {
            UI2.DebugWarning();
        }
    }

    public static SetupHUD(): void {
        UI2._tutorial = getGLOBAL()._layerUI.addChild(new MovieClip()) as MovieClip;
        UI_BOTTOM.Setup();
        UI_BOTTOM.Hide();
        
        if (Chat.flagsShouldChatExist() && Chat._bymChat._open) {
            Chat.initChat();
        }
        if (Chat.flagsShouldChatDisplay()) {
            Chat.setChatPosition(getGLOBAL()._layerUI, 10, 300);
        }
    }

    public static Show(what: string): void {
        if (what === "top" && !UI2._showTop) {
            UI2._showTop = true;
            UI2._top.mc.visible = true;
        } else if (what === "bottom" && !UI2._showBottom) {
            UI2._showBottom = true;
            UI_BOTTOM.Show();
            if (getTUTORIAL()._stage >= 200) {
                UI_WORKERS.Show();
            }
        } else if (what === "warning" && !UI2._showWarning) {
            UI2._showWarning = true;
            if (getGLOBAL()._render) {
                TweenLite.to(UI2._warning.mc, 1, { "y": 0, "ease": Elastic.easeOut });
            } else {
                UI2._warning.mc.y = 0;
            }
        } else if (what === "scareAway" || what === "surrender") {
            if (getGLOBAL()._render && !UI2._scareAway) {
                UI2._scareAway = getGLOBAL()._layerUI.addChild(new UI_BAITERSCAREAWAY(what === "scareAway")) as UI_BAITERSCAREAWAY;
                UI2.ResizeHandler();
            }
        } else if (what === "wmbar") {
            if (getGLOBAL()._render) {
                UI2._wildMonsterBar = new UI_WILDMONSTERBAR();
                getGLOBAL()._layerUI.addChild(UI2._wildMonsterBar);
                UI2._wildMonsterBar.y = 0;
                UI2.ResizeHandler();
            }
        }
    }

    public static Clear(): void {
        if (UI2._top) {
            UI2._top.Clear();
            if (UI2._top.parent) {
                UI2._top.parent.removeChild(UI2._top);
            }
            UI2._top = null;
        }
        UI_BOTTOM.Clear();
        
        if (UI2._warning) {
            if (UI2._warning.parent) {
                UI2._warning.parent.removeChild(UI2._warning);
            }
            UI2._warning = null;
        }
        
        if (UI2._scareAway) {
            if (UI2._scareAway.parent) {
                UI2._scareAway.parent.removeChild(UI2._scareAway);
            }
            UI2._scareAway = null;
        }
        
        if (UI2._wildMonsterBar && UI2._wildMonsterBar.parent) {
            UI2._wildMonsterBar.parent.removeChild(UI2._wildMonsterBar);
            UI2._wildMonsterBar = null;
        }
        
        if (UI2._debugWarningTxt && UI2._debugWarningTxt.parent) {
            UI2._debugWarningTxt.parent.removeChild(UI2._debugWarningTxt);
            UI2._debugWarningTxt = null;
        }
    }

    public static Hide(what: string): void {
        if (what === "top" && UI2._showTop) {
            UI2._showTop = false;
            UI2._top.mc.visible = false;
        } else if (what === "bottom" && UI2._showBottom) {
            UI2._showBottom = false;
            UI_BOTTOM.Hide();
            UI_WORKERS.Hide();
        } else if (what === "warning" && UI2._showWarning) {
            UI2._showWarning = false;
            if (Chat._bymChat) {
                Chat._bymChat.show();
            }
            if (getGLOBAL()._render) {
                TweenLite.to(UI2._warning.mc, 0.5, { "y": -100, "ease": Back.easeIn });
            } else {
                UI2._warning.mc.y = -100;
            }
        } else if (what === "scareAway" && UI2._scareAway) {
            if (getGLOBAL()._layerUI.contains(UI2._scareAway)) {
                getGLOBAL()._layerUI.removeChild(UI2._scareAway);
                if (Chat._bymChat) {
                    Chat._bymChat.show();
                }
                UI2._scareAway = null;
            }
        } else if (what === "wmbar") {
            if (UI2._wildMonsterBar != null) {
                if (getGLOBAL()._render) {
                    TweenLite.to(UI2._wildMonsterBar, 0.5, {
                        "y": UI2._wildMonsterBar.y - 22,
                        "onComplete": (): void => {
                            UI2._wildMonsterBar.parent.removeChild(UI2._wildMonsterBar);
                            UI2._wildMonsterBar = null;
                            UI2.ResizeHandler();
                        }
                    });
                } else {
                    try {
                        UI2._wildMonsterBar.parent.removeChild(UI2._wildMonsterBar);
                    } catch (e) {}
                    UI2._wildMonsterBar.y -= 20;
                    UI2._wildMonsterBar = null;
                }
            }
        }
        
        if (getGLOBAL()._render) {
            UI2.ResizeHandler();
        }
    }

    public static Disable(): void {
        // Empty in original
    }

    public static Enable(): void {
        // Empty in original
    }

    public static Update(): void {
        if (!getGLOBAL()._catchup) {
            if (UI2._top) {
                UI2._top.Update();
                
                if (getTUTORIAL()._stage < getTUTORIAL().k_STAGE_DAMAGE_PROTECT) {
                    if (UI2._top.mcProtected.visible) {
                        UI2._top.mcProtected.visible = false;
                    }
                    if (UI2._top.mcReinforcements.visible) {
                        UI2._top.mcReinforcements.visible = false;
                    }
                    if (UI2._top.mcSpecialEvent && UI2._top.mcSpecialEvent.visible) {
                        UI2._top.mcSpecialEvent.visible = false;
                    }
                    if (UI2._top.mcSave.visible) {
                        UI2._top.mcSave.visible = false;
                    }
                    if (UI2._top.mcZoom.visible) {
                        UI2._top.mcZoom.visible = false;
                    }
                    if (UI2._top.mcFullscreen.visible) {
                        UI2._top.mcFullscreen.visible = ABTest.isInTestGroup("fst", 128);
                    }
                    if (UI2._top.mcBuffHolder.visible) {
                        UI2._top.mcBuffHolder.visible = false;
                    }
                } else {
                    // Update protected timer
                    if (getBASE()._isProtected - getGLOBAL().Timestamp() > 0 && 
                        (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD)) {
                        if (!UI2._top.mcProtected.visible) {
                            UI2._top.mcProtected.visible = true;
                        }
                        if (getBASE()._isProtected - getGLOBAL().Timestamp() > 86400) {
                            (UI2._top.mcProtected as any).tCountdown.htmlText = getGLOBAL().ToTime(getBASE()._isProtected - getGLOBAL().Timestamp(), true, false);
                        } else {
                            (UI2._top.mcProtected as any).tCountdown.htmlText = getGLOBAL().ToTime(getBASE()._isProtected - getGLOBAL().Timestamp(), true);
                        }
                    } else if (UI2._top.mcProtected.visible) {
                        UI2._top.mcProtected.visible = false;
                    }
                    
                    // Update reinforcements timer
                    if (getBASE()._isReinforcements - getGLOBAL().Timestamp() > 0 && 
                        (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD)) {
                        if (!UI2._top.mcReinforcements.visible) {
                            UI2._top.mcReinforcements.visible = true;
                        }
                        if (getBASE()._isReinforcements - getGLOBAL().Timestamp() > 86400) {
                            UI2._top.mcReinforcements.tCountdown.htmlText = getGLOBAL().ToTime(getBASE()._isReinforcements - getGLOBAL().Timestamp(), true, false);
                        } else {
                            UI2._top.mcReinforcements.tCountdown.htmlText = getGLOBAL().ToTime(getBASE()._isReinforcements - getGLOBAL().Timestamp(), true);
                        }
                    } else if (UI2._top.mcReinforcements.visible) {
                        UI2._top.mcReinforcements.visible = false;
                    }
                    
                    // Update special event timer
                    UI2.updateSpecialEventTimer();
                    
                    if (!UI2._top.mcSave.visible) {
                        UI2._top.mcSave.visible = true;
                    }
                    if (!UI2._top.mcZoom.visible) {
                        UI2._top.mcZoom.visible = true;
                    }
                    if (!UI2._top.mcFullscreen.visible) {
                        UI2._top.mcFullscreen.visible = true;
                    }
                    if (UI2._top.mcBuffHolder.visible) {
                        UI2._top.mcBuffHolder.visible = true;
                    }
                    
                    if (!Chat._chatInited || !Chat._bymChat.IsConnected) {
                        Chat.initChat();
                    }
                    if (Chat._bymChat && Chat._chatInited && Chat._bymChat.IsConnected) {
                        Chat._bymChat.toggleVisibleB();
                    }
                }
                
                if ((getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.IBUILD) || !getGLOBAL()._flags.saveicon) {
                    UI2._top.mcSave.visible = false;
                }
                
                // Position timers
                let yPos = 35;
                for (const timer of UI2._timers) {
                    if (timer.visible) {
                        timer.y = yPos;
                        yPos += 30;
                    }
                }
                
                UI2.updateZoom();
            }
            
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD) {
                UI_BOTTOM.Update();
                UI_BOTTOM.Resize();
                if (UI2._scareAway) {
                    getGLOBAL().RefreshScreen();
                    UI2._scareAway.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - UI2._scareAway.mcBG.width - 10;
                    UI2._scareAway.y = getGLOBAL()._SCREENHUD.y - (UI2._scareAway.mcBG.height + 10);
                }
            } else {
                UI_BOTTOM.Resize();
                if (UI2._visitor) {
                    UI2._visitor.Update();
                }
                if (UI_BOTTOM._missions) {
                    UI_BOTTOM._missions.Update();
                }
            }
            
            getBUILDINGINFO().Update();
        }
    }

    private static updateSpecialEventTimer(): void {
        const activeEvent = getSPECIALEVENT().getActiveSpecialEvent();
        const isBuildMode = getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD;
        const isMainYard = !getBASE().isOutpost && !getBASE().isInfernoMainYardOrOutpost;
        const isAllowedPlatform = !getGLOBAL()._flags.viximo && !getGLOBAL()._flags.kongregate;
        const isWMI1Active = activeEvent === SPECIALEVENT_WM1 && 
            (SPECIALEVENT_WM1.invasionpop === 4 || SPECIALEVENT_WM1.invasionpop === 5);
        const isWMI2Active = activeEvent === SPECIALEVENT && getSPECIALEVENT().invasionpop === 4;
        const isEventActive = isWMI1Active || isWMI2Active;

        if (!activeEvent || 
            (activeEvent === SPECIALEVENT && getSPECIALEVENT().GetTimeUntilEnd() < 0) ||
            (activeEvent === SPECIALEVENT_WM1 && 
                (SPECIALEVENT_WM1.GetTimeUntilEnd() < 0 || 
                 SPECIALEVENT_WM1.wave > SPECIALEVENT_WM1.numWaves || 
                 (SPECIALEVENT_WM1.invasionpop === 4 && SPECIALEVENT_WM1.wave > SPECIALEVENT_WM1.BONUSWAVE2)))) {
            if (UI2._top.mcSpecialEvent && UI2._top.mcSpecialEvent.visible) {
                UI2._top.mcSpecialEvent.visible = false;
            }
            getSPECIALEVENT().updateNextWaveUI();
        } else if (activeEvent && isBuildMode && isAllowedPlatform && isEventActive) {
            if (!UI2._top.mcSpecialEvent.visible) {
                UI2._top.mcSpecialEvent.visible = true;
            }
            getSPECIALEVENT().updateNextWaveUI();
            
            let timeRemaining: number;
            if (activeEvent === SPECIALEVENT_WM1) {
                timeRemaining = SPECIALEVENT_WM1.GetTimeUntilExtension();
                if (timeRemaining < 0 || SPECIALEVENT_WM1.invasionpop === 5) {
                    timeRemaining = SPECIALEVENT_WM1.GetTimeUntilEnd();
                }
            } else {
                timeRemaining = getSPECIALEVENT().GetTimeUntilEnd();
            }
            
            if (timeRemaining > 86400) {
                UI2._top.mcSpecialEvent.tCountdown.htmlText = getGLOBAL().ToTime(timeRemaining, true, false);
            } else {
                UI2._top.mcSpecialEvent.tCountdown.htmlText = getGLOBAL().ToTime(timeRemaining, true);
            }
        } else if (isBuildMode && isMainYard && isAllowedPlatform) {
            // Pre-event timing
            if (activeEvent === SPECIALEVENT_WM1) {
                if (SPECIALEVENT_WM1.invasionpop !== 1) {
                    if (!UI2._top.mcSpecialEvent.visible) {
                        UI2._top.mcSpecialEvent.visible = true;
                    }
                } else {
                    if (UI2._top.mcSpecialEvent.visible) {
                        UI2._top.mcSpecialEvent.visible = false;
                    }
                }
                getSPECIALEVENT().updateNextWaveUI();
                
                const timeUntilStart = SPECIALEVENT_WM1.GetTimeUntilStart();
                const daysUntil = Math.ceil(timeUntilStart / 86400);
                if (daysUntil > 1) {
                    UI2._top.mcSpecialEvent.tCountdown.htmlText = daysUntil + " " + getKEYS().Get("global_days");
                } else {
                    const hoursUntil = Math.ceil(timeUntilStart / 3600);
                    if (hoursUntil > 1) {
                        UI2._top.mcSpecialEvent.tCountdown.htmlText = hoursUntil + " " + getKEYS().Get("global_hours");
                    } else {
                        UI2._top.mcSpecialEvent.tCountdown.htmlText = "< 1 " + getKEYS().Get("global_hour");
                    }
                }
            } else if (activeEvent === SPECIALEVENT) {
                if (getSPECIALEVENT().invasionpop >= 0 && getSPECIALEVENT().invasionpop <= 3) {
                    if (!UI2._top.mcSpecialEvent.visible) {
                        UI2._top.mcSpecialEvent.visible = true;
                    }
                } else {
                    if (UI2._top.mcSpecialEvent.visible) {
                        UI2._top.mcSpecialEvent.visible = false;
                    }
                }
                getSPECIALEVENT().updateNextWaveUI();
                
                const timeUntilStart = getSPECIALEVENT().GetTimeUntilStart();
                const daysUntil = Math.ceil(timeUntilStart / 86400);
                if (daysUntil > 1) {
                    UI2._top.mcSpecialEvent.tCountdown.htmlText = daysUntil + " " + getKEYS().Get("global_days");
                } else {
                    const hoursUntil = Math.ceil(timeUntilStart / 3600);
                    if (hoursUntil > 1) {
                        UI2._top.mcSpecialEvent.tCountdown.htmlText = hoursUntil + " " + getKEYS().Get("global_hours");
                    } else {
                        UI2._top.mcSpecialEvent.tCountdown.htmlText = "< 1 " + getKEYS().Get("global_hour");
                    }
                }
            }
        } else {
            if (UI2._top.mcSpecialEvent && UI2._top.mcSpecialEvent.visible) {
                UI2._top.mcSpecialEvent.visible = false;
            }
            getSPECIALEVENT().updateNextWaveUI();
        }
    }

    public static updateZoom(): void {
        let yOffset = 0;
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            yOffset = 6;
            UI2._top.mcZoom.y = yOffset;
            UI2._top.mcFullscreen.y = yOffset;
            UI2._top.mcSound.y = yOffset + 24;
            UI2._top.mcMusic.y = yOffset + 24;
            UI2._top.mcSave.y = yOffset + 24 + 24;
            UI2._top.mcFullscreen.gotoAndStop(1 + 2);
            
            if (getGLOBAL()._ROOT.stage.displayState === StageDisplayState.NORMAL) {
                UI2._top.mcZoom.gotoAndStop(1 + 3);
            } else {
                UI2._top.mcZoom.gotoAndStop(3 + 3);
            }
            if (getGLOBAL()._ROOT.stage.displayState !== StageDisplayState.FULL_SCREEN) {
                if (getGLOBAL()._zoomed) {
                    UI2._top.mcZoom.gotoAndStop(2 + 3);
                }
            }
        } else {
            UI2._top.mcZoom.y = yOffset;
            UI2._top.mcFullscreen.y = yOffset;
            UI2._top.mcSound.y = yOffset;
            UI2._top.mcMusic.y = yOffset;
            UI2._top.mcSave.y = yOffset;
            UI2._top.mcFullscreen.gotoAndStop(1);
            
            if (getGLOBAL()._ROOT.stage.displayState === StageDisplayState.NORMAL) {
                UI2._top.mcZoom.gotoAndStop(1);
            } else {
                UI2._top.mcZoom.gotoAndStop(3);
            }
            if (getGLOBAL()._ROOT.stage.displayState !== StageDisplayState.FULL_SCREEN) {
                if (getGLOBAL()._zoomed) {
                    UI2._top.mcZoom.gotoAndStop(2);
                }
            }
        }
    }

    public static ResizeHandler(e: Event = null): void {
        const stageWidth = getGLOBAL()._ROOT.stage.stageWidth;
        const stageHeight = getGLOBAL().GetGameHeight();
        const wmBarOffset = UI2._wildMonsterBar != null ? 40 : 0;
        
        const rect = new Rectangle(
            0 - (stageWidth - getGLOBAL()._SCREENINIT.width) / 2,
            0 - (stageHeight - (getGLOBAL()._SCREENINIT.height + wmBarOffset)) / 2,
            stageWidth,
            stageHeight
        );
        
        if (UI2._wildMonsterBar) {
            UI2._wildMonsterBar.back.width = rect.width;
            UI2._wildMonsterBar.x = rect.x;
            UI2._wildMonsterBar.y = rect.y - 20;
            UI2._wildMonsterBar.info.x = rect.width - 79;
            UI2._wildMonsterBar.eta_txt.x = rect.width - 190;
        }
        
        if (UI2._top) {
            UI2._top.resize(rect);
        }
        
        if (UI2._warning) {
            UI2._warning.x = rect.x + rect.width / 2 - UI2._warning.width / 2 + 50;
            UI2._warning.y = rect.y + 10;
        }
        
        if (UI2._visitor) {
            UI2._visitor.Update();
            UI2._visitor.mc.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - (UI2._visitor.mc as any).mcBG.width - 10;
            UI2._visitor.mc.y = getGLOBAL()._SCREENHUD.y - (UI2._visitor.mc.height + 10);
        }
        
        if (UI2._scareAway) {
            getGLOBAL().RefreshScreen();
            UI2._scareAway.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - UI2._scareAway.mcBG.width - 10;
            UI2._scareAway.y = getGLOBAL()._SCREENHUD.y - (UI2._scareAway.mcBG.height + 10);
        }
        
        if (Chat._bymChat) {
            Chat._bymChat.position();
        }
        
        if (UI2._debugWarningTxt) {
            UI2.DebugWarning();
        }
        
        UI_BOTTOM.Resize();
        UI_WORKERS.Resize();
    }

    public static TimersVisible(): number {
        let count = 0;
        for (const timer of UI2._timers) {
            if (timer.visible) {
                count++;
            }
        }
        return count;
    }

    public static DebugWarning(): void {
        const text = "DEBUG MODE";
        const format = new TextFormat();
        format.font = "Verdana";
        format.bold = true;
        format.size = 72;
        format.align = TextFormatAlign.CENTER;
        format.color = 0xFF0000;
        format.letterSpacing = -11;
        
        if (!UI2._debugWarningTxt) {
            UI2._debugWarningTxt = new TextField();
        }
        
        UI2._debugWarningTxt.mouseEnabled = false;
        UI2._debugWarningTxt.alpha = 0.8;
        UI2._debugWarningTxt.width = 400;
        UI2._debugWarningTxt.height = 100;
        UI2._debugWarningTxt.autoSize = TextFieldAutoSize.LEFT;
        UI2._debugWarningTxt.text = text;
        UI2._debugWarningTxt.setTextFormat(format);
        UI2._debugWarningTxt.x = getGLOBAL()._SCREEN.x + 15;
        UI2._debugWarningTxt.y = getGLOBAL()._SCREEN.y + getGLOBAL()._SCREEN.height - UI2._debugWarningTxt.height * 0.75;
        getGLOBAL()._layerUI.addChild(UI2._debugWarningTxt);
    }

    public static DebugWarningEdit(text: string = null): void {
        const displayText = text || "DEBUG MODE";
        const format = new TextFormat();
        format.font = "Verdana";
        format.bold = true;
        format.size = 36;
        format.align = TextFormatAlign.CENTER;
        format.color = 0xFF0000;
        format.letterSpacing = -2;
        
        if (UI2._debugWarningTxt) {
            UI2._debugWarningTxt.mouseEnabled = false;
            UI2._debugWarningTxt.alpha = 0.8;
            UI2._debugWarningTxt.width = 400;
            UI2._debugWarningTxt.height = 100;
            UI2._debugWarningTxt.autoSize = TextFieldAutoSize.LEFT;
            UI2._debugWarningTxt.text = displayText;
            UI2._debugWarningTxt.setTextFormat(format);
            UI2._debugWarningTxt.x = getGLOBAL()._SCREEN.x + 15;
            UI2._debugWarningTxt.y = getGLOBAL()._SCREEN.y + getGLOBAL()._SCREEN.height - UI2._debugWarningTxt.height * 0.75;
        }
    }
}
