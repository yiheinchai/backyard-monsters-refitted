import { AuthForm } from './com/auth/AuthForm';
import { SecNum } from './com/cc/utils/SecNum';
import { BYMDevConfig } from './com/monsters/configs/BYMDevConfig';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { Player } from './com/monsters/player/Player';
import { RADIO } from './com/monsters/radio/RADIO';
import Event from 'openfl/events/Event';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import { GAME } from './GAME';
import { md5 } from './md5';
import { PLEASEWAIT } from './PLEASEWAIT';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }


/**
 * LOGIN - User Authentication System
 * Handles login flow, authentication, and session initialization
 */
export class LOGIN {
    public static _playerID: number = 0;
    public static _playerName: string = "";
    public static _playerLastName: string = "";
    public static _playerPic: string = "";
    public static _timePlayed: number = 0;
    public static _playerLevel: number = 0;
    public static _email: string = "";
    public static _proxymail: string = "";
    public static _settings: Record<string, any> | null = null;
    public static _digits: number[] = [];
    public static _sumdigit: number = 0;
    public static _inferno: number = 0;
    public static authForm: AuthForm | null = null;
    public static token: string = "";

    constructor() {}

    public static Login(): void {
        if (GAME.token) {
            PLEASEWAIT.Show("Logging in...");
            getGLOBAL().eventDispatcher.addEventListener(getKEYS().LANGUAGE_FILE_LOADED, LOGIN.onLanguageLoaded);
            getGLOBAL().LanguageSetup();
        } else {
            LOGIN.authForm = new AuthForm();
            getGLOBAL()._layerTop.addChild(LOGIN.authForm);
        }
    }

    private static onLanguageLoaded(event: Event): void {
        getGLOBAL().eventDispatcher.removeEventListener(getKEYS().LANGUAGE_FILE_LOADED, LOGIN.onLanguageLoaded);
        new (getURLLoaderApi())().load(getGLOBAL()._apiURL + "bm/getnewmap", null,
            (serverData: any): void => {
                LOGIN.OnGetNewMap(serverData, [["token", GAME.sharedObj.data.token]]);
            });
    }

    public static OnGetNewMap(serverData: any, authInfo: [string, string][]): void {
        LOGIN._Login(serverData.newmap, serverData.mapheaderurl, authInfo);
    }

    private static _Login(newmap: boolean, mapheaderurl: string, authInfo: [string, string][]): void {
        getMapRoomManager().instance.init(newmap, mapheaderurl);
        if (getGLOBAL()._local) {
            const handleLoadSuccessful = (serverData: any): void => {
                if (serverData.hasOwnProperty("error") && serverData.error !== 0) {
                    getGLOBAL().Message(serverData.error);
                    return;
                }
                if (serverData.error === 0) {
                    if (getGLOBAL()._local) {
                        LOGIN.token = serverData.token;
                        LOGIN.Process(serverData);
                    }
                }
            };
            const handleLoadError = (error: IOErrorEvent): void => {
                getGLOBAL()._layerTop.addChild(getGLOBAL().Message("An error occurred during login on the server."));
            };
            new (getURLLoaderApi())().load(getGLOBAL()._apiURL + "player/getinfo", 
                [["version", getGLOBAL()._version.Get()], ...authInfo], handleLoadSuccessful, handleLoadError);
        } else {
            // Browser mode with ExternalInterface - not implemented for local version
            if (BYMDevConfig.instance.USE_CLIENT_WITH_CALLBACK) {
                getGLOBAL().CallJSWithClient("cc.initApplication", "loginsuccessful", [getGLOBAL()._version.Get()]);
            } else {
                getGLOBAL().CallJS("cc.initApplication", [getGLOBAL()._version.Get(), "loginsuccessful"]);
            }
            LOGIN.logFlashCapabilities();
        }
    }

    public static Process(serverData: any): void {
        if (serverData.version !== getGLOBAL()._version.Get()) {
            LOGIN.handleVersionMismatch(serverData);
        } else {
            LOGIN.handleUserLogin(serverData);
        }
    }

    private static handleUserLogin(serverData: any): void {
        if (LOGIN.authForm) {
            LOGIN.authForm.disposeUI();
        }
        if (serverData) {
            getGLOBAL().player = new Player();
            getGLOBAL().player.ID = serverData.userid;
            getGLOBAL().player.name = serverData.username;
            getGLOBAL().player.lastName = serverData.last_name;
            getGLOBAL().player.picture = serverData.pic_square;
            getGLOBAL().player.timePlayed = serverData.timeplayed;
            getGLOBAL().player.email = serverData.email;
            LOGIN._playerID = serverData.userid;
            LOGIN._playerName = serverData.username;
            LOGIN._playerLastName = serverData.last_name;
            LOGIN._playerPic = serverData.pic_square;
            LOGIN._timePlayed = serverData.timeplayed;
            LOGIN._email = serverData.email;
            if (serverData.stats) {
                if (serverData.stats.inferno !== undefined) {
                    LOGIN._inferno = serverData.stats.inferno;
                }
            }
            getGLOBAL()._friendCount = serverData.friendcount;
            getGLOBAL()._sessionCount = serverData.sessioncount;
            getGLOBAL()._addTime = serverData.addtime;
            getGLOBAL()._mapVersion = serverData.mapversion;
            getGLOBAL()._mailVersion = serverData.mailversion;
            getGLOBAL()._soundVersion = serverData.soundversion;
            getGLOBAL()._languageVersion = serverData.languageversion;
            getGLOBAL()._appid = serverData.app_id;
            getGLOBAL()._tpid = serverData.tpid;
            getGLOBAL()._currencyURL = serverData.currency_url;
            if (serverData.bookmarks) {
                getMapRoomManager().instance.bookmarkData = serverData.bookmarks;
            } else {
                getMapRoomManager().instance.bookmarkData = {};
            }
            if (serverData.settings) {
                LOGIN._settings = serverData.settings;
                RADIO.Setup(LOGIN._settings);
            }
            if (serverData.proxy_email) {
                LOGIN._proxymail = serverData.proxy_email;
            }
            if (!serverData.languageversion) {
                getGLOBAL()._languageVersion = 8;
            }
            if (serverData.sendgift === 1) {
                getGLOBAL()._canGift = true;
            }
            if (serverData.sendinvite === 1) {
                getGLOBAL()._canInvite = true;
            }
            getBASE()._isFan = serverData.isfan;
            if (serverData.ncpCandidate === 1) {
                getGLOBAL()._fbcncp = serverData.ncpCandidate;
            }
            getPOPUPS().Setup();
            LOGIN.Digits(LOGIN._playerID);
            LOGIN.Done();
        }
    }

    private static handleVersionMismatch(serverData: any): void {
        const eventData: any = {
            tag: "userload",
            version_mismatch_h: 1,
            vh2: serverData.version,
            vh1: getGLOBAL()._version.Get()
        };
        getGLOBAL().CallJS("cc.logGenericEvent", [eventData]);
        getGLOBAL().ErrorMessage(getKEYS().Get("msg_updatedgame"), getGLOBAL().ERROR_ORANGE_BOX_ONLY);
    }

    public static Digits(playerId: number): void {
        const str: string = playerId.toString();
        LOGIN._digits = [];
        for (let i = 0; i < str.length; i++) {
            LOGIN._digits.push(parseInt(str.charAt(i)));
        }
        LOGIN._sumdigit = 0;
        if (LOGIN._digits.length >= 3) {
            const sum: number = LOGIN._digits[LOGIN._digits.length - 1] + 
                                LOGIN._digits[LOGIN._digits.length - 2] + 
                                LOGIN._digits[LOGIN._digits.length - 3];
            const sumStr: string = sum.toString();
            LOGIN._sumdigit = parseInt(sumStr.substr(sumStr.length - 1, 1));
        }
    }

    public static Done(): void {
        getGLOBAL().Setup();
        if (getGLOBAL()._openBase && getGLOBAL()._openBase.url && 
            (getGLOBAL()._openBase.userid || getGLOBAL()._openBase.baseid) && 
            getGLOBAL()._openBase.userid !== LOGIN._playerID) {
            getBASE().yardType = getMapRoomManager().instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
            if (!getGLOBAL()._openBase.userid) getGLOBAL()._openBase.userid = 0;
            if (!getGLOBAL()._openBase.baseid) getGLOBAL()._openBase.baseid = 0;
            getGLOBAL()._currentCell = null;
            getGLOBAL().setMode(getGLOBAL().e_BASE_MODE.HELP);
            for (let i = 1; i < 5; i++) {
                getGLOBAL()._resources["r" + i] = new SecNum(0);
                getGLOBAL()._hpResources["r" + i] = 0;
            }
            getBASE().Load(getGLOBAL()._openBase.url, getGLOBAL()._openBase.userid, getGLOBAL()._openBase.baseid);
        } else if (LOGIN._inferno !== 0) {
            getMapRoomManager().instance.mapRoomVersion = getMapRoomManager().MAP_ROOM_VERSION_1;
            getBASE().yardType = EnumYardType.INFERNO_YARD;
            getBASE().LoadBase(getGLOBAL()._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
        } else {
            getBASE().yardType = getMapRoomManager().instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
            getBASE().Load();
        }
    }

    private static logFlashCapabilities(): void {
        const capabilities: any = {
            flash_version: "HTML5",
            screen_resolution: window.screen.width + "x" + window.screen.height,
            screen_dpi: window.devicePixelRatio * 96
        };
        getGLOBAL().CallJS("cc.logFlashCapabilities", [capabilities]);
    }

    public static checkHash(data: string): boolean {
        const parts: string[] = data.split(",\"h\":");
        data = parts[0] + "}";
        const hashPart: string = "{\"h\":" + parts[1];
        const decoded = JSON.parse(data);
        const hashDecoded = JSON.parse(hashPart);
        const hash: string = md5(LOGIN.getSalt() + data + LOGIN.getNum(hashDecoded.hn));
        if (hash !== hashDecoded.h) {
            return false;
        }
        return true;
    }

    public static getNum(n: number): number {
        return n * (n % 11);
    }

    public static getSalt(): string {
        return LOGIN.decodeSalt("84V37530976X4W7175W9Z02U3483Y6VW");
    }

    public static decodeSalt(input: string): string {
        let result: string = "";
        for (let i = 0; i < input.length; i++) {
            const char: string = input.substring(i, i + 1);
            const charMap: Record<string, string> = {
                "a": "Z", "b": "Y", "c": "X", "d": "W", "e": "V", "f": "U", "g": "T", "h": "S", "i": "R",
                "j": "Q", "k": "P", "l": "O", "m": "N", "n": "M", "o": "L", "p": "K", "q": "J", "r": "I",
                "s": "H", "t": "G", "u": "F", "v": "E", "w": "D", "x": "C", "y": "B", "z": "A",
                "A": "z", "B": "y", "C": "x", "D": "w", "E": "v", "F": "u", "G": "t", "H": "s", "I": "r",
                "J": "q", "K": "p", "L": "o", "M": "n", "N": "m", "O": "l", "P": "k", "Q": "j", "R": "i",
                "S": "h", "T": "g", "U": "f", "V": "e", "W": "d", "X": "c", "Y": "b", "Z": "a",
                "0": "9", "1": "8", "2": "7", "3": "6", "4": "5", "5": "4", "6": "3", "7": "2", "8": "1", "9": "0"
            };
            result += charMap[char] || char;
        }
        return result;
    }
}
