import { Console } from "../../debug/Console";
import { ChampionBase } from "../../monsters/champions/ChampionBase";
import { Krallen } from "../../monsters/champions/Krallen";
import { Reward } from "../../rewarding/Reward";

import { GLOBAL } from "../../../../GLOBAL";
import { CREATURES } from "../../../../CREATURES";

/**
 * Krallen buff reward - King of the Hill reward that buffs Krallen champion.
 */
export class KrallenBuffReward extends Reward {
    public static readonly ID: string = "krallenBuffReward";

    private readonly _MAX_BUFF_LEVEL: number = 5;

    constructor() {
        super();
    }

    public override set value(val: number) {
        val = Math.min(val, this._MAX_BUFF_LEVEL);
        super.value = val;
    }

    protected override onApplication(): void {
        this.updateChampionBuff(this._value);
    }

    public override removed(): void {
        this.updateChampionBuff(0);
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }

    private updateChampionBuff(level: number): void {
        const champion: ChampionBase = CREATURES.getGuardian(Krallen.TYPE);
        if (champion) {
            champion.levelSet(level);
            champion.export();
        } else {
            Console.warning("You are trying to setup the Krallen buff but you dont own a Krallen");
        }
    }
}
