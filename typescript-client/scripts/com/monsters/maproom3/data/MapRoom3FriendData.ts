/**
 * Map room 3 friend data - represents friend data for relocation.
 */
export class MapRoom3FriendData {
    private m_FacebookId: string;
    private m_Name: string;
    private m_UserId: number;
    private m_Level: number;
    private m_World: number;
    private m_BaseX: number;
    private m_BaseY: number;
    private m_IsInPlayersWorld: boolean;

    constructor(data: Record<string, any>) {
        this.Map(data);
    }

    public get facebookId(): string {
        return this.m_FacebookId;
    }

    public get name(): string {
        return this.m_Name;
    }

    public get userId(): number {
        return this.m_UserId;
    }

    public get level(): number {
        return this.m_Level;
    }

    public get world(): number {
        return this.m_World;
    }

    public get baseX(): number {
        return this.m_BaseX;
    }

    public get baseY(): number {
        return this.m_BaseY;
    }

    public get isInPlayersWorld(): boolean {
        return this.m_IsInPlayersWorld;
    }

    public Map(data: Record<string, any>): void {
        this.m_FacebookId = data.hasOwnProperty("fbid") ? String(data["fbid"]) : "";
        this.m_Name = data.hasOwnProperty("name") ? String(data["name"]) : "";
        this.m_UserId = data.hasOwnProperty("userid") ? parseInt(data["userid"]) : -1;
        this.m_Level = data.hasOwnProperty("level") ? parseInt(data["level"]) : 0;
        this.m_World = data.hasOwnProperty("worldid") ? parseInt(data["worldid"]) : 0;
        this.m_BaseX = data.hasOwnProperty("x") ? parseInt(data["x"]) : 0;
        this.m_BaseY = data.hasOwnProperty("y") ? parseInt(data["y"]) : 0;
        this.m_IsInPlayersWorld = data.hasOwnProperty("x") && data.hasOwnProperty("y");
    }
}
