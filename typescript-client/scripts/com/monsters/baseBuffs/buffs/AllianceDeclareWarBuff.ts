import { BaseBuff } from "../BaseBuff";
import { MapRoomManager } from "../../maproom_manager/MapRoomManager";

import { KEYS } from "../../../../KEYS";

/**
 * Alliance declare war buff - buff applied during alliance war.
 */
export class AllianceDeclareWarBuff extends BaseBuff {
    public static readonly ID: number = 11;

    constructor(name: string = "", iconPath: string = "") {
        super("ap_declarewar");
    }

    public override get description(): string {
        return KEYS.Get(MapRoomManager.instance.isInMapRoom2 ? "ap_declarewar_desc" : "nwm_ap_declarewar_desc");
    }

    public override apply(): void {
        // Empty implementation
    }

    public override clear(): void {
        // Empty implementation
    }
}
