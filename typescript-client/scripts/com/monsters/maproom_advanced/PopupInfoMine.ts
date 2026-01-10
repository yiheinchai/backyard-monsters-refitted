import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";
import { TweenLite, Elastic } from "gs/TweenLite";

import { ScrollSet } from "../display/ScrollSet";
import { EnumYardType } from "../enums/EnumYardType";
import { Message } from "../mailbox/Message";
import { Contact } from "../mailbox/model/Contact";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { CellData } from "./CellData";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";
import { PopupInfoMine_CLIP } from "./PopupInfoMine_CLIP";
import { PopupInfoMonster } from "./PopupInfoMonster";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { LOGIN } from "../../../LOGIN";
import { POWERUPS } from "../../../POWERUPS";
import { SOUNDS } from "../../../SOUNDS";
import { URLLoaderApi } from "../../../URLLoaderApi";

/**
 * PopupInfoMine - popup for player's own bases in map room.
 */
export class PopupInfoMine extends PopupInfoMine_CLIP {
    private _cell: MapRoomCell | null = null;
    private _mcMonsters: MovieClip | null = null;
    private _message: Message | null = null;
    private _hasMonsters: boolean = false;
    private _bookmarked: boolean = false;
    private _scroller: ScrollSet | null = null;

    constructor() {
        super();
        this.x = 760 / 2 + 75;
        this.y = 520 / 2;
        this.mMonsters.mask = this.mMonstersMask;
        this._scroller = new ScrollSet();
        this._scroller.isHiddenWhileUnnecessary = true;
        this._scroller.AutoHideEnabled = false;
        this._scroller.width = this.scroll.width;
        this._scroller.x = this.scroll.x;
        this._scroller.y = this.scroll.y;
        this.addChild(this._scroller);
        this._scroller.Init(this.mMonsters, this.mMonstersMask, 0, this.scroll.y, this.scroll.height);
        this.bOpen.SetupKey("btn_open");
        this.bOpen.Highlight = true;
        this.bOpen.addEventListener(MouseEvent.MOUSE_OVER, (e: MouseEvent) => {
            this.ButtonInfo("open");
        });
        this.bOpen.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            this.Open();
        });
        this.bMonsters.SetupKey("newmap_tr_from");
        this.bMonsters.addEventListener(MouseEvent.MOUSE_OVER, (e: MouseEvent) => {
            this.ButtonInfo("monsters");
        });
        this.bMonsters.addEventListener(MouseEvent.CLICK, this.StartTransferM.bind(this));
        this.bRelocate.SetupKey("btn_movemainyardhere");
        this.bRelocate.addEventListener(MouseEvent.MOUSE_OVER, (e: MouseEvent) => {
            this.ButtonInfo("relocateme");
        });
        this.bRelocate.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            MapRoom._mc.ShowRelocateMePopup(this._cell!);
        });
        this.bInviteMigrate.addEventListener(MouseEvent.MOUSE_OVER, (e: MouseEvent) => {
            this.ButtonInfo("invitemigrate");
        });
        this.bInviteMigrate.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            this.ShowInviteMigrate();
        });
        this.bBookmark.SetupKey("newmap_bookmark_btn");
        this.bBookmark.addEventListener(MouseEvent.MOUSE_OVER, (e: MouseEvent) => {
            this.ButtonInfo("bookmark");
        });
        this.bBookmark.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            if (!this._bookmarked) {
                MapRoom._mc.ShowBookmarkAddPopup(this._cell!);
            } else {
                GLOBAL.Message(KEYS.Get("newmap_bm_done"));
            }
        });
        (this.mcFrame as any).Setup();
    }

    private StartTransferM(event: MouseEvent): void {
        if (this.bMonsters.Enabled && !MapRoom._monsterTransferInProgress && !MapRoom._resourceTransferInProgress && GLOBAL._mapOutpost.length > 0 && this._hasMonsters) {
            MapRoom._mc.ShowMonstersA(this._cell!);
        }
    }

    public Hide(event: MouseEvent | null = null): void {
        MapRoom._mc.HideInfoMine();
    }

    public Setup(cell: MapRoomCell): void {
        this._cell = cell;
        this.tLabel1.htmlText = "<b>" + KEYS.Get("popup_label_name") + "</b>";
        this.tLabel2.htmlText = "<b>" + KEYS.Get("popup_label_thisyardhas") + "</b>";
        this.tLabel3.htmlText = "<b>" + KEYS.Get("popup_label_locationheight") + "</b>";
        this.tLabel4.htmlText = "<b>" + KEYS.Get("popup_label_monstershoused") + "</b>";
        let warBonus = 0;
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_DECLAREWAR, "NORMAL")) {
            warBonus = POWERUPS.Apply(POWERUPS.ALLIANCE_DECLAREWAR, [0]);
        }
        GLOBAL._attackerCellsInRange = MapRoom._mc.GetCellsInRange(this._cell.X, this._cell.Y, 10 + warBonus);
        if (this._cell._base === 3) {
            this.tName.htmlText = KEYS.Get("map_outpostowner", { "v1": this._cell._name });
        } else {
            this.tName.htmlText = KEYS.Get("map_yardowner", { "v1": this._cell._name });
        }
        this.tLocation.htmlText = cell.X + "x" + cell.Y;
        this.tHeight.htmlText = this._cell._height - 100 + "m";
        let heightBonus = 0;
        if (this._cell._base === 2) {
            heightBonus = 0;
        } else {
            heightBonus = this._cell._height * 100 / GLOBAL._averageAltitude.Get() - 100;
        }
        let inverseBonus = 0;
        if (this._cell._base === 2) {
            inverseBonus = 0;
        } else {
            inverseBonus = 100 * GLOBAL._averageAltitude.Get() / this._cell._height - 100;
        }
        let heightText = "";
        if (heightBonus >= 0) {
            heightText = "<font color=\"#003300\">+" + KEYS.Get("newmap_h1", { "v1": heightBonus }) + "</font>";
        } else {
            heightText = "<font color=\"#330000\">- " + KEYS.Get("newmap_h1", { "v1": Math.abs(heightBonus) }) + "</font>";
        }
        let inverseText = "";
        if (inverseBonus >= 0) {
            inverseText = "<font color=\"#003300\">+" + KEYS.Get("newmap_h2", { "v1": inverseBonus }) + "</font>";
        } else {
            inverseText = "<font color=\"#330000\">- " + KEYS.Get("newmap_h2", { "v1": Math.abs(inverseBonus) }) + "</font>";
        }
        this.tBonus.htmlText = heightText + "<br>" + inverseText;
        if (GLOBAL._mapOutpost.length > 0) {
            this.bMonsters.Enabled = true;
        } else {
            this.bMonsters.Enabled = false;
        }
        this.ButtonInfo("open");
        this.bBookmark.Enabled = true;
        if (MapRoom._bookmarks) {
            for (let i = 0; i < MapRoom._bookmarks.length; i++) {
                if (MapRoom._bookmarks[i].location.x === this._cell.X && MapRoom._bookmarks[i].location.y === this._cell.Y) {
                    this._bookmarked = true;
                    break;
                }
            }
            if (this._bookmarked) {
                this.bBookmark.Enabled = false;
            } else {
                this.bBookmark.Enabled = true;
            }
        }
        if (this._cell._base === 3) {
            this.bRelocate.visible = true;
            this.bInviteMigrate.visible = true;
        } else {
            this.bRelocate.visible = false;
            this.bInviteMigrate.visible = false;
        }
        if (this._cell._invitePendingID === 0) {
            this.bInviteMigrate.SetupKey("btn_invitetomove");
        } else {
            this.bInviteMigrate.SetupKey("btn_revokeinvitation");
        }
        this.Update();
    }

    public Cleanup(): void {
        if (this.mcFrame) {
            (this.mcFrame as any).Clear();
            this.mcFrame = null!;
        }
    }

    private Open(): void {
        if (!this._cell!._locked || this._cell!._locked === LOGIN._playerID) {
            GLOBAL._currentCell = this._cell;
            MapRoom._mc.HideInfoMine();
            MapRoomManager.instance.Hide();
            MapRoom.ClearCells();
            GLOBAL._attackerCellsInRange = [];
            const yardType = this._cell!._base === 3 ? EnumYardType.OUTPOST : EnumYardType.MAIN_YARD;
            BASE.LoadBase(null, 0, this._cell!._baseID, GLOBAL.e_BASE_MODE.BUILD, false, yardType);
        } else {
            GLOBAL.Message(KEYS.Get("newmap_attacked"));
        }
    }

    public PendingInvite(): void {
        this._cell!._invitePendingID = 1;
        this._cell!.mc.mcPlayer.mcInvite.visible = true;
        this._cell!._updated = false;
        MapRoom.GetCell(this._cell!.X, this._cell!.Y, true);
    }

    private RevokeInvitation(): void {
        const onMigrateRevokeSuccess = (data: Record<string, any>): void => {
            this.Hide();
            if (data.error !== 0) {
                GLOBAL.Message(KEYS.Get("msg_err_revoke") + data.error);
                return;
            }
            this._cell!._invitePendingID = 0;
            this._cell!.mc.mcPlayer.mcInvite.visible = false;
            this._cell!._updated = false;
            if (MapRoom._open) {
                MapRoom.GetCell(this._cell!.X, this._cell!.Y, true);
            }
            GLOBAL.Message(KEYS.Get("msg_revoke_success"));
        };
        const onFail = (error: Error): void => {
            this.Hide();
            GLOBAL.Message(KEYS.Get("msg_err_revoke") + error.message);
            LOGGER.Log("err", "PopupInfoMine.RevokeInvitation HTTP ", error.message);
        };
        if (!this._cell!._updated) {
            return;
        }
        SOUNDS.Play("click1");
        const body = KEYS.Get("invite_revoke");
        const subject = KEYS.Get("invite_subject");
        const vars = [["threadid", this._cell!._invitePendingID], ["targetid", LOGIN._playerID], ["targetbaseid", 0], ["type", "migraterevoke"], ["subject", subject], ["message", body]];
        const r = new URLLoaderApi();
        r.load(GLOBAL._apiURL + "player/sendmessage", vars, onMigrateRevokeSuccess, onFail);
    }

    private ButtonInfo(type: string): void {
        if (type === "open") {
            this.txtButtonInfo.htmlText = KEYS.Get("newmap_inf_open");
            this.mcArrow.x = this.bOpen.x + this.bOpen.width / 2 - 5;
        } else if (type === "monsters") {
            this.txtButtonInfo.htmlText = KEYS.Get("newmap_inf_tr");
            this.mcArrow.x = this.bMonsters.x + this.bMonsters.width / 2 - 5;
        } else if (type === "bookmark") {
            this.txtButtonInfo.htmlText = KEYS.Get("newmap_bookmark");
            this.mcArrow.x = this.bBookmark.x + this.bBookmark.width / 2 - 5;
        } else if (type === "relocateme") {
            this.txtButtonInfo.htmlText = KEYS.Get("newmap_relocate_exp");
            this.mcArrow.x = this.bRelocate.x + this.bRelocate.width / 2 - 5;
        } else if (type === "invitemigrate") {
            if (this._cell!._invitePendingID) {
                this.txtButtonInfo.htmlText = KEYS.Get("newmap_revokepending");
            } else {
                this.txtButtonInfo.htmlText = KEYS.Get("newmap_invite_exp");
            }
            this.mcArrow.x = this.bInviteMigrate.x + this.bInviteMigrate.width / 2 - 5;
        }
        TweenLite.to(this.mcArrow, 0.6, {
            "x": this.mcArrow.x + 5,
            "ease": Elastic.easeOut
        });
    }

    private ShowInviteMigrate(): void {
        if (this._cell!._base < 2) {
            GLOBAL.Message(KEYS.Get("newmap_wmtruce", { "v1": this._cell!._name }));
            return;
        }
        if (!this._cell!._updated) {
            return;
        }
        if (this._cell!._invitePendingID) {
            this.RevokeInvitation();
            return;
        }
        if (Boolean(this._message) && Boolean(this._message!.parent)) {
            this._message!.parent.removeChild(this._message!);
            this._message = null;
        }
        const contact = new Contact(String(this._cell!._userID), {
            "first_name": this._cell!._name,
            "last_name": "",
            "pic_square": this._cell!._pic_square
        });
        this._message = new Message("map2friends");
        this._message.requestType = "migraterequest";
        this._message.subject_txt.htmlText = KEYS.Get("invite_subject");
        this._message.body_txt.htmlText = KEYS.Get("invite_body");
        this._message.x = 0;
        this._message.y = -450;
        this._message.baseID = this._cell!._baseID;
        GLOBAL.BlockerAdd(this.parent as MovieClip);
        MapRoom._mc.addChild(this._message);
        this.bInviteMigrate.Enabled = false;
    }

    public Update(): void {
        if (this._cell!._updated) {
            this.bInviteMigrate.Enabled = true;
        } else {
            this.bInviteMigrate.Enabled = false;
        }
        if (Boolean(this._mcMonsters) && Boolean(this._mcMonsters!.parent)) {
            this._mcMonsters!.parent.removeChild(this._mcMonsters!);
            this._mcMonsters = null;
        }
        this._hasMonsters = false;
        if (this._cell!._monsters) {
            this._mcMonsters = new MovieClip();
            this._mcMonsters.x = 5;
            this._mcMonsters.y = 5;
            let col = 0;
            let row = 0;
            for (const monsterId in this._cell!._monsters) {
                if (this._cell!._monsters[monsterId].Get() > 0) {
                    const monsterUI = new PopupInfoMonster();
                    monsterUI.Setup(col * 130, row * 35, monsterId, this._cell!._monsters[monsterId].Get());
                    col += 1;
                    this._mcMonsters.addChild(monsterUI);
                    if (col === 2) {
                        col = 0;
                        row += 1;
                    }
                    this._hasMonsters = true;
                }
            }
            this.mMonsters.addChild(this._mcMonsters);
        }
        if (this._hasMonsters && GLOBAL._mapOutpost.length > 0) {
            this.bMonsters.Enabled = true;
        } else {
            this.bMonsters.Enabled = false;
        }
        if (this._scroller) {
            this._scroller.Update();
        }
    }
}
