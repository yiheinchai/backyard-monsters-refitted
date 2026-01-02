/**
 * BuildingProperties - Data definitions for all buildings
 * Ported from ActionScript YARD_PROPS.as
 */

import { BUILDING_TYPES, BuildingGroup } from '../../core/config';

export interface BuildingCost {
  r1: number;  // Twigs
  r2: number;  // Pebbles
  r3: number;  // Putty
  r4: number;  // Goo
  time: number; // Build time in seconds
  shiny?: number; // Premium currency cost
}

export interface BuildingLevelData {
  hp: number;
  cost: BuildingCost;
  requirements?: {
    townHallLevel?: number;
    buildingType?: number;
    buildingLevel?: number;
  };
  // Type-specific properties
  capacity?: number;        // Storage/Housing capacity
  production?: number;      // Production rate
  cycleTime?: number;       // Production cycle time
  damage?: number;          // Tower damage
  range?: number;           // Tower range
  attackSpeed?: number;     // Tower attack speed
}

export interface BuildingDefinition {
  id: number;
  name: string;
  description: string;
  group: BuildingGroup;
  size: number;             // Grid size (size x size)
  maxLevel: number;
  maxCount: number;         // Max buildings of this type
  levels: BuildingLevelData[];
  icon?: string;
  isWall?: boolean;
  isTrap?: boolean;
  isDefense?: boolean;
}

// Building definitions - this is the equivalent of YARD_PROPS data
export const BUILDING_DEFINITIONS: Record<number, BuildingDefinition> = {
  [BUILDING_TYPES.TOWN_HALL]: {
    id: BUILDING_TYPES.TOWN_HALL,
    name: 'Town Hall',
    description: 'The heart of your base. Upgrade to unlock new buildings and increase base value.',
    group: BuildingGroup.SPECIAL,
    size: 4,
    maxLevel: 10,
    maxCount: 1,
    levels: [
      { hp: 5000, cost: { r1: 0, r2: 0, r3: 0, r4: 0, time: 0 }, capacity: 50000 },
      { hp: 6500, cost: { r1: 2500, r2: 2500, r3: 2500, r4: 0, time: 300 }, capacity: 100000, requirements: { townHallLevel: 1 } },
      { hp: 8000, cost: { r1: 12500, r2: 12500, r3: 12500, r4: 0, time: 1800 }, capacity: 200000, requirements: { townHallLevel: 2 } },
      { hp: 10000, cost: { r1: 50000, r2: 50000, r3: 50000, r4: 0, time: 7200 }, capacity: 400000, requirements: { townHallLevel: 3 } },
      { hp: 12500, cost: { r1: 200000, r2: 200000, r3: 200000, r4: 0, time: 28800 }, capacity: 800000, requirements: { townHallLevel: 4 } },
      { hp: 15500, cost: { r1: 500000, r2: 500000, r3: 500000, r4: 0, time: 86400 }, capacity: 1600000, requirements: { townHallLevel: 5 } },
      { hp: 19000, cost: { r1: 1000000, r2: 1000000, r3: 1000000, r4: 0, time: 172800 }, capacity: 3200000, requirements: { townHallLevel: 6 } },
      { hp: 23000, cost: { r1: 2000000, r2: 2000000, r3: 2000000, r4: 0, time: 345600 }, capacity: 6400000, requirements: { townHallLevel: 7 } },
      { hp: 28000, cost: { r1: 4000000, r2: 4000000, r3: 4000000, r4: 0, time: 518400 }, capacity: 12800000, requirements: { townHallLevel: 8 } },
      { hp: 34000, cost: { r1: 8000000, r2: 8000000, r3: 8000000, r4: 0, time: 691200 }, capacity: 25600000, requirements: { townHallLevel: 9 } },
    ],
  },
  
  [BUILDING_TYPES.HATCHERY]: {
    id: BUILDING_TYPES.HATCHERY,
    name: 'Hatchery',
    description: 'Hatch monsters to defend your base or attack others.',
    group: BuildingGroup.HOUSING,
    size: 3,
    maxLevel: 6,
    maxCount: 4,
    levels: [
      { hp: 3000, cost: { r1: 500, r2: 500, r3: 0, r4: 0, time: 30 } },
      { hp: 3600, cost: { r1: 2000, r2: 2000, r3: 0, r4: 0, time: 120 }, requirements: { townHallLevel: 2 } },
      { hp: 4320, cost: { r1: 8000, r2: 8000, r3: 0, r4: 0, time: 600 }, requirements: { townHallLevel: 3 } },
      { hp: 5184, cost: { r1: 32000, r2: 32000, r3: 0, r4: 0, time: 2400 }, requirements: { townHallLevel: 4 } },
      { hp: 6220, cost: { r1: 128000, r2: 128000, r3: 0, r4: 0, time: 7200 }, requirements: { townHallLevel: 5 } },
      { hp: 7464, cost: { r1: 512000, r2: 512000, r3: 0, r4: 0, time: 28800 }, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.HOUSING]: {
    id: BUILDING_TYPES.HOUSING,
    name: 'Monster Housing',
    description: 'Provides housing space for your monsters.',
    group: BuildingGroup.HOUSING,
    size: 2,
    maxLevel: 6,
    maxCount: 20,
    levels: [
      { hp: 2000, cost: { r1: 200, r2: 200, r3: 0, r4: 0, time: 15 }, capacity: 50 },
      { hp: 2400, cost: { r1: 800, r2: 800, r3: 0, r4: 0, time: 60 }, capacity: 100, requirements: { townHallLevel: 2 } },
      { hp: 2880, cost: { r1: 3200, r2: 3200, r3: 0, r4: 0, time: 300 }, capacity: 200, requirements: { townHallLevel: 3 } },
      { hp: 3456, cost: { r1: 12800, r2: 12800, r3: 0, r4: 0, time: 1200 }, capacity: 400, requirements: { townHallLevel: 4 } },
      { hp: 4147, cost: { r1: 51200, r2: 51200, r3: 0, r4: 0, time: 3600 }, capacity: 800, requirements: { townHallLevel: 5 } },
      { hp: 4976, cost: { r1: 204800, r2: 204800, r3: 0, r4: 0, time: 14400 }, capacity: 1600, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.SILO]: {
    id: BUILDING_TYPES.SILO,
    name: 'Silo',
    description: 'Stores resources for your base.',
    group: BuildingGroup.RESOURCES,
    size: 2,
    maxLevel: 6,
    maxCount: 10,
    levels: [
      { hp: 1500, cost: { r1: 100, r2: 100, r3: 0, r4: 0, time: 10 }, capacity: 100000 },
      { hp: 1800, cost: { r1: 400, r2: 400, r3: 0, r4: 0, time: 30 }, capacity: 200000, requirements: { townHallLevel: 2 } },
      { hp: 2160, cost: { r1: 1600, r2: 1600, r3: 0, r4: 0, time: 120 }, capacity: 400000, requirements: { townHallLevel: 3 } },
      { hp: 2592, cost: { r1: 6400, r2: 6400, r3: 0, r4: 0, time: 600 }, capacity: 800000, requirements: { townHallLevel: 4 } },
      { hp: 3110, cost: { r1: 25600, r2: 25600, r3: 0, r4: 0, time: 1800 }, capacity: 1600000, requirements: { townHallLevel: 5 } },
      { hp: 3732, cost: { r1: 102400, r2: 102400, r3: 0, r4: 0, time: 7200 }, capacity: 3200000, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.RESOURCE_HARVESTER_TWIG]: {
    id: BUILDING_TYPES.RESOURCE_HARVESTER_TWIG,
    name: 'Twig Snapper',
    description: 'Harvests Twigs for your base.',
    group: BuildingGroup.RESOURCES,
    size: 2,
    maxLevel: 6,
    maxCount: 10,
    levels: [
      { hp: 1000, cost: { r1: 50, r2: 50, r3: 0, r4: 0, time: 5 }, production: 100, capacity: 5000, cycleTime: 60 },
      { hp: 1200, cost: { r1: 200, r2: 200, r3: 0, r4: 0, time: 15 }, production: 200, capacity: 10000, cycleTime: 60, requirements: { townHallLevel: 2 } },
      { hp: 1440, cost: { r1: 800, r2: 800, r3: 0, r4: 0, time: 60 }, production: 400, capacity: 20000, cycleTime: 60, requirements: { townHallLevel: 3 } },
      { hp: 1728, cost: { r1: 3200, r2: 3200, r3: 0, r4: 0, time: 300 }, production: 800, capacity: 40000, cycleTime: 60, requirements: { townHallLevel: 4 } },
      { hp: 2073, cost: { r1: 12800, r2: 12800, r3: 0, r4: 0, time: 900 }, production: 1600, capacity: 80000, cycleTime: 60, requirements: { townHallLevel: 5 } },
      { hp: 2488, cost: { r1: 51200, r2: 51200, r3: 0, r4: 0, time: 3600 }, production: 3200, capacity: 160000, cycleTime: 60, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.RESOURCE_HARVESTER_PEBBLE]: {
    id: BUILDING_TYPES.RESOURCE_HARVESTER_PEBBLE,
    name: 'Pebble Shiner',
    description: 'Harvests Pebbles for your base.',
    group: BuildingGroup.RESOURCES,
    size: 2,
    maxLevel: 6,
    maxCount: 10,
    levels: [
      { hp: 1000, cost: { r1: 50, r2: 50, r3: 0, r4: 0, time: 5 }, production: 100, capacity: 5000, cycleTime: 60 },
      { hp: 1200, cost: { r1: 200, r2: 200, r3: 0, r4: 0, time: 15 }, production: 200, capacity: 10000, cycleTime: 60, requirements: { townHallLevel: 2 } },
      { hp: 1440, cost: { r1: 800, r2: 800, r3: 0, r4: 0, time: 60 }, production: 400, capacity: 20000, cycleTime: 60, requirements: { townHallLevel: 3 } },
      { hp: 1728, cost: { r1: 3200, r2: 3200, r3: 0, r4: 0, time: 300 }, production: 800, capacity: 40000, cycleTime: 60, requirements: { townHallLevel: 4 } },
      { hp: 2073, cost: { r1: 12800, r2: 12800, r3: 0, r4: 0, time: 900 }, production: 1600, capacity: 80000, cycleTime: 60, requirements: { townHallLevel: 5 } },
      { hp: 2488, cost: { r1: 51200, r2: 51200, r3: 0, r4: 0, time: 3600 }, production: 3200, capacity: 160000, cycleTime: 60, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.RESOURCE_HARVESTER_PUTTY]: {
    id: BUILDING_TYPES.RESOURCE_HARVESTER_PUTTY,
    name: 'Putty Squisher',
    description: 'Harvests Putty for your base.',
    group: BuildingGroup.RESOURCES,
    size: 2,
    maxLevel: 6,
    maxCount: 10,
    levels: [
      { hp: 1000, cost: { r1: 100, r2: 100, r3: 0, r4: 0, time: 10 }, production: 100, capacity: 5000, cycleTime: 60 },
      { hp: 1200, cost: { r1: 400, r2: 400, r3: 0, r4: 0, time: 30 }, production: 200, capacity: 10000, cycleTime: 60, requirements: { townHallLevel: 2 } },
      { hp: 1440, cost: { r1: 1600, r2: 1600, r3: 0, r4: 0, time: 120 }, production: 400, capacity: 20000, cycleTime: 60, requirements: { townHallLevel: 3 } },
      { hp: 1728, cost: { r1: 6400, r2: 6400, r3: 0, r4: 0, time: 600 }, production: 800, capacity: 40000, cycleTime: 60, requirements: { townHallLevel: 4 } },
      { hp: 2073, cost: { r1: 25600, r2: 25600, r3: 0, r4: 0, time: 1800 }, production: 1600, capacity: 80000, cycleTime: 60, requirements: { townHallLevel: 5 } },
      { hp: 2488, cost: { r1: 102400, r2: 102400, r3: 0, r4: 0, time: 7200 }, production: 3200, capacity: 160000, cycleTime: 60, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.RESOURCE_HARVESTER_GOO]: {
    id: BUILDING_TYPES.RESOURCE_HARVESTER_GOO,
    name: 'Goo Factory',
    description: 'Harvests Goo for your base.',
    group: BuildingGroup.RESOURCES,
    size: 3,
    maxLevel: 6,
    maxCount: 6,
    levels: [
      { hp: 2000, cost: { r1: 1000, r2: 1000, r3: 1000, r4: 0, time: 60 }, production: 50, capacity: 2500, cycleTime: 60, requirements: { townHallLevel: 3 } },
      { hp: 2400, cost: { r1: 4000, r2: 4000, r3: 4000, r4: 0, time: 300 }, production: 100, capacity: 5000, cycleTime: 60, requirements: { townHallLevel: 3 } },
      { hp: 2880, cost: { r1: 16000, r2: 16000, r3: 16000, r4: 0, time: 1200 }, production: 200, capacity: 10000, cycleTime: 60, requirements: { townHallLevel: 4 } },
      { hp: 3456, cost: { r1: 64000, r2: 64000, r3: 64000, r4: 0, time: 3600 }, production: 400, capacity: 20000, cycleTime: 60, requirements: { townHallLevel: 5 } },
      { hp: 4147, cost: { r1: 256000, r2: 256000, r3: 256000, r4: 0, time: 14400 }, production: 800, capacity: 40000, cycleTime: 60, requirements: { townHallLevel: 6 } },
      { hp: 4976, cost: { r1: 1024000, r2: 1024000, r3: 1024000, r4: 0, time: 43200 }, production: 1600, capacity: 80000, cycleTime: 60, requirements: { townHallLevel: 7 } },
    ],
  },
  
  [BUILDING_TYPES.SNIPER_TOWER]: {
    id: BUILDING_TYPES.SNIPER_TOWER,
    name: 'Sniper Tower',
    description: 'Long-range defensive tower with high accuracy.',
    group: BuildingGroup.DEFENSE,
    size: 2,
    maxLevel: 6,
    maxCount: 20,
    isDefense: true,
    levels: [
      { hp: 2500, cost: { r1: 500, r2: 500, r3: 500, r4: 0, time: 30 }, damage: 50, range: 200, attackSpeed: 1.5 },
      { hp: 3000, cost: { r1: 2000, r2: 2000, r3: 2000, r4: 0, time: 120 }, damage: 75, range: 220, attackSpeed: 1.4, requirements: { townHallLevel: 2 } },
      { hp: 3600, cost: { r1: 8000, r2: 8000, r3: 8000, r4: 0, time: 600 }, damage: 112, range: 240, attackSpeed: 1.3, requirements: { townHallLevel: 3 } },
      { hp: 4320, cost: { r1: 32000, r2: 32000, r3: 32000, r4: 0, time: 2400 }, damage: 168, range: 260, attackSpeed: 1.2, requirements: { townHallLevel: 4 } },
      { hp: 5184, cost: { r1: 128000, r2: 128000, r3: 128000, r4: 0, time: 7200 }, damage: 252, range: 280, attackSpeed: 1.1, requirements: { townHallLevel: 5 } },
      { hp: 6220, cost: { r1: 512000, r2: 512000, r3: 512000, r4: 0, time: 28800 }, damage: 378, range: 300, attackSpeed: 1.0, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.CANNON_TOWER]: {
    id: BUILDING_TYPES.CANNON_TOWER,
    name: 'Cannon Tower',
    description: 'Powerful defensive tower with splash damage.',
    group: BuildingGroup.DEFENSE,
    size: 2,
    maxLevel: 6,
    maxCount: 20,
    isDefense: true,
    levels: [
      { hp: 3000, cost: { r1: 750, r2: 750, r3: 750, r4: 0, time: 45 }, damage: 80, range: 150, attackSpeed: 2.0 },
      { hp: 3600, cost: { r1: 3000, r2: 3000, r3: 3000, r4: 0, time: 180 }, damage: 120, range: 160, attackSpeed: 1.9, requirements: { townHallLevel: 2 } },
      { hp: 4320, cost: { r1: 12000, r2: 12000, r3: 12000, r4: 0, time: 900 }, damage: 180, range: 170, attackSpeed: 1.8, requirements: { townHallLevel: 3 } },
      { hp: 5184, cost: { r1: 48000, r2: 48000, r3: 48000, r4: 0, time: 3600 }, damage: 270, range: 180, attackSpeed: 1.7, requirements: { townHallLevel: 4 } },
      { hp: 6220, cost: { r1: 192000, r2: 192000, r3: 192000, r4: 0, time: 10800 }, damage: 405, range: 190, attackSpeed: 1.6, requirements: { townHallLevel: 5 } },
      { hp: 7464, cost: { r1: 768000, r2: 768000, r3: 768000, r4: 0, time: 43200 }, damage: 607, range: 200, attackSpeed: 1.5, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.WALL]: {
    id: BUILDING_TYPES.WALL,
    name: 'Block',
    description: 'Basic defensive wall to slow down attackers.',
    group: BuildingGroup.WALLS,
    size: 1,
    maxLevel: 6,
    maxCount: 500,
    isWall: true,
    levels: [
      { hp: 500, cost: { r1: 50, r2: 50, r3: 0, r4: 0, time: 1 } },
      { hp: 1000, cost: { r1: 200, r2: 200, r3: 0, r4: 0, time: 2 }, requirements: { townHallLevel: 2 } },
      { hp: 2000, cost: { r1: 800, r2: 800, r3: 0, r4: 0, time: 3 }, requirements: { townHallLevel: 3 } },
      { hp: 4000, cost: { r1: 3200, r2: 3200, r3: 0, r4: 0, time: 4 }, requirements: { townHallLevel: 4 } },
      { hp: 8000, cost: { r1: 12800, r2: 12800, r3: 0, r4: 0, time: 5 }, requirements: { townHallLevel: 5 } },
      { hp: 16000, cost: { r1: 51200, r2: 51200, r3: 0, r4: 0, time: 6 }, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.MAP_ROOM]: {
    id: BUILDING_TYPES.MAP_ROOM,
    name: 'Map Room',
    description: 'Access the world map to attack other players.',
    group: BuildingGroup.SPECIAL,
    size: 3,
    maxLevel: 3,
    maxCount: 1,
    levels: [
      { hp: 4000, cost: { r1: 2000, r2: 2000, r3: 2000, r4: 0, time: 120 }, requirements: { townHallLevel: 2 } },
      { hp: 5000, cost: { r1: 10000, r2: 10000, r3: 10000, r4: 0, time: 600 }, requirements: { townHallLevel: 4 } },
      { hp: 6500, cost: { r1: 50000, r2: 50000, r3: 50000, r4: 0, time: 3600 }, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.FLINGER]: {
    id: BUILDING_TYPES.FLINGER,
    name: 'Monster Flinger',
    description: 'Fling monsters during attacks.',
    group: BuildingGroup.SPECIAL,
    size: 3,
    maxLevel: 4,
    maxCount: 1,
    levels: [
      { hp: 3000, cost: { r1: 1000, r2: 1000, r3: 1000, r4: 0, time: 60 }, requirements: { townHallLevel: 2 } },
      { hp: 3600, cost: { r1: 5000, r2: 5000, r3: 5000, r4: 0, time: 300 }, requirements: { townHallLevel: 3 } },
      { hp: 4320, cost: { r1: 25000, r2: 25000, r3: 25000, r4: 0, time: 1800 }, requirements: { townHallLevel: 4 } },
      { hp: 5184, cost: { r1: 125000, r2: 125000, r3: 125000, r4: 0, time: 7200 }, requirements: { townHallLevel: 5 } },
    ],
  },
  
  [BUILDING_TYPES.MONSTER_LOCKER]: {
    id: BUILDING_TYPES.MONSTER_LOCKER,
    name: 'Monster Locker',
    description: 'Store monsters for transfer between bases.',
    group: BuildingGroup.SPECIAL,
    size: 2,
    maxLevel: 6,
    maxCount: 1,
    levels: [
      { hp: 2000, cost: { r1: 1000, r2: 1000, r3: 0, r4: 0, time: 30 }, capacity: 100 },
      { hp: 2400, cost: { r1: 4000, r2: 4000, r3: 0, r4: 0, time: 120 }, capacity: 200, requirements: { townHallLevel: 2 } },
      { hp: 2880, cost: { r1: 16000, r2: 16000, r3: 0, r4: 0, time: 600 }, capacity: 400, requirements: { townHallLevel: 3 } },
      { hp: 3456, cost: { r1: 64000, r2: 64000, r3: 0, r4: 0, time: 2400 }, capacity: 800, requirements: { townHallLevel: 4 } },
      { hp: 4147, cost: { r1: 256000, r2: 256000, r3: 0, r4: 0, time: 7200 }, capacity: 1600, requirements: { townHallLevel: 5 } },
      { hp: 4976, cost: { r1: 1024000, r2: 1024000, r3: 0, r4: 0, time: 28800 }, capacity: 3200, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.ACADEMY]: {
    id: BUILDING_TYPES.ACADEMY,
    name: 'Monster Academy',
    description: 'Train your monsters to increase their level.',
    group: BuildingGroup.SPECIAL,
    size: 3,
    maxLevel: 4,
    maxCount: 1,
    levels: [
      { hp: 3000, cost: { r1: 2000, r2: 2000, r3: 2000, r4: 0, time: 120 }, requirements: { townHallLevel: 3 } },
      { hp: 3600, cost: { r1: 10000, r2: 10000, r3: 10000, r4: 0, time: 600 }, requirements: { townHallLevel: 4 } },
      { hp: 4320, cost: { r1: 50000, r2: 50000, r3: 50000, r4: 0, time: 3600 }, requirements: { townHallLevel: 5 } },
      { hp: 5184, cost: { r1: 250000, r2: 250000, r3: 250000, r4: 0, time: 14400 }, requirements: { townHallLevel: 6 } },
    ],
  },
  
  [BUILDING_TYPES.MONSTER_LAB]: {
    id: BUILDING_TYPES.MONSTER_LAB,
    name: 'Monster Lab',
    description: 'Research and unlock new monsters.',
    group: BuildingGroup.SPECIAL,
    size: 3,
    maxLevel: 4,
    maxCount: 1,
    levels: [
      { hp: 4000, cost: { r1: 5000, r2: 5000, r3: 5000, r4: 0, time: 300 }, requirements: { townHallLevel: 3 } },
      { hp: 4800, cost: { r1: 25000, r2: 25000, r3: 25000, r4: 0, time: 1800 }, requirements: { townHallLevel: 4 } },
      { hp: 5760, cost: { r1: 125000, r2: 125000, r3: 125000, r4: 0, time: 7200 }, requirements: { townHallLevel: 5 } },
      { hp: 6912, cost: { r1: 625000, r2: 625000, r3: 625000, r4: 0, time: 28800 }, requirements: { townHallLevel: 6 } },
    ],
  },
};

/**
 * Get building definition by type
 */
export function getBuildingDefinition(type: number): BuildingDefinition | undefined {
  return BUILDING_DEFINITIONS[type];
}

/**
 * Get all building definitions
 */
export function getAllBuildingDefinitions(): BuildingDefinition[] {
  return Object.values(BUILDING_DEFINITIONS);
}

/**
 * Get buildings by group
 */
export function getBuildingsByGroup(group: BuildingGroup): BuildingDefinition[] {
  return getAllBuildingDefinitions().filter(b => b.group === group);
}

/**
 * Get building cost for a level
 */
export function getBuildingCost(type: number, level: number): BuildingCost | undefined {
  const def = getBuildingDefinition(type);
  if (!def || level < 1 || level > def.levels.length) {
    return undefined;
  }
  return def.levels[level - 1].cost;
}

/**
 * Get building HP for a level
 */
export function getBuildingHP(type: number, level: number): number {
  const def = getBuildingDefinition(type);
  if (!def || level < 1 || level > def.levels.length) {
    return 0;
  }
  return def.levels[level - 1].hp;
}

/**
 * Check if building requirements are met
 */
export function canBuildBuilding(type: number, level: number, townHallLevel: number): boolean {
  const def = getBuildingDefinition(type);
  if (!def || level < 1 || level > def.levels.length) {
    return false;
  }
  
  const levelData = def.levels[level - 1];
  if (levelData.requirements?.townHallLevel) {
    if (townHallLevel < levelData.requirements.townHallLevel) {
      return false;
    }
  }
  
  return true;
}
