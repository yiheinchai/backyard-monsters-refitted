/**
 * BUILDINGS - Building system for the Backyard Monsters client
 * This is the TypeScript equivalent of BUILDINGS.as
 */

// import { GLOBAL } from '@/core/Global';
import { SecNum } from '@/utils';
import { Building, BuildingProps, BuildingStatus } from '@/types';

// Building type IDs (from ActionScript)
export const BuildingTypes = {
  TOWN_HALL: 14,
  RESOURCE_GATHERER_1: 1,  // Twig Snapper
  RESOURCE_GATHERER_2: 2,  // Pebble Shiner
  RESOURCE_GATHERER_3: 3,  // Putty Squisher
  RESOURCE_GATHERER_4: 4,  // Goo Factory
  SILO_1: 10,              // Twig Storage
  SILO_2: 11,              // Pebble Storage
  SILO_3: 12,              // Putty Storage
  SILO_4: 13,              // Goo Storage
  HATCHERY: 15,
  HOUSING: 16,
  FLINGER: 5,
  CATAPULT: 6,
  MAP_ROOM: 8,
  MONSTER_LOCKER: 17,
  ACADEMY: 18,
  MONSTER_LAB: 19,
  MONSTER_JUICER: 9,
  TOWER_SNIPER: 20,
  TOWER_CANNON: 21,
  TOWER_LASER: 22,
  TOWER_TESLA: 23,
  TOWER_QUAKE: 24,
  BLOCK: 25,
  WALL: 26,
  BOOBY_TRAP: 27,
  MONSTER_BUNKER: 28,
  CHAMPION_CAGE: 29,
  CHAMPION_CHAMBER: 30,
  YARD_PLANNER: 31,
  SIEGE_LAB: 32,
  SIEGE_FACTORY: 33,
  STORE: 7,
  RADIO: 112,
  // Decorations
  DECORATION_1: 50,
  DECORATION_2: 51,
  MUSHROOM: 100,
  SHINY_MUSHROOM: 101
};

/**
 * Base building properties (simplified from YARD_PROPS)
 */
export const BUILDING_PROPS: Record<number, BuildingProps> = {
  [BuildingTypes.TOWN_HALL]: {
    id: BuildingTypes.TOWN_HALL,
    type: 'townhall',
    name: 'Town Hall',
    description: 'The heart of your base',
    size: 4,
    group: 1,
    attackgroup: 2,
    quantity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    costs: [{
      r1: 0, r2: 0, r3: 0, r4: 0, time: 0
    }],
    hp: [10000, 15000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000],
    repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
  },
  [BuildingTypes.HATCHERY]: {
    id: BuildingTypes.HATCHERY,
    type: 'hatchery',
    name: 'Hatchery',
    description: 'Breeds monsters',
    size: 4,
    group: 2,
    quantity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    costs: [{
      r1: 100, r2: 100, r3: 0, r4: 0, time: 60
    }, {
      r1: 500, r2: 500, r3: 0, r4: 0, time: 300
    }, {
      r1: 2000, r2: 2000, r3: 0, r4: 0, time: 900
    }],
    hp: [5000, 10000, 15000, 25000],
    repairTime: [30, 60, 120, 240]
  },
  [BuildingTypes.HOUSING]: {
    id: BuildingTypes.HOUSING,
    type: 'housing',
    name: 'Monster Housing',
    description: 'Houses your monsters',
    size: 3,
    group: 2,
    quantity: [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    costs: [{
      r1: 50, r2: 50, r3: 0, r4: 0, time: 30
    }],
    hp: [2000, 3000, 4000, 5000],
    repairTime: [15, 30, 45, 60],
    capacity: [20, 30, 40, 50, 60]
  }
};

/**
 * BUILDINGS class - manages all buildings in the game
 */
export class BUILDINGS {
  // Building list
  private static buildings: Map<string, BuildingInstance> = new Map();
  
  // Selected building
  static selectedBuilding: BuildingInstance | null = null;
  
  // New building being placed
  static newBuilding: BuildingInstance | null = null;

  /**
   * Initialize buildings system
   */
  static Setup(): void {
    BUILDINGS.buildings.clear();
    BUILDINGS.selectedBuilding = null;
    BUILDINGS.newBuilding = null;
  }

  /**
   * Load buildings from data
   */
  static LoadBuildings(buildingData: Building[]): void {
    BUILDINGS.buildings.clear();

    for (const data of buildingData) {
      const building = new BuildingInstance(data);
      BUILDINGS.buildings.set(data.id.toString(), building);
    }
  }

  /**
   * Get building by ID
   */
  static GetBuilding(id: string | number): BuildingInstance | undefined {
    return BUILDINGS.buildings.get(id.toString());
  }

  /**
   * Get all buildings
   */
  static GetAllBuildings(): BuildingInstance[] {
    return Array.from(BUILDINGS.buildings.values());
  }

  /**
   * Get buildings by type
   */
  static GetBuildingsByType(type: number): BuildingInstance[] {
    return BUILDINGS.GetAllBuildings().filter(b => b.type === type);
  }

  /**
   * Get building count by type
   */
  static GetBuildingCount(type: number): number {
    return BUILDINGS.GetBuildingsByType(type).length;
  }

  /**
   * Add a new building
   */
  static AddBuilding(building: BuildingInstance): void {
    BUILDINGS.buildings.set(building.id.toString(), building);
  }

  /**
   * Remove a building
   */
  static RemoveBuilding(id: string | number): void {
    BUILDINGS.buildings.delete(id.toString());
  }

  /**
   * Select a building
   */
  static SelectBuilding(building: BuildingInstance | null): void {
    if (BUILDINGS.selectedBuilding) {
      BUILDINGS.selectedBuilding.selected = false;
    }
    BUILDINGS.selectedBuilding = building;
    if (building) {
      building.selected = true;
    }
  }

  /**
   * Deselect current building
   */
  static DeselectBuilding(): void {
    BUILDINGS.SelectBuilding(null);
  }

  /**
   * Tick all buildings
   */
  static Tick(): void {
    BUILDINGS.buildings.forEach(building => {
      building.tick();
    });
  }

  /**
   * Get total housing capacity
   */
  static GetTotalHousingCapacity(): number {
    let total = 0;
    BUILDINGS.GetBuildingsByType(BuildingTypes.HOUSING).forEach(housing => {
      total += housing.getCapacity();
    });
    return total;
  }

  /**
   * Get total storage capacity for a resource
   */
  static GetStorageCapacity(resourceNum: number): number {
    let total = 0;
    const siloType = BuildingTypes.SILO_1 + resourceNum - 1;
    BUILDINGS.GetBuildingsByType(siloType).forEach(silo => {
      total += silo.getCapacity();
    });
    // Town hall also stores resources
    BUILDINGS.GetBuildingsByType(BuildingTypes.TOWN_HALL).forEach(th => {
      total += th.getCapacity();
    });
    return total;
  }

  /**
   * Check if can build type
   */
  static CanBuild(type: number, townHallLevel: number): boolean {
    const props = BUILDING_PROPS[type];
    if (!props) return false;
    
    const maxQuantity = props.quantity[townHallLevel] || 0;
    const currentCount = BUILDINGS.GetBuildingCount(type);
    
    return currentCount < maxQuantity;
  }

  /**
   * Get building props
   */
  static GetBuildingProps(type: number): BuildingProps | undefined {
    return BUILDING_PROPS[type];
  }
}

/**
 * BuildingInstance class - represents a single building
 */
export class BuildingInstance {
  // Building data
  id: number;
  type: number;
  x: number;
  y: number;
  level: SecNum;
  status: BuildingStatus;
  health: SecNum;
  maxHealth: SecNum;
  fortifyLevel: number;
  
  // Building state
  selected: boolean = false;
  damaged: boolean = false;
  destroyed: boolean = false;
  
  // Queue (for hatchery, etc)
  queue: unknown[] = [];
  
  // Stored resources (for silos)
  stored: SecNum;
  
  // Build/upgrade timer
  buildTime: SecNum;
  
  // Unique identifier
  uid: string;

  constructor(data: Building) {
    this.id = data.id;
    this.type = data.t;
    this.x = data.x;
    this.y = data.y;
    this.level = new SecNum(data.l || 1);
    this.status = data.s || BuildingStatus.NORMAL;
    this.health = new SecNum(data.h || 0);
    this.maxHealth = new SecNum(this.getMaxHealth());
    this.fortifyLevel = data.fl || 0;
    this.queue = data.q || [];
    this.stored = new SecNum(data.st || 0);
    this.buildTime = new SecNum(data.bu || 0);
    this.uid = data.uid || `${data.id}-${Date.now()}`;

    if (this.health.Get() === 0) {
      this.health.Set(this.maxHealth.Get());
    }
  }

  /**
   * Get building properties
   */
  get props(): BuildingProps | undefined {
    return BUILDING_PROPS[this.type];
  }

  /**
   * Get building name
   */
  get name(): string {
    return this.props?.name || 'Unknown Building';
  }

  /**
   * Get building size
   */
  get size(): number {
    return this.props?.size || 1;
  }

  /**
   * Tick update
   */
  tick(): void {
    // Process build time
    if (this.buildTime.Get() > 0) {
      this.buildTime.Subtract(1);
      
      if (this.buildTime.Get() <= 0) {
        this.onBuildComplete();
      }
    }

    // Check damage state
    this.damaged = this.health.Get() < this.maxHealth.Get();
    this.destroyed = this.health.Get() <= 0;
  }

  /**
   * Called when building is complete
   */
  private onBuildComplete(): void {
    if (this.status === BuildingStatus.BUILDING) {
      this.status = BuildingStatus.NORMAL;
    } else if (this.status === BuildingStatus.UPGRADING) {
      this.level.Add(1);
      this.status = BuildingStatus.NORMAL;
      this.maxHealth.Set(this.getMaxHealth());
      this.health.Set(this.maxHealth.Get());
    }
  }

  /**
   * Get max health for current level
   */
  getMaxHealth(): number {
    const props = this.props;
    if (!props) return 1000;
    
    const level = this.level.Get() - 1;
    return props.hp[level] || props.hp[0] || 1000;
  }

  /**
   * Get capacity for current level
   */
  getCapacity(): number {
    const props = this.props;
    if (!props || !props.capacity) return 0;
    
    const level = this.level.Get() - 1;
    return props.capacity[level] || props.capacity[0] || 0;
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health.Subtract(amount);
    if (this.health.Get() < 0) {
      this.health.Set(0);
    }
    this.damaged = true;
    if (this.health.Get() <= 0) {
      this.destroyed = true;
    }
  }

  /**
   * Repair building
   */
  repair(): void {
    this.health.Set(this.maxHealth.Get());
    this.damaged = false;
    this.destroyed = false;
  }

  /**
   * Start upgrade
   */
  startUpgrade(): boolean {
    const props = this.props;
    if (!props) return false;
    
    const nextLevel = this.level.Get();
    if (nextLevel >= props.costs.length) return false;
    
    const cost = props.costs[nextLevel];
    this.buildTime.Set(cost.time);
    this.status = BuildingStatus.UPGRADING;
    
    return true;
  }

  /**
   * Cancel upgrade/build
   */
  cancel(): void {
    this.buildTime.Set(0);
    this.status = BuildingStatus.NORMAL;
  }

  /**
   * Get build/upgrade progress (0-1)
   */
  getProgress(): number {
    const props = this.props;
    if (!props || this.status === BuildingStatus.NORMAL) return 1;
    
    const level = this.status === BuildingStatus.BUILDING ? 0 : this.level.Get();
    if (level >= props.costs.length) return 1;
    
    const totalTime = props.costs[level].time;
    const remaining = this.buildTime.Get();
    
    return 1 - (remaining / totalTime);
  }

  /**
   * Serialize to save data
   */
  toSaveData(): Building {
    return {
      id: this.id,
      t: this.type,
      x: this.x,
      y: this.y,
      l: this.level.Get(),
      s: this.status,
      h: this.health.Get(),
      fl: this.fortifyLevel,
      q: this.queue,
      bu: this.buildTime.Get(),
      st: this.stored.Get(),
      uid: this.uid
    };
  }
}

export default BUILDINGS;
