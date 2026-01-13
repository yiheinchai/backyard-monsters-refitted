import BitmapData from "openfl/display/BitmapData";

import { SPRITES } from "../../../SPRITES";

/**
 * Singleton lock for CreepSkinManager.
 */
class SingletonLock {}

/**
 * Manages creep sprite skins and skin pairs for visual variations.
 */
export class CreepSkinManager {
    private static s_Instance: CreepSkinManager | null = null;
    
    private m_CreepSkinPairs: Map<string, string | null> = new Map();

    constructor() {
        CreepSkinManager.s_Instance = this;
        this.m_CreepSkinPairs = new Map();
    }

    public static get instance(): CreepSkinManager {
        return CreepSkinManager.s_Instance || new CreepSkinManager();
    }

    public SetupSkins(creepId: string): void {
        SPRITES.SetupSprite(creepId);
        const skinPair = this.m_CreepSkinPairs.get(creepId);
        if (skinPair != null) {
            SPRITES.SetupSprite(skinPair);
        }
    }

    public SetSkin(creepId: string, skinId: string | null): void {
        if (skinId != null) {
            SPRITES.SetupSprite(skinId);
        }
        this.m_CreepSkinPairs.set(creepId, skinId);
    }

    public GetSprite(bmd: BitmapData, creepId: string, action: string, frame: number, row: number = 0, facing: number = -1, overrideSkin: string | null = null): number {
        const skinKey = overrideSkin ? overrideSkin : (this.m_CreepSkinPairs.get(creepId) || creepId);
        return SPRITES.GetSprite(bmd, skinKey, action, frame, row, facing);
    }
}
