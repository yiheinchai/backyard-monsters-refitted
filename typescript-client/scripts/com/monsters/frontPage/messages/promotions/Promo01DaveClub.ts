import { KeywordMessage } from "../KeywordMessage";
import { SubscriptionHandler } from "../../../subscriptions/SubscriptionHandler";

// Lazy imports to break circular dependency chains
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }



/**
 * Promo 01 - Dave Club promotional message.
 */
export class Promo01DaveClub extends KeywordMessage {
    private static readonly TIME_UNTIL_RESET: number = 604800;
    public static readonly NAME: string = "promodaveclub";

    private m_CanBeShown: boolean = false;

    constructor() {
        super("promodaveclub", "btn_tellmore", "fp_promodaveclub_v2.jpg");
    }

    public get canBeShown(): boolean {
        return this.m_CanBeShown;
    }

    public set canBeShown(value: boolean) {
        this.m_CanBeShown = value;
    }

    public override setup(data: Record<string, any>): void {
        super.setup(data);
        this.markAsUnseenIfOlderThan(Promo01DaveClub.TIME_UNTIL_RESET);
    }

    public override get areRequirementsMet(): boolean {
        return this.m_CanBeShown;
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        SubscriptionHandler.instance.showPromoPopup();
    }
}
