import { SecNum } from "../../../../cc/utils/SecNum";
import { Console } from "../../debug/Console";
import { ChampionBase } from "../../monsters/champions/ChampionBase";
import { Krallen } from "../../monsters/champions/Krallen";
import { Reward } from "../../rewarding/Reward";

import { GLOBAL } from "../../../../GLOBAL";
import { CREATURES } from "../../../../CREATURES";
import { CHAMPIONCAGE } from "../../../../CHAMPIONCAGE";

/**
 * Krallen reward - King of the Hill reward that grants Krallen champion.
 */
export class KrallenReward extends Reward {
    public static readonly ID: string = "krallenReward";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        this.updateKrallenStatus(this._value);
    }

    public override removed(): void {
        const cage: CHAMPIONCAGE = GLOBAL._bCage;
        if (Boolean(CHAMPIONCAGE.GetGuardianData(Krallen.TYPE)) && Boolean(cage)) {
            cage.RemoveGuardian(Krallen.TYPE);
        }
    }

    public override reset(): void {
        // Empty implementation
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }

    private updateKrallenStatus(powerLevel: number): void {
        const champion: ChampionBase = CREATURES.getGuardian(Krallen.TYPE);
        powerLevel = Math.min(powerLevel, Krallen.MAX_POWERLEVEL);
        if (champion) {
            champion._powerLevel = new SecNum(powerLevel);
        } else {
            const cage: CHAMPIONCAGE = GLOBAL._bCage;
            if (cage) {
                cage.SpawnGuardian(1, 0, 0, Krallen.TYPE, CHAMPIONCAGE.GetGuardianProperty("G" + Krallen.TYPE, 1, "health"), "", 0, powerLevel);
            } else {
                Console.warning("tried to create krallen but you dont have a champion cage");
            }
        }
    }
}
