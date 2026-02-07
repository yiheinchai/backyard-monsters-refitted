import StageDisplayState from "openfl/display/StageDisplayState";

import { RADIOSETTINGSPOPUP } from "./RADIOSETTINGSPOPUP";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getLOGIN(): any { return require("../../../LOGIN").LOGIN; }
function getMAP(): any { return require("../../../MAP").MAP; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }
function getUI2(): any { return require("../../../UI2").UI2; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }



// JSON declaration for encoding/decoding
declare const JSON: {
    encode(obj: any): string;
    decode(str: string): any;
};

/**
 * Radio system for email notifications and social features.
 */
export class RADIO {
    public static _init: boolean = false;
    public static _open: boolean = false;
    public static _twitterAccount: string = "";
    private static _requestedName: boolean = false;
    private static _mc: RADIOSETTINGSPOPUP | null = null;
    public static _proxymode: boolean = false;
    public static _settings: { [key: string]: any } = {};
    public static _isSaving: boolean = false;

    public static readonly ATTACK_KEY: string = "att";
    public static readonly NEWS_KEY: string = "news";
    public static readonly ADDRESS_KEY: string = "address";
    public static readonly PROXY_KEY: string = "proxy";

    constructor() {}

    public static Setup(settings: any = null): void {
        if (settings) {
            RADIO._settings = settings;
        } else if (getLOGIN()._settings) {
            RADIO._settings = getLOGIN()._settings;
        } else {
            RADIO._settings = {};
        }
    }

    public static SubmitEmail(): void {
        // Empty as in original
    }

    public static getProp(key: string): any {
        if (RADIO._settings && RADIO._settings.hasOwnProperty(key)) {
            return RADIO._settings[key];
        }
        return null;
    }

    public static setProp(key: string, value: any): void {
        RADIO._settings[key] = value;
        const encoded = JSON.encode(RADIO._settings);
        new (getURLLoaderApi())().load(
            getGLOBAL()._apiURL + "player/updateemail",
            [["settings", encoded]],
            RADIO.handleSettingsSaveSucc,
            RADIO.handleSettingsSaveFail
        );
        RADIO._isSaving = true;
        if (RADIO._mc) RADIO._mc.bSaveToggle();
    }

    private static handleSettingsSaveSucc(response: any): void {
        RADIO._isSaving = false;
        if (RADIO._mc) RADIO._mc.bSaveToggle();
        if (response.error === 0) {
            getGLOBAL().Message(getKEYS().Get("radio_saveSucc"), null, null, null);
            RADIO.Hide();
        } else {
            getLOGGER().Log("err", "|RADIO| - handleSettingsSaveSucc - Fail" + JSON.encode(response));
            getGLOBAL().Message(getKEYS().Get("radio_saveFail"), null, null, null);
        }
    }

    private static handleSettingsSaveFail(response: any): void {
        RADIO._isSaving = false;
        getGLOBAL().Message(getKEYS().Get("radio_saveFail"), null, null, null);
    }

    public static TwitterCallback(data: string): void {
        const parsed = JSON.decode(data);
        if (parsed.error) {
            if (parsed.error !== "noname") {
                getLOGGER().Log("err", "radio: " + parsed.error);
                getGLOBAL().Message(getKEYS().Get("msg_err_radio") + parsed.error + "<br><br>" + getKEYS().Get("msg_tryagain"));
            }
        } else if (parsed.name) {
            RADIO._twitterAccount = parsed.name;
        }
    }

    public static TwitterSetName(name: string): void {
        getGLOBAL().CallJS("twitterInterface.setName", ["" + name, "twitteraccount"], false);
        RADIO._twitterAccount = name;
    }

    public static TwitterRemoveName(): void {
        getGLOBAL().CallJS("twitterInterface.deleteName", ["twitteraccount"], false);
    }

    public static RemoveName(): void {
        const handleRemoveSucc = (response: any): void => {
            RADIO._isSaving = false;
            if (response.error === 0) {
                getGLOBAL().Message(getKEYS().Get("radio_recycleConfirm"), null, null, null);
                RADIO.Hide();
            } else {
                getLOGGER().Log("err", "|RADIO| - handleSettingsSaveSucc - Fail" + JSON.encode(response));
                getGLOBAL().Message(getKEYS().Get("radio_recycleConfirm"), null, null, null);
            }
        };

        const handleRemoveFail = (response: any): void => {
            RADIO._isSaving = false;
            getGLOBAL().Message(getKEYS().Get("radio_saveFail"), null, null, null);
        };

        const removeEmail = (key: string, value: any): void => {
            RADIO._settings[key] = value;
            const encoded = JSON.encode(RADIO._settings);
            new (getURLLoaderApi())().load(
                getGLOBAL()._apiURL + "player/updateemail",
                [["settings", encoded]],
                handleRemoveSucc,
                handleRemoveFail
            );
            RADIO._isSaving = true;
        };

        const obj: { [key: string]: any } = {};
        obj[RADIO.ATTACK_KEY] = 0;
        if (obj[RADIO.ATTACK_KEY] === 1) {
            getQUESTS()._global.email_att = 1;
        }
        obj[RADIO.NEWS_KEY] = 0;
        if (obj[RADIO.NEWS_KEY] === 1) {
            getQUESTS()._global.email_news = 1;
        }
        obj[RADIO.ADDRESS_KEY] = getLOGIN()._email;
        removeEmail("o1", obj);
    }

    public static TwitterFollow(): void {
        getGLOBAL().CallJS("openUrl", ["http://twitter.com/#!/BackyardMonster"], true);
    }

    public static TwitterBrag(): void {
        getGLOBAL().CallJS("sendFeed", ["build-radio", getKEYS().Get("radiobuilt_streamtitle"), getKEYS().Get("radiobuilt_streambody"), "build-radio.v2.png"]);
    }

    public static Export(): { [key: string]: any } {
        return RADIO._settings;
    }

    public static Show(): void {
        if (!RADIO._open) {
            if (getGLOBAL()._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN) {
                if (getGLOBAL().mode === (GLOBAL as any).e_BASE_MODE.ATTACK || getGLOBAL().mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                    getUI2()._top.mcZoom.gotoAndStop(1 + 3);
                } else {
                    getUI2()._top.mcZoom.gotoAndStop(1);
                }
                getGLOBAL()._ROOT.stage.displayState = StageDisplayState.NORMAL;
                getGLOBAL()._zoomed = false;
                getMAP()._GROUND.scaleX = getMAP()._GROUND.scaleY = 1;
                getMAP().Focus(0, 0);
            }
            getGLOBAL().BlockerAdd();
            RADIO._mc = new RADIOSETTINGSPOPUP();
            RADIO._mc.Center();
            RADIO._mc.ScaleUp();
            getGLOBAL()._layerWindows.addChild(RADIO._mc);
            RADIO._open = true;
        }
    }

    public static Hide(): void {
        if (RADIO._open) {
            getGLOBAL().BlockerRemove();
            if (RADIO._mc && RADIO._mc.parent) {
                RADIO._mc.parent.removeChild(RADIO._mc);
            }
            RADIO._open = false;
        }
    }
}
