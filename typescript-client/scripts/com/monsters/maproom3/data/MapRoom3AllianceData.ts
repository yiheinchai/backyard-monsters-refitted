/**
 * Map Room 3 alliance data - stores alliance info for map room 3.
 */
export class MapRoom3AllianceData {
    private m_Name: string = "";
    private m_AllianceId: number = -1;
    private m_ImageId: number = 1;

    constructor(data: Record<string, any>) {
        this.Map(data);
    }

    public get name(): string {
        return this.m_Name;
    }

    public get allianceId(): number {
        return this.m_AllianceId;
    }

    public get imageId(): number {
        return this.m_ImageId;
    }

    public Map(data: Record<string, any>): void {
        this.m_Name = data.hasOwnProperty("name") ? String(data["name"]) : "";
        this.m_AllianceId = data.hasOwnProperty("alliance_id") ? Number(data["alliance_id"]) : -1;
        this.m_ImageId = data.hasOwnProperty("image") ? Number(data["image"]) : 1;
    }
}
