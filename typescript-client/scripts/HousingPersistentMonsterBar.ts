import { HousingPersistentMonsterBar_CLIP } from './HousingPersistentMonsterBar_CLIP';

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("./KEYS").KEYS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSTORE(): any { return require("./STORE").STORE; }


export class HousingPersistentMonsterBar extends HousingPersistentMonsterBar_CLIP {
    public static readonly k_monsterBarDisplayBarWidth: number = 175;
    public static readonly k_HealFrame: number = 2;
    public static readonly k_NormalFrame: number = 1;

    public m_creatureID: string;

    constructor(param1: string) {
        super();
        this.m_creatureID = param1;
    }

    public updateTimer(): void {
        if (this.bFinish) {
            this.bFinish.Setup(getKEYS().Get("btn_housing_finish", { "v1": this.getTimeCost() }));
        }
        const _loc1_ = this.calcTimeLeft();
        this.tHealStatusText.htmlText = "<b>" + getGLOBAL().ToTime(_loc1_) + "</b>";
    }

    public calcTimeLeft(): number {
        return getGLOBAL().player.getHighestTimeHealingUsingNumberOfHousing(this.m_creatureID);
    }

    public getTimeCost(param1: boolean = false): number {
        let _loc2_ = 0;
        const _loc3_ = getGLOBAL().player.getSecsTillDoneByID(this.m_creatureID, param1);
        if (_loc3_ == 0) {
            return 0;
        }
        _loc2_ = getSTORE().GetTimeCost(_loc3_, false) * getGLOBAL().ABTestHealingTimeShinyMod();
        return Math.max(_loc2_, 1);
    }

    public getResourceCostInShiny(): number {
        if (this.currentFrame == HousingPersistentMonsterBar.k_HealFrame || (this.m_healthBar as any).mcBar.width == HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth) {
            return 0;
        }
        return getGLOBAL().player.getResourceCostInShinyByID(this.m_creatureID);
    }
}
