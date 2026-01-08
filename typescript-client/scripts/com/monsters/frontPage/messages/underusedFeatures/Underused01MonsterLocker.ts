import { KeywordMessage } from "../KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { KEYS } from "../../../../../KEYS";
import { CREATURELOCKER } from "../../../../../CREATURELOCKER";
import { POPUPS } from "../../../../../POPUPS";

/**
 * Underused 01 - Monster Locker feature suggestion message.
 */
export class Underused01MonsterLocker extends KeywordMessage {
    private _creatureID: string | null = null;

    constructor() {
        super("idlelocker", "btn_open");
        this.body = KEYS.Get(KeywordMessage.PREFIX + "idlelocker", { "v1": this.getNextUnlockableCreatureName() });
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + KeywordMessage.PREFIX + "locker.jpg";
    }

    public override get areRequirementsMet(): boolean {
        this.body = KEYS.Get(KeywordMessage.PREFIX + "idlelocker", { "v1": this.getNextUnlockableCreatureName() });
        return GLOBAL._bLocker && !CREATURELOCKER._unlocking && GLOBAL.Timestamp() - GLOBAL.StatGet("CM3") > 60 * 60 * 24 * 5 && Boolean(this.getNextUnlockableCreatureName());
    }

    protected override onView(): void {
        GLOBAL.StatSet("CM3", GLOBAL.Timestamp());
    }

    protected override onButtonClick(): void {
        const creatureName: string | null = this.getNextUnlockableCreatureName();
        CREATURELOCKER._popupCreatureID = this._creatureID;
        CREATURELOCKER.Show();
        CREATURELOCKER._mc.ShowB(this._creatureID);
        POPUPS.Next();
    }

    private getNextUnlockableCreatureName(): string | null {
        if (!GLOBAL._bLocker) {
            return null;
        }
        const creatures: Record<string, any> = CREATURELOCKER.GetAppropriateCreatures();
        const lockerLevel: number = GLOBAL._bLocker._lvl.Get();
        for (const creatureID in creatures) {
            if (!CREATURELOCKER._lockerData[creatureID] && !CREATURELOCKER._creatures[creatureID].blocked && lockerLevel >= creatures[creatureID].page) {
                this._creatureID = creatureID;
                return KEYS.Get(creatures[creatureID].name);
            }
        }
        return null;
    }
}
