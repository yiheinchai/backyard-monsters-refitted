import { KeywordMessage } from "../KeywordMessage";
import { MarketingRecapture } from "../../../marketing/MarketingRecapture";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getCHAMPIONCAGE(): any { return require("../../../../../CHAMPIONCAGE").CHAMPIONCAGE; }



/**
 * Promo 03 - Recaptured Gorgo promotional message.
 */
export class Promo03RecapturedGorgo extends KeywordMessage {
    private static readonly TIME_UNTIL_RESET: number = 604800;
    public static readonly NAME: string = "recapturegorgo";

    private m_CanBeShown: boolean = false;

    constructor() {
        super("recapturegorgo", "btn_opencage", "bym_pop_gorgo.png");
    }

    public get canBeShown(): boolean {
        return this.m_CanBeShown;
    }

    public set canBeShown(value: boolean) {
        this.m_CanBeShown = value;
    }

    public override setup(data: Record<string, any>): void {
        super.setup(data);
        this.markAsUnseenIfOlderThan(Promo03RecapturedGorgo.TIME_UNTIL_RESET);
    }

    public override get areRequirementsMet(): boolean {
        return MarketingRecapture.instance.champPopup === MarketingRecapture.k_POPUP_GORGO;
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        if (getGLOBAL()._bCage) {
            getCHAMPIONCAGE().Show();
        }
    }
}
