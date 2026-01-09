import { Sprite } from "openfl/display/Sprite";
import { MouseEvent } from "openfl/events/MouseEvent";

import { WMBASE } from "../ai/WMBASE";
import { EnumYardType } from "../enums/EnumYardType";
import { Message } from "../mailbox/Message";
import { Contact } from "../mailbox/model/Contact";
import { BaseObject } from "./model/BaseObject";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { DescentMapRoom } from "./DescentMapRoom";
import { MapRoom } from "../maproom/MapRoom";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { MAPROOM_INFERNO } from "../../../MAPROOM_INFERNO";
import { SOUNDS } from "../../../SOUNDS";

/**
 * PlayerHandler - handles player interactions in Inferno map room.
 */
export class PlayerHandler extends Sprite {
    public static currentBase: BaseObject | null = null;

    private static readonly MODE_IATTACK: string = "iattack";
    private static readonly MODE_IWMATTACK: string = "iwmattack";
    private static readonly MODE_IDESCENT: string = "idescent";
    private static readonly MODE_IHELP: string = "ihelp";
    private static readonly MODE_IVIEW: string = "iview";

    private player: any = null;
    private data: BaseObject | null = null;
    private _BRIDGE: any = null;
    private _isDescent: boolean = false;

    constructor() {
        super();
        if (MAPROOM_DESCENT._open) {
            if (DescentMapRoom.BRIDGE) {
                this._BRIDGE = DescentMapRoom.BRIDGE;
                this._isDescent = true;
            }
        } else if (MAPROOM_INFERNO._open) {
            if (MapRoom.BRIDGE) {
                this._BRIDGE = MapRoom.BRIDGE;
                this._isDescent = false;
            }
        }
    }

    public configure(player: any): Record<string, any> {
        this.player = player;
        this.data = this.player.data;
        let okAttack = true;
        let okView = true;
        let status = "";
        let extraStatus = "";
        let extraStatusColor = "#000000";
        let relation = "Unknown";
        let relationColor = "#000000";
        if (this.data!.wm.Get() === 0) {
            if (this.data!.saved.Get() >= GLOBAL.Timestamp() - 62) {
                okAttack = false;
                status = "<font color = '#01BA01'>" + KEYS.Get("player_online");
            } else {
                status = "<font color = '#666666'>" + KEYS.Get("player_offline");
            }
            if (this.data!.friend.Get() === 1) {
                relation = KEYS.Get("map_status_friends");
                relationColor = "#0000FF";
            }
            if (this.data!.attacksfrom.Get() > 1) {
                relation = KEYS.Get("map_status_hostile");
                relationColor = "#990000";
            }
            if (Boolean(this.data!.trucestate) && this.data!.trucestate !== "") {
                this.player.truceBtn.Enabled = false;
                this.player.truceBtn.removeEventListener(MouseEvent.CLICK, this.onTruce.bind(this));
                if (this.data!.trucestate === "accepted") {
                    okAttack = false;
                    relation = KEYS.Get("map_status_tactive");
                    relationColor = "#00FF00";
                } else if (this.data!.trucestate === "requested") {
                    relation = KEYS.Get("map_status_trequested");
                    relationColor = "#0000FF";
                } else if (this.data!.trucestate === "rejected") {
                    relation = KEYS.Get("map_status_trejected");
                    relationColor = "#CC0000";
                }
                switch (this.data!.attackpermitted.Get()) {
                    case 5:
                        okAttack = false;
                        extraStatus = KEYS.Get("map_status_dp");
                        break;
                    case 6:
                        okAttack = false;
                        extraStatus = KEYS.Get("map_status_sp");
                        break;
                    case 7:
                        okAttack = false;
                        okView = false;
                        extraStatus = KEYS.Get("map_status_underattack");
                        extraStatusColor = "#FF0000";
                        break;
                }
            } else {
                this.player.truceBtn.Enabled = false;
                this.player.truceBtn.addEventListener(MouseEvent.CLICK, this.onTruce.bind(this));
                switch (this.data!.attackpermitted.Get()) {
                    case 3:
                        okAttack = false;
                        extraStatus = KEYS.Get("map_status_level");
                        break;
                    case 4:
                        extraStatus = KEYS.Get("map_status_vengeance", { "v1": this.data!.retaliatecount });
                        extraStatusColor = "#FF0000";
                        break;
                    case 5:
                        okAttack = false;
                        extraStatus = KEYS.Get("map_status_dp");
                        break;
                    case 6:
                        okAttack = false;
                        extraStatus = KEYS.Get("map_status_sp");
                        break;
                    case 7:
                        okAttack = false;
                        okView = false;
                        extraStatus = KEYS.Get("map_status_underattack");
                        extraStatusColor = "#FF0000";
                        break;
                }
            }
            if (this.data!.truceexpire > 0) {
                extraStatus = KEYS.Get("map_status_timeremain", { "v1": GLOBAL.ToTime(this.data!.truceexpire, true, false) });
                extraStatusColor = "#000000";
            }
            this.player.helpBtn.removeEventListener(MouseEvent.CLICK, this.onHelp.bind(this));
            this.player.helpBtn.removeEventListener(MouseEvent.CLICK, this.onView.bind(this));
            this.player.attackBtn.removeEventListener(MouseEvent.CLICK, this.onAttack.bind(this));
            this.player.msgBtn.addEventListener(MouseEvent.CLICK, this.onMessage.bind(this));
            this.player.helpBtn.SetupKey("map_view_btn");
            this.player.helpBtn.addEventListener(MouseEvent.CLICK, this.onView.bind(this));
            if (!okView) {
                this.player.helpBtn.Enabled = false;
            }
            this.player.attackBtn.SetupKey("map_attack_btn");
            this.player.attackBtn.addEventListener(MouseEvent.CLICK, this.onAttack.bind(this));
            if (!okView || !okAttack) {
                this.player.attackBtn.Enabled = false;
            } else {
                this.player.attackBtn.Enabled = true;
            }
        } else {
            this.player.helpBtn.SetupKey("map_view_btn");
            this.player.helpBtn.addEventListener(MouseEvent.CLICK, this.onView.bind(this));
            this.player.attackBtn.SetupKey("map_attack_btn");
            this.player.attackBtn.addEventListener(MouseEvent.CLICK, this.onAttack.bind(this));
            this.player.attackBtn.Enabled = true;
            this.player.helpBtn.Enabled = true;
        }
        return {
            "OKattack": okAttack,
            "OKview": okView,
            "status": status,
            "extraStatus": extraStatus,
            "relation": relation,
            "relationColor": relationColor,
            "extraStatusColor": extraStatusColor
        };
    }

    private onMessage(event: MouseEvent): void {
        SOUNDS.Play("click1");
        const message = new Message();
        const contact = new Contact(String(this.player.data.userid.Get()), {
            "first_name": this.player.data.ownerName,
            "last_name": "",
            "pic_square": this.player.data.pic
        });
        message.picker.preloadSelection(contact);
        message.requestType = "message";
        message.body_txt.text = "";
        GLOBAL.BlockerAdd();
        GLOBAL._layerWindows.addChild(message);
    }

    private onHelp(event: MouseEvent): void {
        SOUNDS.Play("click1");
        const baseData = this.player.data;
        if (baseData.friend.Get()) {
            this._BRIDGE.setVisitingFriend(true);
        } else {
            this._BRIDGE.setVisitingFriend(false);
        }
        this._BRIDGE.LoadBase(null, null, this.player.data.baseid.Get(), "ihelp", false, EnumYardType.INFERNO_YARD);
        this._BRIDGE.MAPROOM._mc.Hide();
    }

    private onView(event: MouseEvent): void {
        SOUNDS.Play("click1");
        const baseData = this.player.data;
        if (baseData.friend.Get()) {
            this._BRIDGE.setVisitingFriend(true);
        } else {
            this._BRIDGE.setVisitingFriend(false);
        }
        const mode = baseData.wm.Get() === 1 ? "iwmview" : "iview";
        this._BRIDGE.LoadBase(null, null, this.player.data.baseid.Get(), mode, false, EnumYardType.INFERNO_YARD);
        if (this._BRIDGE && this._BRIDGE.MAPROOM && Boolean(this._BRIDGE.MAPROOM._mc)) {
            this._BRIDGE.MAPROOM._mc.Hide();
        }
    }

    private onTruce(event: MouseEvent): void {
        SOUNDS.Play("click1");
        GLOBAL.Message(KEYS.Get("msg_infernotruce"));
    }

    private onAttack(event: MouseEvent): void {
        SOUNDS.Play("click1");
        const baseData = this.player.data;
        let okAttack = false;
        let message = "";
        const attackLabel = KEYS.Get("map_attack_btn2");
        const hasMonsters = Boolean(this._BRIDGE.HOUSING) && this._BRIDGE.HOUSING._housingUsed.Get() > 0 || GLOBAL._playerGuardianData !== null && !MAPROOM_DESCENT.DescentPassed;
        if (baseData.wm.Get() === 0) {
            if (baseData.saved.Get() >= GLOBAL.Timestamp() - 62) {
                okAttack = false;
                message = KEYS.Get("map_msg_ownerinyard", { "v1": baseData.ownerName });
            } else if (GLOBAL._flags.attacking === 0) {
                okAttack = false;
                message = KEYS.Get("map_msg_attackingdisabled");
            } else {
                switch (baseData.attackpermitted.Get()) {
                    case 1:
                        okAttack = true;
                        if (BASE._isProtected > GLOBAL.Timestamp()) {
                            message = KEYS.Get("map_msg_protection", { "v1": GLOBAL.ToTime(BASE._isProtected - GLOBAL.Timestamp(), false, false) });
                        } else if (baseData.friend.Get()) {
                            message = KEYS.Get("map_msg_attackfriend", { "v1": baseData.ownerName });
                        } else {
                            message = KEYS.Get("map_msg_attackconfirm", { "v1": baseData.ownerName });
                        }
                        break;
                    case 2:
                        okAttack = true;
                        message = KEYS.Get("map_msg_higherlevelconfirm", { "v1": baseData.ownerName });
                        break;
                    case 3:
                        message = KEYS.Get("map_msg_leveltoolow");
                        break;
                    case 4:
                        okAttack = true;
                        message = KEYS.Get("map_msg_vengeance");
                        break;
                    case 5:
                        message = KEYS.Get("map_msg_dp", { "v1": baseData.ownerName });
                        break;
                    case 6:
                        message = KEYS.Get("map_msg_sp", { "v1": baseData.ownerName });
                        break;
                    case 7:
                        message = KEYS.Get("map_msg_inprogress", { "v1": baseData.ownerName, "v2": baseData.attacker });
                        break;
                    case 9:
                        message = KEYS.Get("map_msg_truceactive", { "v1": baseData.ownerName });
                        break;
                }
            }
        } else {
            okAttack = true;
            if (baseData.wm.Get() === 0) {
                message = KEYS.Get("map_msg_atatckconfirm", { "v1": baseData.ownerName });
                if (baseData.level.Get() > BASE.BaseLevel().level) {
                    message = KEYS.Get("map_msg_higherlevelconfirm", { "v1": baseData.ownerName });
                }
            } else {
                const mode = baseData.wm.Get() === 1 ? "iwmattack" : "iattack";
                if (hasMonsters) {
                    this.onAttackB(baseData.baseid.Get(), mode);
                    return;
                }
            }
        }
        if (okAttack) {
            this._BRIDGE.HOUSING.HousingSpace();
            const mode = baseData.wm.Get() === 1 ? "iwmattack" : "iattack";
            if (hasMonsters) {
                GLOBAL.Message(message, attackLabel, this.onAttackB.bind(this), [Number(baseData.baseid.Get()), mode]);
            } else {
                if (MAPROOM_DESCENT.DescentPassed) {
                    message = KEYS.Get("infmap_msg_nomonsters");
                } else {
                    message = KEYS.Get("map_msg_nomonsters");
                }
                GLOBAL.Message(message);
            }
        } else {
            GLOBAL.Message(message);
        }
    }

    public onAttackB(baseId: number, mode: string): void {
        const baseData = this.player.data;
        if (baseData.wm.Get() === 1) {
            WMBASE._type = baseData.type;
        }
        if (baseData.friend.Get()) {
            this._BRIDGE.setVisitingFriend(true);
        } else {
            this._BRIDGE.setVisitingFriend(false);
        }
        MapRoomManager.instance.mapRoomVersion = MapRoomManager.MAP_ROOM_VERSION_1;
        BASE.LoadBase(null, 0, Number(baseId), mode, false, EnumYardType.INFERNO_YARD);
        if (!MAPROOM_DESCENT.DescentPassed && mode === "iwmattack") {
            LOGGER.Stat([87, baseData.level.Get(), "Attacked"]);
        }
        if (this._BRIDGE.MAPROOM._mc) {
            this._BRIDGE.MAPROOM._mc.Hide();
        }
    }
}
