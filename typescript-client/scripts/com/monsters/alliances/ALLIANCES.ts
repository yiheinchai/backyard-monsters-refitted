import IOErrorEvent from "openfl/events/IOErrorEvent";

import { AllyInfo } from "./AllyInfo";

import { ACHIEVEMENTS } from "../../../ACHIEVEMENTS";
import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGIN } from "../../../LOGIN";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { POPUPS } from "../../../POPUPS";
import { URLLoaderApi } from "../../../URLLoaderApi";
import { MapRoomCell } from "../maproom_advanced/MapRoomCell";

/**
 * Alliance management system - handles player alliances and relationships.
 */
export class ALLIANCES {
    public static _allianceID: number = 0;
    private static _alliances: { [key: number]: AllyInfo } = {};
    public static _myAlliance: AllyInfo | null = null;
    private static _open: boolean = false;

    constructor() {}

    public static Setup(allianceId: number = 0): void {
        ALLIANCES._alliances = {};
        if (allianceId > 0) {
            if (GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.BUILD) {
                ALLIANCES._allianceID = allianceId;
                ACHIEVEMENTS.Check("alliance", 1, true);
            }
        }
    }

    public static Clear(): void {
        if (ALLIANCES._alliances) {
            ALLIANCES._alliances = {};
        }
        ALLIANCES._alliances = {};
        if (ALLIANCES._myAlliance) {
            ALLIANCES._myAlliance = null;
        }
    }

    public static SetCellAlliance(cell: MapRoomCell, forceUpdate: boolean = false): AllyInfo | null {
        let allyInfo: AllyInfo | null = null;
        
        if (cell.allianceID && cell.allianceID !== 0) {
            const allianceId = cell.allianceID;
            if (ALLIANCES._alliances[allianceId]) {
                allyInfo = ALLIANCES._alliances[allianceId];
                cell.alliance = allyInfo;
            }
            if (ALLIANCES._allianceID && ALLIANCES._allianceID !== 0 && allyInfo) {
                allyInfo.Relations(ALLIANCES._allianceID);
            }
            return allyInfo;
        }
        return null;
    }

    public static SetAlliance(data: any): AllyInfo {
        let allyInfo: AllyInfo | null = null;
        const allianceId = data.alliance_id as number;
        
        if (ALLIANCES._alliances[data.alliance_id]) {
            allyInfo = ALLIANCES._alliances[allianceId];
        } else {
            allyInfo = new AllyInfo(data);
        }
        
        if (ALLIANCES._allianceID && ALLIANCES._allianceID !== 0 && allyInfo && !allyInfo.relationship) {
            allyInfo.Relations(ALLIANCES._allianceID);
        }
        return allyInfo;
    }

    public static ProcessAlliances(alliances: any[]): void {
        for (let i = 0; i < alliances.length; i++) {
            const data = alliances[i];
            const allyInfo = new AllyInfo(data);
            ALLIANCES._alliances[data.alliance_id] = allyInfo;
        }
    }

    public static AllianceInvite(userId: number): void {
        const onAllianceInviteSuccess = (response: any): void => {
            PLEASEWAIT.Hide();
            if (response.response === "success") {
                GLOBAL.Message(KEYS.Get("msg_allianceinvitesent"));
                return;
            }
            if (response.error) {
                GLOBAL.Message(KEYS.Get("msg_err_processinginvite_long") + " - " + response.error + ": " + response.error_code);
            } else {
                GLOBAL.Message(KEYS.Get("msg_err_processinginvite_short"));
            }
        };
        
        const onAllianceInviteFail = (event: IOErrorEvent): void => {
            GLOBAL.Message(KEYS.Get("msg_err_sendinginvite"));
        };
        
        if (!ALLIANCES._myAlliance) {
            GLOBAL.Message(KEYS.Get("msg_notinalliance"));
            return;
        }
        
        const r = new URLLoaderApi();
        const alliancevars = [["user_id", userId]];
        r.load(GLOBAL._allianceURL + "inviteuserclient", alliancevars, onAllianceInviteSuccess, onAllianceInviteFail);
    }

    public static AlliancesServerUpdate(data: string): void {
        if (ALLIANCES._open) {
            if (!GLOBAL._local) {
                POPUPS.RemoveBG();
            }
            ALLIANCES._open = false;
        }
        if (BASE._userID === LOGIN._playerID) {
            BASE.Page();
        } else {
            BASE.Page();
        }
    }

    public static AlliancesViewLeader(leaderId: string): void {
        // Empty as in original
    }
}
