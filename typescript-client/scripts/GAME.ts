import { SWFProfiler } from './com/flashdynamix/utils/SWFProfiler';
import { ALLIANCES } from './com/monsters/alliances/ALLIANCES';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { MarketingRecapture } from './com/monsters/marketing/MarketingRecapture';
import { RADIO } from './com/monsters/radio/RADIO';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import Stage from 'openfl/display/Stage';
import StageScaleMode from 'openfl/display/StageScaleMode';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("./com/monsters/debug/Console").Console; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUY(): any { return require("./BUY").BUY; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSTORE(): any { return require("./STORE").STORE; }


/**
 * GAME - Main Game Entry Point
 * Initializes the game, sets up layers, and handles external callbacks
 */
export class GAME extends Sprite {
    public static _instance: GAME | null = null;
    public static _isSmallSize: boolean = true;
    public static _firstLoadComplete: boolean = false;
    public static sharedObj: any = null;
    public static token: string = "";
    public static language: string = "";

    private _checkScreenSize: boolean = true;
    private _previousDistance: number = 0;
    private _scaleFactor: number = 1;

    constructor() {
        super();
        GAME._instance = this;
        getGLOBAL()._local = typeof window === 'undefined';
        
        const serverUrl: string = getGLOBAL().serverUrl;
        const apiVersionSuffix: string = getGLOBAL().apiVersionSuffix + "/";
        const cdnUrl: string = getGLOBAL().cdnUrl;

        const urls: any = {
            _baseURL: serverUrl + "base/",
            _apiURL: serverUrl + "api/" + apiVersionSuffix,
            infbaseurl: serverUrl + "api/" + apiVersionSuffix + "bm/base/",
            _statsURL: serverUrl + "recordstats.php",
            _mapURL: serverUrl + "worldmapv2/",
            map3url: serverUrl + "worldmapv3/",
            _allianceURL: serverUrl + "alliance/",
            languageurl: cdnUrl + "gamestage/assets/",
            _storageURL: cdnUrl + "assets/",
            _soundPathURL: cdnUrl + "assets/sounds/",
            _gameURL: serverUrl,
            _appid: serverUrl,
            _tpid: serverUrl,
            _currencyURL: serverUrl,
            _countryCode: "us"
        };

        this.Data(urls, {});
    }

    public static disableWindowScroll(event: Event | null = null): void {
        getGLOBAL().CallJS("cc.disableMouseWheel");
    }

    public static enableWindowScroll(event: Event | null = null): void {
        getGLOBAL().CallJS("cc.enableMouseWheel");
    }

    public setLauncherVars(params: any): void {
        try {
            GAME.sharedObj = localStorage;
            if (params?.language) {
                GAME.language = params.language;
                localStorage.setItem('bymr_language', GAME.language);
            }
            if (params?.token) {
                GAME.token = params.token;
                localStorage.setItem('bymr_token', GAME.token);
            }
        } catch (e: any) {
            getLOGGER().Log("err", "Error setting token from loader: " + e.message);
        }
    }

    public Data(urls: any, loaderParams: any): void {
        this.setLauncherVars(loaderParams);
        getGLOBAL().init();
        getGLOBAL()._baseURL = urls._baseURL;
        getGLOBAL()._infBaseURL = urls.infbaseurl;
        getGLOBAL()._apiURL = urls._apiURL;
        getGLOBAL()._gameURL = urls._gameURL;
        getGLOBAL()._storageURL = urls._storageURL;
        getGLOBAL().languageUrl = urls.languageurl;
        getGLOBAL()._allianceURL = urls._allianceURL;
        getGLOBAL()._soundPathURL = urls._soundPathURL;
        getGLOBAL()._statsURL = urls._statsURL;
        getGLOBAL()._mapURL = urls._mapURL;
        getMapRoomManager().instance.mapRoom3URL = urls.map3url;
        getGLOBAL()._appid = urls.app_id;
        getGLOBAL()._tpid = urls.tpid;
        getGLOBAL()._countryCode = urls._countryCode;
        getGLOBAL()._currencyURL = urls.currency_url;
        getGLOBAL()._fbdata = urls;
        getGLOBAL()._monetized = urls.monetized;
        MarketingRecapture.instance.importData(urls.urlparams);

        // Create display layers
        getGLOBAL()._ROOT = new MovieClip();
        this.addChild(getGLOBAL()._ROOT);
        getGLOBAL()._layerMap = getGLOBAL()._ROOT.addChild(new Sprite()) as Sprite;
        getGLOBAL()._layerUI = getGLOBAL()._ROOT.addChild(new Sprite()) as Sprite;
        getGLOBAL()._layerWindows = getGLOBAL()._ROOT.addChild(new Sprite()) as Sprite;
        getGLOBAL()._layerMessages = getGLOBAL()._ROOT.addChild(new Sprite()) as Sprite;
        getGLOBAL()._layerTop = getGLOBAL()._ROOT.addChild(new Sprite()) as Sprite;
        getGLOBAL()._layerMap.mouseEnabled = false;
        getGLOBAL()._layerUI.mouseEnabled = false;
        getGLOBAL()._layerWindows.mouseEnabled = false;
        getGLOBAL()._layerMessages.mouseEnabled = false;
        getGLOBAL()._layerTop.mouseEnabled = false;
        getGLOBAL().RefreshScreen();

        if (urls.openbase) {
            getGLOBAL()._openBase = JSON.parse(urls.openbase);
        } else {
            getGLOBAL()._openBase = null;
        }

        // Start game loop
        this.addEventListener(Event.ENTER_FRAME, getGLOBAL().TickFast);
        getLOGIN().Login();

        // Set up external interface callbacks (for web)
        this.setupExternalCallbacks();

        if (this._checkScreenSize) {
            getGLOBAL()._SCREENINIT = GAME._isSmallSize 
                ? new Rectangle(0, 0, 760, 670) 
                : new Rectangle(0, 0, 760, 750);
        }
    }

    private setupExternalCallbacks(): void {
        // External interface callbacks would be set up here for browser integration
        // These handle communication between the game and external JavaScript
        if (typeof window !== 'undefined') {
            (window as any).openbase = (data: string) => {
                if (getBASE()._saveCounterA === getBASE()._saveCounterB && !getBASE()._saving && !getBASE()._loading) {
                    getGLOBAL()._currentCell = null;
                    const parsed = JSON.parse(data);
                    const yardType = getMapRoomManager().instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
                    if (parsed.viewleader) {
                        getBASE().LoadBase(parsed.url, parsed.userid, Number(parsed.baseid), getGLOBAL().e_BASE_MODE.VIEW, true, yardType);
                    } else if (parsed.infurl && getBASE().isInfernoMainYardOrOutpost) {
                        getBASE().LoadBase(parsed.infurl, 0, Number(parsed.infbaseid), getGLOBAL().e_BASE_MODE.IVIEW, true, EnumYardType.INFERNO_YARD);
                    } else {
                        getBASE().LoadBase(parsed.url, parsed.userid, Number(parsed.baseid), getGLOBAL().e_BASE_MODE.HELP, true, yardType);
                    }
                }
            };
            (window as any).fbcBuyItem = (data: string) => getSTORE().FacebookCreditPurchaseB(data);
            (window as any).callbackgift = (data: string) => getPOPUPS().CallbackGift(data);
            (window as any).callbackshiny = (data: string) => getPOPUPS().CallbackShiny(data);
            (window as any).twitteraccount = (data: string) => RADIO.TwitterCallback(data);
            (window as any).updateCredits = (data: string) => getSTORE().updateCredits(data);
            (window as any).fbcAdd = (data: string) => getBUY().FBCAdd(data);
            (window as any).fbcOfferDaily = (data: string) => getBUY().FBCOfferDaily(data);
            (window as any).fbcOfferEarn = (data: string) => getBUY().FBCOfferEarn(data);
            (window as any).fbcNcp = (data: string) => getBUY().FBCNcp(data);
            (window as any).fbcNcpConfirm = (data: string) => getBUY().FBCNcpConfirm(data);
            (window as any).purchaseReceive = (data: string) => getBUY().purchaseReceive(data);
            (window as any).purchaseComplete = (data: string) => getBUY().purchaseComplete(data);
            (window as any).receivePurchase = (data: string) => getBUY().purchaseReceive(data);
            (window as any).startPromoTimer = (data: string) => getBUY().startPromo(data);
            (window as any).alliancesupdate = (data: string) => ALLIANCES.AlliancesServerUpdate(data);
            (window as any).alliancesViewLeader = (data: string) => ALLIANCES.AlliancesViewLeader(data);
            (window as any).openmap = () => getGLOBAL().ShowMap();
        }
    }

    public onStageRollOver(event: MouseEvent | null = null): void {
        GAME.disableWindowScroll();
    }

    public onStageRollOut(event: MouseEvent | null = null): void {
        GAME.enableWindowScroll();
    }
}
