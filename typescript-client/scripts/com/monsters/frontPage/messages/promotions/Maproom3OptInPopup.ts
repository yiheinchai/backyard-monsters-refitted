import { KeywordMessage } from "../KeywordMessage";
import { MapRoom3ConfirmMigrationPopup } from "../../../maproom3/popups/MapRoom3ConfirmMigrationPopup";
import { MapRoomManager } from "../../../maproom_manager/MapRoomManager";

import { POPUPS } from "../../../../../POPUPS";

/**
 * Map room 3 opt-in popup - promotional message for migrating to map room 3.
 */
export class Maproom3OptInPopup extends KeywordMessage {
    private static readonly NAME: string = "nwm";
    private static readonly TIME_UNTIL_RESET: number = 432000;
    private static readonly k_POPUP_IMAGES: Array<string> = [
        "fp_world_map_popup1.jpg",
        "fp_world_map_popup2.jpg",
        "fp_world_map_popup3.jpg"
    ];

    constructor() {
        const imageIndex: number = Math.floor(Math.random() * Maproom3OptInPopup.k_POPUP_IMAGES.length);
        super(Maproom3OptInPopup.NAME, "btn_joinnow", Maproom3OptInPopup.k_POPUP_IMAGES[imageIndex]);
    }

    public override setup(data: Record<string, any>): void {
        super.setup(data);
        this.markAsUnseenIfOlderThan(Maproom3OptInPopup.TIME_UNTIL_RESET);
    }

    public override get areRequirementsMet(): boolean {
        return !this.hasBeenSeen && !MapRoomManager.instance.isInMapRoom3;
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        MapRoom3ConfirmMigrationPopup.instance.Show();
    }
}
