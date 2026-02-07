import { SecNum } from "../../../cc/utils/SecNum";
import { ChampionBase } from "../../monsters/champions/ChampionBase";
import { Krallen } from "../../monsters/champions/Krallen";
import { Reward } from "../../rewarding/Reward";

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("../../debug/Console").Console; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getCREATURES(): any { return require("../../../../CREATURES").CREATURES; }
function getCHAMPIONCAGE(): any { return require("../../../../CHAMPIONCAGE").CHAMPIONCAGE; }



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
        const cage: CHAMPIONCAGE = getGLOBAL()._bCage;
        if (Boolean(getCHAMPIONCAGE().GetGuardianData(Krallen.TYPE)) && Boolean(cage)) {
            cage.RemoveGuardian(Krallen.TYPE);
        }
    }

    public override reset(): void {
        // Empty implementation
    }

    public override canBeApplied(): boolean {
        return getGLOBAL().isAtHome();
    }

    private updateKrallenStatus(powerLevel: number): void {
        const champion: ChampionBase = getCREATURES().getGuardian(Krallen.TYPE);
        powerLevel = Math.min(powerLevel, Krallen.MAX_POWERLEVEL);
        if (champion) {
            champion._powerLevel = new SecNum(powerLevel);
        } else {
            const cage: CHAMPIONCAGE = getGLOBAL()._bCage;
            if (cage) {
                cage.SpawnGuardian(1, 0, 0, Krallen.TYPE, getCHAMPIONCAGE().GetGuardianProperty("G" + Krallen.TYPE, 1, "health"), "", 0, powerLevel);
            } else {
                getConsole().warning("tried to create krallen but you dont have a champion cage");
            }
        }
    }
}
