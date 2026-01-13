import { ExposedStructure } from "../../../utils/exposed/ExposedStructure";
import { CreepProps } from "./CreepProps";

/**
 * Upgrade data for a creep type.
 */
export class CreepUpgrade extends ExposedStructure {
    private m_UpgradePuttyCost: number = 0;
    private m_UpgradeTime: number = 0;
    private m_UpgradeProps: CreepProps;

    constructor() {
        super();
        this.m_UpgradeProps = new CreepProps();
    }

    public get upgradePuttyCost(): number {
        return this.m_UpgradePuttyCost;
    }

    public set upgradePuttyCost(value: number) {
        this.m_UpgradePuttyCost = value;
    }

    public get upgradeTime(): number {
        return this.m_UpgradeTime;
    }

    public set upgradeTime(value: number) {
        this.m_UpgradeTime = value;
    }

    public get upgradeProps(): CreepProps {
        return this.m_UpgradeProps;
    }

    public set upgradeProps(value: CreepProps) {
        this.m_UpgradeProps = value;
    }

    protected override _Init(): void {
        super._Init();
    }

    protected override _Destroy(): void {
        super._Destroy();
    }
}
