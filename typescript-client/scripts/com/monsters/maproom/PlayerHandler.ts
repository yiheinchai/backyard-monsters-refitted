import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { WMBASE } from "../ai/WMBASE";
import { EnumYardType } from "../enums/EnumYardType";
import { Contact } from "../mailbox/model/Contact";
import { BaseObject } from "./model/BaseObject";
import { MapRoom } from "./MapRoom";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { MAPROOM } from "../../../MAPROOM";
import { TUTORIAL } from "../../../TUTORIAL";

/**
 * PlayerHandler - handles player interactions in normal map room.
 */
export class PlayerHandler extends Sprite {
    public static currentBase: BaseObject | null = null;

    private player: any = null;
    private data: BaseObject | null = null;

    constructor() {
        super();
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
            if (this.data!.saved.Get() >= MapRoom.BRIDGE.GLOBAL.Timestamp() - 62) {
                okAttack = false;
                status = "<font color = '#01BA01'>" + KEYS.Get("player_online");
            } else {
                status = "<font color = '#666666'>" + KEYS.Get("player_offline");
            }
            if (this.data!.friend.Get() === 1) {
                relation = String(MapRoom.BRIDGE.KEYS.Get("map_status_friends"));
                relationColor = "#0000FF";
            }
            if (this.data!.attacksfrom.Get() > 1) {
                relation = String(MapRoom.BRIDGE.KEYS.Get("map_status_hostile"));
                relationColor = "#990000";
            }
            if (Boolean(this.data!.trucestate) && this.data!.trucestate !== "") {
                this.player.truceBtn.Enabled = false;
                this.player.truceBtn.removeEventListener(MouseEvent.CLICK, this.onTruce.bind(this));
                if (this.data!.trucestate === "accepted") {
                    okAttack = false;
                    relation = String(MapRoom.BRIDGE.KEYS.Get("map_status_tactive"));
                    relationColor = "#00FF00";
                } else if (this.data!.trucestate === "requested") {
                    relation = String(MapRoom.BRIDGE.KEYS.Get("map_status_trequested"));
                    relationColor = "#0000FF";
                } else if (this.data!.trucestate === "rejected") {
                    relation = String(MapRoom.BRIDGE.KEYS.Get("map_status_trejected"));
                    relationColor = "#CC0000";
                }
                switch (this.data!.attackpermitted.Get()) {
                    case 5:
                        okAttack = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_dp"));
                        break;
                    case 6:
                        okAttack = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_sp"));
                        break;
                    case 7:
                        okAttack = false;
                        okView = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_underattack"));
                        extraStatusColor = "#FF0000";
                        break;
                }
            } else {
                this.player.truceBtn.Enabled = true;
                this.player.truceBtn.addEventListener(MouseEvent.CLICK, this.onTruce.bind(this));
                switch (this.data!.attackpermitted.Get()) {
                    case 3:
                        okAttack = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_level"));
                        break;
                    case 4:
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_vengeance", { "v1": this.data!.retaliatecount }));
                        extraStatusColor = "#FF0000";
                        break;
                    case 5:
                        okAttack = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_dp"));
                        break;
                    case 6:
                        okAttack = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_sp"));
                        break;
                    case 7:
                        okAttack = false;
                        okView = false;
                        extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_underattack"));
                        extraStatusColor = "#FF0000";
                        break;
                }
            }
            if (this.data!.truceexpire > 0) {
                extraStatus = String(MapRoom.BRIDGE.KEYS.Get("map_status_timeremain", { "v1": MapRoom.BRIDGE.GLOBAL.ToTime(this.data!.truceexpire, true, false) }));
                extraStatusColor = "#000000";
            }
            this.player.helpBtn.removeEventListener(MouseEvent.CLICK, this.onHelp.bind(this));
            this.player.helpBtn.removeEventListener(MouseEvent.CLICK, this.onView.bind(this));
            this.player.attackBtn.removeEventListener(MouseEvent.CLICK, this.onAttack.bind(this));
            this.player.msgBtn.addEventListener(MouseEvent.CLICK, this.onMessage.bind(this));
            if (this.data!.friend.Get() === 1) {
                this.player.helpBtn.SetupKey("map_help_btn");
                this.player.helpBtn.addEventListener(MouseEvent.CLICK, this.onHelp.bind(this));
            } else {
                this.player.helpBtn.SetupKey("map_view_btn");
                this.player.helpBtn.addEventListener(MouseEvent.CLICK, this.onView.bind(this));
            }
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
            if (TUTORIAL._stage < 110) {
                this.player.helpBtn.Enabled = false;
            } else {
                this.player.helpBtn.addEventListener(MouseEvent.CLICK, this.onView.bind(this));
            }
            this.player.attackBtn.SetupKey("map_attack_btn");
            this.player.attackBtn.addEventListener(MouseEvent.CLICK, this.onAttack.bind(this));
            this.player.attackBtn.Enabled = true;
            if (TUTORIAL._stage > 110) {
                this.player.helpBtn.Enabled = true;
            }
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
        MapRoom.BRIDGE.SOUNDS.Play("click1");
        // Important Comment: This does not exist - fix.
        // const messageUI = new MapRoom.BRIDGE.MessageUI();
        const contact = new Contact(String(this.player.data.userid.Get()), {
            "first_name": this.player.data.ownerName,
            "last_name": "",
            "pic_square": this.player.data.pic
        });
        // messageUI.picker.preloadSelection(contact);
        // messageUI.requestType = "message";
        // messageUI.body_txt.text = "";
        GLOBAL.BlockerAdd();
        // GLOBAL._layerWindows.addChild(messageUI);
    }

    private onHelp(event: MouseEvent): void {
        MapRoom.BRIDGE.SOUNDS.Play("click1");
        const baseData = this.player.data;
        if (baseData.friend.Get()) {
            MapRoom.BRIDGE.setVisitingFriend(true);
        } else {
            MapRoom.BRIDGE.setVisitingFriend(false);
        }
        MapRoom.BRIDGE.LoadBase(null, null, this.player.data.baseid.Get(), "help");
        if (MAPROOM._mc) {
            MAPROOM._mc.Hide();
        }
    }

    private onView(event: MouseEvent): void {
        MapRoom.BRIDGE.SOUNDS.Play("click1");
        const baseData = this.player.data;
        if (baseData.friend.Get()) {
            MapRoom.BRIDGE.setVisitingFriend(true);
        } else {
            MapRoom.BRIDGE.setVisitingFriend(false);
        }
        const mode = baseData.wm.Get() === 1 ? "wmview" : "view";
        MapRoom.BRIDGE.LoadBase(null, null, this.player.data.baseid.Get(), mode, false, EnumYardType.MAIN_YARD);
        if (Boolean(MAPROOM) && Boolean(MAPROOM._mc)) {
            MAPROOM._mc.Hide();
        }
    }

    private onTruce(event: MouseEvent): void {
        MapRoom.BRIDGE.SOUNDS.Play("click1");
        if (!this.data!.trucestate || this.data!.trucestate === "") {
            if (MapRoom._useMailBoxForTruces) {
                // Important Comment: This does not exist - fix.
                // const messageUI = new MapRoom.BRIDGE.MessageUI();
                const contact = new Contact(String(this.player.data.userid.Get()), {
                    "first_name": this.player.data.ownerName,
                    "last_name": "",
                    "pic_square": this.player.data.pic
                });
                // messageUI.picker.preloadSelection(contact);
                // messageUI.subject_txt.htmlText = "<b>" + MapRoom.BRIDGE.KEYS.Get("map_trucesubject");
                // messageUI.body_txt.htmlText = MapRoom.BRIDGE.KEYS.Get("map_trucemessage");
                // messageUI.requestType = "trucerequest";
                // messageUI.truceShareHandler = MapRoom.BRIDGE.truceShareHandler;
                GLOBAL.BlockerAdd();
                // GLOBAL._layerWindows.addChild(messageUI);
            } else {
                MapRoom.BRIDGE.RequestTruce(this.data!.ownerName, this.data!.baseid.Get());
            }
        } else {
            MapRoom.BRIDGE.GLOBAL.Message(MapRoom.BRIDGE.KEYS.Get("msg_trucealreadyrequested"));
        }
    }

    private onAttack(event: MouseEvent): void {
        MapRoom.BRIDGE.SOUNDS.Play("click1");
        const baseData = this.player.data;
        let okAttack = false;
        let message = "";
        const attackLabel = String(MapRoom.BRIDGE.KEYS.Get("map_attack_btn2"));
        const hasMonsters = MapRoom.BRIDGE.HOUSING._housingUsed.Get() > 0 || MapRoom.BRIDGE.GLOBAL._playerGuardianData !== null;
        if (MapRoom.BRIDGE.GLOBAL._bFlinger !== null && MapRoom.BRIDGE.GLOBAL._bFlinger._canFunction && MapRoom.BRIDGE.GLOBAL._bFlinger._countdownUpgrade.Get() === 0) {
            if (baseData.wm.Get() === 0) {
                if (baseData.saved.Get() >= MapRoom.BRIDGE.GLOBAL.Timestamp() - 62) {
                    okAttack = false;
                    message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_ownerinyard", { "v1": baseData.ownerName }));
                } else if (MapRoom.BRIDGE.GLOBAL._flags.attacking === 0) {
                    okAttack = false;
                    message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_attackingdisabled"));
                } else {
                    switch (baseData.attackpermitted.Get()) {
                        case 1:
                            okAttack = true;
                            if (MapRoom.BRIDGE.BASE._isProtected > GLOBAL.Timestamp()) {
                                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_protection", { "v1": MapRoom.BRIDGE.GLOBAL.ToTime(MapRoom.BRIDGE.BASE._isProtected - MapRoom.BRIDGE.GLOBAL.Timestamp(), false, false) }));
                            } else if (baseData.friend.Get()) {
                                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_attackfriend", { "v1": baseData.ownerName }));
                            } else {
                                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_attackconfirm", { "v1": baseData.ownerName }));
                            }
                            break;
                        case 2:
                            okAttack = true;
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_higherlevelconfirm", { "v1": baseData.ownerName }));
                            break;
                        case 3:
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_leveltoolow"));
                            break;
                        case 4:
                            okAttack = true;
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_vengeance"));
                            break;
                        case 5:
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_dp", { "v1": baseData.ownerName }));
                            break;
                        case 6:
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_sp", { "v1": baseData.ownerName }));
                            break;
                        case 7:
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_inprogress", { "v1": baseData.ownerName, "v2": baseData.attacker }));
                            break;
                        case 9:
                            message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_truceactive", { "v1": baseData.ownerName }));
                            break;
                    }
                }
            } else {
                okAttack = true;
                if (baseData.wm.Get() === 0) {
                    message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_atatckconfirm", { "v1": baseData.ownerName }));
                    if (baseData.level.Get() > MapRoom.BRIDGE.BASE.BaseLevel().level) {
                        message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_higherlevelconfirm", { "v1": baseData.ownerName }));
                    }
                } else {
                    const mode = baseData.wm.Get() === 1 ? "wmattack" : GLOBAL.e_BASE_MODE.ATTACK;
                    if (hasMonsters) {
                        this.onAttackB(baseData.baseid.Get(), mode);
                        return;
                    }
                }
            }
        } else {
            okAttack = false;
            if (MapRoom.BRIDGE.GLOBAL._bFlinger === null) {
                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_needflinger"));
            } else if (MapRoom.BRIDGE.GLOBAL._bFlinger._countdownUpgrade.Get() > 0) {
                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_flingerupgrading"));
            } else {
                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_flingerdamaged"));
            }
        }
        if (okAttack) {
            MapRoom.BRIDGE.HOUSING.HousingSpace();
            const mode = baseData.wm.Get() === 1 ? "wmattack" : GLOBAL.e_BASE_MODE.ATTACK;
            if (hasMonsters) {
                MapRoom.BRIDGE.GLOBAL.Message(message, attackLabel, this.onAttackB.bind(this), [baseData.baseid.Get(), mode]);
            } else {
                message = String(MapRoom.BRIDGE.KEYS.Get("map_msg_nomonsters"));
                MapRoom.BRIDGE.GLOBAL.Message(message);
            }
        } else {
            MapRoom.BRIDGE.GLOBAL.Message(message);
        }
    }

    public onAttackB(baseId: number, mode: string): void {
        const baseData = this.player.data;
        if (baseData.wm.Get() === 1) {
            MapRoom.BRIDGE.WMBASE._type = baseData.type;
        }
        if (baseData.friend.Get()) {
            MapRoom.BRIDGE.setVisitingFriend(true);
        } else {
            MapRoom.BRIDGE.setVisitingFriend(false);
        }
        MapRoom.BRIDGE.BASE.LoadBase(null, null, baseId, mode, false, EnumYardType.MAIN_YARD);
        if (MapRoom.BRIDGE && MapRoom.BRIDGE.MAPROOM && Boolean(MapRoom.BRIDGE.MAPROOM._mc)) {
            MapRoom.BRIDGE.MAPROOM._mc.Hide();
        }
    }
}
