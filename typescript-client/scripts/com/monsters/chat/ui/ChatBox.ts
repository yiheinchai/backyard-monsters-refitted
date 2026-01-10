import DisplayObject from "openfl/display/DisplayObject";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import FocusEvent from "openfl/events/FocusEvent";
import MouseEvent from "openfl/events/MouseEvent";
import TextField from "openfl/text/TextField";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";
import TextFieldType from "openfl/text/TextFieldType";
import TextFormat from "openfl/text/TextFormat";

import { TweenLite } from "../../../../gs/TweenLite";
import { Circ, Expo, Quad } from "../../../../gs/easing";
import { ScrollSet } from "../../display/ScrollSet";
import { MapRoom3 } from "../../maproom3/MapRoom3";
import { Chat } from "../Chat";
import { AbstractChatBox } from "./AbstractChatBox";
import { IChatDisplay } from "./IChatDisplay";
import { bubblepopupRight } from "./bubblepopupRight";
import { Button_CLIP } from "../../../../Button_CLIP";
import { ChatBox_CLIP } from "./ChatBox_CLIP";
import { ChatBox_msg_CLIP } from "./ChatBox_msg_CLIP";
import { ChatBox_msg_name_CLIP } from "./ChatBox_msg_name_CLIP";

import { GLOBAL } from "../../../../GLOBAL";
import { LOGIN } from "../../../../LOGIN";
import { LOGGER } from "../../../../LOGGER";
import { MAP } from "../../../../MAP";
import { TUTORIAL } from "../../../../TUTORIAL";

/**
 * ChatBox - Main chat box UI implementation.
 */
export class ChatBox extends AbstractChatBox implements IChatDisplay {
    private static _popupignore: bubblepopupRight | null = null;
    private static _popupignoredo: DisplayObject | null = null;

    private _shell: Sprite | null = null;
    private _maximized: boolean = false;
    private _open: boolean = true;
    public _animating: boolean = false;
    private _useAlerts: boolean = false;
    private _mask: Sprite | null = null;
    private _thumb: Sprite | null = null;
    private _display: Sprite | null = null;
    private _panel: Sprite | null = null;
    private _thumbWidth: number = 15;
    private _thumbHeight: number = 15;
    private _scrollbar: ScrollSet | null = null;
    private _sendBtn: any = null;
    public _headerBar: MovieClip | null = null;
    public _alertsCounter: number = 0;
    public _chatWidth: number = 0;
    private _chatHistory: Array<any> = [];
    private _chatMessages: MovieClip | null = null;
    private _skinnedElements: Array<any> = [];
    private _skinTag: number = 1;
    private fmt_nameOffset: TextFormat | null = null;
    private _enabled: boolean = true;
    private _runOnce: number = 0;
    private _originProps: Record<string, any>;
    private _maxProps: Record<string, any>;
    private _openProps: Record<string, any>;
    private _closeProps: Record<string, any>;
    private _chatWidthDefault: Record<string, any>;
    private _chatWidthShort: Record<string, any>;

    constructor() {
        super(new ChatBox_CLIP());
        this._skinnedElements = [];
        this._originProps = {
            "screenHeight": 240,
            "screenWidth": 380
        };
        this._maxProps = {
            "screenHeight": 470,
            "maskHeight": 470 - 12,
            "y": -(470 + 30),
            "scrollerY": -470,
            "scrollHeight": 470 - 16,
            "inputY": -12
        };
        this._openProps = {
            "screenHeight": 240,
            "maskHeight": 136,
            "y": -178,
            "scrollerY": -148,
            "scrollHeight": 120,
            "inputY": -12
        };
        this._closeProps = {
            "screenHeight": 114,
            "maskHeight": 105,
            "y": 0,
            "scrollerY": 30,
            "scrollHeight": 105,
            "inputY": 27
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
        this._chatWidthShort = {
            "sizeW": 390,
            "headerW": 390,
            "headerX": -5,
            "titleTxtX": 80,
            "alertX": 230,
            "arrowUpX": 343,
            "arrowUpY": 16,
            "arrowDownX": 325,
            "arrowDownY": 13,
            "borderW": 380,
            "mcMaskW": 350,
            "tOutputW": 320,
            "mcScreenW": 360,
            "inputWoodBgW": 390,
            "inputTxtBgW": 310,
            "inputTxtW": 305,
            "sendBtnX": 333,
            "scrollerX": 350,
            "ignoreBtnX": 315
        };
        if (!this._useAlerts) {
            this.background.alert.visible = false;
        }
        this._shell = new Sprite();
        this.background.addChild(this._shell);
        if (Boolean(this._chatMessages) && Boolean(this._chatMessages!.parent)) {
            this._chatMessages!.parent.removeChild(this._chatMessages!);
            this._chatMessages = null;
        }
        this._chatMessages = new MovieClip();
        this._shell.addChild(this._chatMessages);
        this._chatMessages.x = this.background.mcScreen.x;
        this._chatMessages.y = this.background.mcScreen.y;
        this._shell.addChild(this._chatMessages);
        this._shell.mask = this.background.mcMask;
        this._scrollbar = new ScrollSet();
        this.background.addChild(this._scrollbar);
        this._scrollbar.Init(this._shell, this.background.mcMask, 0, 0, 35);
        this._scrollbar.x = 400;
        this._scrollbar.y = 30;
        this._scrollbar.AutoHideEnabled = false;
        this._scrollbar.visible = false;
        this._sendBtn = new Button_CLIP();
        this._sendBtn.SetupKey("btn_say");
        this._sendBtn.x = 383;
        this._sendBtn.y = 8;
        this._sendBtn.width = 40;
        this._sendBtn.height = 26;
        this._sendBtn.Highlight = false;
        this._sendBtn.Enabled = true;
        this._sendBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.handleSendClick.bind(this));
        this.inputbar.addChild(this._sendBtn);
        this.input.addEventListener(MouseEvent.MOUSE_UP, this.onInputFocus.bind(this));
        this.background.alert.alert_txt.autoSize = TextFieldAutoSize.LEFT;
        this.background.alert.alert_txt.multiline = false;
        this.background.alert.alert_txt.wordWrap = false;
        this.background.alert.alert_txt.selectable = false;
        this.background.alert.alert_txt.mouseEnabled = false;
        this.background.alert.alert_txt.type = TextFieldType.DYNAMIC;
        this._chatHistory = [];
        this._originProps.screenWidth = this.background.mcScreen.width;
        this._originProps.screenHeight = this.background.mcScreen.height;
        this._skinnedElements = [this.background.border, this.background.header, this.background.mcScreen.canvas, this.inputbar.inputWoodBg, this.inputbar.inputTxtBG.canvas];
    }

    public static PopupShow(x: number, y: number, text: string, parent: MovieClip): void {
        ChatBox.PopupHide();
        ChatBox._popupignore = new bubblepopupRight();
        ChatBox._popupignore.Setup(x, y, text);
        ChatBox._popupignore.Nudge("left");
        ChatBox._popupignoredo = parent.addChild(ChatBox._popupignore);
    }

    public static PopupUpdate(text: string): void {
        if (ChatBox._popupignore) {
            ChatBox._popupignore.Update(text);
        }
    }

    public static PopupHide(): void {
        if (Boolean(ChatBox._popupignore) && Boolean(ChatBox._popupignore!.parent)) {
            ChatBox._popupignore!.parent.removeChild(ChatBox._popupignore!);
            ChatBox._popupignore = null;
        }
    }

    private handleSendClick(event: MouseEvent): void {
        Chat._bymChat.SendMessage();
        this.forceFocus();
    }

    public get Scrollbar(): any {
        return this._scrollbar;
    }

    private onInputFocus(event: Event): void {
        if (this.stage.displayState === StageDisplayState.FULL_SCREEN) {
            GLOBAL.goFullScreen(null);
        }
        this.forceFocus();
    }

    private forceFocus(): void {
        this.stage.focus = this.input;
        MAP.Release(null);
    }

    public override init(): void {
        this.background.arrowUp.addEventListener(MouseEvent.CLICK, this.toggleHide.bind(this));
        this.background.arrowUp.addEventListener(MouseEvent.MOUSE_OVER, this.onHideOver.bind(this));
        this.background.arrowUp.addEventListener(MouseEvent.MOUSE_OUT, this.onHideOut.bind(this));
        this.background.arrowUp.mouseChildren = false;
        this.background.arrowUp.buttonMode = true;
        this.background.arrowUp.useHandCursor = true;
        this.background.arrowUp.gotoAndStop("on" + this._skinTag);
        this.background.arrowDown.mouseChildren = false;
        this.background.arrowDown.buttonMode = true;
        this.background.arrowDown.useHandCursor = true;
        this.background.arrowDown.gotoAndStop("on" + this._skinTag);
        this.background.arrowDown.enabled = false;
        this.background.arrowDown.visible = false;
        this.background.mcToggle.addEventListener(MouseEvent.CLICK, this.OnChatDisableClick.bind(this));
        this.background.mcToggle.mouseChildren = false;
        this.background.mcToggle.buttonMode = true;
        this.background.mcToggle.useHandCursor = true;
        this.background.mcToggle.gotoAndStop(this._enabled ? "close" + this._skinTag : "on" + this._skinTag);
        this.input.addEventListener(FocusEvent.FOCUS_IN, this.onInputFocus.bind(this));
        this.input.maxChars = 100;
        this.ClearAlert();
        this.UpdateAlert();
        this.background.alert.visible = false;
        if (GLOBAL.StatGet("chatmin") === 1) {
            this._enabled = false;
            this._maximized = false;
        } else {
            this._enabled = true;
            this._maximized = false;
        }
        if (!Chat._bymChat.initialized) {
            this.OnChatDisableClick();
        }
        this.toggleHide();
    }

    private showHelp(...args: any[]): void {
    }

    private hideHelp(...args: any[]): void {
    }

    private toggleHide(event: MouseEvent | null = null): void {
        let targetProps: any = null;
        let shouldMaximize = false;
        let shouldMinimize = false;
        if (event !== null) {
            if (event.currentTarget === this.background.arrowUp) {
                if (this._maximized) {
                    shouldMaximize = false;
                } else {
                    shouldMaximize = true;
                }
            }
            if (event.currentTarget === this.background.mcToggle) {
                if (this._enabled) {
                    shouldMaximize = true;
                    this._maximized = false;
                } else {
                    shouldMaximize = false;
                    this._maximized = false;
                }
            }
        }
        if (this._animating) {
            return;
        }
        const duration = 0.5;
        if (event === null) {
            if (Chat._bymChat._open) {
                targetProps = this._openProps;
            } else {
                targetProps = this._closeProps;
            }
            this._maximized = false;
            this.background.arrowUp.gotoAndStop("on" + this._skinTag);
            this.background.arrowDown.gotoAndStop("on" + this._skinTag);
            this.background.arrowUp.buttonMode = true;
            this.background.arrowDown.buttonMode = false;
        } else if (this._maximized && Chat._bymChat._open) {
            if (!(!shouldMaximize && !shouldMinimize)) {
                return;
            }
            targetProps = this._openProps;
            this._maximized = false;
            this.background.arrowUp.gotoAndStop("on" + this._skinTag);
            this.background.arrowDown.gotoAndStop("on" + this._skinTag);
            this.background.arrowUp.buttonMode = true;
            this.background.arrowDown.buttonMode = true;
        } else if (Chat._bymChat._open && !shouldMinimize) {
            this.ClearAlert();
            if (!shouldMaximize) {
                Chat._bymChat._open = false;
                targetProps = this._closeProps;
                this._maximized = false;
                this.background.arrowUp.gotoAndStop("on" + this._skinTag);
                this.background.arrowDown.gotoAndStop("off" + this._skinTag);
                this.background.arrowUp.buttonMode = true;
                this.background.arrowDown.buttonMode = false;
                GLOBAL.StatSet("chatmin", 1);
            } else if (shouldMaximize) {
                targetProps = this._maxProps;
                this._maximized = true;
                this.background.arrowUp.gotoAndStop("on" + this._skinTag);
                this.background.arrowDown.gotoAndStop("on" + this._skinTag);
                this.background.arrowUp.buttonMode = true;
                this.background.arrowDown.buttonMode = false;
                GLOBAL.StatSet("chatmin", 0);
            } else if (shouldMinimize) {
                return;
            }
        } else if (!Chat._bymChat._open) {
            if (!(shouldMaximize || shouldMinimize)) {
                return;
            }
            Chat._bymChat._open = true;
            targetProps = this._openProps;
            this._maximized = false;
            this.background.arrowUp.gotoAndStop("on" + this._skinTag);
            this.background.arrowDown.gotoAndStop("on" + this._skinTag);
            this.background.arrowUp.buttonMode = true;
            this.background.arrowDown.buttonMode = true;
            GLOBAL.StatSet("chatmin", 0);
        }
        if (targetProps === null) {
            return;
        }
        this._scrollbar!.visible = false;
        TweenLite.to(this.background, duration, {
            "y": targetProps.y,
            "onUpdate": this.toggleOnUpdate.bind(this),
            "onComplete": this.toggleVisibleB.bind(this)
        });
        TweenLite.to(this.background.mcScreen, duration, { "height": targetProps.screenHeight });
        TweenLite.to(this.background.mcMask, duration, { "height": targetProps.maskHeight });
        TweenLite.to(this._scrollbar, duration, { "y": targetProps.scrollerY });
        if (Chat._bymChat._open) {
            TweenLite.to(this.inputbar, duration, {
                "y": targetProps.inputY,
                "autoAlpha": 1,
                "ease": Expo.easeOut
            });
            TweenLite.to(this.background.alert, duration, {
                "autoAlpha": 0,
                "ease": Expo.easeOut
            });
        } else {
            TweenLite.to(this.inputbar, duration, {
                "y": targetProps.inputY,
                "autoAlpha": 0,
                "ease": Quad.easeIn
            });
        }
        this._animating = true;
        const alphaValue = targetProps === this._closeProps ? 0 : 1;
        if (TUTORIAL.hasFinished) {
            if (this._maximized) {
                TweenLite.to(this.background.arrowUp, duration, {
                    "rotation": 180,
                    "autoAlpha": alphaValue,
                    "y": this._chatWidthDefault.arrowDownY,
                    "ease": Expo.easeOut
                });
            } else {
                TweenLite.to(this.background.arrowUp, duration, {
                    "rotation": 0,
                    "autoAlpha": alphaValue,
                    "y": this._chatWidthDefault.arrowUpY,
                    "ease": Expo.easeOut
                });
            }
        }
    }

    private toggleOnUpdate(): void {
        if (MapRoom3.mapRoom3Window) {
            MapRoom3.mapRoom3WindowHUD.PositionLeftMenuButtonsBar();
        }
    }

    private toggleVisibleB(): void {
        this._animating = false;
        const props = this._maximized ? this._maxProps : this._openProps;
        this._scrollbar!.Update();
        this._scrollbar!.visible = this._shell!.height > this.background.mcMask.height;
        if (!Chat._bymChat._open) {
            Chat._bymChat.toggleMinimizedStat(true);
            this._scrollbar!.visible = false;
        } else if (GLOBAL.StatGet("chatmin") !== 0) {
            Chat._bymChat.toggleMinimizedStat(false);
        }
        this._scrollbar!.ScrollTo(1, false);
        this.update();
    }

    public ResizeWindow(): void {
        if (this._chatWidth !== this._chatWidthDefault.sizeW) {
            this.background.header.width = this._chatWidthDefault.headerW;
            this.background.tTitle.x = this._chatWidthDefault.titleTxtX;
            this.background.alert.x = this._chatWidthDefault.alertX;
            this.background.arrowUp.x = this._chatWidthDefault.arrowUpX;
            this.background.arrowDown.x = this._chatWidthDefault.arrowDownX;
            this.background.arrowUp.y = this._chatWidthDefault.arrowUpY;
            this.background.arrowDown.y = this._chatWidthDefault.arrowDownY;
            this.background.border.width = this._chatWidthDefault.borderW;
            this.background.mcMask.width = this._chatWidthDefault.mcMaskW;
            this.background.mcScreen.width = this._chatWidthDefault.mcScreenW;
            this.background._output.width = this._chatWidthDefault.tOutputW;
            this.inputbar.inputWoodBg.width = this._chatWidthDefault.inputWoodBgW;
            this.input.width = this._chatWidthDefault.inputTxtW;
            this.inputbar.inputTxtBG.width = this._chatWidthDefault.inputTxtBgW;
            this._sendBtn.x = this._chatWidthDefault.sendBtnX;
            this._scrollbar!.x = this._chatWidthDefault.scrollerX;
            this._chatWidth = this._chatWidthDefault.sizeW;
        }
    }

    public ResizeMessages(): void {
        let yPos = 0;
        if (Boolean(this._chatMessages) && Boolean(this._chatMessages!.parent)) {
            this._chatMessages!.parent.removeChild(this._chatMessages!);
            this._chatMessages = null;
        }
        this._chatMessages = new MovieClip();
        this._shell!.addChild(this._chatMessages);
        this._chatMessages.x = this.background.mcMask.x;
        this._chatMessages.y = this.background.mcMask.y;
        const scaleY = 1;
        for (let i = 0; i < this._chatHistory.length; i++) {
            if (this._chatHistory[i].isOwnMessage) {
                this._chatHistory[i].bg.gotoAndStop(3);
            } else {
                this._chatHistory[i].bg.gotoAndStop(i % 2 + 1);
            }
            this._chatHistory[i].y = yPos;
            this._chatHistory[i].scaleY = scaleY;
            this._chatHistory[i].txt.width = this._chatWidthDefault.tOutputW;
            this._chatHistory[i].ignoreBtn.x = this._chatWidthDefault.ignoreBtnX;
            this._chatMessages.addChild(this._chatHistory[i]);
            yPos += this._chatHistory[i].height;
        }
        if (!this._scrollbar!.visible && Chat._bymChat._open) {
            this._scrollbar!.visible = this._shell!.height > this.background.mcMask.height;
        }
        this.addChild(this._scrollbar!);
        this._scrollbar!.Update();
        if (!this._scrollbar!.IsDragging) {
            this._scrollbar!.ScrollTo(1, false);
        }
    }

    public UpdateAlert(count: number = 0): void {
        if (!this._useAlerts) {
            this.background.alert.visible = false;
            return;
        }
        if (!Chat._bymChat._open) {
            this._alertsCounter += count;
            const alertText = this._alertsCounter < 100 ? String(this._alertsCounter) : "99+";
            this.background.alert.alert_txt.htmlText = "<b>" + alertText + "</b>";
            this.background.alert.alert_txt.x = 2;
            this.background.alert.bg.width = this.background.alert.alert_txt.width + 6;
        }
        if (this._alertsCounter > 0 && !Chat._bymChat._open && this._useAlerts) {
            TweenLite.to(this.background.alert, 0.5, {
                "autoAlpha": 1,
                "ease": Circ.easeIn
            });
        } else if (Chat._bymChat._open && this.background.alert.alpha !== 0) {
            TweenLite.to(this.background.alert, 0.5, {
                "autoAlpha": 0,
                "ease": Expo.easeOut
            });
        }
    }

    public ClearAlert(): void {
        if (Chat._bymChat._open) {
            this._alertsCounter = 0;
            this.UpdateAlert();
        }
    }

    public override push(message: string, username: string | null = null, userid: string | null = null, msgtype: string | null = null, isHistory: boolean = false): void {
        let displayName = username;
        if (displayName !== null) {
            displayName = displayName.substr(displayName.indexOf("["));
            if (displayName !== null) {
                displayName = displayName.substring(0, displayName.indexOf("<") - 1);
            }
        }
        const msgData = {
            "msg": message,
            "username": displayName,
            "userid": userid,
            "msgtype": msgtype
        };
        const msgClip = new ChatBox_msg_CLIP();
        msgClip.txt.htmlText = message;
        msgClip.txt.autoSize = TextFieldAutoSize.LEFT;
        msgClip.bg.height = msgClip.txt.height;
        msgClip.addEventListener(MouseEvent.ROLL_OVER, this.OnMsgMouseOver.bind(this));
        msgClip.addEventListener(MouseEvent.ROLL_OUT, this.OnMsgMouseOut.bind(this));
        msgClip.ignoreBtn.visible = false;
        msgClip.ignoreBtn.buttonMode = true;
        msgClip.msgData = msgData;
        msgClip.isOwnMessage = userid === LOGIN._playerID.toString();
        if (username !== null) {
            msgClip.ignoreBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.OnMsgIgnoreMouseDown.bind(this));
            msgClip.ignoreBtn.addEventListener(MouseEvent.ROLL_OVER, this.OnMsgIgnoreRollOver.bind(this));
            msgClip.ignoreBtn.addEventListener(MouseEvent.ROLL_OUT, this.OnMsgIgnoreRollOut.bind(this));
            const nameClip = new ChatBox_msg_name_CLIP();
            nameClip.label.htmlText = username;
            nameClip.label.autoSize = TextFieldAutoSize.LEFT;
            nameClip.bg.width = nameClip.label.textWidth;
            nameClip.label.visible = false;
            nameClip.x = 0;
            nameClip.y = 0;
            nameClip.addEventListener(MouseEvent.MOUSE_DOWN, this.OnMsgNameMouseDown.bind(this));
            nameClip.addEventListener(MouseEvent.ROLL_OVER, this.OnMsgNameRollOver.bind(this));
            nameClip.addEventListener(MouseEvent.ROLL_OUT, this.OnMsgNameRollOut.bind(this));
            msgClip.addChild(nameClip);
        }
        this._chatHistory.push(msgClip);
        if (!isHistory) {
            while (this._chats.length > 40) {
                this._chats.shift();
            }
        }
        this.ResizeMessages();
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
        this.background.mcToggle.gotoAndStop(this._enabled ? "on" + this._skinTag : "close" + this._skinTag);
        this.background.arrowUp.gotoAndStop("on" + this._skinTag);
        this.background.arrowDown.gotoAndStop("on" + this._skinTag);
    }

    public override update(): void {
        super.update();
        this.ResizeWindow();
        this.ResizeMessages();
        if (!TUTORIAL.hasFinished) {
            this.background.arrowUp.visible = TUTORIAL.hasFinished;
            this.background.mcToggle.visible = TUTORIAL.hasFinished;
        } else if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
            this.background.arrowUp.visible = TUTORIAL.hasFinished;
            this.background.mcToggle.visible = TUTORIAL.hasFinished;
        }
        this.Skin();
        this.UpdateChatStatus();
    }

    public UpdateChatStatus(): void {
        this.background.mcToggle.gotoAndStop(this._enabled ? "close" + this._skinTag : "on" + this._skinTag);
        if (Chat._bymChat.isLoggingOut) {
            this.background.mcToggle.gotoAndStop("wait" + this._skinTag);
        }
    }

    public override clearChat(): void {
        super.clearChat();
        this._chatHistory = [];
    }

    public override get background(): MovieClip {
        return this._displayAssets.frame;
    }

    public override get input(): TextField {
        return this._displayAssets.input._input;
    }

    public override get output(): TextField {
        return this.background._output;
    }

    public get inputbar(): MovieClip {
        return this._displayAssets.input;
    }

    public OnMsgMouseOver(event: MouseEvent): void {
        if (event.currentTarget && (event.currentTarget as any).msgData && !(event.currentTarget as any).isOwnMessage) {
            if ((event.currentTarget as any).msgData.userid) {
                const msgClip = event.currentTarget as ChatBox_msg_CLIP;
                if (msgClip.msgData.msgtype === "IgnoreList") {
                    if (Chat._bymChat.userIsIgnored(msgClip.msgData.userid)) {
                        msgClip.ignoreBtn.gotoAndStop(2);
                        msgClip.ignoreBtn.visible = true;
                    }
                } else if (!Chat._bymChat.userIsIgnored(msgClip.msgData.userid)) {
                    msgClip.ignoreBtn.gotoAndStop(1);
                    msgClip.ignoreBtn.visible = true;
                }
            }
        }
    }

    public OnMsgMouseOut(event: MouseEvent): void {
        const msgClip = event.currentTarget as ChatBox_msg_CLIP;
        msgClip.ignoreBtn.visible = false;
    }

    public OnMsgIgnoreMouseDown(event: MouseEvent): void {
        const target = event.currentTarget as any;
        if (Boolean(target.parent) && Boolean(target.parent.msgData)) {
            if (target.parent.msgData.msgtype === "IgnoreList") {
                Chat._bymChat.unignoreUser(target.parent.msgData.userid);
            } else {
                Chat._bymChat.ignoreUser(target.parent.msgData.userid, target.parent.msgData.username);
            }
        }
    }

    public OnMsgIgnoreRollOver(event: MouseEvent): void {
        const target = event.currentTarget as any;
        const text = target.parent.msgData.msgtype === "IgnoreList" ? "Click to unignore user" : "Click to ignore user";
        const yPos = target.y + target.height / 2;
        ChatBox.PopupShow(target.x - 10, yPos, text, target.parent as MovieClip);
    }

    public OnMsgIgnoreRollOut(event: MouseEvent): void {
        ChatBox.PopupHide();
    }

    public OnMsgNameMouseDown(event: MouseEvent): void {
    }

    public OnMsgNameRollOver(event: MouseEvent): void {
    }

    public OnMsgNameRollOut(event: MouseEvent): void {
    }

    private OnChatDisableClick(event: MouseEvent | null = null): void {
        if (this._animating) {
            return;
        }
        if (event && event.currentTarget === this.background.mcToggle && TUTORIAL.hasFinished) {
            this._enabled = !this._enabled;
        }
        if (TUTORIAL.hasFinished && !Chat._bymChat.isLoggingOut) {
            this.EnableInput(this._enabled);
            if (!this._enabled && Chat._bymChat.IsJoined) {
                Chat._bymChat.disableChat();
                LOGGER.Stat([68, "hide"]);
            } else if (Chat.flagsShouldChatExist()) {
                if (!Chat._bymChat.IsConnected) {
                    Chat.connectAndLogin();
                    LOGGER.Stat([68, "unhide"]);
                }
            }
            this.UpdateChatStatus();
            this.toggleHide(event);
        }
    }

    public EnableInput(enable: boolean): void {
        if (enable) {
            this.input.text = "";
            this.input.visible = true;
        } else {
            this.input.text = "";
            this.input.visible = false;
        }
    }

    public ClearInputText(): void {
        this.input.text = "";
    }

    public get chatEnabled(): boolean {
        return this._enabled;
    }

    public inputHasFocus(): boolean {
        return this.stage !== null && this.stage.focus === this.input;
    }

    public disableChatBoxForAB(): void {
        this._sendBtn.removeEventListener(MouseEvent.MOUSE_DOWN, this.handleSendClick.bind(this));
        this.input.removeEventListener(MouseEvent.MOUSE_UP, this.onInputFocus.bind(this));
        this._sendBtn.enabled = false;
        this._sendBtn.removeEventListener(MouseEvent.MOUSE_DOWN, this.handleSendClick.bind(this));
        this.EnableInput(false);
    }
}
