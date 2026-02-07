import BitmapData from "openfl/display/BitmapData";

// Lazy imports to break circular dependency chains
function getSPRITES(): any { return require("../../../SPRITES").SPRITES; }



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
        getSPRITES().SetupSprite(creepId);
        const skinPair = this.m_CreepSkinPairs.get(creepId);
        if (skinPair != null) {
            getSPRITES().SetupSprite(skinPair);
        }
    }

    public SetSkin(creepId: string, skinId: string | null): void {
        if (skinId != null) {
            getSPRITES().SetupSprite(skinId);
        }
        this.m_CreepSkinPairs.set(creepId, skinId);
    }

    public GetSprite(bmd: BitmapData, creepId: string, action: string, frame: number, row: number = 0, facing: number = -1, overrideSkin: string | null = null): number {
        const skinKey = overrideSkin ? overrideSkin : (this.m_CreepSkinPairs.get(creepId) || creepId);
        return getSPRITES().GetSprite(bmd, skinKey, action, frame, row, facing);
    }
}
