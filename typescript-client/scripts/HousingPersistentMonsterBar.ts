import { HousingPersistentMonsterBar_CLIP } from './HousingPersistentMonsterBar_CLIP';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { STORE } from './STORE';

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
            this.bFinish.Setup(KEYS.Get("btn_housing_finish", { "v1": this.getTimeCost() }));
        }
        const _loc1_ = this.calcTimeLeft();
        this.tHealStatusText.htmlText = "<b>" + GLOBAL.ToTime(_loc1_) + "</b>";
    }

    public calcTimeLeft(): number {
        return GLOBAL.player.getHighestTimeHealingUsingNumberOfHousing(this.m_creatureID);
    }

    public getTimeCost(param1: boolean = false): number {
        let _loc2_ = 0;
        const _loc3_ = GLOBAL.player.getSecsTillDoneByID(this.m_creatureID, param1);
        if (_loc3_ == 0) {
            return 0;
        }
        _loc2_ = STORE.GetTimeCost(_loc3_, false) * GLOBAL.ABTestHealingTimeShinyMod();
        return Math.max(_loc2_, 1);
    }

    public getResourceCostInShiny(): number {
        if (this.currentFrame == HousingPersistentMonsterBar.k_HealFrame || this.m_healthBar.mcBar.width == HousingPersistentMonsterBar.k_monsterBarDisplayBarWidth) {
            return 0;
        }
        return GLOBAL.player.getResourceCostInShinyByID(this.m_creatureID);
    }
}
