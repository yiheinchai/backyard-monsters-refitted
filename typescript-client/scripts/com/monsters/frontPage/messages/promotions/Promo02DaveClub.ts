import { KeywordMessage } from "../KeywordMessage";
import { SubscriptionHandler } from "../../../subscriptions/SubscriptionHandler";

import { POPUPS } from "../../../../../POPUPS";
import { Button } from "../../../../Button";

/**
 * Promo 02 - Dave Club v2 promotional message.
 */
export class Promo02DaveClub extends KeywordMessage {
    private static readonly TIME_UNTIL_RESET: number = 604800;
    public static readonly NAME: string = "promodaveclub2";

    private m_CanBeShown: boolean = false;

    constructor() {
        super("promodaveclub2", "btn_tellmore", "fp_daveclubyp2.jpg");
    }

    public get canBeShown(): boolean {
        return this.m_CanBeShown;
    }

    public set canBeShown(value: boolean) {
        this.m_CanBeShown = value;
    }

    public override setup(data: Record<string, any>): void {
        super.setup(data);
        this.markAsUnseenIfOlderThan(Promo02DaveClub.TIME_UNTIL_RESET);
    }

    public override setupButton(button: Button): Button {
        if (SubscriptionHandler.instance.isSubscriptionActive) {
            button.visible = false;
            return button;
        }
        return super.setupButton(button);
    }

    public override get areRequirementsMet(): boolean {
        return this.m_CanBeShown;
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        SubscriptionHandler.instance.showPromoPopup();
    }
}
