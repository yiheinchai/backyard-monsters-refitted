/**
 * BuildingManager - Manages all buildings on the map
 * 
 * Handles creation, destruction, selection, and updates of buildings
 */

import { Building } from './Building';
import { BuildingData, BuildingProps } from '../types/game';
import { BASE } from '../core/Base';
import { GLOBAL } from '../core/Global';
import { MAP } from '../rendering/Map';
import { EventEmitter } from '../core/EventEmitter';

// Building type IDs (from original game)
export const BUILDING_TYPES = {
  TOWN_HALL: 1,
  HATCHERY: 2,
  TWIG_SNAPPER: 3,
  PEBBLE_SHINER: 4,
  FLINGER: 5,
  SILO: 6,
  SILO_2: 7,
  MAP_ROOM: 8,
  MONSTER_JUICER: 9,
  CANNON_TOWER: 10,
  SNIPER_TOWER: 11,
  LASER_TOWER: 12,
  TESLA_TOWER: 13,
  HOUSING: 14,
  HOUSING_2: 15,
  HATCHERY_CC: 16,
  GUARD_TOWER: 17,
  MONSTER_LAB: 18,
  MONSTER_LOCKER: 19,
  FLAK_TOWER: 20,
  MONSTER_ACADEMY: 21,
  MONSTER_BUNKER: 22,
  WALL_1: 25,
  WALL_2: 26,
  WALL_3: 27,
  YARD_PLANNER: 28,
  GENERAL_STORE: 29,
  SIEGE_FACTORY: 30,
  SIEGE_LAB: 31,
  CHAMPION_CAGE: 32,
  CHAMPION_CHAMBER: 33,
  CATAPULT: 34,
  MONSTER_BAITER: 35,
  RADIO_TOWER: 36,
  OUTPOST_DEFENDER: 37,
};

// Building sizes (grid units)
export const BUILDING_SIZES: Record<number, number> = {
  [BUILDING_TYPES.TOWN_HALL]: 4,
  [BUILDING_TYPES.HATCHERY]: 3,
  [BUILDING_TYPES.TWIG_SNAPPER]: 2,
  [BUILDING_TYPES.PEBBLE_SHINER]: 2,
  [BUILDING_TYPES.FLINGER]: 3,
  [BUILDING_TYPES.SILO]: 2,
  [BUILDING_TYPES.SILO_2]: 2,
  [BUILDING_TYPES.MAP_ROOM]: 3,
  [BUILDING_TYPES.MONSTER_JUICER]: 2,
  [BUILDING_TYPES.CANNON_TOWER]: 2,
  [BUILDING_TYPES.SNIPER_TOWER]: 2,
  [BUILDING_TYPES.LASER_TOWER]: 2,
  [BUILDING_TYPES.TESLA_TOWER]: 2,
  [BUILDING_TYPES.HOUSING]: 2,
  [BUILDING_TYPES.HOUSING_2]: 2,
  [BUILDING_TYPES.HATCHERY_CC]: 3,
  [BUILDING_TYPES.GUARD_TOWER]: 2,
  [BUILDING_TYPES.MONSTER_LAB]: 3,
  [BUILDING_TYPES.MONSTER_LOCKER]: 3,
  [BUILDING_TYPES.FLAK_TOWER]: 2,
  [BUILDING_TYPES.MONSTER_ACADEMY]: 3,
  [BUILDING_TYPES.MONSTER_BUNKER]: 2,
  [BUILDING_TYPES.WALL_1]: 1,
  [BUILDING_TYPES.WALL_2]: 1,
  [BUILDING_TYPES.WALL_3]: 1,
  [BUILDING_TYPES.YARD_PLANNER]: 2,
  [BUILDING_TYPES.GENERAL_STORE]: 2,
  [BUILDING_TYPES.SIEGE_FACTORY]: 3,
  [BUILDING_TYPES.SIEGE_LAB]: 3,
  [BUILDING_TYPES.CHAMPION_CAGE]: 2,
  [BUILDING_TYPES.CHAMPION_CHAMBER]: 3,
  [BUILDING_TYPES.CATAPULT]: 2,
  [BUILDING_TYPES.MONSTER_BAITER]: 2,
  [BUILDING_TYPES.RADIO_TOWER]: 2,
  [BUILDING_TYPES.OUTPOST_DEFENDER]: 3,
};

// Building names
export const BUILDING_NAMES: Record<number, string> = {
  [BUILDING_TYPES.TOWN_HALL]: 'Town Hall',
  [BUILDING_TYPES.HATCHERY]: 'Hatchery',
  [BUILDING_TYPES.TWIG_SNAPPER]: 'Twig Snapper',
  [BUILDING_TYPES.PEBBLE_SHINER]: 'Pebble Shiner',
  [BUILDING_TYPES.FLINGER]: 'Flinger',
  [BUILDING_TYPES.SILO]: 'Silo',
  [BUILDING_TYPES.SILO_2]: 'Silo',
  [BUILDING_TYPES.MAP_ROOM]: 'Map Room',
  [BUILDING_TYPES.MONSTER_JUICER]: 'Monster Juicer',
  [BUILDING_TYPES.CANNON_TOWER]: 'Cannon Tower',
  [BUILDING_TYPES.SNIPER_TOWER]: 'Sniper Tower',
  [BUILDING_TYPES.LASER_TOWER]: 'Laser Tower',
  [BUILDING_TYPES.TESLA_TOWER]: 'Tesla Tower',
  [BUILDING_TYPES.HOUSING]: 'Monster Housing',
  [BUILDING_TYPES.HOUSING_2]: 'Monster Housing',
  [BUILDING_TYPES.HATCHERY_CC]: 'Hatchery Control Center',
  [BUILDING_TYPES.GUARD_TOWER]: 'Guard Tower',
  [BUILDING_TYPES.MONSTER_LAB]: 'Monster Lab',
  [BUILDING_TYPES.MONSTER_LOCKER]: 'Monster Locker',
  [BUILDING_TYPES.FLAK_TOWER]: 'Flak Tower',
  [BUILDING_TYPES.MONSTER_ACADEMY]: 'Monster Academy',
  [BUILDING_TYPES.MONSTER_BUNKER]: 'Monster Bunker',
  [BUILDING_TYPES.WALL_1]: 'Block',
  [BUILDING_TYPES.WALL_2]: 'Block',
  [BUILDING_TYPES.WALL_3]: 'Block',
  [BUILDING_TYPES.YARD_PLANNER]: 'Yard Planner',
  [BUILDING_TYPES.GENERAL_STORE]: 'General Store',
  [BUILDING_TYPES.SIEGE_FACTORY]: 'Siege Factory',
  [BUILDING_TYPES.SIEGE_LAB]: 'Siege Lab',
  [BUILDING_TYPES.CHAMPION_CAGE]: 'Champion Cage',
  [BUILDING_TYPES.CHAMPION_CHAMBER]: 'Champion Chamber',
  [BUILDING_TYPES.CATAPULT]: 'Catapult',
  [BUILDING_TYPES.MONSTER_BAITER]: 'Monster Baiter',
  [BUILDING_TYPES.RADIO_TOWER]: 'Radio Tower',
  [BUILDING_TYPES.OUTPOST_DEFENDER]: 'Outpost Defender',
};

class BuildingManagerClass extends EventEmitter {
  private _buildings: Map<number, Building> = new Map();
  private _selectedBuilding: Building | null = null;
  private _newBuilding: Building | null = null;
  private _initialized: boolean = false;

  constructor() {
    super();
  }

  /**
   * Initialize the building manager
   */
  async init(): Promise<void> {
    if (this._initialized) return;

    console.log('[BuildingManager] Initializing...');

    // Listen for base load events
    BASE.on('loadComplete', (...args: unknown[]) => {
      const data = args[0] as { buildings: BuildingData[] };
      this.loadBuildings(data.buildings);
    });

    BASE.on('buildingAdded', (...args: unknown[]) => {
      const data = args[0] as BuildingData;
      this.createBuilding(data);
    });

    BASE.on('buildingRemoved', (...args: unknown[]) => {
      const data = args[0] as BuildingData;
      this.removeBuilding(data.id);
    });

    this._initialized = true;
    console.log('[BuildingManager] Initialized');
  }

  /**
   * Load buildings from data array
   */
  loadBuildings(buildingsData: BuildingData[]): void {
    console.log(`[BuildingManager] Loading ${buildingsData.length} buildings`);

    // Clear existing buildings
    this.clear();

    // Create buildings from data
    for (const data of buildingsData) {
      this.createBuilding(data);
    }

    // Sort by depth
    MAP.sortDepth();

    this.emit('buildingsLoaded', this._buildings.size);
  }

  /**
   * Create a building from data
   */
  createBuilding(data: BuildingData): Building {
    // Get building properties
    const props = this.getBuildingProps(data.type);

    // Create building instance
    const building = new Building({
      data,
      props,
      interactive: GLOBAL.mode === 'build',
    });

    // Setup event handlers
    building.on('click', (...args: unknown[]) => {
      const b = args[0] as Building;
      this.selectBuilding(b);
    });

    building.on('buildComplete', (...args: unknown[]) => {
      const b = args[0] as Building;
      this.emit('buildingComplete', b);
    });

    building.on('upgradeComplete', (...args: unknown[]) => {
      const b = args[0] as Building;
      this.emit('upgradeComplete', b);
    });

    // Add to map
    building.addToMap();

    // Store reference
    this._buildings.set(data.id, building);

    this.emit('buildingCreated', building);
    return building;
  }

  /**
   * Get building properties by type
   */
  getBuildingProps(type: number): BuildingProps {
    // Return basic props - in full implementation would load from GLOBAL._buildingProps
    return {
      id: type,
      type: BUILDING_NAMES[type] || 'Unknown',
      size: BUILDING_SIZES[type] || 2,
      quantity: [1],
      hp: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      repairTime: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      costs: [],
    };
  }

  /**
   * Remove a building by ID
   */
  removeBuilding(id: number): void {
    const building = this._buildings.get(id);
    if (building) {
      if (this._selectedBuilding === building) {
        this.deselectBuilding();
      }
      building.destroy();
      this._buildings.delete(id);
      this.emit('buildingRemoved', id);
    }
  }

  /**
   * Select a building
   */
  selectBuilding(building: Building): void {
    // Deselect current
    if (this._selectedBuilding && this._selectedBuilding !== building) {
      this._selectedBuilding.setSelected(false);
    }

    // Select new
    this._selectedBuilding = building;
    building.setSelected(true);

    this.emit('buildingSelected', building);
  }

  /**
   * Deselect current building
   */
  deselectBuilding(): void {
    if (this._selectedBuilding) {
      this._selectedBuilding.setSelected(false);
      this._selectedBuilding = null;
      this.emit('buildingDeselected');
    }
  }

  /**
   * Get building at grid position
   */
  getBuildingAt(gridX: number, gridY: number): Building | null {
    for (const building of this._buildings.values()) {
      const bx = building.gridX;
      const by = building.gridY;
      const size = building.size;

      // Check if point is within building footprint
      if (gridX >= bx && gridX < bx + size && gridY >= by && gridY < by + size) {
        return building;
      }
    }
    return null;
  }

  /**
   * Check if position is valid for building
   */
  isPositionValid(gridX: number, gridY: number, size: number, excludeId?: number): boolean {
    // Check bounds
    if (gridX < 0 || gridY < 0 || gridX + size > 100 || gridY + size > 100) {
      return false;
    }

    // Check for collisions with other buildings
    for (const building of this._buildings.values()) {
      if (building.data.id === excludeId) continue;

      const bx = building.gridX;
      const by = building.gridY;
      const bs = building.size;

      // Check for overlap
      if (!(gridX + size <= bx || gridX >= bx + bs || gridY + size <= by || gridY >= by + bs)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Update all buildings (tick)
   */
  tick(ticks: number = 1): void {
    for (const building of this._buildings.values()) {
      building.tick(ticks);
    }
  }

  /**
   * Clear all buildings
   */
  clear(): void {
    this.deselectBuilding();
    for (const building of this._buildings.values()) {
      building.destroy();
    }
    this._buildings.clear();
    this.emit('cleared');
  }

  /**
   * Get building by ID
   */
  getBuilding(id: number): Building | undefined {
    return this._buildings.get(id);
  }

  /**
   * Get all buildings
   */
  getAllBuildings(): Building[] {
    return Array.from(this._buildings.values());
  }

  /**
   * Get buildings by type
   */
  getBuildingsByType(type: number): Building[] {
    return Array.from(this._buildings.values()).filter(b => b.type === type);
  }

  /**
   * Get building count
   */
  get buildingCount(): number {
    return this._buildings.size;
  }

  /**
   * Get selected building
   */
  get selectedBuilding(): Building | null {
    return this._selectedBuilding;
  }

  /**
   * Get town hall
   */
  get townHall(): Building | null {
    return this.getBuildingsByType(BUILDING_TYPES.TOWN_HALL)[0] || null;
  }

  /**
   * Get hatchery
   */
  get hatchery(): Building | null {
    return this.getBuildingsByType(BUILDING_TYPES.HATCHERY)[0] || null;
  }

  /**
   * Get map room
   */
  get mapRoom(): Building | null {
    return this.getBuildingsByType(BUILDING_TYPES.MAP_ROOM)[0] || null;
  }
}

export const BuildingManager = new BuildingManagerClass();
