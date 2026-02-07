import { BaseBuff } from "../BaseBuff";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }



/**
 * Alliance declare war buff - buff applied during alliance war.
 */
export class AllianceDeclareWarBuff extends BaseBuff {
    public static readonly ID: number = 11;

    constructor(name: string = "", iconPath: string = "") {
        super("ap_declarewar");
    }

    public override get description(): string {
        return getKEYS().Get(getMapRoomManager().instance.isInMapRoom2 ? "ap_declarewar_desc" : "nwm_ap_declarewar_desc");
    }

    public override apply(): void {
        // Empty implementation
    }

    public override clear(): void {
        // Empty implementation
    }
}
