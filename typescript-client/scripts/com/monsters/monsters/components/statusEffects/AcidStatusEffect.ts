import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { MonsterBase } from "../../MonsterBase";
import { CStatusEffect } from "./CStatusEffect";

import { SPRITES } from "../../../../SPRITES";

/**
 * Acid status effect - damage over time from acid.
 */
export class AcidStatusEffect extends CStatusEffect {
    constructor(monster: MonsterBase, dps: number) {
        super(monster);
        this._dps = dps;
        SPRITES.SetupSprite("venomBal");
        this._icon = new SpriteSheetAnimation(SPRITES.GetSpriteDescriptor("venomBal") as SpriteData, 1);
        this._icon.play();
    }
}
