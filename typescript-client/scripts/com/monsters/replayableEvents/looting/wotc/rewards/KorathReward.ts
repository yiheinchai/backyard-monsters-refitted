import { SecNum } from "../../../../../cc/utils/SecNum";
import { ChampionBase } from "../../../../monsters/champions/ChampionBase";
import { Reward } from "../../../../rewarding/Reward";

import { GLOBAL } from "../../../../../../GLOBAL";
import { BASE } from "../../../../../../BASE";
import { CREATURES } from "../../../../../../CREATURES";
import { CHAMPIONCAGE } from "../../../../../../CHAMPIONCAGE";

/**
 * Korath reward - War of the Champs reward that grants Korath champion.
 */
export class KorathReward extends Reward {
    public static readonly k_REWARD_ID: string = "KorathReward";
    private static readonly k_KORATH_TYPE: string = "G4";

    constructor() {
        super();
    }

    public override set value(newValue: number) {
        if (newValue < this._value) {
            console.log("You are trying to lower your Korath powerlevel reward, you're not supposed to do that");
            return;
        }
        super.value = newValue;
    }

    protected override onApplication(): void {
        CHAMPIONCAGE._guardians[KorathReward.k_KORATH_TYPE].props.powerLevel = this._value;
        const champion: ChampionBase = CREATURES.getGuardian(4);
        if (champion) {
            champion._powerLevel.Set(this._value);
        }
        const guardianData: any = CHAMPIONCAGE.GetGuardianData(4);
        if (guardianData) {
            guardianData.pl = new SecNum(this._value);
        }
    }

    public override removed(): void {
        CHAMPIONCAGE._guardians[KorathReward.k_KORATH_TYPE].props.powerLevel = 0;
        const cage: CHAMPIONCAGE = GLOBAL._bCage;
        if (Boolean(cage) && Boolean(CHAMPIONCAGE.GetGuardianData(4))) {
            cage.RemoveGuardian(4);
        }
        const guardianData: any = CHAMPIONCAGE.GetGuardianData(4);
        if (guardianData) {
            guardianData.pl = new SecNum(0);
        }
    }

    public override reset(): void {
        // Empty implementation
    }

    public override canBeApplied(): boolean {
        return !(GLOBAL.mode !== GLOBAL.e_BASE_MODE.BUILD || BASE.isInfernoMainYardOrOutpost);
    }

    public override importData(data: Record<string, any>): void {
        super.importData(data);
    }

    public override exportData(): Record<string, any> {
        if (this._value === 0) {
            console.log("you're trying to save a blank korath reward, why?");
        }
        return super.exportData();
    }
}
