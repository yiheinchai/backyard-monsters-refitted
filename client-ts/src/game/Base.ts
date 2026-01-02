/**
 * BASE - Base management system for the Backyard Monsters client
 * This is the TypeScript equivalent of BASE.as
 */

import { GLOBAL } from '@/core/Global';
import { LOGIN } from '@/core/Login';
// import { KEYS } from '@/core/Keys';
import { API } from '@/network/API';
import { SecNum } from '@/utils';
import { GAME } from '@/core/Game';
import { 
  BaseLoadResponse, 
  BaseSaveResponse, 
  Building, 
  BuildingData,
  MonsterData,
  YardType 
} from '@/types';

/**
 * BASE class - handles base loading, saving, and state management
 */
export class BASE {
  // Base identification
  static _baseID: number = 0;
  static _wmID: number = 0;

  // Resources
  static _resources: { [key: string]: SecNum } = {};
  static _hpResources: { [key: string]: number } = {};
  static _bankedValue: number = 0;
  static _bankedTime: number = 0;

  // Delta tracking
  static _deltaResources: { [key: string]: SecNum } = {};
  static _hpDeltaResources: { [key: string]: number } = {};
  static _savedDeltaResources: { [key: string]: SecNum } = {};

  // Credits
  static _credits: SecNum = new SecNum(0);
  static _hpCredits: number = 0;

  // Save state
  static _saveCounterA: number = 0;
  static _saveCounterB: number = 0;
  static _saving: boolean = false;
  static _paging: boolean = false;
  static _lastSaveID: number = 0;
  static _attackID: number = 0;
  static _lastSaved: number = 0;
  static _lastSaveRequest: number = 0;
  static _saveOver: number = 0;
  static _returnHome: boolean = false;
  static _saveProtect: number = 0;
  static _saveErrors: number = 0;
  static _pageErrors: number = 0;
  static _blockSave: boolean = false;

  // Load state
  static _loadTime: number = 0;
  static _loading: boolean = false;
  static _infernoSaveLoad: boolean = false;

  // Processing state
  static _processing: boolean = false;
  static _lastProcessed: number = 0;
  static _lastProcessedB: number = 0;
  static _catchupTime: number = 0;
  static _currentTime: number = 0;

  // Building data
  static _baseData: Building[] = [];
  static _upgradeData: { [key: string]: number } = {};
  static _buildingCount: number = 0;
  static _buildingHealthData: { [key: string]: number } = {};
  static _buildingData: BuildingData = {};
  static _buildingsAll: { [key: string]: unknown } = {};
  static _buildingsWalls: { [key: string]: unknown } = {};
  static _buildingsTowers: { [key: string]: unknown } = {};
  static _buildingsBunkers: { [key: string]: unknown } = {};
  static _buildingsHousing: unknown[] = [];
  static _buildingsMain: { [key: string]: unknown } = {};
  static _buildingsMushrooms: { [key: string]: unknown } = {};
  static _buildingsGifts: { [key: string]: unknown } = {};
  static _buildingsStored: { [key: string]: unknown } = {};

  // Monster data
  static _rawMonsters: MonsterData = {};

  // Base info
  static _baseName: string = '';
  static _baseSeed: number = 0;
  static _loadedBaseID: number = 0;
  static _loadedFriendlyBaseID: number = 0;
  static _loadedFBID: number = 0;
  static _baseLevel: number = 0;
  static _baseValue: number = 0;
  static _basePoints: number = 0;
  static _outpostValue: number = 0;

  // Yard type
  static yardType: YardType = YardType.MAIN_YARD;

  // Attack data
  static _attackerArray: unknown[] = [];
  static _attackerNameArray: string[] = [];
  static _currentAttacks: unknown[] = [];
  static _attacksModified: boolean = false;
  static _shakeCountdown: number = 0;

  // Misc
  static _isFan: number = 0;
  static _needCurrentCell: boolean = false;
  static _timer: number = 0;
  static _size: number = 0;
  static _mushroomList: unknown[] = [];
  static _lastSpawnedMushroom: number = 0;
  static _GIP: { [key: string]: unknown } = {};
  static _processedGIP: { [key: string]: unknown } = {};
  static _rawGIP: { [key: string]: unknown } = {};
  static _lastProcessedGIP: number = 0;

  /**
   * Setup base state
   */
  static Setup(): void {
    BASE._saveCounterA = 0;
    BASE._saveCounterB = 0;
    BASE._saving = false;
    BASE._loading = false;
    BASE._blockSave = false;
    BASE._saveErrors = 0;
    BASE._pageErrors = 0;
    
    BASE._buildingData = {};
    BASE._buildingsAll = {};
    BASE._buildingsWalls = {};
    BASE._buildingsTowers = {};
    BASE._buildingsBunkers = {};
    BASE._buildingsHousing = [];
    BASE._buildingsMain = {};
    BASE._buildingsMushrooms = {};
    BASE._buildingsGifts = {};
    BASE._buildingsStored = {};
    
    BASE._deltaResources = {};
    BASE._hpDeltaResources = {};
    BASE._savedDeltaResources = {};
    
    for (let i = 1; i < 5; i++) {
      BASE._deltaResources['r' + i] = new SecNum(0);
      BASE._savedDeltaResources['r' + i] = new SecNum(0);
      BASE._hpDeltaResources['r' + i] = 0;
    }
  }

  /**
   * Load the player's base
   */
  static async Load(url?: string, userId?: number, baseId?: number): Promise<void> {
    if (BASE._loading) {
      console.log('[BASE] Already loading, ignoring request');
      return;
    }

    BASE._loading = true;
    GLOBAL.WaitShow('Loading base...');
    GAME.instance.updateLoadingProgress(60);

    try {
      const baseUrl = url || GLOBAL._baseURL + 'load';
      
      const params: Array<[string, string | number]> = [
        ['baseid', baseId || 0],
        ['userid', userId || LOGIN._playerID]
      ];

      const response = await API.load<BaseLoadResponse>(baseUrl, params);

      if (!response) {
        throw new Error('Failed to load base data');
      }

      if (response.error && response.error !== 0) {
        throw new Error(String(response.error));
      }

      // Process loaded data
      BASE.ProcessLoadData(response);

    } catch (error) {
      console.error('[BASE] Load error:', error);
      GLOBAL.errorMessage('Failed to load base: ' + (error as Error).message);
    } finally {
      BASE._loading = false;
      GLOBAL.WaitHide();
    }
  }

  /**
   * Load a specific base (for attacking/viewing)
   */
  static async LoadBase(
    url: string | null,
    userId: number,
    baseId: number,
    mode: string,
    _resetMap: boolean = false,
    yardType: YardType = YardType.MAIN_YARD
  ): Promise<void> {
    BASE.yardType = yardType;
    
    if (mode) {
      GLOBAL._loadmode = mode;
      if (GLOBAL.isValidMode(mode)) {
        GLOBAL.setMode(GLOBAL.infernoToDefaultMode(mode));
      }
    }

    await BASE.Load(url || undefined, userId, baseId);
  }

  /**
   * Load next outpost
   */
  static async LoadNext(): Promise<void> {
    // TODO: Implement outpost navigation
    console.log('[BASE] LoadNext - not yet implemented');
  }

  /**
   * Process loaded base data
   */
  static ProcessLoadData(data: BaseLoadResponse): void {
    console.log('[BASE] Processing load data:', data);

    // Set base info
    BASE._baseID = data.baseid || 0;
    BASE._baseName = data.basename || '';
    BASE._baseSeed = data.baseseed || 0;
    BASE._baseValue = data.basevalue || 0;
    BASE._basePoints = data.basepoints || 0;
    BASE._loadedBaseID = data.baseid || 0;

    // Set resources
    if (data.resources) {
      for (const key in data.resources) {
        const value = (data.resources as unknown as Record<string, number>)[key];
        GLOBAL._resources[key] = new SecNum(value || 0);
        GLOBAL._hpResources[key] = value || 0;
      }
    }

    // Set credits
    if (data.credits !== undefined) {
      BASE._credits = new SecNum(data.credits);
      BASE._hpCredits = data.credits;
      GLOBAL._credits = new SecNum(data.credits);
    }

    // Set building data
    if (data.buildings) {
      BASE._baseData = data.buildings;
      BASE._buildingCount = data.buildings.length;
      
      // Process buildings into categories
      for (const building of data.buildings) {
        const id = building.id.toString();
        BASE._buildingData[id] = building;
        BASE._buildingsAll[id] = building;
      }
    }

    // Set monster data
    if (data.monsters) {
      BASE._rawMonsters = data.monsters;
    }

    // Set flags
    if (data.flags) {
      GLOBAL.SetFlags(data.flags);
    }

    // Set upgrade data
    if (data.upgrades) {
      BASE._upgradeData = data.upgrades;
    }

    // Set timestamps
    if (data.timestamp) {
      BASE._currentTime = data.timestamp;
    }
    if (data.catchuptime) {
      BASE._catchupTime = data.catchuptime;
    }

    // Set attacker data
    if (data.attackerarray) {
      BASE._attackerArray = data.attackerarray;
    }

    // Mark as loaded
    BASE._loadTime = Date.now();
    GAME.instance.updateLoadingProgress(100);
    
    // Hide loading screen and start game
    setTimeout(() => {
      GAME.instance.hideLoadingScreen();
      GAME.instance.startGameLoop();
    }, 500);

    console.log('[BASE] Base loaded successfully');
  }

  /**
   * Save the current base state
   */
  static async Save(force: boolean = false): Promise<void> {
    if (BASE._blockSave && !force) {
      console.log('[BASE] Save blocked');
      return;
    }

    if (BASE._saving) {
      console.log('[BASE] Already saving');
      BASE._saveCounterA++;
      return;
    }

    if (!GLOBAL._save) {
      console.log('[BASE] Saving disabled');
      return;
    }

    BASE._saving = true;
    BASE._lastSaveRequest = Date.now();

    try {
      const saveData = BASE.BuildSaveData();
      
      const response = await API.load<BaseSaveResponse>(
        GLOBAL._baseURL + 'save',
        [
          ['baseid', BASE._baseID],
          ['data', JSON.stringify(saveData)]
        ]
      );

      if (response) {
        if (response.error && response.error !== 0) {
          throw new Error(String(response.error));
        }

        BASE._lastSaveID = response.saveid || 0;
        BASE._lastSaved = Date.now();
        BASE._saveCounterB = BASE._saveCounterA;
        BASE._saveErrors = 0;
        
        console.log('[BASE] Save successful:', response.saveid);
      }
    } catch (error) {
      console.error('[BASE] Save error:', error);
      BASE._saveErrors++;
      
      if (BASE._saveErrors >= 3) {
        GLOBAL.errorMessage('Failed to save. Please check your connection.');
      }
    } finally {
      BASE._saving = false;
    }
  }

  /**
   * Build save data object
   */
  static BuildSaveData(): Record<string, unknown> {
    return {
      baseid: BASE._baseID,
      buildings: BASE._baseData,
      resources: {
        r1: GLOBAL._resources.r1?.Get() || 0,
        r2: GLOBAL._resources.r2?.Get() || 0,
        r3: GLOBAL._resources.r3?.Get() || 0,
        r4: GLOBAL._resources.r4?.Get() || 0
      },
      credits: BASE._credits.Get(),
      monsters: BASE._rawMonsters,
      upgrades: BASE._upgradeData,
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * Tick function for base updates
   */
  static Tick(): void {
    // Increment timer
    BASE._timer++;

    // Auto-save every 60 seconds
    if (BASE._timer % 60 === 0 && !BASE._saving && BASE._saveCounterA > BASE._saveCounterB) {
      BASE.Save();
    }
  }

  /**
   * Check if in main yard
   */
  static get isMainYard(): boolean {
    return BASE.yardType === YardType.MAIN_YARD;
  }

  /**
   * Check if in outpost
   */
  static get isOutpost(): boolean {
    return BASE.yardType === YardType.OUTPOST;
  }

  /**
   * Check if in inferno yard
   */
  static get isInfernoMainYard(): boolean {
    return BASE.yardType === YardType.INFERNO_YARD;
  }

  /**
   * Check if in main yard or inferno main yard
   */
  static get isMainYardOrInfernoMainYard(): boolean {
    return BASE.isMainYard || BASE.isInfernoMainYard;
  }

  /**
   * Check if in inferno main yard or outpost
   */
  static get isInfernoMainYardOrOutpost(): boolean {
    return BASE.isInfernoMainYard || BASE.isOutpost;
  }

  /**
   * Deselect current building
   */
  static BuildingDeselect(): void {
    // TODO: Implement building selection system
  }

  /**
   * Shake the screen (for damage effects)
   */
  static Shake(duration: number = 10): void {
    BASE._shakeCountdown = duration;
  }

  /**
   * Process screen shake
   */
  static ShakeB(): void {
    if (BASE._shakeCountdown > 0) {
      BASE._shakeCountdown--;
      // Apply shake effect to canvas/container
    }
  }
}

export default BASE;
