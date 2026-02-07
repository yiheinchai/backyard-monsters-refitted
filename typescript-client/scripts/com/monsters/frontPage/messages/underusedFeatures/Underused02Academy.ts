import { KeywordMessage } from "../KeywordMessage";

import { ACADEMY } from "../../../../../ACADEMY";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../../managers/InstanceManager").InstanceManager; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getCREATURELOCKER(): any { return require("../../../../../CREATURELOCKER").CREATURELOCKER; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getBUILDING26(): any { return require("../../../../../BUILDING26").BUILDING26; }


/**
 * Underused 02 - Academy feature suggestion message.
 */
export class Underused02Academy extends KeywordMessage {
    constructor() {
        super("idleacademy", "btn_open");
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + KeywordMessage.PREFIX + "academy.jpg";
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL()._bAcademy && this.hasIdleAcademy() && getGLOBAL().townHall._lvl.Get() >= 3 && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM5") > 60 * 60 * 24 * 5 && Boolean(this.hasUpgradableMonster());
    }

    protected override onView(): void {
        getGLOBAL().StatSet("CM5", getGLOBAL().Timestamp());
    }

    protected override onButtonClick(): void {
        ACADEMY.Show(getGLOBAL()._bAcademy);
        getPOPUPS().Next();
    }

    private hasUpgradableMonster(): string | null {
        const creatures: Record<string, any> = getCREATURELOCKER().GetAppropriateCreatures();
        const academyLevel: number = getGLOBAL()._bAcademy._lvl.Get();
        const isMaxLevel: boolean = academyLevel >= getGLOBAL()._buildingProps[ACADEMY.ID - 1].costs.length;
        for (const creatureID in creatures) {
            const upgradeData: any = getGLOBAL().player.m_upgrades[creatureID];
            if (!upgradeData) {
                return null;
            }
            const upgradeLevel: number = parseInt(upgradeData.level);
            if (upgradeLevel < academyLevel || (upgradeLevel === academyLevel && !isMaxLevel && academyLevel >= creatures[creatureID].page && !getGLOBAL().player.m_upgrades[creatureID].time)) {
                return getKEYS().Get(creatures[creatureID].name);
            }
        }
        return null;
    }

    private hasIdleAcademy(): boolean {
        const academies: Array<any> = getInstanceManager().getInstancesByClass(getBUILDING26());
        for (const academy of academies) {
            if (!academy._upgrading) {
                return true;
            }
        }
        return false;
    }
}
