import { KeywordMessage } from "../KeywordMessage";
import { MarketingRecapture } from "../../../marketing/MarketingRecapture";

import { GLOBAL } from "../../../../../GLOBAL";
import { POPUPS } from "../../../../../POPUPS";
import { CHAMPIONCAGE } from "../../../../../CHAMPIONCAGE";

/**
 * Promo 04 - Recaptured Drull promotional message.
 */
export class Promo04RecapturedDrull extends KeywordMessage {
    private static readonly TIME_UNTIL_RESET: number = 604800;
    public static readonly NAME: string = "recapturedrull";

    private m_CanBeShown: boolean = false;

    constructor() {
        super("recapturedrull", "btn_opencage", "bym_pop_drull.png");
    }

    public get canBeShown(): boolean {
        return this.m_CanBeShown;
    }

    public set canBeShown(value: boolean) {
        this.m_CanBeShown = value;
    }

    public override setup(data: Record<string, any>): void {
        super.setup(data);
        this.markAsUnseenIfOlderThan(Promo04RecapturedDrull.TIME_UNTIL_RESET);
    }

    public override get areRequirementsMet(): boolean {
        return MarketingRecapture.instance.champPopup === MarketingRecapture.k_POPUP_DRULL;
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        if (GLOBAL._bCage) {
            CHAMPIONCAGE.Show();
        }
    }
}
