import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { RewardHandler } from "../../../rewarding/RewardHandler";
import { SubscriptionHandler } from "../../SubscriptionHandler";
import { DAVEStatueReward } from "../../rewards/DAVEStatueReward";
import { ExtraTilesReward } from "../../rewards/ExtraTilesReward";
import { GoldenDAVEReward } from "../../rewards/GoldenDAVEReward";
import { MembershipPopup } from "./MembershipPopup";
import { subscriptions_controlPanel_popup } from "../../../../../subscriptions_controlPanel_popup";

import { KEYS } from "../../../../../KEYS";
import { POPUPS } from "../../../../../POPUPS";
import { POPUPSETTINGS } from "../../../../../POPUPSETTINGS";

/**
 * SubscriptionControlPanelPopup - settings panel for DAVE's Club subscribers.
 */
export class SubscriptionControlPanelPopup extends subscriptions_controlPanel_popup {
    public static readonly SAVE: string = "saveChanges";
    public static readonly PLACE_DAVE_STATUE: string = "placeDAVEStatue";
    public static readonly REMOVE_DAVE_STATUE: string = "removeDAVEStatue";

    public bgTileSelected: number = 0;
    public goldDavesToggle: number = 0;
    private _tiles: Array<MovieClip> = [];
    private _memberPopup: MembershipPopup | null = null;

    constructor() {
        super();
        this.setup();
        this.tDavesGold_title.htmlText = KEYS.Get("dc_panel_golddave");
        this.mcDave1.gotoAndStop(1);
        this.mcDave2.gotoAndStop(2);
        this.mcDavesGoldToggle.gotoAndStop(this.goldDavesToggle + 1);
        this.mcDavesGoldToggle.addEventListener(MouseEvent.CLICK, this.clickedGoldDaveToggle.bind(this));
        this.mcDavesGoldToggle.buttonMode = true;
        this.mcDave3.gotoAndStop(3);
        if (DAVEStatueReward.doesStatueRewardExistsInInventory()) {
            this.bPlaceDave.buttonMode = true;
            this.bPlaceDave.Setup(KEYS.Get("btn_placedave"));
            this.bPlaceDave.addEventListener(MouseEvent.CLICK, this.clickedPlaceDaveStatue.bind(this));
        } else {
            this.bPlaceDave.buttonMode = true;
            this.bPlaceDave.Setup(KEYS.Get("btn_removedave"));
            this.bPlaceDave.addEventListener(MouseEvent.CLICK, this.clickedRemoveDaveStatue.bind(this));
        }
        this.bSave.buttonMode = true;
        this.bSave.Highlight = true;
        this.bSave.Setup(KEYS.Get("btn_save"));
        this.bSave.addEventListener(MouseEvent.CLICK, this.clickedSave.bind(this));
        this.bMembership.Setup(KEYS.Get("btn_membership"));
        this.bMembership.buttonMode = true;
        this.bMembership.addEventListener(MouseEvent.CLICK, this.clickedMembership.bind(this));
        this._memberPopup = null;
        this.tMembers_title.htmlText = KEYS.Get("dc_panel_benefits");
        this.tMembers_desc.htmlText = KEYS.Get("dc_panel_benefitsdesc");
        this.tTerrainSelect.htmlText = KEYS.Get("dc_panel_terrain");
        this._tiles = [this.mcTile1, this.mcTile2, this.mcTile3, this.mcTile4];
        for (let i = 0; i < this._tiles.length; i++) {
            this._tiles[i].buttonMode = true;
            (this._tiles[i] as any).mcSelect.visible = false;
            this._tiles[i].addEventListener(MouseEvent.CLICK, this.clickedBGTileSelect.bind(this));
            switch (i) {
                case 0:
                    (this._tiles[i] as any).mcTerrain.gotoAndStop("isograss1");
                    break;
                case 1:
                    (this._tiles[i] as any).mcTerrain.gotoAndStop("rockgrass");
                    break;
                case 2:
                    (this._tiles[i] as any).mcTerrain.gotoAndStop("isosand3");
                    break;
                case 3:
                    (this._tiles[i] as any).mcTerrain.gotoAndStop("isocrater1");
                    break;
            }
        }
        (this._tiles[this.bgTileSelected] as any).mcSelect.visible = true;
    }

    private setup(): void {
        this.bgTileSelected = RewardHandler.instance.getRewardByID(ExtraTilesReward.ID).value;
        this.goldDavesToggle = RewardHandler.instance.getRewardByID(GoldenDAVEReward.ID).value;
    }

    private clickedGoldDaveToggle(event: MouseEvent | null = null): void {
        this.goldDavesToggle = (this.goldDavesToggle + 1) % 2;
        this.mcDavesGoldToggle.gotoAndStop(this.goldDavesToggle + 1);
    }

    private clickedPlaceDaveStatue(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionControlPanelPopup.PLACE_DAVE_STATUE));
        this.Hide();
    }

    private clickedRemoveDaveStatue(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionControlPanelPopup.REMOVE_DAVE_STATUE));
        this.Hide();
    }

    private clickedSave(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionControlPanelPopup.SAVE));
    }

    private clickedMembership(event: MouseEvent | null = null): void {
        this._memberPopup = new MembershipPopup();
        this._memberPopup.addEventListener(SubscriptionHandler.REACTIVATE, this.membershipReactivated.bind(this));
        this._memberPopup.addEventListener(SubscriptionHandler.CHANGE, this.membershipChanged.bind(this));
        this._memberPopup.addEventListener(SubscriptionHandler.CANCEL, this.membershipCancel.bind(this));
        this._memberPopup.addEventListener(Event.CLOSE, this.clickedCloseMembership.bind(this));
        POPUPS.Add(this._memberPopup);
        POPUPSETTINGS.AlignToCenter(this._memberPopup);
    }

    protected membershipReactivated(event: Event): void {
        this.dispatchEvent(new Event(SubscriptionHandler.REACTIVATE));
    }

    private membershipChanged(event: Event): void {
        this.dispatchEvent(new Event(SubscriptionHandler.CHANGE));
    }

    private membershipCancel(event: Event): void {
        this.dispatchEvent(new Event(SubscriptionHandler.CANCEL));
    }

    private clickedCloseMembership(event: Event): void {
        if (this._memberPopup) {
            this._memberPopup.removeEventListener(SubscriptionHandler.REACTIVATE, this.membershipReactivated.bind(this));
            this._memberPopup.removeEventListener(SubscriptionHandler.CHANGE, this.membershipChanged.bind(this));
            this._memberPopup.removeEventListener(SubscriptionHandler.CANCEL, this.membershipCancel.bind(this));
            this._memberPopup.removeEventListener(Event.CLOSE, this.clickedCloseMembership.bind(this));
        }
        POPUPS.Remove(this._memberPopup!);
    }

    private clickedBGTileSelect(event: MouseEvent | null = null): void {
        for (let i = 0; i < this._tiles.length; i++) {
            (this._tiles[i] as any).mcSelect.visible = false;
            if (event!.currentTarget === this._tiles[i]) {
                this.bgTileSelected = i;
            }
        }
        (event!.currentTarget as any).mcSelect.visible = true;
    }

    public Hide(event: MouseEvent | null = null): void {
        this.mcDavesGoldToggle.removeEventListener(MouseEvent.CLICK, this.clickedGoldDaveToggle.bind(this));
        this.bPlaceDave.removeEventListener(MouseEvent.CLICK, this.clickedPlaceDaveStatue.bind(this));
        this.bSave.removeEventListener(MouseEvent.CLICK, this.clickedSave.bind(this));
        this.bMembership.removeEventListener(MouseEvent.CLICK, this.clickedMembership.bind(this));
        this.dispatchEvent(new Event(Event.CLOSE));
    }
}
