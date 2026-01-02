/**
 * Core type definitions for the Backyard Monsters client
 * These types mirror the data structures used in the ActionScript client
 */

// ==================== Server Response Types ====================

export interface ServerResponse<T = unknown> {
  error: number | string;
  [key: string]: T | number | string;
}

export interface InitResponse extends ServerResponse {
  debugMode?: boolean;
  versionMismatch?: boolean;
}

export interface LoginResponse extends ServerResponse {
  token?: string;
  userid?: number;
  username?: string;
  last_name?: string;
  pic_square?: string;
  timeplayed?: number;
  email?: string;
  friendcount?: number;
  sessioncount?: number;
  addtime?: number;
  mapversion?: number;
  mailversion?: number;
  soundversion?: number;
  languageversion?: number;
  app_id?: string;
  tpid?: string;
  currency_url?: string;
  bookmarks?: Record<string, unknown>;
  settings?: PlayerSettings;
  proxy_email?: string;
  sendgift?: number;
  sendinvite?: number;
  isfan?: number;
  ncpCandidate?: number;
  version?: number;
  stats?: PlayerStats;
}

export interface NewMapResponse extends ServerResponse {
  newmap: boolean;
  mapheaderurl: string;
}

export interface BaseLoadResponse extends ServerResponse {
  baseid?: number;
  userid?: number;
  basename?: string;
  baseseed?: number;
  basevalue?: number;
  basepoints?: number;
  buildingdata?: BuildingData;
  buildings?: Building[];
  monsters?: MonsterData;
  resources?: Resources;
  credits?: number;
  flags?: Flags;
  attackerarray?: unknown[];
  attackerbasearray?: unknown[];
  protected?: number;
  protectedtime?: number;
  timestamp?: number;
  catchuptime?: number;
  champion?: ChampionData;
  quests?: QuestData;
  inventory?: InventoryData;
  outposts?: OutpostData[];
  homebaseid?: number;
  upgrades?: UpgradeData;
  academy?: AcademyData;
  events?: EventData;
  lockerdata?: LockerData;
  purchasedata?: PurchaseData[];
  attacklog?: AttackLogEntry[];
  silos?: SiloData[];
}

export interface BaseSaveResponse extends ServerResponse {
  saveid?: number;
  timestamp?: number;
}

// ==================== Game State Types ====================

export interface Resources {
  r1: number;  // Twigs / Bone
  r2: number;  // Pebbles / Coal
  r3: number;  // Putty / Sulfur
  r4: number;  // Goo / Magma
  shiny?: number;
}

export interface Building {
  id: number;
  t: number;  // Type
  x: number;
  y: number;
  l: number;  // Level
  s: number;  // Status (0=normal, 1=building, 2=upgrading, etc.)
  h: number;  // Health points
  d?: number; // Damage
  fl?: number; // Fortify level
  q?: unknown[]; // Queue
  bu?: number; // Build time
  st?: number; // Stored resources
  uid?: string; // Unique ID
}

export interface BuildingData {
  [buildingId: string]: Building;
}

export interface MonsterData {
  [monsterId: string]: Monster;
}

export interface Monster {
  id: number;
  t: number;   // Type
  l: number;   // Level
  c: number;   // Count
  hp?: number; // Health points
}

export interface ChampionData {
  type?: number;
  level?: number;
  health?: number;
  name?: string;
  status?: number;
}

export interface QuestData {
  active?: Quest[];
  completed?: number[];
}

export interface Quest {
  id: number;
  progress: number;
  target: number;
}

export interface InventoryData {
  items?: InventoryItem[];
}

export interface InventoryItem {
  id: number;
  type: string;
  count: number;
}

export interface OutpostData {
  id: number;
  x: number;
  y: number;
  level: number;
}

export interface UpgradeData {
  [upgradeId: string]: number;
}

export interface AcademyData {
  research?: Research[];
  queue?: Research[];
}

export interface Research {
  id: number;
  level: number;
  time?: number;
}

export interface EventData {
  active?: GameEvent[];
}

export interface GameEvent {
  id: number;
  type: string;
  startTime: number;
  endTime: number;
}

export interface LockerData {
  monsters?: LockerMonster[];
}

export interface LockerMonster {
  type: number;
  count: number;
}

export interface PurchaseData {
  id: number;
  type: string;
  quantity: number;
}

export interface AttackLogEntry {
  id: number;
  attackerId: number;
  attackerName: string;
  time: number;
  result: string;
  damage: number;
  loot?: Resources;
}

export interface SiloData {
  id: number;
  type: number;
  stored: number;
  capacity: number;
}

// ==================== Player Types ====================

export interface PlayerSettings {
  music?: boolean;
  sound?: boolean;
  quality?: string;
  language?: string;
}

export interface PlayerStats {
  level?: number;
  points?: number;
  inferno?: number;
  attacks?: number;
  defenses?: number;
}

export interface Flags {
  [key: string]: number | boolean | string;
}

// ==================== UI Types ====================

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ==================== Building Properties ====================

export interface BuildingCost {
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  time: number;
  re?: number[][];  // Requirements
}

export interface BuildingProps {
  id: number;
  type: string;
  name: string;
  description?: string;
  size: number;
  group: number;
  attackgroup?: number;
  quantity: number[];
  costs: BuildingCost[];
  hp: number[];
  repairTime: number[];
  capacity?: number[];
  cycle?: number;
  cycleTime?: number;
  produce?: number;
  block?: boolean;
}

// ==================== Monster Properties ====================

export interface MonsterProps {
  id: number;
  name: string;
  description?: string;
  type: string;
  health: number[];
  damage: number[];
  speed: number[];
  housingSpace: number;
  costs: MonsterCost[];
  hatchTime: number[];
  movement?: string;  // "ground" | "flying"
}

export interface MonsterCost {
  r1?: number;
  r2?: number;
  r3?: number;
  r4?: number;
  goo?: number;
  time: number;
}

// ==================== Map Room Types ====================

export interface MapCell {
  x: number;
  y: number;
  type: number;  // 0=empty, 1=player, 2=wild, etc.
  baseId?: number;
  userId?: number;
  username?: string;
  level?: number;
  protected?: boolean;
  alliance?: string;
}

export interface MapRoomData {
  cells: MapCell[];
  version: number;
  playerCell?: MapCell;
}

// ==================== Event Types ====================

export interface GameEventData {
  type: string;
  data: unknown;
}

// ==================== Enum Types ====================

export enum YardType {
  MAIN_YARD = 0,
  OUTPOST = 1,
  INFERNO_YARD = 2,
  PLAYER = 3
}

export enum BaseMode {
  BUILD = 'build',
  ATTACK = 'attack',
  VIEW = 'view',
  HELP = 'help',
  WMATTACK = 'wmattack',
  WMVIEW = 'wmview',
  IBUILD = 'ibuild',
  IATTACK = 'iattack',
  IVIEW = 'iview',
  IHELP = 'ihelp',
  IWMATTACK = 'iwmattack',
  IWMVIEW = 'iwmview'
}

export enum BuildingStatus {
  NORMAL = 0,
  BUILDING = 1,
  UPGRADING = 2,
  DAMAGED = 3,
  DESTROYED = 4,
  FORTIFYING = 5
}

// ==================== Network Types ====================

export interface APIRequest {
  url: string;
  method: 'GET' | 'POST';
  data?: unknown;
  headers?: Record<string, string>;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}
