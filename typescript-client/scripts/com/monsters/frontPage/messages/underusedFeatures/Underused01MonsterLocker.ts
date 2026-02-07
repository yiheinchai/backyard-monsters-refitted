import { KeywordMessage } from "../KeywordMessage";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getCREATURELOCKER(): any { return require("../../../../../CREATURELOCKER").CREATURELOCKER; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }



/**
 * Underused 01 - Monster Locker feature suggestion message.
 */
export class Underused01MonsterLocker extends KeywordMessage {
    private _creatureID: string | null = null;

    constructor() {
        super("idlelocker", "btn_open");
        this.body = getKEYS().Get(KeywordMessage.PREFIX + "idlelocker", { "v1": this.getNextUnlockableCreatureName() });
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + KeywordMessage.PREFIX + "locker.jpg";
    }

    public override get areRequirementsMet(): boolean {
        this.body = getKEYS().Get(KeywordMessage.PREFIX + "idlelocker", { "v1": this.getNextUnlockableCreatureName() });
        return getGLOBAL()._bLocker && !getCREATURELOCKER()._unlocking && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM3") > 60 * 60 * 24 * 5 && Boolean(this.getNextUnlockableCreatureName());
    }

    protected override onView(): void {
        getGLOBAL().StatSet("CM3", getGLOBAL().Timestamp());
    }

    protected override onButtonClick(): void {
        const creatureName: string | null = this.getNextUnlockableCreatureName();
        getCREATURELOCKER()._popupCreatureID = this._creatureID;
        getCREATURELOCKER().Show();
        getCREATURELOCKER()._mc.ShowB(this._creatureID);
        getPOPUPS().Next();
    }

    private getNextUnlockableCreatureName(): string | null {
        if (!getGLOBAL()._bLocker) {
            return null;
        }
        const creatures: Record<string, any> = getCREATURELOCKER().GetAppropriateCreatures();
        const lockerLevel: number = getGLOBAL()._bLocker._lvl.Get();
        for (const creatureID in creatures) {
            if (!getCREATURELOCKER()._lockerData[creatureID] && !getCREATURELOCKER()._creatures[creatureID].blocked && lockerLevel >= creatures[creatureID].page) {
                this._creatureID = creatureID;
                return getKEYS().Get(creatures[creatureID].name);
            }
        }
        return null;
    }
}
