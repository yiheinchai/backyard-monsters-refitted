import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { MonsterBase } from "../../MonsterBase";
import { CStatusEffect } from "./CStatusEffect";

import { SPRITES } from "../../../../../SPRITES";

/**
 * Flame effect - fire damage over time.
 */
export class FlameEffect extends CStatusEffect {
    constructor(monster: MonsterBase, dps: number = 25) {
        super(monster);
        this._dps = dps;
        SPRITES.SetupSprite("flame");
        this._icon = new SpriteSheetAnimation(SPRITES.GetSpriteDescriptor("flame") as SpriteData, 1);
        this._icon.play();
    }
}
