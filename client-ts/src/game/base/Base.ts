/**
 * Base - Manages the player's base and its buildings
 * Ported from ActionScript BASE.as
 */

import { SecNum } from '../../utils/SecNum';
import { globalEvents } from '../../utils/EventEmitter';
import { GAME_EVENTS, BaseMode, BUILDING_TYPES } from '../../core/config';
import { game } from '../../core/Game';
import { network, BaseLoadResponse } from '../../network/NetworkManager';
import { Building, BuildingData } from '../buildings/Building';

export interface BaseResources {
  r1: SecNum;
  r2: SecNum;
  r3: SecNum;
  r4: SecNum;
}

export interface BaseSaveData {
  baseid: number;
  buildingdata: Record<string, BuildingData>;
  buildingresources: Record<string, unknown>;
  resources: { r1: number; r2: number; r3: number; r4: number };
  credits: number;
  [key: string]: unknown;
}

export class Base {
  // Base identification
  public baseId: number = 0;
  public wmId: number = 0;
  public baseName: string = '';
  public baseSeed: number = 0;
  
  // Resources
  public resources: BaseResources = {
    r1: new SecNum(0),
    r2: new SecNum(0),
    r3: new SecNum(0),
    r4: new SecNum(0),
  };
  
  // Building data
  private buildings: Map<string, Building> = new Map();
  private buildingData: Record<string, BuildingData> = {};
  private buildingResourceData: Record<string, unknown> = {};
  private buildingHealthData: Record<string, number> = {};
  // storedBuildings will be used for pickup/place functionality later
  public storedBuildings: Record<string, unknown> = {};
  
  // Base stats
  public baseLevel: number = 0;
  public baseValue: number = 0;
  public basePoints: number = 0;
  public credits: SecNum = new SecNum(0);
  
  // Special buildings references
  public townHall?: Building;
  public mapRoom?: Building;
  public hatchery?: Building;
  public housing?: Building;
  public flinger?: Building;
  
  // State flags
  public isLoading: boolean = false;
  public isSaving: boolean = false;
  private saveCounter: number = 0;
  private lastSaveId: number = 0;
  private lastSaveTime: number = 0;
  
  // Monster/Creature data
  public rawMonsters: object = {};
  public championData: object = {};
  public academyData: object = {};
  public lockerData: object = {};
  
  constructor() {
    // Initialize
  }
  
  /**
   * Load base data from server response
   */
  async loadFromData(data: BaseLoadResponse): Promise<void> {
    this.isLoading = true;
    
    try {
      // Store base identification
      this.baseId = data.baseid;
      this.wmId = data.wmid || 0;
      this.baseName = data.basename || 'My Base';
      this.baseSeed = data.baseseed || Math.floor(Math.random() * 1000000);
      
      // Store base stats
      this.baseLevel = data.level || 1;
      this.baseValue = data.basevalue || 0;
      this.basePoints = data.points || 0;
      
      // Store resources
      if (data.resources) {
        this.resources.r1.Set(data.resources.r1 || 0);
        this.resources.r2.Set(data.resources.r2 || 0);
        this.resources.r3.Set(data.resources.r3 || 0);
        this.resources.r4.Set(data.resources.r4 || 0);
        
        // Also update global state
        game.state.resources.r1.Set(data.resources.r1 || 0);
        game.state.resources.r2.Set(data.resources.r2 || 0);
        game.state.resources.r3.Set(data.resources.r3 || 0);
        game.state.resources.r4.Set(data.resources.r4 || 0);
      }
      
      // Store credits
      this.credits.Set(data.credits || 0);
      game.state.credits = data.credits || 0;
      
      // Store building data
      this.buildingData = data.buildingdata as Record<string, BuildingData> || {};
      this.buildingResourceData = (data.buildingresources as Record<string, unknown>) || {};
      this.buildingHealthData = data.buildinghealthdata as Record<string, number> || {};
      this.storedBuildings = (data.storedbuildings as Record<string, unknown>) || {};
      
      // Store monster/creature data
      this.rawMonsters = (data.monsters as Record<string, unknown>) || {};
      this.championData = (data.champion as Record<string, unknown>) || {};
      this.academyData = (data.academy as Record<string, unknown>) || {};
      this.lockerData = (data.lockerdata as Record<string, unknown>) || {};
      
      // Store flags
      if (data.flags) {
        game.state.flags = data.flags as Record<string, unknown>;
      }
      
      // Create buildings
      await this.createBuildings();
      
      // Update game state
      game.state.baseId = this.baseId;
      game.state.homeBaseId = data.homebase || this.baseId;
      
      this.isLoading = false;
      
      globalEvents.emit(GAME_EVENTS.BASE_LOADED, this);
      
    } catch (error) {
      this.isLoading = false;
      console.error('Failed to load base:', error);
      throw error;
    }
  }
  
  /**
   * Create building objects from data
   */
  private async createBuildings(): Promise<void> {
    this.buildings.clear();
    this.townHall = undefined;
    this.mapRoom = undefined;
    this.hatchery = undefined;
    this.housing = undefined;
    this.flinger = undefined;
    
    for (const [id, data] of Object.entries(this.buildingData)) {
      // Create building
      const building = new Building(id, data);
      
      // Add health data if available
      if (this.buildingHealthData[id]) {
        building.setHealth(this.buildingHealthData[id]);
      }
      
      // Add resource data if available
      const resourceData = this.buildingResourceData[id];
      if (resourceData) {
        building.setResourceData(resourceData);
      }
      
      this.buildings.set(id, building);
      
      // Track special buildings
      this.trackSpecialBuilding(building);
    }
    
    // Add buildings to map renderer
    for (const building of this.buildings.values()) {
      await building.addToMap(game.mapRenderer);
    }
  }
  
  /**
   * Track special buildings for quick access
   */
  private trackSpecialBuilding(building: Building): void {
    switch (building.type) {
      case BUILDING_TYPES.TOWN_HALL:
        this.townHall = building;
        break;
      case BUILDING_TYPES.MAP_ROOM:
        this.mapRoom = building;
        break;
      case BUILDING_TYPES.HATCHERY:
        if (!this.hatchery) this.hatchery = building;
        break;
      case BUILDING_TYPES.HOUSING:
        if (!this.housing) this.housing = building;
        break;
      case BUILDING_TYPES.FLINGER:
        this.flinger = building;
        break;
    }
  }
  
  /**
   * Get a building by ID
   */
  getBuilding(id: string): Building | undefined {
    return this.buildings.get(id);
  }
  
  /**
   * Get all buildings
   */
  getAllBuildings(): Building[] {
    return Array.from(this.buildings.values());
  }
  
  /**
   * Get buildings by type
   */
  getBuildingsByType(type: number): Building[] {
    return this.getAllBuildings().filter(b => b.type === type);
  }
  
  /**
   * Add a new building
   */
  async addBuilding(type: number, gridX: number, gridY: number): Promise<Building | null> {
    // Check if we can place here
    if (!this.canPlaceBuilding(type, gridX, gridY)) {
      return null;
    }
    
    // Generate unique ID
    const id = this.generateBuildingId();
    
    // Create building data
    const data: BuildingData = {
      t: type,
      l: 1,
      x: gridX,
      y: gridY,
      s: 0,
      h: 0,
      d: 0,
      fb: 0,
      bu: 0,
      fr: 0,
    };
    
    // Create building
    const building = new Building(id, data);
    this.buildings.set(id, building);
    this.buildingData[id] = data;
    
    // Add to map
    await building.addToMap(game.mapRenderer);
    
    // Track special buildings
    this.trackSpecialBuilding(building);
    
    // Mark for save
    this.markDirty();
    
    globalEvents.emit(GAME_EVENTS.BUILDING_PLACED, building);
    
    return building;
  }
  
  /**
   * Remove a building
   */
  removeBuilding(id: string): boolean {
    const building = this.buildings.get(id);
    if (!building) return false;
    
    // Remove from map
    building.removeFromMap();
    
    // Remove from data
    this.buildings.delete(id);
    delete this.buildingData[id];
    delete this.buildingResourceData[id];
    delete this.buildingHealthData[id];
    
    // Mark for save
    this.markDirty();
    
    globalEvents.emit(GAME_EVENTS.BUILDING_DESTROYED, building);
    
    return true;
  }
  
  /**
   * Move a building to new position
   */
  moveBuilding(id: string, gridX: number, gridY: number): boolean {
    const building = this.buildings.get(id);
    if (!building) return false;
    
    // Check if we can place here
    if (!this.canPlaceBuildingAt(building, gridX, gridY)) {
      return false;
    }
    
    // Update position
    building.setPosition(gridX, gridY);
    
    // Update data
    if (this.buildingData[id]) {
      this.buildingData[id].x = gridX;
      this.buildingData[id].y = gridY;
    }
    
    // Mark for save
    this.markDirty();
    
    return true;
  }
  
  /**
   * Check if a building type can be placed at position
   */
  canPlaceBuilding(_type: number, gridX: number, gridY: number): boolean {
    // TODO: Implement proper collision checking
    // Check bounds
    if (gridX < 0 || gridY < 0) return false;
    if (gridX >= game.state.mapWidth || gridY >= game.state.mapHeight) return false;
    
    // Check for overlaps with existing buildings
    // This is a simplified check - full implementation would check tile occupation
    for (const building of this.buildings.values()) {
      const dx = Math.abs(building.gridX - gridX);
      const dy = Math.abs(building.gridY - gridY);
      if (dx < 3 && dy < 3) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Check if a specific building can be placed at position
   */
  canPlaceBuildingAt(building: Building, gridX: number, gridY: number): boolean {
    // Check bounds
    if (gridX < 0 || gridY < 0) return false;
    if (gridX >= game.state.mapWidth || gridY >= game.state.mapHeight) return false;
    
    // Check for overlaps with other buildings (exclude self)
    for (const other of this.buildings.values()) {
      if (other === building) continue;
      
      const dx = Math.abs(other.gridX - gridX);
      const dy = Math.abs(other.gridY - gridY);
      if (dx < 3 && dy < 3) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Generate a unique building ID
   */
  private generateBuildingId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `b_${timestamp}_${random}`;
  }
  
  /**
   * Mark base as needing save
   */
  markDirty(): void {
    this.saveCounter++;
  }
  
  /**
   * Save base to server
   */
  async save(): Promise<boolean> {
    if (this.isSaving || this.isLoading) {
      return false;
    }
    
    // Don't save if not in build mode
    if (game.state.mode !== BaseMode.BUILD && game.state.mode !== BaseMode.IBUILD) {
      return false;
    }
    
    this.isSaving = true;
    
    try {
      const saveData: BaseSaveData = {
        baseid: this.baseId,
        buildingdata: this.buildingData,
        buildingresources: this.buildingResourceData,
        resources: {
          r1: this.resources.r1.Get(),
          r2: this.resources.r2.Get(),
          r3: this.resources.r3.Get(),
          r4: this.resources.r4.Get(),
        },
        credits: this.credits.Get(),
        monsters: this.rawMonsters,
        academy: this.academyData,
        champion: this.championData,
        lockerdata: this.lockerData,
      };
      
      const response = await network.saveBase(saveData);
      
      if (response.error) {
        console.error('Failed to save base:', response.error);
        this.isSaving = false;
        return false;
      }
      
      this.lastSaveId++;
      this.lastSaveTime = Date.now();
      this.isSaving = false;
      
      globalEvents.emit(GAME_EVENTS.BASE_SAVED);
      
      return true;
      
    } catch (error) {
      console.error('Failed to save base:', error);
      this.isSaving = false;
      return false;
    }
  }
  
  /**
   * Update resources
   */
  updateResources(r1: number, r2: number, r3: number, r4: number): void {
    this.resources.r1.Set(r1);
    this.resources.r2.Set(r2);
    this.resources.r3.Set(r3);
    this.resources.r4.Set(r4);
    
    // Update global state
    game.state.resources.r1.Set(r1);
    game.state.resources.r2.Set(r2);
    game.state.resources.r3.Set(r3);
    game.state.resources.r4.Set(r4);
    
    globalEvents.emit(GAME_EVENTS.RESOURCES_CHANGED, this.resources);
    this.markDirty();
  }
  
  /**
   * Add resources
   */
  addResources(r1: number, r2: number, r3: number, r4: number): void {
    this.resources.r1.Add(r1);
    this.resources.r2.Add(r2);
    this.resources.r3.Add(r3);
    this.resources.r4.Add(r4);
    
    // Update global state
    game.state.resources.r1.Add(r1);
    game.state.resources.r2.Add(r2);
    game.state.resources.r3.Add(r3);
    game.state.resources.r4.Add(r4);
    
    globalEvents.emit(GAME_EVENTS.RESOURCES_CHANGED, this.resources);
    this.markDirty();
  }
  
  /**
   * Deduct resources
   */
  deductResources(r1: number, r2: number, r3: number, r4: number): boolean {
    // Check if we have enough
    if (this.resources.r1.Get() < r1 ||
        this.resources.r2.Get() < r2 ||
        this.resources.r3.Get() < r3 ||
        this.resources.r4.Get() < r4) {
      return false;
    }
    
    this.resources.r1.Subtract(r1);
    this.resources.r2.Subtract(r2);
    this.resources.r3.Subtract(r3);
    this.resources.r4.Subtract(r4);
    
    // Update global state
    game.state.resources.r1.Subtract(r1);
    game.state.resources.r2.Subtract(r2);
    game.state.resources.r3.Subtract(r3);
    game.state.resources.r4.Subtract(r4);
    
    globalEvents.emit(GAME_EVENTS.RESOURCES_CHANGED, this.resources);
    this.markDirty();
    
    return true;
  }
  
  /**
   * Game tick update
   */
  tick(delta: number): void {
    // Update all buildings
    for (const building of this.buildings.values()) {
      building.tick(delta);
    }
    
    // Auto-save periodically (every 60 seconds if dirty)
    const now = Date.now();
    if (this.saveCounter > 0 && now - this.lastSaveTime > 60000) {
      this.save();
    }
  }
  
  /**
   * Get town hall level
   */
  getTownHallLevel(): number {
    return this.townHall?.level.Get() ?? 0;
  }
  
  /**
   * Get total storage capacity
   */
  getStorageCapacity(): { r1: number; r2: number; r3: number; r4: number } {
    let capacity = { r1: 0, r2: 0, r3: 0, r4: 0 };
    
    // Sum up all silo capacities
    const silos = this.getBuildingsByType(BUILDING_TYPES.SILO);
    for (const silo of silos) {
      const siloCapacity = silo.getCapacity();
      capacity.r1 += siloCapacity;
      capacity.r2 += siloCapacity;
      capacity.r3 += siloCapacity;
      capacity.r4 += siloCapacity;
    }
    
    return capacity;
  }
  
  /**
   * Get number of buildings of a type
   */
  getBuildingCount(type: number): number {
    return this.getBuildingsByType(type).length;
  }
  
  /**
   * Clear all buildings (for loading new base)
   */
  clear(): void {
    for (const building of this.buildings.values()) {
      building.removeFromMap();
    }
    this.buildings.clear();
    this.buildingData = {};
    this.buildingResourceData = {};
    this.buildingHealthData = {};
  }
}
