/**
 * Singleton enforcer for BYMConfig.
 */
class InstanceEnforcer {}

/**
 * Global configuration for Backyard Monsters.
 */
export class BYMConfig {
    public static readonly k_sLOCAL_MODE_TRUNK: number = 1;
    public static readonly k_sLOCAL_MODE_KONG: number = 2;
    public static readonly k_sLOCAL_MODE_VIXTEST: number = 3;
    public static readonly k_sLOCAL_MODE_VIXSTAGE: number = 4;
    public static readonly k_sLOCAL_MODE_INF_TRUNK: number = 5;
    public static readonly k_sLOCAL_MODE_LIVE: number = 6;
    public static readonly k_sLOCAL_MODE_VIXLIVE: number = 7;
    public static readonly k_sLOCAL_MODE_ALEX: number = 8;
    public static readonly k_sLOCAL_MODE_NICK: number = 9;
    public static readonly k_sLOCAL_MODE_KONGDEV: number = 10;
    public static readonly k_sLOCAL_MODE_KONGSTAGE: number = 11;
    public static readonly k_sLOCAL_MODE_PREVIEW: number = 12;
    public static readonly k_sLOCAL_MODE_STAGE: number = 13;
    public static readonly k_sVICTORY_THRESHOLD: number = 90;
    public static readonly k_sMAX_FORTIFICATION_LEVEL: number = 4;

    protected static _instance: BYMConfig;

    private constructor() {}

    public static get instance(): BYMConfig {
        if (!BYMConfig._instance) {
            BYMConfig._instance = new BYMConfig();
        }
        return BYMConfig._instance;
    }

    public get RENDERER_ON(): boolean {
        // Bitmap rendering approach - more performant
        return true;
    }

    public get OPTIMIZED_SHADOWS(): boolean {
        return false;
    }

    public get AUTOBANK_FIX(): boolean {
        return true;
    }

    public get USE_CLIENT_WITH_CALLBACK(): boolean {
        return false;
    }

    public get BRUKKARG_WAR_ON(): boolean {
        return true;
    }

    public get INVITE_BUTTON(): boolean {
        return false;
    }

    public get LOCAL_MODE(): number {
        return BYMConfig.k_sLOCAL_MODE_TRUNK;
    }

    public get fbData(): any {
        return null;
    }
}
