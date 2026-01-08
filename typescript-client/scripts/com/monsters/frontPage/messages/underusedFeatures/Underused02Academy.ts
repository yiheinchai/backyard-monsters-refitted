import { KeywordMessage } from "../KeywordMessage";
import { InstanceManager } from "../../../managers/InstanceManager";

import { GLOBAL } from "../../../../../GLOBAL";
import { KEYS } from "../../../../../KEYS";
import { CREATURELOCKER } from "../../../../../CREATURELOCKER";
import { ACADEMY } from "../../../../../ACADEMY";
import { POPUPS } from "../../../../../POPUPS";
import { BUILDING26 } from "../../../../../BUILDING26";

/**
 * Underused 02 - Academy feature suggestion message.
 */
export class Underused02Academy extends KeywordMessage {
    constructor() {
        super("idleacademy", "btn_open");
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + KeywordMessage.PREFIX + "academy.jpg";
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL._bAcademy && this.hasIdleAcademy() && GLOBAL.townHall._lvl.Get() >= 3 && GLOBAL.Timestamp() - GLOBAL.StatGet("CM5") > 60 * 60 * 24 * 5 && Boolean(this.hasUpgradableMonster());
    }

    protected override onView(): void {
        GLOBAL.StatSet("CM5", GLOBAL.Timestamp());
    }

    protected override onButtonClick(): void {
        ACADEMY.Show(GLOBAL._bAcademy);
        POPUPS.Next();
    }

    private hasUpgradableMonster(): string | null {
        const creatures: Record<string, any> = CREATURELOCKER.GetAppropriateCreatures();
        const academyLevel: number = GLOBAL._bAcademy._lvl.Get();
        const isMaxLevel: boolean = academyLevel >= GLOBAL._buildingProps[ACADEMY.ID - 1].costs.length;
        for (const creatureID in creatures) {
            const upgradeData: any = GLOBAL.player.m_upgrades[creatureID];
            if (!upgradeData) {
                return null;
            }
            const upgradeLevel: number = parseInt(upgradeData.level);
            if (upgradeLevel < academyLevel || (upgradeLevel === academyLevel && !isMaxLevel && academyLevel >= creatures[creatureID].page && !GLOBAL.player.m_upgrades[creatureID].time)) {
                return KEYS.Get(creatures[creatureID].name);
            }
        }
        return null;
    }

    private hasIdleAcademy(): boolean {
        const academies: Array<any> = InstanceManager.getInstancesByClass(BUILDING26);
        for (const academy of academies) {
            if (!academy._upgrading) {
                return true;
            }
        }
        return false;
    }
}
