import { KeywordMessage } from "../KeywordMessage";
import { MarketingRecapture } from "../../../marketing/MarketingRecapture";

import { GLOBAL } from "../../../../../GLOBAL";
import { POPUPS } from "../../../../../POPUPS";
import { CHAMPIONCAGE } from "../../../../../CHAMPIONCAGE";

/**
 * Promo 06 - Recaptured Korath promotional message.
 */
export class Promo06RecapturedKorath extends KeywordMessage {
    private static readonly TIME_UNTIL_RESET: number = 604800;
    public static readonly NAME: string = "recapturekorath";

    private m_CanBeShown: boolean = false;

    constructor() {
        super("recapturekorath", "btn_opencage", "bym_pop_korath.png");
    }

    public get canBeShown(): boolean {
        return this.m_CanBeShown;
    }

    public set canBeShown(value: boolean) {
        this.m_CanBeShown = value;
    }

    public override setup(data: Record<string, any>): void {
        super.setup(data);
        this.markAsUnseenIfOlderThan(Promo06RecapturedKorath.TIME_UNTIL_RESET);
    }

    public override get areRequirementsMet(): boolean {
        return MarketingRecapture.instance.champPopup === MarketingRecapture.k_POPUP_KORATH;
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        if (GLOBAL._bCage) {
            CHAMPIONCAGE.Show();
        }
    }
}
