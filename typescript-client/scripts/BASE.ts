import { SecNum } from './com/cc/utils/SecNum';
import { TRIBES } from './com/monsters/ai/TRIBES';
import { WMBASE } from './com/monsters/ai/WMBASE';
import { ALLIANCES } from './com/monsters/alliances/ALLIANCES';
import { AutoBankManager } from './com/monsters/autobanking/AutoBankManager';
import { BaseBuffHandler } from './com/monsters/baseBuffs/BaseBuffHandler';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { ResourceBombs } from './com/monsters/effects/ResourceBombs';
import { Fire } from './com/monsters/effects/fire/Fire';
import { ParticleText } from './com/monsters/effects/particles/ParticleText';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { MapRoom3 } from './com/monsters/maproom3/MapRoom3';
import { MapRoom3Tutorial } from './com/monsters/maproom3/MapRoom3Tutorial';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { Player } from './com/monsters/player/Player';
import { RasterData } from './com/monsters/rendering/RasterData';
import { RewardHandler } from './com/monsters/rewarding/RewardHandler';
import Point from 'openfl/geom/Point';

import { ACADEMY } from './ACADEMY';
import { ACHIEVEMENTS } from './ACHIEVEMENTS';
import { BlackSpurtzCannon } from './BlackSpurtzCannon';
import { CHECKER } from './CHECKER';
import { SiegeFactory } from './com/monsters/siege/SiegeFactory';
import { SiegeLab } from './com/monsters/siege/SiegeLab';
import { CUSTOMATTACKS } from './CUSTOMATTACKS';
import { GAME } from './GAME';
import { GIFTS } from './GIFTS';
import { INFERNO_DESCENT_POPUPS } from './INFERNO_DESCENT_POPUPS';
import { MAPROOM } from './MAPROOM';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { MAPROOM_INFERNO } from './MAPROOM_INFERNO';
import { MARKETING } from './MARKETING';
import { MONSTERBAITER } from './MONSTERBAITER';
import { MUSHROOMS } from './MUSHROOMS';
import { NewPopupSystem } from './NewPopupSystem';
import { PLEASEWAIT } from './PLEASEWAIT';
import { POWERUPS } from './POWERUPS';
import { PROJECTILES } from './PROJECTILES';
import { SPECIALEVENT_WM1 } from './SPECIALEVENT_WM1';
import { WORKERS } from './WORKERS';
import { BaseTemplate } from './com/monsters/baseplanner/BaseTemplate';
import { BaseTemplateNode } from './com/monsters/baseplanner/BaseTemplateNode';
import { PlannerTemplate } from './com/monsters/baseplanner/PlannerTemplate';

// Lazy imports to break circular dependency chains
function getBuildingOverlay(): any { return require("./com/monsters/display/BuildingOverlay").BuildingOverlay; }
function getSmoke(): any { return require("./com/monsters/effects/smoke/Smoke").Smoke; }
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getInventoryManager(): any { return require("./com/monsters/inventory/InventoryManager").InventoryManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getPATHING(): any { return require("./com/monsters/pathing/PATHING").PATHING; }
function getSiegeWeapons(): any { return require("./com/monsters/siege/SiegeWeapons").SiegeWeapons; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBTOWER(): any { return require("./BTOWER").BTOWER; }
function getBTRAP(): any { return require("./BTRAP").BTRAP; }
function getBUILDINGINFO(): any { return require("./BUILDINGINFO").BUILDINGINFO; }
function getBWALL(): any { return require("./BWALL").BWALL; }
function getBunker(): any { return require("./Bunker").Bunker; }
function getBUILDING14(): any { return require("./BUILDING14").BUILDING14; }
function getBUILDING15(): any { return require("./BUILDING15").BUILDING15; }
function getBUILDING6(): any { return require("./BUILDING6").BUILDING6; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getEFFECTS(): any { return require("./EFFECTS").EFFECTS; }
function getFIREBALLS(): any { return require("./FIREBALLS").FIREBALLS; }
function getGIBLETS(): any { return require("./GIBLETS").GIBLETS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getGRID(): any { return require("./GRID").GRID; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getHOUSINGBUNKER(): any { return require("./HOUSINGBUNKER").HOUSINGBUNKER; }
function getINFERNO_MAGMA_TOWER(): any { return require("./INFERNO_MAGMA_TOWER").INFERNO_MAGMA_TOWER; }
function getINFERNOQUAKETOWER(): any { return require("./INFERNOQUAKETOWER").INFERNOQUAKETOWER; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getQUEUE(): any { return require("./QUEUE").QUEUE; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getResourcePackages(): any { return require("./ResourcePackages").ResourcePackages; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }
function getSPRITES(): any { return require("./SPRITES").SPRITES; }
function getSpurtzCannon(): any { return require("./SpurtzCannon").SpurtzCannon; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTargeting(): any { return require("./Targeting").Targeting; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getUI2(): any { return require("./UI2").UI2; }
function getUPDATES(): any { return require("./UPDATES").UPDATES; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }


/**
 * BASE - Core game base management class
 * Handles loading, saving, building, processing of the game base
 * Converted from ActionScript to TypeScript (6671 lines original)
 */
export class BASE {
    // Base identification
    public static _baseID: number = 0;
    public static _wmID: number = 0;
    public static _loadedBaseID: number = 0;
    public static _loadedFriendlyBaseID: number = 0;
    public static _loadedFBID: number = 0;
    public static _baseSeed: number = 0;
    public static _baseName: string = "";
    public static _baseLevel: number = 0;
    public static _baseValue: number = 0;
    public static _basePoints: number = 0;
    public static _outpostValue: number = 0;
    public static _userID: number = 0;
    public static _allianceID: number = 0;
    
    // Resources
    public static _resources: any = {};
    public static _hpResources: any = {};
    public static _deltaResources: any = {};
    public static _hpDeltaResources: any = {};
    public static _savedDeltaResources: any = {};
    public static _ideltaResources: any = null;
    public static _iresources: any = null;
    public static _bankedValue: number = 0;
    public static _bankedTime: number = 0;
    
    // Credits
    public static _credits: SecNum = new SecNum(0);
    public static _hpCredits: number = 0;
    
    // GIP (Generated In Production)
    public static _GIP: any = {};
    public static _processedGIP: any = {};
    public static _rawGIP: any = {};
    public static _lastProcessedGIP: number = 0;
    
    // Saving/Loading state
    public static _blockSave: boolean = false;
    public static _saveCounterA: number = 0;
    public static _saveCounterB: number = 0;
    public static _saving: boolean = false;
    public static _paging: boolean = false;
    public static _lastSaveID: number = 0;
    public static _attackID: number = 0;
    public static _lastSaved: number = 0;
    public static _lastSaveRequest: number = 0;
    public static _saveOver: number = 0;
    public static _returnHome: boolean = false;
    public static _saveProtect: number = 0;
    public static _saveErrors: number = 0;
    public static _pageErrors: number = 0;
    public static _loadTime: number = 0;
    public static _loading: boolean = false;
    public static _infernoSaveLoad: boolean = false;
    public static _lastPaged: number = 0;
    
    // Processing state
    public static _lastProcessed: number = 0;
    public static _lastProcessedB: number = 0;
    public static _catchupTime: number = 0;
    public static _currentTime: number = 0;
    public static _processing: boolean = false;
    public static _timer: number = 0;
    private static s_processing: boolean = false;
    private static _tmpPercent: number = 0;
    
    // Building data
    public static _baseData: any[] = [];
    public static _upgradeData: any = {};
    public static _buildingCount: number = 0;
    public static _buildingHealthData: any = {};
    public static _buildingData: any = {};
    public static _buildingsAll: any = {};
    public static _buildingsWalls: any = {};
    public static _buildingsTowers: any = {};
    public static _buildingsBunkers: any = {};
    public static _buildingsHousing: any[] = [];
    public static _buildingsMain: any = {};
    public static _buildingsMushrooms: any = {};
    public static _buildingsGifts: any = {};
    public static _buildingsStored: any = {};
    public static buildings: BFOUNDATION[] = [];
    public static _buildingCounts: any = {};
    public static _buildingStatsToggle: boolean = false;
    
    // Monster data
    public static _rawMonsters: any = {};
    
    // Mushroom data
    public static _mushroomList: any[] = [];
    public static _lastSpawnedMushroom: number = 0;
    
    // Map/Visual settings
    public static _size: number = 400;
    public static _angle: number = 0.8;
    public static _shakeCountdown: number = 0;
    
    // Attack tracking
    public static _attackerArray: any[] = [];
    public static _attackerNameArray: any[] = [];
    public static _currentAttacks: any[] = [];
    public static _attacksModified: boolean = false;
    
    // Temporary data
    public static _tempLoot: any = {};
    public static _tempGifts: any[] = [];
    public static _tempSentGifts: any[] = [];
    public static _tempSentInvites: any[] = [];
    
    // Protection/Status flags
    public static _isProtected: number = 0;
    public static _isReinforcements: number = 0;
    public static _isSanctuary: number = 0;
    public static _isFan: number = 0;
    public static _isBookmarked: number = 0;
    public static _installsGenerated: number = 0;
    
    // Owner info
    public static _ownerName: string = "";
    public static _ownerPic: string = "";
    
    // Pending operations
    public static _pendingPurchase: any[] = [];
    public static _pendingPromo: number = 0;
    public static _pendingFBPromo: number = 0;
    public static _pendingFBPromoIDs: any[] = [];
    public static _salePromoTime: number = 0;
    public static _loadBase: any[] = [];
    
    // Damage tracking
    public static _percentDamaged: number = 0;
    public static _damagedBaseWarnTime: number = 0;
    
    // Takeover
    public static _takeoverFirstOpen: number = 0;
    public static _takeoverPreviousOwnersName: string = "";
    
    // Siege data
    private static _oldSiegeData: any = {};
    
    // Load object
    public static loadObject: any = {};
    
    // Alliance armament
    public static _allianceArmamentTime: SecNum = new SecNum(0);
    
    // Resource cells
    private static s_resourceCells: any = {};
    
    // Yard type
    public static _loadedYardType: number = 0;
    private static m_yardType: number = EnumYardType.MAIN_YARD;
    
    // First load flag
    protected static _firstBaseLoaded: boolean = true;
    
    // User digits
    public static _userDigits: number[] = [];
    
    // Guardian data
    public static _guardianData: any[] = [];
    
    // Event bases
    public static s_eventBases: number[] = [];
    
    // UI state
    public static _showingWhatsNew: boolean = false;
    public static _needCurrentCell: boolean = false;
    public static _currentCellLoc: { x: number, y: number } | null = null;
    
    // Level progression data
    private static readonly s_levels: number[] = [
        0, 900, 3500, 5000, 7500, 10500, 14700, 20580, 28812, 40337, 56472, 79060, 
        110684, 154958, 216941, 303717, 425204, 595286, 833401, 1166761, 1633465, 
        2286851, 3201591, 4482228, 6275119, 8785167, 12299234, 17218927, 24106498, 
        33749097, 47248736, 66148230, 92607522, 129650530, 181510743, 254115040, 
        355761056, 498065478, 697291669, 976208337, 1366691671, 1913368339, 
        2678715675, 3750201945, 5250282723, 7350395812, 10290554137, 14406775792, 
        20169486109, 28237280553, 39532192774, 55345069884, 77483097838, 
        108476336973, 151866871762, 212613620467, 297659068653, 357190880000, 
        428629050000, 514354860000, 617225830000, 740670990000, 888805180000, 
        1066566210000, 1279879450000, 1535853400000, 1843026400000, 2211631680000, 
        2653958010000, 3184749610000, 3821699530000, 4586039430000, 5503247310000, 
        6603896770000, 7924676120000, 9509611340000, 11411533600000, 13693840320000, 
        16432608380000, 19719130050000, 23662956060000, 28395547270000, 
        34074656720000, 40889588060000, 49067505670000, 58881006800000, 
        70657208160000, 84788649790000, 101746379740000, 122095655680000, 
        146514786810000, 175817744170000, 210981293000000, 253177551600000, 
        303813061920000, 364575674300000, 437490809160000, 524988970990000, 
        629986765180000, 755984118210000
    ];
    
    private static _loadedSomething: boolean = false;
    private static _addtionalLoadArguments: any[] = [];
    
    constructor() {
        BASE._baseID = 0;
        BASE.Setup();
        BASE.Load();
    }
    
    // Property getters/setters
    public static get yardType(): number {
        return BASE.m_yardType;
    }
    
    public static set yardType(value: number) {
        BASE.m_yardType = value;
    }
    
    public static get firstBaseLoaded(): boolean {
        return BASE._firstBaseLoaded;
    }
    
    public static get processing(): boolean {
        return BASE.s_processing;
    }
    
    public static get resourceCells(): any {
        return BASE.s_resourceCells;
    }
    
    // Yard type helpers
    public static get isMainYard(): boolean {
        return BASE.m_yardType === EnumYardType.MAIN_YARD;
    }
    
    public static get isOutpost(): boolean {
        return BASE.m_yardType === EnumYardType.OUTPOST || 
               BASE.m_yardType === EnumYardType.INFERNO_OUTPOST;
    }
    
    public static get isInfernoMainYardOrOutpost(): boolean {
        return BASE.m_yardType === EnumYardType.INFERNO_YARD || 
               BASE.m_yardType === EnumYardType.INFERNO_OUTPOST;
    }
    
    public static get isMainYardOrInfernoMainYard(): boolean {
        return BASE.m_yardType === EnumYardType.MAIN_YARD || 
               BASE.m_yardType === EnumYardType.INFERNO_YARD;
    }
    
    public static get isOutpostOrInfernoOutpost(): boolean {
        return BASE.m_yardType === EnumYardType.OUTPOST || 
               BASE.m_yardType === EnumYardType.INFERNO_OUTPOST;
    }
    
    public static get isOutpostMapRoom2Only(): boolean {
        return BASE.m_yardType === EnumYardType.OUTPOST;
    }
    
    public static get isOutpostInfernoOnly(): boolean {
        return BASE.m_yardType === EnumYardType.INFERNO_OUTPOST;
    }
    
    public static get isMainYardInfernoOnly(): boolean {
        return BASE.m_yardType === EnumYardType.INFERNO_YARD;
    }
    
    public static Setup(): void {
        BASE._buildingsHousing = [];
        BASE._buildingsBunkers = {};
        BASE._pendingPurchase = [];
        BASE._buildingCount = 0;
        BASE._processing = false;
        BASE._buildingStatsToggle = false;
        BASE._angle = 0.8;
        BASE._lastPaged = 0;
        BASE._blockSave = false;
        BASE._damagedBaseWarnTime = 0;
        BASE._saveCounterA = 0;
        BASE._saveCounterB = 0;
        BASE._saveOver = 0;
        BASE._returnHome = false;
        BASE._saveProtect = 0;
        BASE._saving = false;
        BASE._paging = false;
        BASE._saveErrors = 0;
        BASE._currentAttacks = [];
        BASE._attacksModified = false;
        BASE._pageErrors = 0;
        BASE._lastSaved = 0;
        BASE._infernoSaveLoad = false;
        BASE._isProtected = 0;
        BASE._isReinforcements = 0;
        BASE._isSanctuary = 0;
        BASE._isFan = 0;
        BASE._isBookmarked = 0;
        BASE._installsGenerated = 0;
        
        BASE._ideltaResources = {
            dirty: false,
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0),
            r1max: 0,
            r2max: 0,
            r3max: 0,
            r4max: 0
        };
        
        BASE._iresources = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0),
            r1max: 0,
            r2max: 0,
            r3max: 0,
            r4max: 0
        };
        
        BASE._deltaResources = {
            dirty: false,
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
        
        BASE._hpDeltaResources = {
            dirty: false,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
        };
        
        BASE._savedDeltaResources = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
        
        BASE._loadBase = [];
        getGLOBAL().Clear();
    }
    
    public static Cleanup(): void {
        getSPECIALEVENT().ClearWildMonsterPowerups();
        SPECIALEVENT_WM1.ClearWildMonsterPowerups();
        BaseBuffHandler.instance.clearBuffs();
        RewardHandler.instance.clear();
        getGLOBAL().player.clear();
        
        if (getGLOBAL().attackingPlayer) {
            getGLOBAL().attackingPlayer.clear();
        }
        
        getCREATURES().Clear();
        getCREEPS().Clear();
        getInstanceManager().clearAll();
        
        BASE.buildings = [];
        BASE._buildingsAll = {};
        BASE._buildingsWalls = {};
        BASE._buildingsTowers = {};
        BASE._buildingsMain = {};
        BASE._buildingsMushrooms = {};
        BASE._buildingsGifts = {};
        BASE._buildingsStored = {};
        
        getGLOBAL().setTownHall(null);
        getGLOBAL()._bAcademy = null;
        getGLOBAL()._bBaiter = null;
        getGLOBAL()._bFlinger = null;
        getGLOBAL()._bHatchery = null;
        getGLOBAL()._bHatcheryCC = null;
        getGLOBAL()._bHousing = null;
        getGLOBAL()._bJuicer = null;
        getGLOBAL()._bLocker = null;
        getGLOBAL()._bMap = null;
        getGLOBAL()._bStore = null;
        
        getUI2().Hide("warning");
        getUI2().Hide("scareAway");
        getWMATTACK()._inProgress = false;
        MONSTERBAITER._scaredAway = false;
        CUSTOMATTACKS._started = false;
        getWMATTACK()._queued = null;
        
        getGRID().Cleanup();
        getPATHING().Cleanup();
        RasterData.clear();
        
        BASE._showingWhatsNew = false;
        
        BASE._deltaResources = {
            dirty: false,
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
        
        BASE._hpDeltaResources = {
            dirty: false,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
        };
        
        BASE._savedDeltaResources = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
    }
    
    public static LoadBase(
        url: string | null = null,
        userId: number = 0,
        baseId: number = 0,
        baseMode: string = "build",
        isError: boolean = false,
        baseType: number = -1,
        cellId: number = 0,
        keyValuePairs: any[] | null = null
    ): boolean {
        if (isNaN(baseId)) baseId = 0;
        if (isNaN(userId)) userId = 0;
        
        if (getMapRoomManager().instance.isInMapRoom2or3 && getMapRoomManager().instance.isOpen) {
            getMapRoomManager().instance.Hide();
        }
        
        if (MAPROOM_INFERNO._open) {
            MAPROOM_INFERNO.Hide();
        }
        
        if (MAPROOM._open) {
            MAPROOM.Hide();
        }
        
        if (!getMapRoomManager().instance.isInMapRoom2or3 && 
            (baseMode === getGLOBAL().e_BASE_MODE.ATTACK || baseMode === getGLOBAL().e_BASE_MODE.IATTACK) && 
            (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.IBUILD)) {
            return false;
        }
        
        if (!BASE._loading) {
            getGLOBAL()._reloadonerror = isError;
            
            if (baseId === 0 && userId === 0) {
                if (baseMode !== getGLOBAL().e_BASE_MODE.IBUILD) {
                    baseMode = getGLOBAL().e_BASE_MODE.BUILD;
                }
            }
            
            if ((baseMode === getGLOBAL().e_BASE_MODE.ATTACK || baseMode === getGLOBAL().e_BASE_MODE.WMATTACK) && 
                !getMapRoomManager().instance.isInMapRoom2or3 && 
                (!getGLOBAL()._bFlinger || !getGLOBAL()._bFlinger._canFunction) && 
                !BASE.isInfernoMainYardOrOutpost) {
                getLOGGER().Log("err", "Impossible fling");
                getGLOBAL().ErrorMessage("BASE.LoadBase impossible fling");
                return false;
            }
            
            BASE._loadBase = [url, userId, baseId, baseMode, baseType, cellId];
            
            if (!getMapRoomManager().instance.isInMapRoom2or3 && 
                (baseMode === getGLOBAL().e_BASE_MODE.ATTACK || 
                 baseMode === getGLOBAL().e_BASE_MODE.WMATTACK || 
                 baseMode === getGLOBAL().e_BASE_MODE.IATTACK || 
                 baseMode === getGLOBAL().e_BASE_MODE.IWMATTACK)) {
                PLEASEWAIT.Show(getKEYS().Get("msg_preparing"));
                BASE.Save(0, false, true);
            } else if (!BASE._saving) {
                if (keyValuePairs) {
                    BASE._addtionalLoadArguments.push(keyValuePairs);
                }
                BASE.LoadBaseB();
                BASE._addtionalLoadArguments = [];
            }
        }
        
        return true;
    }
    
    public static LoadBaseB(): void {
        console.log("|BASE| - LoadBaseB() _loadBase:" + JSON.stringify(BASE._loadBase));
        
        getGLOBAL()._baseURL2 = BASE._loadBase[0];
        const userId = Number(BASE._loadBase[1]);
        const baseId = Number(BASE._loadBase[2]);
        const baseMode = String(BASE._loadBase[3]);
        const baseType = Number(BASE._loadBase[4]);
        const cellId = Number(BASE._loadBase[5]);
        
        BASE._loadBase = [];
        getGLOBAL().Setup(baseMode);
        BASE.Load(getGLOBAL()._baseURL2, userId, baseId, baseType, cellId);
    }
    
    public static Load(
        url: string | null = null,
        userId: number = 0,
        baseId: number = 0,
        baseType: number = -1,
        cellId: number = 0
    ): void {
        getGLOBAL()._baseLoads += 1;
        BASE._loading = true;
        BASE._baseID = baseId;
        BASE._baseLevel = 0;
        BASE._saveOver = 0;
        BASE._returnHome = false;
        BASE._saveProtect = 0;
        
        PLEASEWAIT.Hide();
        BASE.Cleanup();
        
        if (getMapRoomManager().instance.isInMapRoom3 && baseType !== -1) {
            BASE.m_yardType = baseType;
        } else if (baseType >= EnumYardType.MAIN_YARD) {
            BASE.m_yardType = baseType;
        }
        
        if (BASE.isMainYardOrInfernoMainYard) {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD) {
                getGLOBAL().attackingPlayer = getGLOBAL().player;
            }
        }
        
        getGLOBAL().attackingPlayer.isAttacking = getGLOBAL().attackingPlayer !== getGLOBAL().player;
        
        PLEASEWAIT.Show(getKEYS().Get("msg_loading"));
        getGRID().CreateGrid();
        getPOPUPS().Setup();
        getCREEPS().Clear();
        getGLOBAL().Clear();
        getMAP().Clear();
        getUI2().Clear();
        ResourceBombs.Clear();
        getCREATURES().Clear();
        PROJECTILES.Clear();
        getATTACK().Setup();
        getResourcePackages().Clear();
        getGIBLETS().Clear();
        getCREATURELOCKER().Setup();
        CUSTOMATTACKS.Setup();
        getUPDATES().Setup();
        getBuildingOverlay().Clear();
        ParticleText.Clear();
        getSPRITES().Clear();
        getSPRITES().Setup();
        Fire.Clear();
        ResourceBombs.Data();
        ALLIANCES.Setup();
        
        getGLOBAL()._catchup = true;
        BASE._mushroomList = [];
        BASE._lastSpawnedMushroom = 0;
        BASE._size = 400;
        
        // Build request data and load from server
        const requestData: any[] = [];
        requestData.push(["userid", userId > 0 ? userId : ""]);
        if (cellId) {
            requestData.push(["cellid", cellId]);
        }
        requestData.push(["baseid", BASE._baseID]);
        
        let loadMode = getGLOBAL()._loadmode;
        if (getMapRoomManager().instance.isInMapRoom2or3) {
            if (loadMode === getGLOBAL().e_BASE_MODE.WMATTACK) {
                loadMode = getGLOBAL().e_BASE_MODE.ATTACK;
            }
            if (loadMode === getGLOBAL().e_BASE_MODE.WMVIEW) {
                loadMode = getGLOBAL().e_BASE_MODE.VIEW;
            }
        }
        
        requestData.push(["type", loadMode]);
        
        if (loadMode === getGLOBAL().e_BASE_MODE.ATTACK || 
            loadMode === getGLOBAL().e_BASE_MODE.WMATTACK || 
            loadMode === getGLOBAL().e_BASE_MODE.IATTACK || 
            loadMode === getGLOBAL().e_BASE_MODE.IWMATTACK) {
            const attackData = JSON.stringify(getATTACK().AttackData());
            requestData.push(["attackData", attackData]);
        }
        
        // Load from appropriate URL
        const loader = new (getURLLoaderApi())();
        if (url) {
            loader.load(url + "load", requestData, BASE.handleBaseLoadSuccessful, BASE.handleBaseLoadError);
        } else if (BASE.isInfernoMainYardOrOutpost || (BASE.isEventBaseId(BASE._baseID) && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK)) {
            loader.load(getGLOBAL()._infBaseURL + "load", requestData, BASE.handleBaseLoadSuccessful, BASE.handleBaseLoadError);
        } else {
            loader.load(getGLOBAL()._baseURL + "load", requestData, BASE.handleBaseLoadSuccessful, BASE.handleBaseLoadError);
        }
    }
    
    private static handleBaseLoadSuccessful(serverData: any): void {
        try {
            if (serverData.error === 0) {
                BASE.loadObject = serverData;
                // Process server data and build base
                BASE.Build();
            } else {
                getGLOBAL().ErrorMessage(serverData.error, getGLOBAL().ERROR_ORANGE_BOX_ONLY);
                PLEASEWAIT.Hide();
            }
        } catch (error: any) {
            getGLOBAL().Message(getKEYS().Get("err_loading_base"));
            getLOGGER().Log("err", "Failed to load user base with error: " + error.message);
        }
    }
    
    private static handleBaseLoadError(event: any): void {
        if (getGLOBAL()._reloadonerror) {
            getGLOBAL().CallJS("reloadPage");
        } else {
            getLOGGER().Log("err", "BASE.Load HTTP");
            PLEASEWAIT.Hide();
            getGLOBAL().ErrorMessage("BASE.Load HTTP");
        }
    }
    
    public static Build(): void {
        PLEASEWAIT.Update(getKEYS().Get("msg_building"));
        
        if (MAPROOM_INFERNO._open) {
            MAPROOM_INFERNO.Hide();
        }
        if (MAPROOM._open) {
            MAPROOM.Hide();
        }
        
        getUI2().Setup();
        getGLOBAL().ResizeGame(null);
        getGLOBAL()._render = false;
        getPATHING().Setup();
        
        let terrainType = "grass";
        if (BASE.isInfernoMainYardOrOutpost) {
            terrainType = "lava";
        }
        
        const map = new (getMAP())(terrainType);
        const targeting = new (getTargeting())();
        getQUEUE().Spawn(0);
        getSmoke().Setup();
        
        // Process building data 
        // ... (building creation logic would go here)
        
        getBFOUNDATION().redrawAllShadowData();
        
        getGRID().Clear();
        getMAP().SortDepth();
        getHOUSING().HousingSpace();
        MONSTERBAITER.Update();
        
        BASE.Process();
    }
    
    public static Process(): void {
        PLEASEWAIT.Update(getKEYS().Get("msg_processing"));
        BASE._tmpPercent = 0;
        
        getHOUSING().Cull();
        BASE.CalcResources();
        
        BASE._baseLevel = BASE.BaseLevel().level;
        BASE._bankedValue = 0;
        getGLOBAL().t = BASE._lastProcessed;
        BASE._lastProcessedB = BASE._lastProcessed;
        BASE._catchupTime = BASE._currentTime - BASE._lastProcessed;
        
        BASE._timer = Date.now();
        BASE.HideFootprints();
        
        // Continue processing
        BASE.ProcessD();
    }
    
    public static ProcessD(): void {
        BASE.s_processing = true;
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            getATTACK().Setup();
        }
        
        getEFFECTS().Process(BASE._catchupTime);
        
        if (BASE.isMainYard) {
            getCREATURELOCKER().Tick();
        }
        
        if (BASE._tempGifts) {
            GIFTS.Process(BASE._tempGifts);
        }
        
        getUPDATES().Catchup();
        getHOUSING().Cull();
        getHOUSING().Populate();
        getSOUNDS().Setup();
        
        getGLOBAL()._render = true;
        getGLOBAL()._catchup = false;
        
        getUI2().Update();
        PLEASEWAIT.Hide();
        BASE.CalcResources();
        getUI2()._scrollMap = true;
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            if (!getWMATTACK()._inProgress) {
                getUI2().Show("top");
                getUI2().Show("bottom");
            }
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            getUI2().Show("top");
        }
        
        BASE._baseLevel = BASE.BaseLevel().level;
        BASE._loadTime = getGLOBAL().Timestamp();
        BASE._lastSaved = getGLOBAL().Timestamp();
        BASE.Save();
        
        getQUESTS().TutorialCheck();
        getQUESTS().Check();
        getPATHING().ResetCosts();
        getTUTORIAL().Process();
        MUSHROOMS.Setup();
        NewPopupSystem.instance.CheckAll(true);
        
        getLOGGER().Stat([29, getGLOBAL().mode]);
        BASE._loading = false;
        
        getGLOBAL().CallJS("cc.injectFriendsSwf", null, false);
        BASE.s_processing = false;
        BASE.HideFootprints();
    }
    
    public static Tick(): void {
        let saveDelay = 2;
        if (getGLOBAL()._flags.savedelay) {
            saveDelay = getGLOBAL()._flags.savedelay;
        }
        
        if (BASE._saveCounterA !== BASE._saveCounterB) {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK && BASE._saveOver !== 1) {
                if (getGLOBAL().Timestamp() - BASE._lastSaveRequest > saveDelay * 2 || getGLOBAL().Timestamp() - BASE._lastSaved > 15) {
                    BASE.SaveB();
                }
            } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK && BASE._saveOver !== 1) {
                if (getGLOBAL().Timestamp() - BASE._lastSaveRequest > saveDelay * 2 || getGLOBAL().Timestamp() - BASE._lastSaved > 20) {
                    BASE.SaveB();
                }
            } else if (getGLOBAL().Timestamp() - BASE._lastSaveRequest >= saveDelay || 
                       BASE._pendingPurchase.length > 0 || 
                       (BASE._loadBase.length > 0 && BASE._saveOver !== 1)) {
                BASE.SaveB();
            }
            
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
                getUI2()._top.mcSave.gotoAndStop(4);
            } else {
                getUI2()._top.mcSave.gotoAndStop(2);
            }
        } else {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
                getUI2()._top.mcSave.gotoAndStop(3);
            } else {
                getUI2()._top.mcSave.gotoAndStop(1);
            }
        }
        
        if (getGLOBAL().Timestamp() % 10 === 0) {
            CHECKER.Check();
            if (!BASE.isInfernoMainYardOrOutpost) {
                AutoBankManager.autobank();
            }
        }
        
        ++BASE._lastPaged;
        BASE.ShakeB();
    }
    
    public static Purchase(itemId: string, quantity: number, source: string, param4: boolean = false): boolean {
        if (BASE._pendingPurchase.length > 0) {
            getGLOBAL().ErrorMessage(getKEYS().Get("msg_err_purchase"), getGLOBAL().ERROR_ORANGE_BOX_ONLY);
            return false;
        }
        
        if (!quantity || quantity <= 0) {
            getGLOBAL().ErrorMessage("BASE.Purchase zero quantity");
            getLOGGER().Log("err", `BASE.Purchase Id ${itemId}, illegal quantity ${quantity}, possible hack`);
            return false;
        }
        
        BASE._pendingPurchase = [itemId, quantity, BASE._saveCounterA + 1, source, param4];
        
        if (source !== "store") {
            getLOGGER().Stat([61, itemId, quantity]);
        }
        
        BASE.Save();
        return true;
    }
    
    public static Save(saveOver: number = 0, returnHome: boolean = false, immediate: boolean = false, infernoSave: boolean = false): void {
        if (getUI2()._top && getUI2()._top.mcSave) {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
                getUI2()._top.mcSave.gotoAndStop(4);
            } else {
                getUI2()._top.mcSave.gotoAndStop(2);
            }
        }
        
        if (saveOver > 0) {
            BASE._saveOver = saveOver;
        }
        
        if (returnHome) {
            BASE._returnHome = true;
        }
        
        BASE._lastSaveRequest = getGLOBAL().Timestamp();
        ++BASE._saveCounterA;
        
        if (immediate || BASE._pendingPurchase.length > 0) {
            BASE.SaveB();
        }
        
        if (BASE.isInfernoMainYardOrOutpost || infernoSave || getGLOBAL()._loadmode !== getGLOBAL().mode) {
            BASE._infernoSaveLoad = true;
        }
    }
    
    public static SaveB(): void {
        // Implementation for saving to server
        BASE._saving = true;
        BASE._lastSaved = getGLOBAL().Timestamp();
        BASE._saveCounterB = BASE._saveCounterA;
        
        // Save logic would go here
        
        BASE._saving = false;
    }
    
    public static Charge(resourceType: number, amount: number, checkOnly: boolean = false, useInferno: boolean = false): number {
        amount = Math.floor(amount);
        if (useInferno && BASE.isInfernoMainYardOrOutpost) {
            useInferno = false;
        }
        
        const deltaResources = useInferno ? BASE._ideltaResources : BASE._deltaResources;
        const resources = (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === "ibuild") 
            ? (useInferno ? BASE._iresources : BASE._resources) 
            : getGLOBAL()._attackersResources;
        const hpResources = (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === "ibuild") 
            ? BASE._hpResources 
            : getGLOBAL()._hpAttackersResources;
        const resourceKey = "r" + resourceType;
        
        if (amount <= resources[resourceKey].Get()) {
            if (!checkOnly) {
                resources[resourceKey].Add(-amount);
                if (!useInferno) {
                    hpResources[resourceKey] -= amount;
                }
                if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === "ibuild") {
                    if (useInferno) {
                        if (deltaResources[resourceKey]) {
                            deltaResources[resourceKey].Add(Math.floor(-amount));
                        } else {
                            deltaResources[resourceKey] = new SecNum(Math.floor(-amount));
                        }
                        deltaResources.dirty = true;
                        getGLOBAL()._resources[resourceKey].Add(-amount);
                        getGLOBAL()._hpResources[resourceKey] -= amount;
                    } else {
                        if (deltaResources[resourceKey]) {
                            deltaResources[resourceKey].Add(Math.floor(-amount));
                            BASE._hpDeltaResources[resourceKey] += Math.floor(-amount);
                        } else {
                            deltaResources[resourceKey] = new SecNum(Math.floor(-amount));
                            BASE._hpDeltaResources[resourceKey] = Math.floor(-amount);
                        }
                        deltaResources.dirty = true;
                        BASE._hpDeltaResources.dirty = true;
                        getGLOBAL()._resources[resourceKey].Add(-amount);
                        getGLOBAL()._hpResources[resourceKey] -= amount;
                    }
                } else {
                    if (getGLOBAL()._attackersDeltaResources[resourceKey]) {
                        getGLOBAL()._attackersDeltaResources[resourceKey].Add(Math.floor(-amount));
                    } else {
                        getGLOBAL()._attackersDeltaResources[resourceKey] = new SecNum(Math.floor(-amount));
                    }
                    getGLOBAL()._attackersDeltaResources.dirty = true;
                }
                BASE.CalcResources();
            }
            return amount;
        }
        return 0;
    }
    
    public static CalcResources(): void {
        // Calculate max resources based on storage buildings
        // For main yard, start with 10000 base
        if (!BASE.isOutpostOrInfernoOutpost) {
            BASE._resources.r1max = 10000;
            BASE._resources.r2max = 10000;
            BASE._resources.r3max = 10000;
            BASE._resources.r4max = 10000;
        }
        
        // Get storage silo buildings (BUILDING6)
        const silos = getInstanceManager().getInstancesByClass(BUILDING6) as BFOUNDATION[];
        for (const silo of silos) {
            if (silo._lvl.Get() >= 1 && BASE.isMainYardOrInfernoMainYard) {
                const type = silo._type;
                const capacity = getGLOBAL()._buildingProps[type - 1].capacity[silo._lvl.Get() - 1];
                BASE._resources.r1max += capacity;
                BASE._resources.r2max += capacity;
                BASE._resources.r3max += capacity;
                BASE._resources.r4max += capacity;
            }
        }
    }
    
    public static BaseLevel(): { level: number; nextLevel: number; progress: number; points: number; needed: number; lower: number; upper: number; leveled: boolean } {
        let level = 1;
        let lower = 0;
        let upper = 0;
        const points = BASE._basePoints + Number(BASE._baseValue);
        let needed = 0;
        
        for (let i = 0; i < BASE.s_levels.length - 1; i++) {
            if (points >= BASE.s_levels[i]) {
                level = i + 1;
                lower = BASE.s_levels[i];
                upper = BASE.s_levels[i + 1];
                needed = upper - points;
            }
        }
        
        const currentLevelPoints = BASE.s_levels[level - 1] || 0;
        const nextLevelPoints = BASE.s_levels[level] || BASE.s_levels[BASE.s_levels.length - 1];
        const progress = (BASE._basePoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints);
        
        return {
            level: level,
            nextLevel: nextLevelPoints,
            progress: progress,
            points: points,
            needed: needed,
            lower: lower,
            upper: upper,
            leveled: false
        };
    }
    
    public static PointsAdd(amount: number): void {
        BASE._basePoints += amount;
    }
    
    public static PointsRemove(amount: number): void {
        BASE._basePoints -= amount;
        if (BASE._basePoints < 0) {
            BASE._basePoints = 0;
        }
    }
    
    public static Shake(intensity: number = 10): void {
        BASE._shakeCountdown = intensity;
    }
    
    public static ShakeB(): void {
        if (BASE._shakeCountdown > 0) {
            BASE._shakeCountdown--;
            const offsetX: number = Math.floor(BASE._shakeCountdown / 10 - Math.random() * (BASE._shakeCountdown / 5));
            const offsetY: number = Math.floor(BASE._shakeCountdown / 10 - Math.random() * (BASE._shakeCountdown / 5));
            if (getMAP()._GROUND) {
                getMAP()._GROUND.x += offsetX;
                getMAP()._GROUND.y += offsetY;
            }
        }
    }
    
    public static HideFootprints(): void {
        // Hide building footprints
    }
    
    public static ShowFootprints(): void {
        // Show building footprints
    }
    
    public static BuildingDeselect(): void {
        // Deselect current building
    }
    
    public static isEventBaseId(baseId: number): boolean {
        return BASE.s_eventBases.indexOf(baseId) !== -1;
    }
    
    public static addEventBaseException(baseId: number): void {
        if (BASE.s_eventBases.indexOf(baseId) === -1) {
            BASE.s_eventBases.push(baseId);
        }
    }
    
    public static addBuildingC(buildingType: number): BFOUNDATION | null {
        // Create and add a building of the specified type
        // Returns the created building foundation
        return null;
    }
    
    public static Page(): void {
        // Paging logic for periodic server sync
        BASE._paging = true;
        BASE._lastPaged = 0;
        
        // Page request would go here
        
        BASE._paging = false;
    }
    
    public static repairAllBuildingsToMinimumPercentage(percentage: number): void {
        percentage = Math.max(0, Math.min(1, percentage));
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        
        for (const building of buildings) {
            const minHealth = building.maxHealth * percentage;
            if (building.health < minHealth) {
                building.setHealth(minHealth);
            }
        }
    }
    
    public static startHealAllHelper(): void {
        // Helper for healing all creatures
        BASE.Save();
    }
    
    public static healShinyNowHelper(): void {
        // Helper for instant heal with shiny
        const cost = getSTORE().GetHealAllShinyCost();
        getSTORE().ShowB(3, 1, ["HAMS"], true);
        getPOPUPS().Next();
    }

    /**
     * Check if a building placement has blockers (overlaps with other buildings).
     * @param building The building to check
     * @param allowTraps Whether to allow overlap with traps
     * @returns Empty string if no blockers, "overlap" if blocked
     */
    public static BuildBlockers(building: BFOUNDATION, allowTraps: boolean = false): string {
        if (getGRID().FootprintBlocked(building._footprint, new Point(building._mc.x, building._mc.y), true, allowTraps)) {
            return "overlap";
        }
        return "";
    }

    /**
     * Add resources to the base (opposite of Charge).
     * @param resourceType Resource type (1-4)
     * @param amount Amount to add
     * @param ignoreMax Whether to ignore max capacity
     * @param building Optional building that produced the resources
     * @param useInferno Whether to use inferno resources
     * @param triggerSave Whether to trigger a save
     * @returns Amount actually added
     */
    public static Fund(
        resourceType: number, 
        amount: number, 
        ignoreMax: boolean = false, 
        building: BFOUNDATION | null = null, 
        useInferno: boolean = false,
        triggerSave: boolean = true
    ): number {
        amount = Math.floor(amount);
        
        if (useInferno && BASE.isInfernoMainYardOrOutpost) {
            useInferno = false;
        }
        
        if (resourceType < 5) {
            const resources = useInferno ? BASE._iresources : BASE._resources;
            const deltaResources = useInferno ? BASE._ideltaResources : BASE._deltaResources;
            const hpDeltaResources = useInferno ? {} : BASE._hpDeltaResources;
            const resourceKey = "r" + resourceType;
            const maxKey = "r" + resourceType + "max";
            let actualGain = 0;
            
            if (resources[resourceKey].Get() < resources[maxKey] || ignoreMax) {
                if (resources[resourceKey].Get() + amount < resources[maxKey] || ignoreMax) {
                    resources[resourceKey].Add(amount);
                    if (!useInferno) {
                        BASE._hpResources[resourceKey] += amount;
                    }
                    if (deltaResources[resourceKey]) {
                        deltaResources[resourceKey].Add(amount);
                        hpDeltaResources[resourceKey] += amount;
                    } else {
                        deltaResources[resourceKey] = new SecNum(amount);
                        hpDeltaResources[resourceKey] = amount;
                    }
                    if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD) {
                        getGLOBAL()._resources[resourceKey].Add(amount);
                        getGLOBAL()._hpResources[resourceKey] += amount;
                    }
                    deltaResources.dirty = true;
                    hpDeltaResources.dirty = true;
                    actualGain = amount;
                } else {
                    actualGain = resources[maxKey] - resources[resourceKey].Get();
                    resources[resourceKey].Set(resources[maxKey]);
                    if (!useInferno) {
                        BASE._hpResources[resourceKey] = resources[maxKey];
                    }
                    if (deltaResources[resourceKey]) {
                        deltaResources[resourceKey].Add(Math.floor(actualGain));
                        hpDeltaResources[resourceKey] += Math.floor(actualGain);
                    } else {
                        deltaResources[resourceKey] = new SecNum(Math.floor(actualGain));
                        hpDeltaResources[resourceKey] = Math.floor(actualGain);
                    }
                    if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD) {
                        getGLOBAL()._resources[resourceKey].Add(Math.floor(actualGain));
                        getGLOBAL()._hpResources[resourceKey] += Math.floor(actualGain);
                    }
                    deltaResources.dirty = true;
                    hpDeltaResources.dirty = true;
                }
                
                BASE._bankedValue += actualGain;
                BASE._bankedTime = getGLOBAL().Timestamp();
            } else if ((getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD) && 
                       !useInferno && !getWMATTACK()._inProgress && triggerSave) {
                getUI2()._top.OverchargeShow(resourceType);
            }
            
            if (building) {
                building._stored.Add(-actualGain);
                if (!building._producing) {
                    building.StartProduction();
                }
                building.Update();
            }
            
            if (actualGain > 0 && (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IBUILD) && triggerSave) {
                BASE.Save();
            }
            
            getUI2().Update();
            return actualGain;
        }
        
        getUI2().Update();
        return 0;
    }

    /**
     * Select a building.
     * @param building The building to select
     * @param suppressPopup Whether to suppress the building info popup
     */
    public static BuildingSelect(building: BFOUNDATION, suppressPopup: boolean = false): void {
        if (getGLOBAL()._selectedBuilding) {
            BASE.BuildingDeselect();
        }
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === "ibuild") {
            if (getUI2()._showBottom || getTUTORIAL()._stage === 3 || getTUTORIAL()._stage === 4 || 
                getTUTORIAL()._stage === 20 || getTUTORIAL()._stage === 21 || getTUTORIAL()._stage === 23) {
                getGLOBAL()._selectedBuilding = building;
                if (building._class !== "mushroom") {
                    getGLOBAL()._selectedBuilding.showFootprint(false, true);
                }
                building.Update();
                if (!suppressPopup) {
                    if (building._type === 127 && getGLOBAL().StatGet("p_id") !== 1 && 
                        !MAPROOM_DESCENT.DescentPassed && !BASE.isInfernoMainYardOrOutpost) {
                        INFERNO_DESCENT_POPUPS.ShowEnticePopup();
                    } else {
                        getBUILDINGINFO().Show(building);
                    }
                }
            }
        } else if (getGLOBAL().mode === "help" || getGLOBAL().mode === "ihelp" || getLOGIN()._playerID === building._senderid) {
            getGLOBAL()._selectedBuilding = building;
            getGLOBAL()._selectedBuilding.showFootprint(false);
            building.Update();
            if (!suppressPopup) {
                getBUILDINGINFO().Show(building);
            }
        }
    }

    /**
     * Check if a building type can be built.
     * @param buildingType The building type ID
     * @param checkOnly Whether to just check without showing errors
     * @returns Object with error status and message
     */
    public static CanBuild(buildingType: number, checkOnly: boolean = false): { error: boolean; errorMessage?: string } {
        let buildingProps: any = null;
        let hasError = false;
        let errorMessage = "";
        
        if (getGLOBAL()._aiDesignMode) {
            return { error: false };
        }
        
        for (const key in getGLOBAL()._buildingProps) {
            if (getGLOBAL()._buildingProps[key].id === buildingType) {
                if (getGLOBAL()._buildingProps[key].rewarded) {
                    return { error: false };
                }
                buildingProps = getGLOBAL()._buildingProps[key];
                break;
            }
        }
        
        if (!buildingProps) {
            return { error: true, errorMessage: "Building not found" };
        }
        
        if (getTUTORIAL()._stage < 200 && buildingProps.tutstage > getTUTORIAL()._stage) {
            hasError = true;
            errorMessage = getKEYS().Get("base_builderr_locked");
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && (buildingProps.type === "taunt" || buildingProps.type === "gift")) {
            hasError = true;
            errorMessage = getKEYS().Get("base_builderr_ownyard1");
        } else if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD && buildingProps.type !== "taunt" && buildingProps.type !== "gift") {
            hasError = true;
            errorMessage = getKEYS().Get("base_builderr_ownyard2");
        }
        
        return { error: hasError, errorMessage: errorMessage };
    }

    /**
     * Check if a building can be fortified.
     * @param building The building to check
     * @param checkOnly Whether to just check without showing errors  
     * @returns Object with error status and message
     */
    public static CanFortify(building: BFOUNDATION, checkOnly: boolean = false): { error: boolean; errorMessage?: string } {
        if (!building || !building._fortification) {
            return { error: true, errorMessage: "Cannot fortify this building" };
        }
        
        const buildingProps = getGLOBAL()._buildingProps[building._type - 1];
        if (!buildingProps || !buildingProps.fortify_costs) {
            return { error: true, errorMessage: "No fortify data" };
        }
        
        const currentFortifyLevel = building._fortification.Get();
        if (currentFortifyLevel >= buildingProps.fortify_costs.length) {
            return { error: true, errorMessage: getKEYS().Get("base_forterr_maxlvl") };
        }
        
        return { error: false };
    }

    /**
     * Check if a building can be upgraded.
     * @param building The building to check
     * @param checkOnly Whether to just check without showing errors
     * @returns Object with error status and message
     */
    public static CanUpgrade(building: BFOUNDATION, checkOnly: boolean = false): { error: boolean; errorMessage?: string } {
        if (!building || !building._lvl) {
            return { error: true, errorMessage: "Cannot upgrade this building" };
        }
        
        const buildingProps = getGLOBAL()._buildingProps[building._type - 1];
        if (!buildingProps || !buildingProps.costs) {
            return { error: true, errorMessage: "No upgrade data" };
        }
        
        const currentLevel = building._lvl.Get();
        if (currentLevel >= buildingProps.costs.length) {
            return { error: true, errorMessage: getKEYS().Get("base_upgraderr_maxlvl") };
        }
        
        if (building._countdownBuild && building._countdownBuild.Get() > 0) {
            return { error: true, errorMessage: getKEYS().Get("base_upgraderr_building") };
        }
        
        if (building._countdownUpgrade && building._countdownUpgrade.Get() > 0) {
            return { error: true, errorMessage: getKEYS().Get("base_upgraderr_upgrading") };
        }
        
        return { error: false };
    }

    /**
     * Check if a building type is an inferno-specific building that shouldn't appear in normal yards.
     * @param buildingType The building type ID
     * @returns True if it's an inferno building in a non-inferno yard
     */
    public static isInfernoBuilding(buildingType: number): boolean {
        return (buildingType === getINFERNOQUAKETOWER().TYPE || 
                buildingType === getINFERNO_MAGMA_TOWER().ID || 
                buildingType === SiegeFactory.ID || 
                buildingType === SiegeLab.ID || 
                buildingType === getSpurtzCannon().TYPE || 
                buildingType === BlackSpurtzCannon.TYPE) && 
               !BASE.isInfernoMainYardOrOutpost;
    }

    /**
     * Check if in 711 mode (special promo event).
     * @returns True if 711 mode is valid
     */
    public static is711Valid(): boolean {
        // 711 promo event check - typically checks for specific flags
        return getGLOBAL()._flags && getGLOBAL()._flags.is711 === true;
    }

    /**
     * Count buildings of a specific type.
     * @param buildingType The building type ID
     * @param minLevel Minimum level to count
     * @param countOne Whether to stop counting after finding one
     * @returns Number of buildings found
     */
    public static hasNumBuildings(buildingType: number, minLevel: number = 0, countOne: boolean = false): number {
        const buildingProps = getGLOBAL()._buildingProps[buildingType - 1];
        const buildings = getInstanceManager().getInstancesByClass(buildingProps?.cls || BFOUNDATION) as BFOUNDATION[];
        let count = 0;
        
        for (const building of buildings) {
            if (building._type === buildingType && building._lvl.Get() >= minLevel) {
                count++;
                if (countOne) {
                    break;
                }
            }
        }
        
        return count;
    }

    /**
     * Find a building by type.
     * @param buildingType The building type ID
     * @returns The first building of that type, or null
     */
    public static findBuilding(buildingType: number): BFOUNDATION | null {
        const buildingProps = getGLOBAL()._buildingProps[buildingType];
        const buildings = getInstanceManager().getInstancesByClass(buildingProps?.cls || BFOUNDATION) as BFOUNDATION[];
        
        for (const building of buildings) {
            if (building._type === buildingType) {
                return building;
            }
        }
        
        return null;
    }

    /**
     * Check if a creature ID is an inferno creature.
     * @param creatureId The creature ID string
     * @returns True if it's an inferno creature (starts with "I")
     */
    public static isInfernoCreep(creatureId: string): boolean {
        return creatureId.substring(0, 1) === "I";
    }

    /**
     * Find closest housing to a point.
     * @param x X coordinate
     * @param y Y coordinate
     * @param exclude Building to exclude from search
     * @param isLvl If true, exclude buildings under construction
     * @param isFlyer If true, exclude destroyed buildings
     * @returns The closest housing building or null
     */
    public static FindClosestHousingToPoint(x: number, y: number, exclude: BFOUNDATION | null = null, isLvl: boolean = true, isFlyer: boolean = true): BFOUNDATION | null {
        const distances: Array<{house: BFOUNDATION, dist: number}> = [];
        const buildingClass = BASE.isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15;
        const buildings = getInstanceManager().getInstancesByClass(buildingClass) as BFOUNDATION[];
        
        for (const building of buildings) {
            if (building !== exclude) {
                // Skip if under construction and isLvl is true
                if (isLvl && building._countdownBuild.Get() > 0) {
                    continue;
                }
                // Skip if destroyed and isFlyer is true
                if (isFlyer && building.health <= 0) {
                    continue;
                }
                const dx = building.x - x;
                const dy = building.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                distances.push({ house: building, dist: dist });
            }
        }
        
        if (distances.length === 0) {
            return null;
        }
        
        distances.sort((a, b) => a.dist - b.dist);
        return distances[0].house;
    }

    /**
     * Check if all requirements for a building are met.
     * @param buildingProps The building properties object with requirements
     * @returns True if all requirements are met
     */
    public static HasRequirements(buildingProps: any): boolean {
        if (!buildingProps.re) {
            return true;
        }
        
        for (const req of buildingProps.re) {
            let count = 0;
            
            if (req[0] === getINFERNOQUAKETOWER().UNDERHALL_ID) {
                // Check Underhall level requirement
                if (getGLOBAL().StatGet(getBUILDING14().UNDERHALL_LEVEL) >= req[2] && MAPROOM_DESCENT.DescentPassed) {
                    count = 1;
                }
            } else {
                // Check other building requirements
                const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION);
                for (const building of buildings) {
                    if (building._type === req[0] && building._lvl.Get() >= req[2]) {
                        count++;
                    }
                }
            }
            
            if (count < req[1]) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Add a building to the base in build mode.
     * @param buildingType The type of building to add
     * @param forceCheck If true, force requirement check
     * @returns The created building or null
     */
    public static addBuildingB(buildingType: number, forceCheck: boolean = false): BFOUNDATION | null {
        let canBuildNow = false;
        BASE.BuildingDeselect();
        
        // Check if building is instant (no build time) or queue is available
        canBuildNow = getGLOBAL()._buildingProps[buildingType - 1].costs[0].time.Get() === 0;
        if (!canBuildNow) {
            const queueResult = getQUEUE().CanDo();
            canBuildNow = queueResult.error === false;
        }
        
        // Check if building is in inventory
        if (getInventoryManager().buildingStorageCount(buildingType) > 0) {
            canBuildNow = true;
        }
        
        if (canBuildNow) {
            const canBuildResult = BASE.CanBuild(buildingType, forceCheck);
            if (!canBuildResult.error) {
                BASE.BuildingDeselect();
                BASE.ShowFootprints();
                getGLOBAL()._newBuilding = BASE.addBuildingC(buildingType);
                if (getGLOBAL()._newBuilding) {
                    getGLOBAL()._newBuilding._mc.alpha = 0.5;
                    getGLOBAL()._newBuilding.FollowMouse();
                } else {
                    BASE.BuildingDeselect();
                }
                return getGLOBAL()._newBuilding;
            }
            getGLOBAL().Message(canBuildResult.errorMessage);
        } else {
            getPOPUPS().DisplayWorker(0, buildingType);
        }
        return null;
    }

    /**
     * Apply a template layout to the base, moving buildings to their template positions.
     * @param template The base template to apply
     */
    public static applyTemplate(template: BaseTemplate): void {
        for (let i = 0; i < template.nodes.length; i++) {
            const node = template.nodes[i];
            const pos = getGRID().ToISO(node.x, node.y, 0);
            const building = BASE.getBuildingFromNode(node);
            if (building) {
                building.moveTo(pos.x, pos.y);
            }
        }
        BASE.Save();
    }

    /**
     * Get a building from a template node, creating decoration buildings if needed.
     * @param node The template node
     * @returns The building foundation or null
     */
    private static getBuildingFromNode(node: BaseTemplateNode): BFOUNDATION | null {
        const pos = getGRID().ToISO(node.x, node.y, 0);
        if (node.id === PlannerTemplate._DECORATION_ID) {
            const buildingType = node.type;
            const building = BASE.addBuildingC(buildingType);
            if (building) {
                const setupData: any = {
                    "X": node.x,
                    "Y": node.y,
                    "t": buildingType,
                    "id": BASE._buildingCount++
                };
                if (BASE._buildingsStored["bl" + buildingType]) {
                    setupData.l = BASE._buildingsStored["bl" + buildingType].Get();
                }
                building.Setup(setupData);
                node.id = building._id;
                BASE._buildingsStored["b" + buildingType].Set(
                    BASE._buildingsStored["b" + buildingType].Get() - 1
                );
            }
            return building;
        } else {
            return BASE.getBuildingByID(node.id);
        }
    }

    /**
     * Get a template of the current base layout.
     * @returns The base template
     */
    public static getTemplate(): BaseTemplate {
        const template = new BaseTemplate();
        template.name = BASE._baseName;
        const buildings = BASE.getYardPlannerBuildings();
        for (const building of buildings) {
            const gridPos = getGRID().FromISO(building.x, building.y);
            template.addNode(new BaseTemplateNode(gridPos.x, gridPos.y, building._id, building._type));
        }
        return template;
    }

    /**
     * Get all buildings that should appear in the yard planner.
     * @returns Array of building foundations
     */
    public static getYardPlannerBuildings(): BFOUNDATION[] {
        const allBuildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        const plannerBuildings: BFOUNDATION[] = [];
        for (const building of allBuildings) {
            if (building._type !== 7) { // Exclude town hall marker or similar
                plannerBuildings.push(building);
            }
        }
        return plannerBuildings;
    }

    /**
     * Get a building by its unique ID.
     * @param buildingId The building ID
     * @returns The building foundation or null
     */
    public static getBuildingByID(buildingId: number): BFOUNDATION | null {
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        for (const building of buildings) {
            if (building._id === buildingId) {
                return building;
            }
        }
        return null;
    }

    /**
     * Get the index of a guardian by type.
     * @param guardianType The guardian type ID
     * @returns The index in _guardianData or -1 if not found
     */
    public static getGuardianIndex(guardianType: number): number {
        for (let i = 0; i < BASE._guardianData.length; i++) {
            if (BASE._guardianData[i].t === guardianType) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Get the number of guardians with normal status.
     * @returns Number of normal status guardians
     */
    public static _guardianDataNumNormal(): number {
        let count = BASE._guardianData.length;
        for (let i = BASE._guardianData.length - 1; i >= 0; i--) {
            if (BASE._guardianData[i].status !== ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                count--;
            }
        }
        return count;
    }

    /**
     * Check if a building should be ignored in yard planner save.
     * @param building The building to check
     * @returns True if the building should be ignored (enemy buildings)
     */
    public static isBuildingIgnoredInYardPlannerSave(building: BFOUNDATION): boolean {
        return building._class === "enemy";
    }

    /**
     * Calculate the edge distance of an ellipse at a given angle.
     * @param angle The angle in radians
     * @param semiMajorAxis The semi-major axis (horizontal radius)
     * @param semiMinorAxis The semi-minor axis (vertical radius)
     * @returns The distance from the center to the edge of the ellipse
     */
    public static EllipseEdgeDistance(angle: number, semiMajorAxis: number, semiMinorAxis: number): number {
        let x: number = Math.pow(Math.pow(semiMajorAxis / 2, -2) + Math.pow(Math.tan(angle), 2) * Math.pow(semiMinorAxis / 2, -2), -0.5);
        const angleDegrees: number = angle * 180 / Math.PI;
        if (angleDegrees < -90 || angleDegrees > 90) {
            x *= -1;
        }
        const y: number = Math.tan(angle) * x;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Check if a building would overlap with existing buildings at a given position.
     * @param position The position to check
     * @param size The size of the building to place
     * @param ignoreTraps Whether to ignore trap buildings
     * @param ignoreDestroyed Whether to ignore destroyed buildings
     * @param ignoreDecorations Whether to ignore decoration buildings
     * @param ignoreImmovableAndEnemy Whether to ignore immovable and enemy buildings
     * @returns True if there is an overlap
     */
    public static BuildingOverlap(position: Point, size: number, ignoreTraps: boolean, ignoreDestroyed: boolean = false, ignoreDecorations: boolean = false, ignoreImmovableAndEnemy: boolean = false): boolean {
        const buildings: Object[] = getInstanceManager().getInstancesByClass(BFOUNDATION);
        for (const building of buildings) {
            const bf = building as BFOUNDATION;
            // Skip mushrooms
            if (bf._class === "mushroom") {
                continue;
            }
            const buildingPos: Point = new Point(bf._mc.x, bf._mc.y + bf._middle);
            
            // Check exclusion conditions
            if (ignoreTraps && bf._class === "trap") {
                continue;
            }
            if (ignoreDestroyed && bf.health <= 0) {
                continue;
            }
            if (ignoreDecorations && bf._class === "decoration") {
                continue;
            }
            if (ignoreImmovableAndEnemy && (bf._class === "immovable" || bf._class === "enemy")) {
                continue;
            }
            
            // Calculate edge distances for elliptical overlap check
            let angle: number = Math.atan2(position.y - buildingPos.y, position.x - buildingPos.x);
            const edgeDist1: number = BASE.EllipseEdgeDistance(angle, size, size * BASE._angle);
            angle = Math.atan2(buildingPos.y - position.y, buildingPos.x - position.x);
            const edgeDist2: number = BASE.EllipseEdgeDistance(angle, bf._size * 0.5, bf._size * 0.5 * BASE._angle);
            
            const dx: number = position.x - buildingPos.x;
            const dy: number = position.y - buildingPos.y;
            const distance: number = Math.floor(Math.sqrt(dx * dx + dy * dy));
            
            if (distance < edgeDist1 + edgeDist2) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get all buildings that overlap with a given position and size.
     * @param x The x position
     * @param y The y position  
     * @param size The size of the area to check
     * @param outBuildings Array to populate with overlapping buildings
     */
    public static GetBuildingOverlap(x: number, y: number, size: number, outBuildings: BFOUNDATION[]): void {
        const position: Point = new Point(x, y);
        const buildings: Object[] = getInstanceManager().getInstancesByClass(BFOUNDATION);
        for (const building of buildings) {
            const bf = building as BFOUNDATION;
            // Skip mushrooms
            if (bf._class === "mushroom") {
                continue;
            }
            const buildingPos: Point = new Point(bf._mc.x, bf._mc.y + bf._middle);
            
            let angle: number = Math.atan2(position.y - buildingPos.y, position.x - buildingPos.x);
            const edgeDist1: number = BASE.EllipseEdgeDistance(angle, size, size * BASE._angle);
            angle = Math.atan2(buildingPos.y - position.y, buildingPos.x - position.x);
            const edgeDist2: number = BASE.EllipseEdgeDistance(angle, bf._size * 0.5, bf._size * 0.5 * BASE._angle);
            
            const dx: number = position.x - buildingPos.x;
            const dy: number = position.y - buildingPos.y;
            const distance: number = Math.floor(Math.sqrt(dx * dx + dy * dy));
            
            if (distance < edgeDist1 + edgeDist2) {
                outBuildings.push(bf);
            }
        }
    }

    /**
     * Calculate the squared edge distance of an ellipse at a given angle.
     * @param angle The angle in radians
     * @param semiMajorAxis The semi-major axis (horizontal radius)
     * @param semiMinorAxis The semi-minor axis (vertical radius)
     * @returns The squared distance from the center to the edge of the ellipse
     */
    public static EllipseEdgeDistanceSqrd(angle: number, semiMajorAxis: number, semiMinorAxis: number): number {
        let x: number = Math.pow(Math.pow(semiMajorAxis / 2, -2) + Math.pow(Math.tan(angle), 2) * Math.pow(semiMinorAxis / 2, -2), -0.5);
        const angleDegrees: number = angle * 180 / Math.PI;
        if (angleDegrees < -90 || angleDegrees > 90) {
            x *= -1;
        }
        const y: number = Math.tan(angle) * x;
        return x * x + y * y;
    }

    /**
     * Load the next outpost in the list
     * @param event Optional mouse event
     */
    public static LoadNext(event: MouseEvent | null = null): void {
        if (BASE._saving || BASE._loading || BASE._saveCounterA !== BASE._saveCounterB) {
            getGLOBAL()._nextOutpostWaiting = 1;
            return;
        }
        if (getMapRoomManager().instance.isInMapRoom2) {
            if (BASE.isMainYard && !getGLOBAL()._bMap._canFunction) {
                getGLOBAL().Message(getKEYS().Get("map_msg_damaged"));
                return;
            }
            if (getGLOBAL()._mapOutpostIDs && getGLOBAL()._mapOutpostIDs.length > 0) {
                if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === "ibuild") {
                    if (BASE.isMainYardOrInfernoMainYard) {
                        BASE._currentCellLoc = getGLOBAL()._mapOutpost[0];
                        getGLOBAL()._currentCell = null;
                        BASE._needCurrentCell = true;
                        getMapRoomManager().instance.LoadCell(getGLOBAL()._mapOutpost[0].x, getGLOBAL()._mapOutpost[0].y, true);
                        PLEASEWAIT.Show(getKEYS().Get("process_outpost"));
                    } else {
                        for (let i = 0; i < getGLOBAL()._mapOutpostIDs.length; i++) {
                            if (getGLOBAL()._mapOutpostIDs[i] === BASE._loadedBaseID) {
                                if (i < getGLOBAL()._mapOutpostIDs.length - 1) {
                                    BASE._currentCellLoc = getGLOBAL()._mapOutpost[i + 1];
                                    getGLOBAL()._currentCell = null;
                                    BASE._needCurrentCell = true;
                                    getMapRoomManager().instance.LoadCell(getGLOBAL()._mapOutpost[i + 1].x, getGLOBAL()._mapOutpost[i + 1].y, true);
                                    PLEASEWAIT.Show(getKEYS().Get("process_outpost"));
                                    break;
                                }
                                BASE._needCurrentCell = false;
                                getGLOBAL()._currentCell = null;
                                BASE.LoadBase(null, 0, getGLOBAL()._homeBaseID, getGLOBAL().e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Get empire resources per hour for a given resource type
     * @param resourceType The resource type (1-4)
     * @returns The resource production rate per hour
     */
    public static getEmpireResources(resourceType: number): number {
        let multiplier: number = 1;
        if (getGLOBAL()._harvesterOverdrive >= getGLOBAL().Timestamp() && getGLOBAL()._harvesterOverdrivePower.Get() > 0) {
            multiplier = getGLOBAL()._harvesterOverdrivePower.Get();
        }
        return (BASE._GIP as any)["r" + resourceType].Get() * 360 * multiplier;
    }

    /**
     * Get the number of housing heals per tick
     * @returns The number of heals per tick
     */
    public static getNumHousingHealsPerTick(): number {
        let count: number = 0;
        const buildings: Object[] = getInstanceManager().getInstancesByClass(BASE.isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15);
        if (BASE.isInfernoMainYardOrOutpost) {
            if (buildings[0]) {
                count = Math.min(4, (buildings[0] as BFOUNDATION)._lvl.Get());
            }
        } else {
            for (const building of buildings) {
                count++;
            }
        }
        return count;
    }
}

