import { ExposedStructure } from "../../../../utils/exposed/ExposedStructure";

/**
 * Properties for a creep at a specific upgrade level.
 */
export class CreepProps extends ExposedStructure {
    private m_Speed: number = 0;
    private m_Health: number = 0;
    private m_Damage: number = 0;
    private m_BuildTime: number = 0;
    private m_GooCost: number = 0;
    private m_StorageCost: number = 0;
    private m_Bucket: number = 0;
    private m_TargetGroup: number = 0;

    constructor() {
        super();
    }

    public get speed(): number {
        return this.m_Speed;
    }

    public set speed(value: number) {
        this.m_Speed = value;
    }

    public get health(): number {
        return this.m_Health;
    }

    public set health(value: number) {
        this.m_Health = value;
    }

    public get damage(): number {
        return this.m_Damage;
    }

    public set damage(value: number) {
        this.m_Damage = value;
    }

    public get buildTime(): number {
        return this.m_BuildTime;
    }

    public set buildTime(value: number) {
        this.m_BuildTime = value;
    }

    public get gooCost(): number {
        return this.m_GooCost;
    }

    public set gooCost(value: number) {
        this.m_GooCost = value;
    }

    public get storageCost(): number {
        return this.m_StorageCost;
    }

    public set storageCost(value: number) {
        this.m_StorageCost = value;
    }

    public get bucket(): number {
        return this.m_Bucket;
    }

    public set bucket(value: number) {
        this.m_Bucket = value;
    }

    public get targetGroup(): number {
        return this.m_TargetGroup;
    }

    public set targetGroup(value: number) {
        this.m_TargetGroup = value;
    }

    protected override _Init(): void {
        super._Init();
    }

    protected override _Destroy(): void {
        super._Destroy();
    }
}
