import { EnumBaseRelationship } from "../../enums/EnumBaseRelationship";

/**
 * MapRoom3CellData - compact data structure for a map room 3 cell.
 * Uses bit fields for efficient memory storage.
 */
export class MapRoom3CellData {
    private static readonly MAX_BITS_BASE_LEVEL: number = 8;
    private static readonly MAX_BITS_PLAYER_LEVEL: number = 8;
    private static readonly MAX_BITS_ATTACK_RANGE: number = 8;
    private static readonly MAX_BITS_DAMAGE: number = 8;

    private static readonly MAX_VALUE_BASE_LEVEL: number = Math.pow(2, MapRoom3CellData.MAX_BITS_BASE_LEVEL) - 1;
    private static readonly MAX_VALUE_PLAYER_LEVEL: number = Math.pow(2, MapRoom3CellData.MAX_BITS_PLAYER_LEVEL) - 1;
    private static readonly MAX_VALUE_ATTACK_RANGE: number = Math.pow(2, MapRoom3CellData.MAX_BITS_ATTACK_RANGE) - 1;
    private static readonly MAX_VALUE_DAMAGE: number = Math.pow(2, MapRoom3CellData.MAX_BITS_DAMAGE) - 1;

    private static readonly BIT_SHIFT_BASE_LEVEL: number = 0;
    private static readonly BIT_SHIFT_PLAYER_LEVEL: number = MapRoom3CellData.BIT_SHIFT_BASE_LEVEL + MapRoom3CellData.MAX_BITS_BASE_LEVEL;
    private static readonly BIT_SHIFT_ATTACK_RANGE: number = MapRoom3CellData.BIT_SHIFT_PLAYER_LEVEL + MapRoom3CellData.MAX_BITS_PLAYER_LEVEL;
    private static readonly BIT_SHIFT_DAMAGE: number = MapRoom3CellData.BIT_SHIFT_ATTACK_RANGE + MapRoom3CellData.MAX_BITS_ATTACK_RANGE;

    private static readonly MAX_BITS_WILD_MONSTER_TRIBE_ID: number = 3;
    private static readonly MAX_BITS_RELATIONSHIP: number = 3;
    private static readonly MAX_BITS_LOCKED_INVISIBLE: number = 2;
    private static readonly MAX_BITS_FACEBOOK_FRIEND: number = 1;
    private static readonly MAX_BITS_DAMAGE_PROTECTION: number = 1;
    private static readonly MAX_BITS_DESTROYED: number = 1;
    private static readonly MAX_BITS_TRUCE: number = 1;

    private static readonly MAX_VALUE_WILD_MONSTER_TRIBE_ID: number = Math.pow(2, MapRoom3CellData.MAX_BITS_WILD_MONSTER_TRIBE_ID) - 1;
    private static readonly MAX_VALUE_RELATIONSHIP: number = Math.pow(2, MapRoom3CellData.MAX_BITS_RELATIONSHIP) - 1;
    private static readonly MAX_VALUE_LOCKED_INVISIBLE: number = Math.pow(2, MapRoom3CellData.MAX_BITS_LOCKED_INVISIBLE) - 1;
    private static readonly MAX_VALUE_FACEBOOK_FRIEND: number = Math.pow(2, MapRoom3CellData.MAX_BITS_FACEBOOK_FRIEND) - 1;
    private static readonly MAX_VALUE_DAMAGE_PROTECTION: number = Math.pow(2, MapRoom3CellData.MAX_BITS_DAMAGE_PROTECTION) - 1;
    private static readonly MAX_VALUE_DESTROYED: number = Math.pow(2, MapRoom3CellData.MAX_BITS_DESTROYED) - 1;
    private static readonly MAX_VALUE_TRUCE: number = Math.pow(2, MapRoom3CellData.MAX_BITS_TRUCE) - 1;

    private static readonly BIT_SHIFT_WILD_MONSTER_TRIBE_ID: number = 0;
    private static readonly BIT_SHIFT_RELATIONSHIP: number = MapRoom3CellData.BIT_SHIFT_WILD_MONSTER_TRIBE_ID + MapRoom3CellData.MAX_BITS_WILD_MONSTER_TRIBE_ID;
    private static readonly BIT_SHIFT_LOCKED_INVISIBLE: number = MapRoom3CellData.BIT_SHIFT_RELATIONSHIP + MapRoom3CellData.MAX_BITS_RELATIONSHIP;
    private static readonly BIT_SHIFT_FACEBOOK_FRIEND: number = MapRoom3CellData.BIT_SHIFT_LOCKED_INVISIBLE + MapRoom3CellData.MAX_BITS_LOCKED_INVISIBLE;
    private static readonly BIT_SHIFT_DAMAGE_PROTECTION: number = MapRoom3CellData.BIT_SHIFT_FACEBOOK_FRIEND + MapRoom3CellData.MAX_BITS_FACEBOOK_FRIEND;
    private static readonly BIT_SHIFT_DESTROYED: number = MapRoom3CellData.BIT_SHIFT_DAMAGE_PROTECTION + MapRoom3CellData.MAX_BITS_DAMAGE_PROTECTION;
    private static readonly BIT_SHIFT_TRUCE: number = MapRoom3CellData.BIT_SHIFT_DESTROYED + MapRoom3CellData.MAX_BITS_DESTROYED;

    private m_Name: string = "";
    private m_FacebookId: string = "";
    private m_AllianceId: number = 0;
    private m_BaseId: number = 0;
    private m_UserId: number = 0;
    private m_CellDataBitField1: number = 0;
    private m_CellDataBitField2: number = 0;

    constructor(cellData: Record<string, any>) {
        this.Map(cellData);
    }

    public get name(): string {
        return this.m_Name;
    }

    public get facebookID(): string {
        return this.m_FacebookId;
    }

    public get allianceID(): number {
        return this.m_AllianceId;
    }

    public get baseID(): number {
        return this.m_BaseId;
    }

    public get userID(): number {
        return this.m_UserId;
    }

    public get baseLevel(): number {
        return (this.m_CellDataBitField1 >> MapRoom3CellData.BIT_SHIFT_BASE_LEVEL) & MapRoom3CellData.MAX_VALUE_BASE_LEVEL;
    }

    public get playerLevel(): number {
        return (this.m_CellDataBitField1 >> MapRoom3CellData.BIT_SHIFT_PLAYER_LEVEL) & MapRoom3CellData.MAX_VALUE_PLAYER_LEVEL;
    }

    public get attackRange(): number {
        return (this.m_CellDataBitField1 >> MapRoom3CellData.BIT_SHIFT_ATTACK_RANGE) & MapRoom3CellData.MAX_VALUE_ATTACK_RANGE;
    }

    public get damage(): number {
        return (this.m_CellDataBitField1 >> MapRoom3CellData.BIT_SHIFT_DAMAGE) & MapRoom3CellData.MAX_VALUE_DAMAGE;
    }

    public get wildMonsterTribeId(): number {
        return (this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_WILD_MONSTER_TRIBE_ID) & MapRoom3CellData.MAX_VALUE_WILD_MONSTER_TRIBE_ID;
    }

    public get relationship(): number {
        return (this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_RELATIONSHIP) & MapRoom3CellData.MAX_VALUE_RELATIONSHIP;
    }

    public get isLocked(): boolean {
        return ((this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_LOCKED_INVISIBLE) & MapRoom3CellData.MAX_VALUE_LOCKED_INVISIBLE) === 1;
    }

    public get isInvisible(): boolean {
        return ((this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_LOCKED_INVISIBLE) & MapRoom3CellData.MAX_VALUE_LOCKED_INVISIBLE) === 2;
    }

    public get isFacebookFriend(): boolean {
        return ((this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_FACEBOOK_FRIEND) & MapRoom3CellData.MAX_VALUE_FACEBOOK_FRIEND) === 1;
    }

    public get hasDamageProtection(): boolean {
        return ((this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_DAMAGE_PROTECTION) & MapRoom3CellData.MAX_VALUE_DAMAGE_PROTECTION) === 1;
    }

    public get isDestroyed(): boolean {
        return ((this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_DESTROYED) & MapRoom3CellData.MAX_VALUE_DESTROYED) === 1;
    }

    public get hasTruce(): boolean {
        return ((this.m_CellDataBitField2 >> MapRoom3CellData.BIT_SHIFT_TRUCE) & MapRoom3CellData.MAX_VALUE_TRUCE) === 1;
    }

    public Map(cellData: Record<string, any>): void {
        this.m_Name = cellData.hasOwnProperty("n") ? String(cellData["n"]) : "";
        this.m_FacebookId = cellData.hasOwnProperty("fbid") ? String(cellData["fbid"]) : "";
        this.m_AllianceId = cellData.hasOwnProperty("aid") ? cellData["aid"] : 0;
        this.m_BaseId = cellData.hasOwnProperty("bid") ? Number(cellData["bid"]) : 0;
        this.m_UserId = cellData.hasOwnProperty("uid") ? cellData["uid"] : 0;
        this.m_CellDataBitField1 = 0;
        const baseLevel = cellData.hasOwnProperty("l") ? cellData["l"] : 0;
        const playerLevel = cellData.hasOwnProperty("pl") ? cellData["pl"] : 0;
        const attackRange = cellData.hasOwnProperty("r") ? cellData["r"] : 0;
        const damage = cellData.hasOwnProperty("dm") ? cellData["dm"] : 0;
        this.m_CellDataBitField1 |= (baseLevel & MapRoom3CellData.MAX_VALUE_BASE_LEVEL) << MapRoom3CellData.BIT_SHIFT_BASE_LEVEL;
        this.m_CellDataBitField1 |= (playerLevel & MapRoom3CellData.MAX_VALUE_PLAYER_LEVEL) << MapRoom3CellData.BIT_SHIFT_PLAYER_LEVEL;
        this.m_CellDataBitField1 |= (attackRange & MapRoom3CellData.MAX_VALUE_ATTACK_RANGE) << MapRoom3CellData.BIT_SHIFT_ATTACK_RANGE;
        this.m_CellDataBitField1 |= (damage & MapRoom3CellData.MAX_VALUE_DAMAGE) << MapRoom3CellData.BIT_SHIFT_DAMAGE;
        this.m_CellDataBitField2 = 0;
        const tribeId = cellData.hasOwnProperty("tid") ? cellData["tid"] : 0;
        const rel = cellData.hasOwnProperty("rel") ? cellData["rel"] : EnumBaseRelationship.k_RELATIONSHIP_NONE;
        const locked = cellData.hasOwnProperty("lo") ? cellData["lo"] : 0;
        const friend = cellData.hasOwnProperty("fr") ? cellData["fr"] : 0;
        const protection = cellData.hasOwnProperty("p") ? cellData["p"] : 0;
        const destroyed = cellData.hasOwnProperty("d") ? cellData["d"] : 0;
        const truce = cellData.hasOwnProperty("t") ? cellData["t"] : 0;
        this.m_CellDataBitField2 |= (tribeId & MapRoom3CellData.MAX_VALUE_WILD_MONSTER_TRIBE_ID) << MapRoom3CellData.BIT_SHIFT_WILD_MONSTER_TRIBE_ID;
        this.m_CellDataBitField2 |= (rel & MapRoom3CellData.MAX_VALUE_RELATIONSHIP) << MapRoom3CellData.BIT_SHIFT_RELATIONSHIP;
        this.m_CellDataBitField2 |= (locked & MapRoom3CellData.MAX_VALUE_LOCKED_INVISIBLE) << MapRoom3CellData.BIT_SHIFT_LOCKED_INVISIBLE;
        this.m_CellDataBitField2 |= (friend & MapRoom3CellData.MAX_VALUE_FACEBOOK_FRIEND) << MapRoom3CellData.BIT_SHIFT_FACEBOOK_FRIEND;
        this.m_CellDataBitField2 |= (protection & MapRoom3CellData.MAX_VALUE_DAMAGE_PROTECTION) << MapRoom3CellData.BIT_SHIFT_DAMAGE_PROTECTION;
        this.m_CellDataBitField2 |= (destroyed & MapRoom3CellData.MAX_VALUE_DESTROYED) << MapRoom3CellData.BIT_SHIFT_DESTROYED;
        this.m_CellDataBitField2 |= (truce & MapRoom3CellData.MAX_VALUE_TRUCE) << MapRoom3CellData.BIT_SHIFT_TRUCE;
    }
}
