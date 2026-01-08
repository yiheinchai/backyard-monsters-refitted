import { ExposedObject } from "../../../../utils/exposed/ExposedObject";
import { CreepProps } from "./CreepProps";
import { CreepTypeManager } from "./CreepTypeManager";
import { CreepUpgrade } from "./CreepUpgrade";

interface CreepPropsData {
    speed: number[];
    health: number[];
    damage: number[];
    cTime: number[];
    cResource: number[];
    cStorage: number[];
    bucket: number[];
    targetGroup: number[];
}

/**
 * Definition for a type of creep/monster.
 */
export class CreepType extends ExposedObject {
    private m_Id: string = "";
    private m_Name: string = "";
    private m_Description: string = "";
    private m_Index: number = 0;
    private m_Page: number = 0;
    private m_Order: number = 0;
    private m_Resource: number = 0;
    private m_Time: number = 0;
    private m_Level: number = 0;
    private m_Stream: string[] = [];
    private m_BaseProps: CreepProps;
    private m_Upgrades: CreepUpgrade[] = [];

    public trainingCosts: number[][] = [];
    public props: CreepPropsData;
    public dependent: string = "";
    public type: string = "";
    public movement: string = "";
    public pathing: string = "";
    public blocked: boolean = false;
    public classType: any = null;

    constructor() {
        super();
        this.m_Stream = [];
        this.m_BaseProps = new CreepProps();
        this.m_Upgrades = [];
        this.trainingCosts = [];
        this.props = {
            speed: [],
            health: [],
            damage: [],
            cTime: [],
            cResource: [],
            cStorage: [],
            bucket: [],
            targetGroup: []
        };
    }

    public get id(): string {
        return this.m_Id;
    }

    public set id(value: string) {
        this.m_Id = value;
    }

    public get name(): string {
        return this.m_Name;
    }

    public set name(value: string) {
        this.m_Name = value;
    }

    public get description(): string {
        return this.m_Description;
    }

    public set description(value: string) {
        this.m_Description = value;
    }

    public get index(): number {
        return this.m_Index;
    }

    public set index(value: number) {
        this.m_Index = value;
    }

    public get page(): number {
        return this.m_Page;
    }

    public set page(value: number) {
        this.m_Page = value;
    }

    public get order(): number {
        return this.m_Order;
    }

    public set order(value: number) {
        this.m_Order = value;
    }

    public get resource(): number {
        return this.m_Resource;
    }

    public set resource(value: number) {
        this.m_Resource = value;
    }

    public get time(): number {
        return this.m_Time;
    }

    public set time(value: number) {
        this.m_Time = value;
    }

    public get level(): number {
        return this.m_Level;
    }

    public set level(value: number) {
        this.m_Level = value;
    }

    public get baseProps(): CreepProps {
        return this.m_BaseProps;
    }

    public set baseProps(value: CreepProps) {
        this.m_BaseProps = value;
    }

    public get upgrades(): CreepUpgrade[] {
        return this.m_Upgrades;
    }

    public set upgrades(value: CreepUpgrade[]) {
        this.m_Upgrades = value;
    }

    public get stream(): string[] {
        return this.m_Stream;
    }

    public set stream(value: string[]) {
        this.m_Stream = value;
    }

    protected override _Init(): void {
        super._Init();
        CreepTypeManager.instance.RegisterCreepType(this);
        
        this.props.speed = [this.m_BaseProps.speed];
        this.props.health = [this.m_BaseProps.health];
        this.props.damage = [this.m_BaseProps.damage];
        this.props.cTime = [this.m_BaseProps.buildTime];
        this.props.cResource = [this.m_BaseProps.gooCost];
        this.props.cStorage = [this.m_BaseProps.storageCost];
        this.props.bucket = [this.m_BaseProps.bucket];
        this.props.targetGroup = [this.m_BaseProps.targetGroup];
        
        const len = this.m_Upgrades.length;
        for (let i = 0; i < len; i++) {
            const upgrade = this.m_Upgrades[i];
            this.trainingCosts.push([upgrade.upgradePuttyCost, upgrade.upgradeTime]);
            this.props.speed.push(upgrade.upgradeProps.speed);
            this.props.health.push(upgrade.upgradeProps.health);
            this.props.damage.push(upgrade.upgradeProps.damage);
            this.props.cTime.push(upgrade.upgradeProps.buildTime);
            this.props.cResource.push(upgrade.upgradeProps.gooCost);
            this.props.cStorage.push(upgrade.upgradeProps.storageCost);
            this.props.bucket.push(upgrade.upgradeProps.bucket);
            this.props.targetGroup.push(upgrade.upgradeProps.targetGroup);
        }
    }

    protected override _Destroy(): void {
        CreepTypeManager.instance.DeregisterCreepType(this);
        this.trainingCosts.length = 0;
        (this as any).props = null;
        super._Destroy();
    }
}
