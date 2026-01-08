import { StageDisplayState } from "openfl/display/StageDisplayState";

import { RADIOSETTINGSPOPUP } from "./RADIOSETTINGSPOPUP";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { LOGIN } from "../../../LOGIN";
import { MAP } from "../../../MAP";
import { QUESTS } from "../../../QUESTS";
import { UI2 } from "../../../UI2";
import { URLLoaderApi } from "../../../URLLoaderApi";

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
        } else if (LOGIN._settings) {
            RADIO._settings = LOGIN._settings;
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
        new URLLoaderApi().load(
            GLOBAL._apiURL + "player/updateemail",
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
            GLOBAL.Message(KEYS.Get("radio_saveSucc"), null, null, null);
            RADIO.Hide();
        } else {
            LOGGER.Log("err", "|RADIO| - handleSettingsSaveSucc - Fail" + JSON.encode(response));
            GLOBAL.Message(KEYS.Get("radio_saveFail"), null, null, null);
        }
    }

    private static handleSettingsSaveFail(response: any): void {
        RADIO._isSaving = false;
        GLOBAL.Message(KEYS.Get("radio_saveFail"), null, null, null);
    }

    public static TwitterCallback(data: string): void {
        const parsed = JSON.decode(data);
        if (parsed.error) {
            if (parsed.error !== "noname") {
                LOGGER.Log("err", "radio: " + parsed.error);
                GLOBAL.Message(KEYS.Get("msg_err_radio") + parsed.error + "<br><br>" + KEYS.Get("msg_tryagain"));
            }
        } else if (parsed.name) {
            RADIO._twitterAccount = parsed.name;
        }
    }

    public static TwitterSetName(name: string): void {
        GLOBAL.CallJS("twitterInterface.setName", ["" + name, "twitteraccount"], false);
        RADIO._twitterAccount = name;
    }

    public static TwitterRemoveName(): void {
        GLOBAL.CallJS("twitterInterface.deleteName", ["twitteraccount"], false);
    }

    public static RemoveName(): void {
        const handleRemoveSucc = (response: any): void => {
            RADIO._isSaving = false;
            if (response.error === 0) {
                GLOBAL.Message(KEYS.Get("radio_recycleConfirm"), null, null, null);
                RADIO.Hide();
            } else {
                LOGGER.Log("err", "|RADIO| - handleSettingsSaveSucc - Fail" + JSON.encode(response));
                GLOBAL.Message(KEYS.Get("radio_recycleConfirm"), null, null, null);
            }
        };

        const handleRemoveFail = (response: any): void => {
            RADIO._isSaving = false;
            GLOBAL.Message(KEYS.Get("radio_saveFail"), null, null, null);
        };

        const removeEmail = (key: string, value: any): void => {
            RADIO._settings[key] = value;
            const encoded = JSON.encode(RADIO._settings);
            new URLLoaderApi().load(
                GLOBAL._apiURL + "player/updateemail",
                [["settings", encoded]],
                handleRemoveSucc,
                handleRemoveFail
            );
            RADIO._isSaving = true;
        };

        const obj: { [key: string]: any } = {};
        obj[RADIO.ATTACK_KEY] = 0;
        if (obj[RADIO.ATTACK_KEY] === 1) {
            QUESTS._global.email_att = 1;
        }
        obj[RADIO.NEWS_KEY] = 0;
        if (obj[RADIO.NEWS_KEY] === 1) {
            QUESTS._global.email_news = 1;
        }
        obj[RADIO.ADDRESS_KEY] = LOGIN._email;
        removeEmail("o1", obj);
    }

    public static TwitterFollow(): void {
        GLOBAL.CallJS("openUrl", ["http://twitter.com/#!/BackyardMonster"], true);
    }

    public static TwitterBrag(): void {
        GLOBAL.CallJS("sendFeed", ["build-radio", KEYS.Get("radiobuilt_streamtitle"), KEYS.Get("radiobuilt_streambody"), "build-radio.v2.png"]);
    }

    public static Export(): { [key: string]: any } {
        return RADIO._settings;
    }

    public static Show(): void {
        if (!RADIO._open) {
            if (GLOBAL._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN) {
                if (GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.ATTACK || GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                    UI2._top.mcZoom.gotoAndStop(1 + 3);
                } else {
                    UI2._top.mcZoom.gotoAndStop(1);
                }
                GLOBAL._ROOT.stage.displayState = StageDisplayState.NORMAL;
                GLOBAL._zoomed = false;
                MAP._GROUND.scaleX = MAP._GROUND.scaleY = 1;
                MAP.Focus(0, 0);
            }
            GLOBAL.BlockerAdd();
            RADIO._mc = new RADIOSETTINGSPOPUP();
            RADIO._mc.Center();
            RADIO._mc.ScaleUp();
            GLOBAL._layerWindows.addChild(RADIO._mc);
            RADIO._open = true;
        }
    }

    public static Hide(): void {
        if (RADIO._open) {
            GLOBAL.BlockerRemove();
            if (RADIO._mc && RADIO._mc.parent) {
                RADIO._mc.parent.removeChild(RADIO._mc);
            }
            RADIO._open = false;
        }
    }
}
