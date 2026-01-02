/**
 * BASE - Base management
 * Converted from ActionScript BASE.as
 * 
 * Handles loading, saving, and managing base data
 */

import { GLOBAL } from './Global';
import { apiClient } from '../api/ApiClient';
import { 
  BaseMode, 
  YardType, 
  BuildingData, 
  MonsterData, 
  BaseLoadResponse,
} from '../types/game';
import { SecNum } from '../utils/SecNum';
import { EventEmitter } from './EventEmitter';

class BaseManager extends EventEmitter {
  // Base identifiers
  _baseID: number = 0;
  _wmID: number = 0;

  // Resources
  _resources: Record<string, SecNum> = {};
  _hpResources: Record<string, number> = {};
  _deltaResources: Record<string, SecNum> = {};
  _credits: SecNum = new SecNum(0);
  _hpCredits: number = 0;

  // Save state
  _saveCounterA: number = 0;
  _saveCounterB: number = 0;
  _saving: boolean = false;
  _lastSaveID: number = 0;
  _lastSaved: number = 0;
  _lastSaveRequest: number = 0;
  _saveErrors: number = 0;
  _blockSave: boolean = false;

  // Load state
  _loading: boolean = false;
  _loadTime: number = 0;
  _lastProcessed: number = 0;
  _lastProcessedB: number = 0;
  _currentTime: number = 0;
  _catchupTime: number = 0;

  // Base data
  _baseName: string = '';
  _baseSeed: number = 0;
  _loadedBaseID: number = 0;
  _loadedFriendlyBaseID: number = 0;
  _loadedFBID: number = 0;
  _baseLevel: number = 1;
  _baseValue: number = 0;
  _basePoints: number = 0;
  _outpostValue: number = 0;
  _buildingCount: number = 0;

  // Building storage
  _buildingData: Record<number, BuildingData> = {};
  _buildingsAll: Record<number, BuildingData> = {};
  _buildingsWalls: Record<number, BuildingData> = {};
  _buildingsTowers: Record<number, BuildingData> = {};
  _buildingsHousing: BuildingData[] = [];
  _buildingsMain: Record<number, BuildingData> = {};
  buildings: BuildingData[] = [];

  // Monster data
  _rawMonsters: MonsterData[] = [];

  // Other stats
  _otherStats: Record<string, unknown> = {};

  // Yard type
  yardType: YardType = YardType.MAIN_YARD;
  private _isFanValue: number = 0;
  _needCurrentCell: boolean = false;
  _returnHome: boolean = false;
  _attackID: number = 0;

  constructor() {
    super();
    this.initResources();
  }

  private initResources(): void {
    for (let i = 1; i <= 4; i++) {
      this._resources[`r${i}`] = new SecNum(0);
      this._hpResources[`r${i}`] = 0;
      this._deltaResources[`r${i}`] = new SecNum(0);
    }
  }

  /**
   * Load a base
   */
  async load(
    url?: string,
    userId: number = 0,
    baseId: number = 0
  ): Promise<void> {
    if (this._loading) {
      console.warn('Already loading a base');
      return;
    }

    this._loading = true;
    this._loadTime = Date.now();
    this.emit('loadStart');

    try {
      const response = await apiClient.loadBase(
        baseId,
        userId,
        GLOBAL.mode,
        this.yardType
      );

      if (response.error) {
        this.emit('loadError', response.error);
        this._loading = false;
        return;
      }

      this.processLoadResponse(response);
      
    } catch (error) {
      console.error('Base load error:', error);
      this.emit('loadError', 'Failed to load base');
      this._loading = false;
    }
  }

  /**
   * Load base with full parameters
   */
  async loadBase(
    url: string | null,
    userId: number,
    baseId: number,
    mode: BaseMode,
    force: boolean = false,
    yardType: YardType = YardType.MAIN_YARD
  ): Promise<void> {
    this.yardType = yardType;
    GLOBAL.setMode(mode);
    await this.load(url || undefined, userId, baseId);
  }

  private processLoadResponse(response: BaseLoadResponse): void {
    this._baseID = response.baseid;
    this._baseName = response.basename;
    this._baseSeed = response.baseseed;
    this._baseLevel = response.baselevel;
    this._baseValue = response.basevalue;
    this._basePoints = response.basepoints;
    this._credits.Set(response.credits);
    this._currentTime = response.timestamp;
    this._loadedBaseID = response.baseid;

    // Parse resources
    if (response.resources) {
      for (const key in response.resources) {
        if (this._resources[key]) {
          const value = response.resources[key];
          if (typeof value === 'number') {
            this._resources[key].Set(value);
          } else if (value && typeof value.Get === 'function') {
            this._resources[key].Set(value.Get());
          }
        }
      }
    }

    // Parse building data
    if (response.buildingdata) {
      try {
        const buildingData = typeof response.buildingdata === 'string' 
          ? JSON.parse(response.buildingdata) 
          : response.buildingdata;
        this.parseBuildingData(buildingData);
      } catch (e) {
        console.error('Failed to parse building data:', e);
      }
    }

    // Parse monster data
    if (response.monsterdata) {
      try {
        const monsterData = typeof response.monsterdata === 'string'
          ? JSON.parse(response.monsterdata)
          : response.monsterdata;
        this.parseMonsterData(monsterData);
      } catch (e) {
        console.error('Failed to parse monster data:', e);
      }
    }

    // Parse other stats
    if (response.otherStats) {
      this._otherStats = response.otherStats;
    }

    this._loading = false;
    this.emit('loadComplete', {
      baseId: this._baseID,
      baseName: this._baseName,
      buildings: this.buildings,
      monsters: this._rawMonsters,
    });
  }

  private parseBuildingData(data: unknown): void {
    this.buildings = [];
    this._buildingsAll = {};
    this._buildingsWalls = {};
    this._buildingsTowers = {};
    this._buildingsMain = {};
    this._buildingsHousing = [];
    this._buildingCount = 0;

    if (!data || !Array.isArray(data)) return;

    data.forEach((buildingArray: unknown[], index: number) => {
      if (!Array.isArray(buildingArray) || buildingArray.length < 6) return;

      const building: BuildingData = {
        id: index,
        type: buildingArray[0] as number,
        x: buildingArray[1] as number,
        y: buildingArray[2] as number,
        level: buildingArray[3] as number,
        health: buildingArray[5] as number,
        status: 0,
        buildTime: buildingArray[4] as number || undefined,
      };

      this.buildings.push(building);
      this._buildingsAll[index] = building;
      this._buildingCount++;

      // Categorize buildings
      this.categorizeBuilding(building);
    });
  }

  private categorizeBuilding(building: BuildingData): void {
    // Wall types: 25, 26, 27, etc.
    const wallTypes = [25, 26, 27, 81, 82, 83, 84, 85];
    // Tower types: 10, 11, 12, etc.
    const towerTypes = [10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 23, 24];
    // Housing types: 14, 15
    const housingTypes = [14, 15];

    if (wallTypes.includes(building.type)) {
      this._buildingsWalls[building.id] = building;
    } else if (towerTypes.includes(building.type)) {
      this._buildingsTowers[building.id] = building;
    } else if (housingTypes.includes(building.type)) {
      this._buildingsHousing.push(building);
    } else {
      this._buildingsMain[building.id] = building;
    }
  }

  private parseMonsterData(data: unknown): void {
    this._rawMonsters = [];

    if (!data) return;

    if (Array.isArray(data)) {
      // Format: [[type, level, count], ...]
      data.forEach((monster: number[]) => {
        if (Array.isArray(monster) && monster.length >= 3) {
          this._rawMonsters.push({
            type: monster[0],
            level: monster[1],
            count: monster[2],
          });
        }
      });
    } else if (typeof data === 'object') {
      // Format: { monsterType: { level: count } }
      for (const type in data) {
        const levels = (data as Record<string, Record<string, number>>)[type];
        for (const level in levels) {
          this._rawMonsters.push({
            type: parseInt(type, 10),
            level: parseInt(level, 10),
            count: levels[level],
          });
        }
      }
    }
  }

  /**
   * Save the base
   */
  async save(force: boolean = false): Promise<void> {
    if (this._blockSave && !force) {
      console.log('Save blocked');
      return;
    }

    if (this._saving && !force) {
      console.log('Already saving');
      this._saveCounterA++;
      return;
    }

    this._saving = true;
    this._saveCounterA++;
    this._lastSaveRequest = Date.now();
    this.emit('saveStart');

    try {
      // Serialize building data
      const buildingData = this.serializeBuildingData();
      const monsterData = this.serializeMonsterData();

      const response = await apiClient.saveBase(
        this._baseID,
        buildingData,
        monsterData,
        {
          r1: this._resources.r1.Get(),
          r2: this._resources.r2.Get(),
          r3: this._resources.r3.Get(),
          r4: this._resources.r4.Get(),
          credits: this._credits.Get(),
        },
        this._otherStats
      );

      if (response.error) {
        this._saveErrors++;
        this.emit('saveError', response.error);
      } else {
        this._lastSaveID = response.saveid || 0;
        this._lastSaved = Date.now();
        this._saveCounterB = this._saveCounterA;
        this.emit('saveComplete', { saveid: this._lastSaveID });
      }
    } catch (error) {
      console.error('Save error:', error);
      this._saveErrors++;
      this.emit('saveError', 'Failed to save base');
    } finally {
      this._saving = false;
    }
  }

  private serializeBuildingData(): string {
    const data: (number | null)[][] = [];
    
    this.buildings.forEach(building => {
      data.push([
        building.type,
        building.x,
        building.y,
        building.level,
        building.buildTime || 0,
        building.health,
      ]);
    });

    return JSON.stringify(data);
  }

  private serializeMonsterData(): string {
    const data: Record<string, Record<string, number>> = {};
    
    this._rawMonsters.forEach(monster => {
      const typeKey = monster.type.toString();
      const levelKey = monster.level.toString();
      
      if (!data[typeKey]) {
        data[typeKey] = {};
      }
      data[typeKey][levelKey] = monster.count;
    });

    return JSON.stringify(data);
  }

  /**
   * Setup for a new session
   */
  setup(): void {
    this.initResources();
    this.buildings = [];
    this._rawMonsters = [];
    this._buildingsAll = {};
    this._buildingCount = 0;
    this._saveCounterA = 0;
    this._saveCounterB = 0;
    this._saving = false;
    this._loading = false;
    this.emit('setup');
  }

  /**
   * Update a building's data
   */
  updateBuilding(id: number, updates: Partial<BuildingData>): void {
    const building = this._buildingsAll[id];
    if (building) {
      Object.assign(building, updates);
      this.emit('buildingUpdated', building);
    }
  }

  /**
   * Add a new building
   */
  addBuilding(building: BuildingData): void {
    const id = this._buildingCount++;
    building.id = id;
    this.buildings.push(building);
    this._buildingsAll[id] = building;
    this.categorizeBuilding(building);
    this.emit('buildingAdded', building);
  }

  /**
   * Remove a building
   */
  removeBuilding(id: number): void {
    const building = this._buildingsAll[id];
    if (building) {
      const index = this.buildings.indexOf(building);
      if (index > -1) {
        this.buildings.splice(index, 1);
      }
      delete this._buildingsAll[id];
      delete this._buildingsWalls[id];
      delete this._buildingsTowers[id];
      delete this._buildingsMain[id];
      
      const housingIndex = this._buildingsHousing.indexOf(building);
      if (housingIndex > -1) {
        this._buildingsHousing.splice(housingIndex, 1);
      }
      
      this.emit('buildingRemoved', building);
    }
  }

  /**
   * Get building at grid position
   */
  getBuildingAt(gridX: number, gridY: number): BuildingData | null {
    return this.buildings.find(b => b.x === gridX && b.y === gridY) || null;
  }

  /**
   * Check if yard is main yard
   */
  get isMainYard(): boolean {
    return this.yardType === YardType.MAIN_YARD || this.yardType === YardType.PLAYER;
  }

  /**
   * Check if yard is outpost
   */
  get isOutpost(): boolean {
    return this.yardType === YardType.OUTPOST;
  }

  /**
   * Check if in inferno yard
   */
  get isInfernoMainYardOrOutpost(): boolean {
    return this.yardType === YardType.INFERNO_YARD || this.yardType === YardType.INFERNO_OUTPOST;
  }

  /**
   * Check if main yard or inferno main yard
   */
  get isMainYardOrInfernoMainYard(): boolean {
    return this.isMainYard || this.yardType === YardType.INFERNO_YARD;
  }

  /**
   * Getter/setter for isFan
   */
  get isFan(): number {
    return this._isFanValue;
  }

  set isFan(value: number) {
    this._isFanValue = value;
  }

  /**
   * Get resource value
   */
  getResource(key: string): number {
    return this._resources[key]?.Get() || 0;
  }

  /**
   * Set resource value
   */
  setResource(key: string, value: number): void {
    if (this._resources[key]) {
      this._resources[key].Set(value);
      this.emit('resourceChanged', { key, value });
    }
  }

  /**
   * Add to resource
   */
  addResource(key: string, amount: number): void {
    if (this._resources[key]) {
      this._resources[key].Add(amount);
      this.emit('resourceChanged', { key, value: this._resources[key].Get() });
    }
  }
}

export const BASE = new BaseManager();
