import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { MonsterBase } from "../../MonsterBase";
import { CStatusEffect } from "./CStatusEffect";

import { SPRITES } from "../../../../SPRITES";

/**
 * Decoy effect - makes monster a decoy target.
 */
export class DecoyEffect extends CStatusEffect {
    constructor(monster: MonsterBase) {
        super(monster);
        this._dps = 0;
        SPRITES.SetupSprite("heart");
        this._icon = new SpriteSheetAnimation(SPRITES.GetSpriteDescriptor("heart") as SpriteData, 1);
        this._icon.play();
    }
}
