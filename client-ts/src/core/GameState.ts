/**
 * GameState - Central state management for the game
 * Ported from ActionScript GLOBAL.as static variables
 */

import { SecNum } from '../utils/SecNum';
import { BaseMode, YardType, CONFIG } from './config';

export interface Resources {
  r1: SecNum; // Twigs/Bone
  r2: SecNum; // Pebbles/Coal
  r3: SecNum; // Putty/Sulfur
  r4: SecNum; // Goo/Magma
}

export interface PlayerData {
  id: number;
  name: string;
  lastName?: string;
  picture?: string;
  email?: string;
  timePlayed: number;
  level: number;
}

export class GameState {
  // Server/Version info
  public version: SecNum = new SecNum(CONFIG.VERSION);
  public debugMode: boolean = false;
  
  // Connection state
  public connectionLost: boolean = false;
  public connectionCounter: number = 0;
  
  // Game flags
  public halted: boolean = false;
  public loading: boolean = false;
  public saving: boolean = false;
  public catchup: boolean = false;
  public render: boolean = false;
  
  // Screen dimensions
  public screenWidth: number = CONFIG.SCREEN_WIDTH;
  public screenHeight: number = CONFIG.SCREEN_HEIGHT;
  public screenInitWidth: number = CONFIG.SCREEN_WIDTH;
  public screenInitHeight: number = CONFIG.SCREEN_HEIGHT;
  
  // Frame/Time tracking
  public frameNumber: number = 0;
  public timestamp: number = 0;
  public timePlayed: number = 0;
  public lastActivityFrame: number = 0;
  
  // Player info
  public playerId: number = 0;
  public playerName: string = '';
  public playerLastName: string = '';
  public playerPicture: string = '';
  public playerEmail: string = '';
  public playerLevel: number = 0;
  public sessionCount: number = 0;
  public friendCount: number = 0;
  
  // Currency
  public credits: number = 0;
  
  // Resources (player's home base)
  public resources: Resources = {
    r1: new SecNum(0),
    r2: new SecNum(0),
    r3: new SecNum(0),
    r4: new SecNum(0),
  };
  
  // Attacker resources (when attacking)
  public attackerResources: Resources = {
    r1: new SecNum(0),
    r2: new SecNum(0),
    r3: new SecNum(0),
    r4: new SecNum(0),
  };
  
  // Current base info
  public baseId: number = 0;
  public homeBaseId: number = 0;
  public mode: BaseMode = BaseMode.BUILD;
  public loadMode: BaseMode = BaseMode.BUILD;
  public yardType: YardType = YardType.MAIN_YARD;
  
  // Map info
  public mapVersion: number = 0;
  public mapWidth: number = CONFIG.MAP_WIDTH;
  public mapHeight: number = CONFIG.MAP_HEIGHT;
  
  // Zoom
  public zoomed: boolean = false;
  public magnification: number = 1;
  
  // Special features
  public hasInferno: boolean = false;
  
  // Selected items
  public selectedBuildingId: string | null = null;
  public newBuildingId: string | null = null;
  
  // Outposts
  public outpostIds: number[] = [];
  public outpostCapacity: SecNum = new SecNum(2000000);
  
  // Champion/Guardian data
  public playerGuardianData: object[] = [];
  public playerCatapultLevel: SecNum = new SecNum(0);
  public playerFlingerLevel: SecNum = new SecNum(0);
  
  // Creature management
  public creepCount: number = 0;
  
  // Powerups/Overdrives
  public hatcheryOverdrive: number = 0;
  public hatcheryOverdrivePower: SecNum = new SecNum(0);
  public harvesterOverdrive: number = 0;
  public harvesterOverdrivePower: SecNum = new SecNum(0);
  public extraHousing: number = 0;
  public extraHousingPower: SecNum = new SecNum(0);
  public towerOverdrive: SecNum = new SecNum(0);
  public monsterOverdrive: SecNum = new SecNum(0);
  public monsterDefenseOverdrive: SecNum = new SecNum(0);
  public monsterSpeedOverdrive: SecNum = new SecNum(0);
  
  // Stats
  public otherStats: Record<string, number | string> = {};
  public flags: Record<string, unknown> = {};
  
  // Settings
  public settings: Record<string, unknown> = {};
  
  constructor() {
    // Initialize with defaults
    this.reset();
  }
  
  /**
   * Reset state to defaults
   */
  reset(): void {
    this.frameNumber = 0;
    this.timestamp = 0;
    this.timePlayed = 0;
    this.halted = false;
    this.catchup = false;
    this.render = false;
    this.zoomed = false;
    this.magnification = 1;
    this.creepCount = 0;
    this.selectedBuildingId = null;
    this.newBuildingId = null;
  }
  
  /**
   * Get current timestamp
   */
  getTimestamp(): number {
    return this.timestamp;
  }
  
  /**
   * Increment timestamp
   */
  tick(): void {
    this.timestamp++;
    this.frameNumber++;
  }
  
  /**
   * Check if in attack mode
   */
  isInAttackMode(): boolean {
    return this.mode === BaseMode.ATTACK ||
           this.mode === BaseMode.WMATTACK ||
           this.mode === BaseMode.IATTACK ||
           this.mode === BaseMode.IWMATTACK;
  }
  
  /**
   * Check if in inferno mode
   */
  isInfernoMode(mode?: BaseMode): boolean {
    const checkMode = mode || this.mode;
    return checkMode === BaseMode.IBUILD ||
           checkMode === BaseMode.IATTACK ||
           checkMode === BaseMode.IVIEW ||
           checkMode === BaseMode.IHELP ||
           checkMode === BaseMode.IWMATTACK ||
           checkMode === BaseMode.IWMVIEW;
  }
  
  /**
   * Check if at home base
   */
  isAtHome(): boolean {
    return this.mode === BaseMode.BUILD &&
           (this.yardType === YardType.MAIN_YARD || this.yardType === YardType.INFERNO_YARD);
  }
  
  /**
   * Check if defending
   */
  isDefending(): boolean {
    return this.mode === BaseMode.BUILD || this.mode === BaseMode.IBUILD;
  }
  
  /**
   * Get next creep ID
   */
  getNextCreepId(): number {
    this.creepCount++;
    return this.creepCount;
  }
  
  /**
   * Get a stat value
   */
  getStat(key: string): number | string | undefined {
    return this.otherStats[key];
  }
  
  /**
   * Set a stat value
   */
  setStat(key: string, value: number | string): void {
    this.otherStats[key] = value;
  }
  
  /**
   * Get resource name based on current yard type
   */
  getResourceName(resourceKey: string): string {
    const isInferno = this.isInfernoMode();
    const names = isInferno ? CONFIG.INFERNO_RESOURCE_NAMES : CONFIG.RESOURCE_NAMES;
    
    switch (resourceKey) {
      case 'r1': return names[0];
      case 'r2': return names[1];
      case 'r3': return names[2];
      case 'r4': return names[3];
      case 'shiny': return names[4];
      case 'time': return names[5];
      default: return '???';
    }
  }
  
  /**
   * Get total resources value
   */
  getTotalResources(): number {
    return this.resources.r1.Get() +
           this.resources.r2.Get() +
           this.resources.r3.Get() +
           this.resources.r4.Get();
  }
  
  /**
   * Convert mode to default (non-inferno) version
   */
  infernoToDefaultMode(mode: BaseMode): BaseMode {
    switch (mode) {
      case BaseMode.IBUILD: return BaseMode.BUILD;
      case BaseMode.IVIEW: return BaseMode.VIEW;
      case BaseMode.IATTACK: return BaseMode.ATTACK;
      case BaseMode.IHELP: return BaseMode.HELP;
      case BaseMode.IWMVIEW: return BaseMode.WMVIEW;
      case BaseMode.IWMATTACK: return BaseMode.WMATTACK;
      default: return mode;
    }
  }
}
