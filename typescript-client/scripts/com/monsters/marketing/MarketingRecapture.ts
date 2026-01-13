// JSON decode declaration
declare const JSON: { decode(str: string): any; encode(obj: any): string };

/**
 * Instance enforcer for singleton pattern
 */
class InstanceEnforcer {}

/**
 * Marketing recapture - handles champion popup marketing.
 */
export class MarketingRecapture {
    public static readonly k_POPUP_GORGO: number = 1;
    public static readonly k_POPUP_DRULL: number = 2;
    public static readonly k_POPUP_FOMOR: number = 3;
    public static readonly k_POPUP_KORATH: number = 4;

    protected static s_instance: MarketingRecapture | null = null;

    protected m_champPopup: number = 0;

    constructor(enforcer: InstanceEnforcer) {
        if (!enforcer) {
            throw new Error("MarketingRecapture is a Singleton, use instance.");
        }
    }

    public static get instance(): MarketingRecapture {
        MarketingRecapture.s_instance = MarketingRecapture.s_instance || new MarketingRecapture(new InstanceEnforcer());
        return MarketingRecapture.s_instance;
    }

    public get champPopup(): number {
        return this.m_champPopup;
    }

    public importData(data: string): void {
        if (!data) {
            return;
        }
        const parsed = JSON.decode(data);
        if (parsed.champpopup) {
            this.m_champPopup = Number(parsed.champpopup);
        }
    }
}
