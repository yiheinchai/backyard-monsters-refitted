import DisplayObject from "openfl/display/DisplayObject";
import DisplayObjectContainer from "openfl/display/DisplayObjectContainer";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import EventDispatcher from "openfl/events/EventDispatcher";
import IEventDispatcher from "openfl/events/IEventDispatcher";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import ExternalInterface from "openfl/external/ExternalInterface";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import navigateToURL from "openfl/net/navigateToURL";
import URLLoader from "openfl/net/URLLoader";
import URLRequest from "openfl/net/URLRequest";
import URLRequestMethod from "openfl/net/URLRequestMethod";
import URLVariables from "openfl/net/URLVariables";
import getTimer from "openfl/utils/getTimer";

import { ABTest } from "./com/cc/tests/ABTest";
import { SecNum } from "./com/cc/utils/SecNum";
import { Timekeeper } from "./com/computus/model/Timekeeper";
import { Rndm } from "./com/gskinner/utils/Rndm";
import { WMBASE } from "./com/monsters/ai/WMBASE";
import { Chat } from "./com/monsters/chat/Chat";
import { BYMConfig } from "./com/monsters/configs/BYMConfig";
import { Console } from "./com/monsters/debug/Console";
import { ImageCache } from "./com/monsters/display/ImageCache";
import { Fire } from "./com/monsters/effects/fire/Fire";
import { Smoke } from "./com/monsters/effects/smoke/Smoke";
import { EnumBaseMode } from "./com/monsters/enums/EnumBaseMode";
import { EnumYardType } from "./com/monsters/enums/EnumYardType";
import { ICoreBuilding } from "./com/monsters/interfaces/ICoreBuilding";
import { ITickable } from "./com/monsters/interfaces/ITickable";
import { InstanceManager } from "./com/monsters/managers/InstanceManager";
import { MapRoom3AssetCache } from "./com/monsters/maproom3/MapRoom3AssetCache";
import { MapRoom3TileSetManager } from "./com/monsters/maproom3/tiles/MapRoom3TileSetManager";
import { CellData } from "./com/monsters/maproom_advanced/CellData";
import { IMapRoomCell } from "./com/monsters/maproom_manager/IMapRoomCell";
import { MapRoomManager } from "./com/monsters/maproom_manager/MapRoomManager";
import { MonsterBase } from "./com/monsters/monsters/MonsterBase";
import { ChampionBase } from "./com/monsters/monsters/champions/ChampionBase";
import { PATHING } from "./com/monsters/pathing/PATHING";
import { Player } from "./com/monsters/player/Player";
import { SiegeFactory } from "./com/monsters/siege/SiegeFactory";
import { SiegeLab } from "./com/monsters/siege/SiegeLab";
import { SiegeWeapons } from "./com/monsters/siege/SiegeWeapons";
import { UI_BOTTOM } from "./com/monsters/ui/UI_BOTTOM";
import { TweenLite, Cubic } from "./gs";
import { URLLoaderApi } from "./URLLoaderApi";
import { GAME } from "./GAME";
import { BFOUNDATION } from "./BFOUNDATION";
import { BRESOURCE } from "./BRESOURCE";
import { BTOWER } from "./BTOWER";
import { BTRAP } from "./BTRAP";
import { BTOTEM } from "./BTOTEM";
import { Bunker } from "./Bunker";
import { BUILDING5 } from "./BUILDING5";
import { BUILDING9 } from "./BUILDING9";
import { BUILDING14 } from "./BUILDING14";
import { BUILDING16 } from "./BUILDING16";
import { CHAMPIONCAGE } from "./CHAMPIONCAGE";
import { INFERNOQUAKETOWER } from "./INFERNOQUAKETOWER";
import { INFERNOYARDPROPS } from "./INFERNOYARDPROPS";
import { OUTPOST_YARD_PROPS } from "./OUTPOST_YARD_PROPS";
import { YARD_PROPS } from "./YARD_PROPS";
import { popup_bg } from "./popup_bg";
import { popup_bg2 } from "./popup_bg2";
import { PROTIP_CLIP } from "./PROTIP_CLIP";
import { ERRORMESSAGE } from "./ERRORMESSAGE";
import { MESSAGE } from "./MESSAGE";
import { KEYS } from "./KEYS";
import { LOGIN } from "./LOGIN";
import { BASE } from "./BASE";
import { MAP } from "./MAP";
import { UI2 } from "./UI2";
import { ATTACK } from "./ATTACK";
import { ACADEMY } from "./ACADEMY";
import { CREATURELOCKER } from "./CREATURELOCKER";
import { CREATURES } from "./CREATURES";
import { CREEPS } from "./CREEPS";
import { EFFECTS } from "./EFFECTS";
import { FIREBALLS } from "./FIREBALLS";
import { HATCHERY } from "./HATCHERY";
import { HATCHERYCC } from "./HATCHERYCC";
import { HOUSING } from "./HOUSING";
import { LOGGER } from "./LOGGER";
import { MAILBOX } from "./MAILBOX";
import { MAPROOM } from "./MAPROOM";
import { MAPROOM_DESCENT } from "./MAPROOM_DESCENT";
import { MAPROOM_INFERNO } from "./MAPROOM_INFERNO";
import { MONSTERBAITER } from "./MONSTERBAITER";
import { MONSTERBUNKER } from "./MONSTERBUNKER";
import { PLEASEWAIT } from "./PLEASEWAIT";
import { POPUPS } from "./POPUPS";
import { POWERUPS } from "./POWERUPS";
import { PROJECTILES } from "./PROJECTILES";
import { QUEUE } from "./QUEUE";
import { SOUNDS } from "./SOUNDS";
import { STORE } from "./STORE";
import { TUTORIAL } from "./TUTORIAL";
import { UPDATES } from "./UPDATES";
import { WMATTACK } from "./WMATTACK";
import { WORKERS } from "./WORKERS";
import { JSON as JSONUtil } from "./JSON";
import { md5 } from "./md5";
import { print } from "./print";

export class GLOBAL {
    public static serverUrl: string = "http://localhost:3001/";
    public static cdnUrl: string = "http://localhost:3001/";
    public static apiVersionSuffix: string = "v1.4.3-beta";
    public static connectionCounter: number;
    public static connectionLost: boolean = false;
    public static _local: boolean = false;
    public static _save: boolean = true;
    public static textContentLoaded: boolean = false;
    public static supportedLangsLoaded: boolean = false;
    public static _localMode: number = BYMConfig.k_sLOCAL_MODE_PREVIEW;
    public static _version: SecNum = new SecNum(128);
    public static _softversion: number;
    public static _aiDesignMode: boolean;
    public static readonly DOES_USE_SCROLL: boolean = false;
    public static _mapVersion: number;
    public static _mailVersion: number;
    public static _soundVersion: number;
    public static _languageVersion: number;
    public static _halt: boolean;
    public static _frameNumber: number;
    public static _friendCount: number;
    public static _sessionCount: number;
    public static _addTime: number;
    public static _proTip: PROTIP_CLIP;
    public static _checkPromo: number = 1;
    public static _giveTips: number = 1;
    public static _ROOT: MovieClip;
    public static _layerMap: Sprite;
    public static _layerUI: Sprite;
    public static _layerWindows: Sprite;
    public static _layerMessages: Sprite;
    public static _layerProjectiles: Sprite;
    public static _layerTop: Sprite;
    public static _fluidWidthEnabled: boolean = true;
    public static _SCREENINIT: Rectangle = new Rectangle(0, 0, 760, 670);
    public static _SCREEN: Rectangle;
    public static _SCREENCENTER: Point;
    public static _SCREENHUD: Point;
    public static _SCREENHUDLEFT: Point;
    public static t: number = 0;
    public static _baseURL: string;
    public static _baseURL2: string;
    public static _infBaseURL: string;
    public static _apiURL: string;
    public static _gameURL: string;
    public static _storageURL: string;
    public static languageUrl: string;
    public static _allianceURL: string;
    public static _soundPathURL: string;
    public static _mapURL: string;
    public static _statsURL: string;
    public static _countryCode: string = "us";
    public static _appid: string;
    public static _tpid: string;
    public static _currencyURL: string;
    public static _monetized: number;
    public static _shinyShroomCount: number = 0;
    private static _shinyShrooms: any[] = [];
    public static _shinyShroomValid: boolean = false;
    public static _allianceConquestTime: SecNum = new SecNum(0);
    public static _fbdata: any;
    public static _openBase: any = null;
    public static readonly _degtorad: number = 0.0174532925;
    public static readonly _radtodeg: number = 57.2957795;
    public static _selectedBuilding: BFOUNDATION;
    public static _newBuilding: BFOUNDATION;
    public static _render: boolean;
    private static _mode: string;
    public static _loadmode: string;
    public static readonly e_BASE_MODE: EnumBaseMode = new EnumBaseMode();
    public static _mapWidth: number;
    public static _mapHeight: number;
    public static _resourceNames: string[];
    public static iresourceNames: string[] = ["#r_bone#", "#r_coal#", "#r_sulfur#", "#r_magma#", "#r_shiny#", "#r_time#"];
    private static _bTownhall: BFOUNDATION;
    public static _bRadio: BFOUNDATION;
    public static _bStore: BFOUNDATION;
    public static _bMap: BFOUNDATION;
    public static _bLocker: BFOUNDATION;
    public static _bAcademy: BFOUNDATION;
    public static _bHousing: BFOUNDATION;
    public static _bHatchery: BFOUNDATION;
    public static _bFlinger: BUILDING5;
    public static _bCatapult: BFOUNDATION;
    public static _bHatcheryCC: BUILDING16;
    public static _bJuicer: BUILDING9;
    public static _bBaiter: BFOUNDATION;
    public static _bYardPlanner: BFOUNDATION;
    public static _bSiegeLab: SiegeLab;
    public static _bSiegeFactory: SiegeFactory;
    public static _bChamber: BFOUNDATION;
    public static _bLab: BFOUNDATION;
    public static _bCage: CHAMPIONCAGE;
    public static _bTower: BFOUNDATION;
    public static _bTotem: BTOTEM;
    public static _bTowerCount: number;
    public static _newThings: boolean;
    public static _reloadonerror: boolean;
    public static _catchup: boolean;
    public static _researchTime: number;
    public static _buildTime: number;
    public static _upgradePacking: number;
    public static _hatcheryOverdrive: number;
    public static _hatcheryOverdrivePower: SecNum = new SecNum(0);
    public static _harvesterOverdrive: number;
    public static _harvesterOverdrivePower: SecNum = new SecNum(0);
    public static _extraHousing: number;
    public static _extraHousingPower: SecNum = new SecNum(0);
    public static _lockerOverdrive: number;
    public static _towerOverdrive: SecNum = new SecNum(0);
    public static _monsterOverdrive: SecNum = new SecNum(0);
    public static _attackerMonsterOverdrive: SecNum = new SecNum(0);
    public static _playerMonsterOverdrive: SecNum = new SecNum(0);
    public static _monsterDefenseOverdrive: SecNum = new SecNum(0);
    public static _attackerMonsterDefenseOverdrive: SecNum = new SecNum(0);
    public static _playerMonsterDefenseOverdrive: SecNum = new SecNum(0);
    public static _monsterSpeedOverdrive: SecNum = new SecNum(0);
    public static _attackerMonsterSpeedOverdrive: SecNum = new SecNum(0);
    public static _playerMonsterSpeedOverdrive: SecNum = new SecNum(0);
    public static _designSlots: number;
    public static _creepCount: number;
    public static _timekeeper: Timekeeper;
    public static _buildingProps: any[];
    public static readonly k_STAGE_FPS: number = 24;
    public static _fps: number;
    public static _FPSframecount: number = 0;
    public static _FPStimestamp: number;
    public static _FPSarray: any[] = [];
    public static _mapHome: Point;
    public static _mapOutpost: any[] = [];
    public static _mapOutpostIDs: any[] = [];
    public static _wmCreaturePowerups: any[] = [];
    public static _wmCreatureLevels: any[] = [];
    public static _playerGuardianData: any[] = [];
    public static _playerCatapultLevel: SecNum = new SecNum(0);
    public static _playerFlingerLevel: SecNum = new SecNum(0);
    public static _attackersResources: any;
    public static _hpAttackersResources: any;
    public static _attackersCredits: SecNum;
    public static _attackersFlinger: number;
    public static _attackersCatapult: number;
    public static _currentCell: IMapRoomCell;
    public static _empireDestroyed: number;
    public static _empireDestroyedShown: boolean;
    public static _savedAttackersDeltaResources: any;
    public static _attackersDeltaResources: any;
    public static _attackerMapResources: any = {};
    public static _attackerCellsInRange: CellData[] = [];
    public static _attackerMapCreaturesStart: any = {};
    public static _homeBaseID: number;
    public static _showMapWaiting: number = 0;
    public static _nextOutpostWaiting: number = 0;
    public static _toggleYardWaiting: number = 0;
    public static _resources: any = {};
    public static _hpResources: any = {};
    public static _yardResources: any = {};
    public static _loops: number = 10;
    public static _maxLoops: number = 800;
    public static _loopsBanked: number = 0;
    public static lastTime: number;
    public static _zoomed: boolean = false;
    public static _timePlayed: number = 0;
    public static _flags: any;
    public static _unreadMessages: number;
    public static _promptedInvite: boolean = false;
    public static _promptedAFK: boolean = false;
    public static _canInvite: boolean = false;
    public static _canGift: boolean = false;
    public static _whatsnewid: number = 0;
    public static _lastWhatsNew: number = 1048;
    public static _mr2TutorialId: number;
    public static _afktimer: SecNum = new SecNum(0);
    public static _oldMousePoint: Point = new Point(0, 0);
    public static _otherStats: any = {};
    public static _baseLoads: number = 0;
    public static _averageAltitude: SecNum = new SecNum(125);
    public static _outpostCapacity: SecNum;
    public static _displayedPromoNew: boolean;
    public static readonly _fbPromoTimer: number = 60 * 60 * 24 * 7;
    public static _fbcncp: number;
    public static _credits: SecNum;
    public static readonly ERROR_OOPS_ONLY: number = 0;
    public static readonly ERROR_OOPS_AND_ORANGE_BOX: number = 1;
    public static readonly ERROR_ORANGE_BOX_ONLY: number = 2;
    public static readonly TIME_ELAPSED_THRESHHOLD: number = 300000;
    public static eventDispatcher: EventDispatcher = new EventDispatcher();
    public static debugLogJSCalls: boolean = false;
    public static m_mapRoomFunctional: boolean = true;
    public static _showStreamlinedSpeedUps: boolean = false;
    public static _magnification: number = 1;
    public static __: number;
    public static ___: number;
    private static _blockerList: any[] = [];
    private static readonly _MAGNIFICATION_BOUNDS: Point = new Point(0.6, 2.75);
    private static _player: Player;
    private static _attackingPlayer: Player;
    public static k_MAX_NUMBER_OF_OUTPOSTS: number = 3500;
    public static _buildingMousedOver: BFOUNDATION;
    private static tickables: ITickable[] = [];
    private static fastTickables: ITickable[] = [];
    public static initError: string = "";
    public static versionMismatch: boolean = false;

    constructor() {
        // Empty constructor
    }

    public static init(): void {
        new URLLoaderApi().load(GLOBAL.serverUrl + "init", [["apiVersion", GLOBAL.apiVersionSuffix]], (serverData: any): void => {
            const stage = GAME._instance.stage;
            if (serverData.hasOwnProperty("error")) {
                GLOBAL.initError = serverData.error;
                GLOBAL.versionMismatch = !!serverData.versionMismatch;
                GLOBAL.eventDispatcher.dispatchEvent(new Event("initError"));
                return;
            }
            GLOBAL.LanguageSetup();
            if (serverData.hasOwnProperty("debugMode")) {
                GLOBAL._aiDesignMode = serverData.debugMode;
                Console.initialize(stage);
            }
        }, (error: IOErrorEvent): void => {
            GLOBAL.initError = "Failed to connect to the server.";
            GLOBAL.eventDispatcher.dispatchEvent(new Event("initError"));
        });
    }

    public static CheckNetworkConnection(event: TimerEvent): void {
        const url = GLOBAL.serverUrl + "connection";
        const request = new URLRequest(url);
        request.method = URLRequestMethod.GET;
        const loader = new URLLoader();

        const onComplete = (event: Event): void => {
            loader.removeEventListener(Event.COMPLETE, onComplete);
            loader.removeEventListener(IOErrorEvent.IO_ERROR, onError);
            GLOBAL.connectionLost = false;
        };

        const onError = (event: IOErrorEvent): void => {
            loader.removeEventListener(Event.COMPLETE, onComplete);
            loader.removeEventListener(IOErrorEvent.IO_ERROR, onError);
            GLOBAL.connectionLost = true;
            POPUPS.NoConnection();
        };

        loader.addEventListener(Event.COMPLETE, onComplete);
        loader.addEventListener(IOErrorEvent.IO_ERROR, onError);

        try {
            loader.load(request);
        } catch (error) {
            GLOBAL.connectionLost = true;
            POPUPS.NoConnection();
        }
    }

    public static LanguageSetup(): void {
        const token = GAME.sharedObj.data.token;
        const language = GAME.sharedObj.data.language;
        KEYS._storageURL = GLOBAL.languageUrl;
        KEYS.GetSupportedLanguages();

        if (token) {
            KEYS.Setup(language);
        } else {
            KEYS.Setup("english");
        }
    }

    public static get townHall(): BFOUNDATION {
        return GLOBAL._bTownhall;
    }

    public static setTownHall(building: ICoreBuilding): void {
        const foundation = building as BFOUNDATION;
        if (foundation || !building) {
            GLOBAL._bTownhall = foundation;
        }
    }

    public static get player(): Player {
        return GLOBAL._player;
    }

    public static set player(value: Player) {
        GLOBAL._player = value;
    }

    public static get attackingPlayer(): Player {
        return GLOBAL._attackingPlayer;
    }

    public static set attackingPlayer(value: Player) {
        GLOBAL._attackingPlayer = value;
        if (GLOBAL._attackingPlayer && GLOBAL._attackingPlayer !== GLOBAL.player) {
            GLOBAL._attackingPlayer.isAttacking = true;
        }
    }

    public static get mode(): string {
        return GLOBAL._mode;
    }

    public static setMode(value: string): void {
        GLOBAL._mode = value;
    }

    public static get isInAttackMode(): boolean {
        return GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK ||
               GLOBAL.mode === GLOBAL.e_BASE_MODE.IWMATTACK ||
               GLOBAL.mode === GLOBAL.e_BASE_MODE.IATTACK ||
               GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK;
    }

    public static SetBuildingProps(): void {
        switch (BASE.yardType) {
            case EnumYardType.INFERNO_YARD:
                GLOBAL._buildingProps = INFERNOYARDPROPS._infernoYardProps;
                break;
            case EnumYardType.OUTPOST:
                GLOBAL._buildingProps = OUTPOST_YARD_PROPS._outpostProps;
                break;
            default:
                GLOBAL._buildingProps = YARD_PROPS._yardProps;
                if (!MapRoomManager.instance.isInMapRoom3) {
                    GLOBAL.changeNotMaproom3SpecificBuildings();
                }
        }
    }

    private static changeNotMaproom3SpecificBuildings(): void {
        // Cost and property overrides for non-MapRoom3 mode
        // Implementation simplified - full costs defined in YARD_PROPS
    }

    public static isInfernoMode(mode: string): boolean {
        return mode === GLOBAL.e_BASE_MODE.IBUILD ||
               mode === GLOBAL.e_BASE_MODE.IVIEW ||
               mode === GLOBAL.e_BASE_MODE.IATTACK ||
               mode === GLOBAL.e_BASE_MODE.IHELP ||
               mode === GLOBAL.e_BASE_MODE.IWMVIEW ||
               mode === GLOBAL.e_BASE_MODE.IWMATTACK;
    }

    public static isValidMode(mode: string): boolean {
        return mode === GLOBAL.e_BASE_MODE.BUILD ||
               mode === GLOBAL.e_BASE_MODE.ATTACK ||
               mode === GLOBAL.e_BASE_MODE.WMATTACK ||
               mode === GLOBAL.e_BASE_MODE.VIEW ||
               mode === GLOBAL.e_BASE_MODE.WMVIEW ||
               mode === GLOBAL.e_BASE_MODE.HELP ||
               mode === GLOBAL.e_BASE_MODE.IBUILD ||
               mode === GLOBAL.e_BASE_MODE.IVIEW ||
               mode === GLOBAL.e_BASE_MODE.IATTACK ||
               mode === GLOBAL.e_BASE_MODE.IHELP ||
               mode === GLOBAL.e_BASE_MODE.IWMVIEW ||
               mode === GLOBAL.e_BASE_MODE.IWMATTACK;
    }

    public static infernoToDefaultMode(mode: string): string {
        switch (mode) {
            case GLOBAL.e_BASE_MODE.IBUILD: return GLOBAL.e_BASE_MODE.BUILD;
            case GLOBAL.e_BASE_MODE.IVIEW: return GLOBAL.e_BASE_MODE.VIEW;
            case GLOBAL.e_BASE_MODE.IATTACK: return GLOBAL.e_BASE_MODE.ATTACK;
            case GLOBAL.e_BASE_MODE.IHELP: return GLOBAL.e_BASE_MODE.HELP;
            case GLOBAL.e_BASE_MODE.IWMVIEW: return GLOBAL.e_BASE_MODE.WMVIEW;
            case GLOBAL.e_BASE_MODE.IWMATTACK: return GLOBAL.e_BASE_MODE.WMATTACK;
            default: return mode;
        }
    }

    public static Setup(baseMode: string = "build"): void {
        GLOBAL.player = new Player();
        GLOBAL._loadmode = baseMode;
        GLOBAL.connectionCounter = 0;
        
        if (GLOBAL.isValidMode(baseMode)) {
            GLOBAL.setMode(GLOBAL.infernoToDefaultMode(baseMode));
        }
        
        GLOBAL._fps = 40;
        GLOBAL._FPSframecount = 0;
        GLOBAL._FPSarray = [];
        GLOBAL._FPStimestamp = 0;
        
        ImageCache.prependImagePath = GLOBAL._storageURL;
        MapRoom3AssetCache.instance.Load();
        
        const defaultTileSet = MapRoom3TileSetManager.DEFAULT_TILE_SET;
        MapRoom3TileSetManager.instance.SetCurrentTileSet(defaultTileSet);
        
        if (!GLOBAL._timekeeper) {
            GLOBAL._timekeeper = new Timekeeper();
        }
        GLOBAL._timekeeper.startTicking();
        
        GLOBAL._halt = false;
        GLOBAL._mapWidth = 800;
        GLOBAL._mapHeight = 800;
        GLOBAL._zoomed = false;
        GLOBAL._averageAltitude = new SecNum(125);
        GLOBAL._outpostCapacity = new SecNum(2000000);
        GLOBAL._attackersCatapult = 0;
        GLOBAL._attackersFlinger = 0;
        
        GLOBAL._savedAttackersDeltaResources = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
        GLOBAL._attackersDeltaResources = { dirty: false };
        GLOBAL._attackerMonsterOverdrive = new SecNum(0);
        
        // Play appropriate music based on mode
        switch (GLOBAL._loadmode) {
            case GLOBAL.e_BASE_MODE.IATTACK:
            case GLOBAL.e_BASE_MODE.IWMATTACK:
                SOUNDS.PlayMusic("musiciattack");
                break;
            case GLOBAL.e_BASE_MODE.IBUILD:
            case GLOBAL.e_BASE_MODE.IHELP:
            case GLOBAL.e_BASE_MODE.IVIEW:
                SOUNDS.PlayMusic("musicibuild");
                break;
            case GLOBAL.e_BASE_MODE.ATTACK:
            case GLOBAL.e_BASE_MODE.WMATTACK:
                SOUNDS.PlayMusic("musicattack");
                break;
            default:
                SOUNDS.PlayMusic("musicbuild");
        }
        
        GLOBAL._render = false;
        GLOBAL._creepCount = 0;
        GLOBAL._timePlayed = 0;
        
        if (GLOBAL._loadmode === GLOBAL._mode) {
            GLOBAL._resourceNames = ["#r_twigs#", "#r_pebbles#", "#r_putty#", "#r_goo#", "#r_shiny#", "#r_time#"];
        } else {
            GLOBAL._resourceNames = GLOBAL.iresourceNames;
        }
        
        BASE.Setup();
    }

    public static Clear(): void {
        GLOBAL._bBaiter = null;
        GLOBAL._bFlinger = null;
        GLOBAL._bCatapult = null;
        GLOBAL._bHatchery = null;
        GLOBAL._bHatcheryCC = null;
        GLOBAL._bHousing = null;
        GLOBAL._bJuicer = null;
        GLOBAL._bLocker = null;
        GLOBAL._bTower = null;
        GLOBAL._bMap = null;
        GLOBAL._bStore = null;
        GLOBAL._bTotem = null;
        GLOBAL._bTownhall = null;
        GLOBAL._bRadio = null;
        GLOBAL._bSiegeLab = null;
        GLOBAL._bSiegeFactory = null;
        GLOBAL._bCage = null;
        GLOBAL.tickables = [];
        GLOBAL.fastTickables = [];
    }

    public static WaitShow(message: string = ""): void {
        PLEASEWAIT.Show(KEYS.Get("wait_processing"));
    }

    public static WaitHide(): void {
        PLEASEWAIT.Hide();
    }

    public static Tick(): void {
        GLOBAL.connectionCounter += 1;
        if (GLOBAL.connectionCounter % 5 === 0) {
            GLOBAL.CheckNetworkConnection(null);
        }
        
        if (!GLOBAL._halt && !GLOBAL._catchup) {
            GLOBAL.t += 1;
            
            if (MapRoomManager.instance.isOpen) {
                MapRoomManager.instance.Tick();
                LOGGER.Tick();
                MAILBOX.Tick();
                GLOBAL.AFK();
            } else {
                MapRoomManager.instance.CheckForAndForceUpgradeFromMapRoom1();
                GLOBAL._timePlayed++;
                
                for (let i = 0; i < GLOBAL.tickables.length - 1; i++) {
                    GLOBAL.tickables[i].tick();
                }
                
                const foundations = InstanceManager.getInstancesByClass(BFOUNDATION);
                for (const foundation of foundations) {
                    (foundation as BFOUNDATION).Tick(1);
                }
                
                HOUSING.catchupTick(1);
                UPDATES.Check();
                CREATURELOCKER.Tick();
                HATCHERY.Tick();
                HATCHERYCC.Tick();
                STORE.ProcessPurchases();
                BASE.Tick();
                HOUSING.Update();
                ACADEMY.Tick();
                
                if (GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) {
                    ATTACK.Tick();
                }
                
                QUEUE.Tick();
                UI2.Update();
                LOGGER.Tick();
                MAILBOX.Tick();
                GLOBAL.AFK();
                MONSTERBAITER.Tick();
                MONSTERBUNKER.Tick();
                
                if (GLOBAL._mode === GLOBAL.e_BASE_MODE.WMATTACK || GLOBAL._mode === GLOBAL.e_BASE_MODE.WMVIEW) {
                    WMBASE.Tick();
                }
            }
        }
    }

    public static addTickable(tickable: ITickable): void {
        GLOBAL.tickables.push(tickable);
    }

    public static removeTickable(tickable: ITickable): void {
        const index = GLOBAL.tickables.indexOf(tickable);
        if (index >= 0) {
            GLOBAL.tickables.splice(index, 1);
        }
    }

    public static addFastTickable(tickable: ITickable): void {
        GLOBAL.fastTickables.push(tickable);
    }

    public static removeFastTickable(tickable: ITickable): void {
        const index = GLOBAL.fastTickables.indexOf(tickable);
        if (index >= 0) {
            GLOBAL.fastTickables.splice(index, 1);
        }
    }

    public static TickFast(e: Event): void {
        if (!GLOBAL._halt) {
            SOUNDS.Tick();
            MapRoomManager.instance.TickFast();
            
            if (GLOBAL._render) {
                const now = getTimer();
                
                if (!MapRoomManager.instance.isOpen) {
                    for (let i = 0; i < GLOBAL._loops; i++) {
                        GLOBAL._render = (i === GLOBAL._loops - 1);
                        
                        if (CREEPS._creepCount > 0 || SiegeWeapons.activeWeapon) {
                            CREEPS.Tick();
                            
                            const towers = InstanceManager.getInstancesByClass(BTOWER);
                            for (const tower of towers) {
                                (tower as BFOUNDATION).TickAttack();
                            }
                            
                            const traps = InstanceManager.getInstancesByClass(BTRAP);
                            for (const trap of traps) {
                                (trap as BTRAP).TickAttack();
                            }
                            
                            const bunkers = InstanceManager.getInstancesByClass(Bunker);
                            for (const bunker of bunkers) {
                                (bunker as Bunker).TickAttack();
                            }
                        }
                        
                        CREATURES.Tick();
                        
                        for (let j = GLOBAL.fastTickables.length - 1; j >= 0; j--) {
                            GLOBAL.fastTickables[j].tick();
                        }
                        
                        PROJECTILES.Tick();
                        FIREBALLS.Tick();
                    }
                }
                
                GLOBAL._frameNumber++;
                
                if (!MapRoomManager.instance.isOpen) {
                    WORKERS.Tick();
                    EFFECTS.Tick();
                    WMATTACK.Tick();
                    MAPROOM.Tick();
                    PATHING.Tick();
                    Smoke.Tick();
                    Fire.Tick();
                    BASE.ShakeB();
                    GLOBAL._player.tick();
                }
                
                if (!TUTORIAL.hasFinished) {
                    TUTORIAL.Tick();
                }
            }
        }
    }

    public static Timestamp(): number {
        return GLOBAL.t;
    }

    public static ShowMap(e: MouseEvent = null): void {
        if (!BASE._loading) {
            if (BASE.isInfernoMainYardOrOutpost) {
                BASE._needCurrentCell = false;
                MAPROOM_INFERNO.Setup();
                MAPROOM_INFERNO.Show();
            } else if (MapRoomManager.instance.isInMapRoom2or3) {
                BASE._needCurrentCell = false;
                MapRoomManager.instance.SetupAndShow();
            } else {
                MAPROOM.Setup();
                MAPROOM.Show();
            }
        }
    }

    public static isMapOpen(): boolean {
        return MAPROOM_INFERNO._open || MapRoomManager.instance.isOpen || MAPROOM._open;
    }

    public static ToTime(totalSeconds: number, includeDays: boolean = false, includeHours: boolean = true, includeMinutes: boolean = true, includeSeconds: boolean = false): string {
        if (totalSeconds < 0) totalSeconds = 0;
        
        let days = 0, hours = 0, minutes = 0, seconds = 0;
        
        if (totalSeconds >= 86400) {
            days = Math.floor(totalSeconds / 86400);
            totalSeconds -= days * 86400;
        }
        if (totalSeconds >= 3600) {
            hours = Math.floor(totalSeconds / 3600);
            totalSeconds -= hours * 3600;
        }
        if (totalSeconds >= 60) {
            minutes = Math.floor(totalSeconds / 60);
            totalSeconds -= minutes * 60;
        }
        seconds = totalSeconds;
        
        let result = "";
        if (includeDays) {
            if (days) result = days + KEYS.Get("global_days_short") + " ";
            if (hours || days || includeSeconds) result += GLOBAL.DoubleDigit(hours) + KEYS.Get("global_hours_short") + " ";
            if (minutes || hours || days || includeSeconds) result += GLOBAL.DoubleDigit(minutes) + KEYS.Get("global_minutes_short") + " ";
            if (includeHours || days + hours + minutes === 0 || includeSeconds) result += GLOBAL.DoubleDigit(seconds) + KEYS.Get("global_seconds_short");
        } else {
            if (days) result += days + (days > 1 ? KEYS.Get("global_days") : KEYS.Get("global_day")) + " ";
            if (hours || days || includeSeconds) result += hours + (hours > 1 ? KEYS.Get("global_hours") : KEYS.Get("global_hour")) + " ";
            if (minutes || hours || days || includeSeconds) result += minutes + (minutes > 1 ? KEYS.Get("global_minutes") : KEYS.Get("global_minute")) + " ";
            if ((minutes > 0 || hours > 0 || days === 0 || includeSeconds) && (seconds > 0 && (includeHours || days + hours + minutes === 0))) {
                result += GLOBAL.dd(seconds) + KEYS.Get("global_seconds_short");
            }
        }
        return result;
    }

    public static dd(n: number): string {
        return n < 10 ? "0" + n : n.toString();
    }

    public static DoubleDigit(n: number): string {
        return n < 10 ? "0" + n : n.toString();
    }

    public static FormatNumber(n: number): string {
        n = Math.floor(n);
        const str = n.toString();
        const parts: string[] = [];
        let i = str.length;
        while (i > 0) {
            const start = Math.max(i - 3, 0);
            parts.unshift(str.slice(start, i));
            i = start;
        }
        return parts.join(",");
    }

    public static ErrorMessage(message: string = "", errorType: number = 0): Function {
        print(message + "@ " + Console.getSource(3));
        const em = new ERRORMESSAGE();
        em.Show(message, errorType);
        return (e?: MouseEvent): void => {};
    }

    public static Message(text: string, button1Text: string = null, button1Callback: Function = null, button1Params: any[] = null, button2Text: string = null, button2Callback: Function = null, button2Params: any[] = null, type: number = 1, showClose: boolean = true): MESSAGE {
        const msg = new MESSAGE();
        return msg.Show(text, button1Text, button1Callback, button1Params, button2Text, button2Callback, button2Params, type, showClose);
    }

    public static Array2String(arr: any[]): string {
        let result = "";
        for (let i = 0; i < arr.length; i++) {
            result += GLOBAL.FormatNumber(arr[i][0]) + " " + arr[i][1];
            if (i < arr.length - 2) result += ", ";
            if (i === arr.length - 2) result += " and ";
        }
        return result;
    }

    public static getShinyCostFromResourceAmt(amount: number): number {
        return Math.ceil(Math.pow(Math.sqrt(amount / 2), 0.75));
    }

    public static AFK(): void {
        if (!GLOBAL._catchup) {
            if (Math.abs(GLOBAL._ROOT.mouseX - GLOBAL._oldMousePoint.x) > 50 || GLOBAL._afktimer.Get() === 0) {
                GLOBAL._oldMousePoint = new Point(GLOBAL._ROOT.mouseX, GLOBAL._ROOT.mouseY);
                GLOBAL.UpdateAFKTimer();
            }
            if (GLOBAL.Timestamp() - GLOBAL._afktimer.Get() === 60 * 6 && !MapRoomManager.instance.isOpen) {
                POPUPS.AFK();
            } else if (GLOBAL.Timestamp() - GLOBAL._afktimer.Get() > 60 * 10) {
                POPUPS.Timeout();
            }
        }
    }

    public static UpdateAFKTimer(): void {
        GLOBAL._afktimer.Set(GLOBAL.Timestamp());
    }

    public static StatGet(key: string): number {
        return GLOBAL._otherStats[key] || 0;
    }

    public static StatSet(key: string, value: number, save: boolean = true): void {
        if (MapRoomManager.instance.isInMapRoom3 && key === "mrl" && value !== 3) return;
        
        if (!GLOBAL._otherStats) GLOBAL._otherStats = {};
        
        if (value === 0 && GLOBAL._otherStats[key]) {
            delete GLOBAL._otherStats[key];
            if (save) BASE.Save();
        } else if (!GLOBAL._otherStats[key] || GLOBAL._otherStats[key] !== value) {
            GLOBAL._otherStats[key] = value;
            if (save) BASE.Save();
        }
    }

    public static BlockerAdd(layer: Sprite = null): void {
        GLOBAL.RefreshScreen();
        if (!layer) layer = GLOBAL._layerWindows;
        
        const blocker = layer.addChild(new popup_bg()) as DisplayObject;
        blocker.width = GLOBAL._ROOT.stage.stageWidth;
        blocker.height = GLOBAL._ROOT.stage.stageHeight;
        blocker.x = GLOBAL._SCREEN.x;
        blocker.y = GLOBAL._SCREEN.y;
        GLOBAL._blockerList.push(blocker);
    }

    public static BlockerRemove(): void {
        if (GLOBAL._blockerList) {
            const blocker = GLOBAL._blockerList.pop();
            if (blocker && blocker.parent) {
                blocker.parent.removeChild(blocker);
            }
        }
    }

    public static RefreshScreen(): void {
        const width = GLOBAL._ROOT.stage.stageWidth;
        const height = GLOBAL.GetGameHeight();
        const monsterBarHeight = UI2._wildMonsterBar != null ? 40 : 0;
        
        if (!GLOBAL._SCREEN || !GLOBAL._SCREEN.x || !GLOBAL._SCREEN.y || !GLOBAL._SCREEN.width || !GLOBAL._SCREEN.height) {
            GLOBAL._SCREEN = new Rectangle(
                0 - (width - GLOBAL._SCREENINIT.width) / 2,
                0 - (height - (GLOBAL._SCREENINIT.height + monsterBarHeight)) / 2,
                width,
                height
            );
        } else {
            GLOBAL._SCREEN.x = 0 - (width - GLOBAL._SCREENINIT.width) / 2;
            GLOBAL._SCREEN.y = 0 - (height - (GLOBAL._SCREENINIT.height + monsterBarHeight)) / 2;
            GLOBAL._SCREEN.width = width;
            GLOBAL._SCREEN.height = height;
        }
        
        GLOBAL._SCREENCENTER = new Point(GLOBAL._SCREEN.x + GLOBAL._SCREEN.width / 2, GLOBAL._SCREEN.y + GLOBAL._SCREEN.height / 2);
        GLOBAL._SCREENHUD = new Point(GLOBAL._SCREEN.x, GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - 208);
        GLOBAL._SCREENHUDLEFT = new Point(GLOBAL._SCREEN.x, GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - 208);
        
        if (MAP._GROUND) {
            MAP.instance.resizeViewRect();
            BFOUNDATION.updateAllRasterData();
        }
    }

    public static ResizeGame(e: Event): void {
        if (GLOBAL._fluidWidthEnabled && GAME._firstLoadComplete) {
            GLOBAL.RefreshScreen();
            UI2.ResizeHandler(e);
            GLOBAL.ResizeLayer(GLOBAL._layerUI);
            GLOBAL.ResizeLayer(GLOBAL._layerWindows);
            GLOBAL.ResizeLayer(GLOBAL._layerMessages);
            GLOBAL.ResizeLayer(GLOBAL._layerTop);
            if (TUTORIAL._stage < TUTORIAL._endstage) {
                TUTORIAL.Resize();
            }
        } else {
            UI2.ResizeHandler(e);
        }
    }

    public static ResizeLayer(layer: Sprite): void {
        let count = layer.numChildren;
        while (count--) {
            const child = layer.getChildAt(count) as any;
            if (child.hasOwnProperty("Resize")) {
                child.Resize();
            } else if (child instanceof popup_bg || child instanceof popup_bg2) {
                child.width = GLOBAL._SCREEN.width;
                child.height = GLOBAL._SCREEN.height;
                child.x = GLOBAL._SCREEN.x;
                child.y = GLOBAL._SCREEN.y;
            }
        }
    }

    public static GetGameHeight(): number {
        return GLOBAL._ROOT.stage.stageHeight;
    }

    public static get isFullScreen(): boolean {
        return GLOBAL._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN ||
               GLOBAL._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN_INTERACTIVE;
    }

    public static goFullScreen(e: MouseEvent = null): void {
        if (GLOBAL._ROOT.stage.displayState === StageDisplayState.NORMAL) {
            GLOBAL._ROOT.stage.displayState = StageDisplayState.FULL_SCREEN;
            MAP._GROUND.scaleX = MAP._GROUND.scaleY = 1;
        } else {
            GLOBAL._ROOT.stage.displayState = StageDisplayState.NORMAL;
        }
        GLOBAL._zoomed = false;
        GLOBAL.magnification = 1;
        if (MapRoomManager.instance.isOpen) {
            MapRoomManager.instance.ResizeHandler();
        }
    }

    public static Zoom(e: MouseEvent = null): void {
        if (GLOBAL._ROOT.stage.displayState !== StageDisplayState.FULL_SCREEN) {
            BASE.BuildingDeselect();
            MAP.FocusTo(0, 0, 0.4);
            
            if (GLOBAL._zoomed) {
                GLOBAL._zoomed = false;
                TweenLite.to(MAP._GROUND, 0.1, { scaleX: 1, scaleY: 1, ease: Cubic.easeInOut, overwrite: false });
            } else {
                GLOBAL._zoomed = true;
                TweenLite.to(MAP._GROUND, 0.4, { scaleX: 0.5, scaleY: 0.5, ease: Cubic.easeInOut, overwrite: false });
            }
        }
    }

    public static get magnification(): number {
        return GLOBAL._magnification;
    }

    public static set magnification(value: number) {
        if (value === GLOBAL._magnification) return;
        value = Math.max(GLOBAL._MAGNIFICATION_BOUNDS.x, value);
        value = Math.min(GLOBAL._MAGNIFICATION_BOUNDS.y, value);
        TweenLite.to(GLOBAL, 0.25, { _magnification: value, onUpdate: GLOBAL.onMagnificationUpdate });
    }

    private static onMagnificationUpdate(): void {
        MAP._GROUND.scaleX = MAP._GROUND.scaleY = GLOBAL._magnification;
        MAP.Focus(0, 0);
        GLOBAL.RefreshScreen();
        UI_BOTTOM.Resize();
    }

    public static getResourceFrame(resource: string, isInferno: boolean = false): string {
        if (isInferno || BASE.isInfernoMainYardOrOutpost) {
            switch (resource) {
                case "r1": return "bone";
                case "r2": return "coal";
                case "r3": return "sulfur";
                case "r4": return "magma";
                case "shiny": return "shiny2";
                case "time": return "time2";
            }
        } else {
            switch (resource) {
                case "r1": return "twig";
                case "r2": return "pebble";
                case "r3": return "putty";
                case "r4": return "goo";
                case "shiny": return "shiny";
                case "time": return "time";
            }
        }
        return "unknown";
    }

    public static getResourceName(resource: string, isInferno: boolean = false): string {
        const names = isInferno ? GLOBAL.iresourceNames : GLOBAL._resourceNames;
        switch (resource) {
            case "r1": return KEYS.Get(names[0]);
            case "r2": return KEYS.Get(names[1]);
            case "r3": return KEYS.Get(names[2]);
            case "r4": return KEYS.Get(names[3]);
            case "shiny": return KEYS.Get(names[4]);
            case "time": return KEYS.Get(names[5]);
            default: return "???";
        }
    }

    public static NextCreepID(): number {
        GLOBAL._creepCount++;
        return GLOBAL._creepCount;
    }

    public static QuickDistance(p1: Point, p2: Point): number {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static QuickDistanceSquared(p1: Point, p2: Point): number {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    }

    public static isAtHome(): boolean {
        return GLOBAL._mode === "build" && BASE.isMainYardOrInfernoMainYard;
    }

    public static isAtHomeOrInOutpost(): boolean {
        return GLOBAL._mode === "build" && (BASE.isMainYard || BASE.isOutpost);
    }

    public static isDefending(): boolean {
        return GLOBAL._mode === GLOBAL.e_BASE_MODE.BUILD || GLOBAL._mode === GLOBAL.e_BASE_MODE.IBUILD;
    }

    public static isNoob(): boolean {
        return TUTORIAL._stage <= 200 && GLOBAL._sessionCount < 5;
    }

    public static InfernoMode(mode: string = null): boolean {
        const checkMode = mode || GLOBAL._loadmode;
        switch (checkMode) {
            case "ibuild":
            case "iattack":
            case "iview":
            case "ihelp":
            case "iwmattack":
            case "iwmview":
                return true;
            default:
                return false;
        }
    }

    public static SetFlags(serverFlags: any): void {
        GLOBAL._flags = serverFlags;
        GLOBAL._flags.showProgressBar = 0;
    }

    public static get StageX(): number {
        return Math.ceil((760 - GLOBAL._ROOT.stage.stageWidth) / 2);
    }

    public static get StageY(): number {
        return Math.ceil((670 - GLOBAL._ROOT.stage.stageHeight) / 2);
    }

    public static get StageWidth(): number {
        return GLOBAL._ROOT.stage.stageWidth;
    }

    public static get StageHeight(): number {
        return GLOBAL._ROOT.stage.stageHeight;
    }
}
