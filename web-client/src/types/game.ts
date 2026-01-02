// Game state types based on ActionScript GLOBAL.as

export interface GameResources {
  r1: SecNum; // Twigs/Bones
  r2: SecNum; // Pebbles/Coal
  r3: SecNum; // Putty/Sulfur
  r4: SecNum; // Goo/Magma
  [key: string]: SecNum; // Allow string indexing
}

export interface SecNum {
  value: number;
  Get(): number;
  Set(val: number): void;
  Add(val: number): void;
}

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
  IWMVIEW = 'iwmview',
}

export enum YardType {
  MAIN_YARD = 0,
  OUTPOST = 1,
  INFERNO_YARD = 2,
  PLAYER = 3,
  INFERNO_OUTPOST = 4,
}

export interface PlayerData {
  id: number;
  name: string;
  lastName: string;
  picture: string;
  timePlayed: number;
  email: string;
  level: number;
  isAttacking: boolean;
}

export interface BuildingCost {
  r1: SecNum;
  r2: SecNum;
  r3: SecNum;
  r4: SecNum;
  time: SecNum;
  re?: [number, number, number][]; // Requirements
}

export interface BuildingProps {
  id: number;
  type: string;
  size: number;
  cycle?: number;
  attackgroup?: number;
  quantity: number[];
  produce?: number;
  cycleTime?: number;
  hp: number[];
  repairTime: number[];
  capacity?: number[];
  costs: BuildingCost[];
  group?: number;
  block?: boolean;
  fortify_costs?: BuildingCost[];
}

export interface BuildingData {
  id: number;
  type: number;
  x: number;
  y: number;
  level: number;
  health: number;
  status: number;
  buildTime?: number;
  upgradeTime?: number;
  stored?: number;
  countdown?: number;
}

export interface MonsterData {
  type: number;
  level: number;
  count: number;
  status?: string;
}

export interface BaseData {
  id: number;
  name: string;
  seed: number;
  level: number;
  value: number;
  points: number;
  buildings: BuildingData[];
  monsters: MonsterData[];
  resources: GameResources;
  credits: number;
  timestamp: number;
  attackerId?: number;
}

export interface MapRoomCell {
  x: number;
  y: number;
  baseId: number;
  baseType: YardType;
  ownerId?: number;
  ownerName?: string;
  level?: number;
  protected?: boolean;
}

export interface CellData {
  x: number;
  y: number;
  data?: MapRoomCell;
}

export interface AttackData {
  countdown: number;
  attackerId: number;
  defenderId: number;
  attackerResources: GameResources;
  defenderResources: GameResources;
  deltaResources: Partial<GameResources>;
}

export interface GameFlags {
  viximo?: number;
  kongregate?: number;
  showProgressBar?: number;
  logfps?: boolean;
  midgameIncentive?: number;
  plinko?: number;
}

export interface ServerInitResponse {
  error?: string;
  versionMismatch?: boolean;
  debugMode?: boolean;
}

export interface LoginResponse {
  error: number | string;
  userid: number;
  username: string;
  last_name: string;
  pic_square: string;
  timeplayed: number;
  email: string;
  version: number;
  friendcount: number;
  sessioncount: number;
  addtime: number;
  mapversion: number;
  mailversion: number;
  soundversion: number;
  languageversion: number;
  app_id: string;
  tpid: string;
  currency_url: string;
  bookmarks?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  proxy_email?: string;
  sendgift?: number;
  sendinvite?: number;
  isfan?: number;
  ncpCandidate?: number;
  stats?: {
    inferno?: number;
  };
  token?: string;
}

export interface BaseLoadResponse {
  error?: number | string;
  baseid: number;
  basename: string;
  baseseed: number;
  baselevel: number;
  basevalue: number;
  basepoints: number;
  buildingdata: string; // JSON string
  monsterdata: string; // JSON string
  resources: GameResources;
  credits: number;
  timestamp: number;
  attackerid?: number;
  buildings?: BuildingData[];
  monsters?: MonsterData[];
  otherStats?: Record<string, unknown>;
}

export interface SaveResponse {
  error?: number | string;
  saveid?: number;
  timestamp?: number;
}
