import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { ABTest } from "../../cc/tests/ABTest";
import { BasePlanner } from "../baseplanner/BasePlanner";
import { FrontPageHandler } from "../frontPage/FrontPageHandler";
import { FrontPageLibrary } from "../frontPage/FrontPageLibrary";
import { Promo01DaveClub } from "../frontPage/messages/promotions/Promo01DaveClub";
import { Promo02DaveClub } from "../frontPage/messages/promotions/Promo02DaveClub";
import { IHandler } from "../interfaces/IHandler";
import { Reward } from "../rewarding/Reward";
import { RewardHandler } from "../rewarding/RewardHandler";
import { DAVEStatueReward } from "./rewards/DAVEStatueReward";
import { ExtraTilesReward } from "./rewards/ExtraTilesReward";
import { GoldenDAVEReward } from "./rewards/GoldenDAVEReward";
import { ImprovedHCCReward } from "./rewards/ImprovedHCCReward";
import { YardPlannerExtraSlotsReward } from "./rewards/YardPlannerExtraSlotsReward";
import { SubscriptionJoinPopup } from "./ui/SubscriptionJoinPopup";
import { SubscriptionResourceIcon } from "./ui/SubscriptionResourceIcon";
import { SubscriptionControlPanelPopup } from "./ui/controlPanel/SubscriptionControlPanelPopup";
import { SubscriptionService } from "./SubscriptionService";
import { SubscriptionStatusEvent } from "./SubscriptionStatusEvent";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { LOGIN } from "../../../LOGIN";
import { POPUPS } from "../../../POPUPS";
import { UI2 } from "../../../UI2";

/**
 * SubscriptionHandler - manages DAVE's Club subscription functionality.
 */
export class SubscriptionHandler implements IHandler {
    public static readonly JOIN: string = "startSubscription";
    public static readonly CANCEL: string = "cancelSubscription";
    public static readonly CANCELCONFIRM: string = "cancelConfirmation";
    public static readonly CLOSECONFIRM: string = "closeConfirmation";
    public static readonly CHANGE: string = "changeSubscription";
    public static readonly REACTIVATE: string = "reactiveSubscription";

    private static _instance: SubscriptionHandler | null = null;
    public static ignoreAB: boolean = false;

    private _rewardIDs: Array<string> = [ImprovedHCCReward.ID, DAVEStatueReward.ID, GoldenDAVEReward.ID, ExtraTilesReward.ID, YardPlannerExtraSlotsReward.ID];
    private _renewalDate: number = 0;
    private _expirationDate: number = 0;
    private _icon: SubscriptionResourceIcon | null = null;
    private _service: SubscriptionService | null = null;
    private _subscriptionID: number = 0;

    constructor() {
        this._rewardIDs = [ImprovedHCCReward.ID, DAVEStatueReward.ID, GoldenDAVEReward.ID, ExtraTilesReward.ID, YardPlannerExtraSlotsReward.ID];
    }

    public static get instance(): SubscriptionHandler {
        if (!SubscriptionHandler._instance) {
            SubscriptionHandler._instance = new SubscriptionHandler();
            SubscriptionHandler._instance._service = new SubscriptionService();
        }
        return SubscriptionHandler._instance;
    }

    public static get isEnabledForAll(): boolean {
        return GLOBAL._flags["subscriptions"] > 0 && GLOBAL._flags["subscriptions_ab"] === 0;
    }

    public static setRenewalDateDEBUG(date: number): void {
        SubscriptionHandler._instance!._renewalDate = date;
        SubscriptionHandler._instance!.updateSubscriptionStatus();
    }

    public static setExpirationDateDEBUG(date: number): void {
        SubscriptionHandler._instance!._expirationDate = date;
        SubscriptionHandler._instance!.updateSubscriptionStatus();
    }

    public get name(): string {
        return "subscriptions";
    }

    public get isSubscriptionActive(): boolean {
        // return Boolean(this._renewalDate) || Boolean(this._expirationDate);
        return true;
    }

    public get renewalDate(): number {
        return this._renewalDate;
    }

    public get expirationDate(): number {
        return this._expirationDate;
    }

    public get service(): SubscriptionService {
        return SubscriptionHandler._instance!._service!;
    }

    private specialUser(): boolean {
        return SubscriptionHandler.ignoreAB || (LOGIN._playerID === 12467111 || LOGIN._playerID === 3099454);
    }

    public initialize(data: Record<string, any> | null = null): void {
        if (!SubscriptionHandler.isEnabledForAll && !ABTest.isInTestGroup("davesclub108", 64) && !this.specialUser() || !GLOBAL.isAtHome() || !GLOBAL._flags["subscriptions"] || GLOBAL.isNoob()) {
            return;
        }
        this.unlockTeaserInformation();
        this.addIcon();
        this._service!.addEventListener(SubscriptionStatusEvent.STATUS_EVENT, this.recievedSubscriptionData.bind(this));
        this._service!.getSubscriptionData();
    }

    protected recievedSubscriptionData(event: SubscriptionStatusEvent): void {
        this._subscriptionID = event.subscriptionID;
        this._renewalDate = event.renewalDate;
        this._expirationDate = event.expirationDate;
        this.updateSubscriptionStatus();
    }

    private updateSubscriptionStatus(): void {
        this.updateRewards();
        this._icon!.update(this.isSubscriptionActive);
        const promo1 = FrontPageLibrary.getMessageByName(Promo01DaveClub.NAME) as Promo01DaveClub;
        const promo2 = FrontPageLibrary.getMessageByName(Promo02DaveClub.NAME) as Promo02DaveClub;
        if (promo1 && !ABTest.isInTestGroup("davesclub108", 64) && !this.isSubscriptionActive) {
            promo1.canBeShown = true;
        } else if (promo2 && ABTest.isInTestGroup("davesclub108", 64) && SubscriptionHandler.isEnabledForAll) {
            promo2.canBeShown = true;
        }
        if (!promo1 && !promo2) {
            return;
        }
        if (FrontPageHandler.hasBeenSetupThisSession === false) {
            return;
        }
        if (FrontPageHandler.hasBeenSeenThisSession === false || FrontPageHandler.isVisible) {
            FrontPageHandler.showPopup(true);
        } else if (POPUPS.hasPopupsOpen()) {
            FrontPageHandler.refresh();
        }
    }

    private unlockTeaserInformation(): void {
        const statueReward = RewardHandler.instance.getRewardByID(DAVEStatueReward.ID) as DAVEStatueReward;
        if (statueReward === null || statueReward.hasBeenApplied === false) {
            DAVEStatueReward.unlockTeaserInformation(this.showPromoPopup.bind(this));
        }
        if (SubscriptionHandler.isEnabledForAll) {
            BasePlanner.maxNumberOfSlots = 10;
        }
    }

    private addIcon(): void {
        this._icon = new SubscriptionResourceIcon(this.isSubscriptionActive);
        UI2._top.addResourceBar(this._icon);
        this._icon.addEventListener(MouseEvent.CLICK, this.clickedIcon.bind(this), false, 0, true);
    }

    protected clickedIcon(event: Event): void {
        if (this.isSubscriptionActive) {
            this.showControlPanel();
        } else {
            GLOBAL.Message(KEYS.Get("disabled_daveclub"));
        }
    }

    private showControlPanel(): void {
        const panel = new SubscriptionControlPanelPopup();
        POPUPS.Push(panel);
        panel.addEventListener(Event.CLOSE, this.clickedClosePanel.bind(this));
        panel.addEventListener(SubscriptionHandler.CHANGE, this.clickedChange.bind(this));
        panel.addEventListener(SubscriptionHandler.CANCEL, this.clickedCancel.bind(this));
        panel.addEventListener(SubscriptionHandler.REACTIVATE, this.clickedReactivate.bind(this));
        panel.addEventListener(SubscriptionControlPanelPopup.PLACE_DAVE_STATUE, this.clickedPlace.bind(this));
        panel.addEventListener(SubscriptionControlPanelPopup.REMOVE_DAVE_STATUE, this.clickedRemove.bind(this));
        panel.addEventListener(SubscriptionControlPanelPopup.SAVE, this.clickedSave.bind(this));
    }

    protected clickedClosePanel(event: Event): void {
        const panel = event.target as SubscriptionControlPanelPopup;
        panel.removeEventListener(Event.CLOSE, this.clickedClosePanel.bind(this));
        panel.removeEventListener(SubscriptionHandler.CHANGE, this.clickedChange.bind(this));
        panel.removeEventListener(SubscriptionHandler.CANCEL, this.clickedCancel.bind(this));
        panel.removeEventListener(SubscriptionHandler.REACTIVATE, this.clickedReactivate.bind(this));
        panel.removeEventListener(SubscriptionControlPanelPopup.PLACE_DAVE_STATUE, this.clickedPlace.bind(this));
        panel.removeEventListener(SubscriptionControlPanelPopup.REMOVE_DAVE_STATUE, this.clickedRemove.bind(this));
        panel.removeEventListener(SubscriptionControlPanelPopup.SAVE, this.clickedSave.bind(this));
        POPUPS.Next();
    }

    protected clickedReactivate(event: Event): void {
        this._service!.reactivateSubscription(this._subscriptionID);
    }

    protected clickedChange(event: Event): void {
        this._service!.changeSubscription(this._subscriptionID);
    }

    protected clickedCancel(event: Event): void {
        this._service!.cancelSubscription(this._subscriptionID);
    }

    protected clickedPlace(event: Event): void {
        LOGGER.StatB({ "st1": "daves_club" }, "golden_dave_placed");
        BASE.addBuildingB(DAVEStatueReward.DAVE_STATUE_TYPE_ID, true);
    }

    protected clickedRemove(event: Event): void {
        const statue = DAVEStatueReward.findStatueRewardInWorld();
        if (statue !== null) {
            statue.RecycleC();
        }
    }

    protected clickedSave(event: Event): void {
        const panel = event.target as SubscriptionControlPanelPopup;
        let reward = RewardHandler.instance.getRewardByID(GoldenDAVEReward.ID);
        if (this.updateRewardValue(reward, panel.goldDavesToggle)) {
            if (panel.goldDavesToggle) {
                LOGGER.StatB({ "st1": "daves_club" }, "dave_on");
            } else {
                LOGGER.StatB({ "st1": "daves_club" }, "dave_off");
            }
        }
        reward = RewardHandler.instance.getRewardByID(ExtraTilesReward.ID);
        this.updateRewardValue(reward, panel.bgTileSelected);
        POPUPS.Next();
        BASE.Save();
    }

    private updateRewardValue(reward: Reward, value: number): boolean {
        if (reward.value === value) {
            return false;
        }
        reward.value = value;
        RewardHandler.instance.applyReward(reward);
        return true;
    }

    public showPromoPopup(): void {
        if (this.isSubscriptionActive) {
            const popup = new SubscriptionJoinPopup();
            POPUPS.Push(popup);
            popup.addEventListener(SubscriptionHandler.JOIN, this.clickedJoin.bind(this));
            popup.addEventListener(Event.CLOSE, this.clickedClose.bind(this));
        } else {
            GLOBAL.Message(KEYS.Get("disabled_daveclub"));
        }
    }

    protected clickedJoin(event: Event): void {
        this._service!.startSubscription();
        this.clickedClose(event);
    }

    protected clickedClose(event: Event): void {
        const popup = event.target as SubscriptionJoinPopup;
        popup.removeEventListener(SubscriptionHandler.JOIN, this.clickedJoin.bind(this));
        popup.removeEventListener(Event.CLOSE, this.clickedClose.bind(this));
        POPUPS.Next();
    }

    private updateRewards(): void {
        for (let i = 0; i < this._rewardIDs.length; i++) {
            if (this.isSubscriptionActive) {
                const reward = RewardHandler.instance.updateExistingOrAddNewReward(this._rewardIDs[i]);
                if (!reward.hasBeenApplied) {
                    RewardHandler.instance.applyReward(reward);
                }
            } else {
                RewardHandler.instance.removeRewardByID(this._rewardIDs[i]);
            }
        }
    }

    public importData(data: Record<string, any>): void {
        this._renewalDate = GLOBAL.StatGet("renewal");
        this._expirationDate = GLOBAL.StatGet("expiration");
        this.updateRewards();
    }

    public exportData(): Record<string, any> | null {
        GLOBAL.StatSet("renewal", this._renewalDate, false);
        GLOBAL.StatSet("expiration", this._expirationDate, false);
        return null;
    }
}
