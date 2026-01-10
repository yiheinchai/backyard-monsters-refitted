import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Loader from "openfl/display/Loader";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import URLRequest from "openfl/net/URLRequest";

import { SecNum } from "../../../cc/utils/SecNum";
import { AllyInfo } from "../alliances/AllyInfo";
import { ImageCache } from "../display/ImageCache";
import { EnumYardType } from "../enums/EnumYardType";
import { Message } from "../mailbox/Message";
import { Contact } from "../mailbox/model/Contact";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { CellData } from "./CellData";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";
import { PopupInfoEnemy_CLIP } from "./PopupInfoEnemy_CLIP";
import { PopupTakeover } from "./PopupTakeover";
import { bubblepopupRight } from "./bubblepopupRight";
import { frame } from "../../../frame";
import { URLLoaderApi } from "../../../URLLoaderApi";

import { ALLIANCES } from "../../../ALLIANCES";
import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { JSON } from "../../../JSON";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { LOGIN } from "../../../LOGIN";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { POWERUPS } from "../../../POWERUPS";

/**
 * PopupInfoEnemy - Enemy info popup in the map room.
 */
export class PopupInfoEnemy extends PopupInfoEnemy_CLIP {
    private static _takeoverCost: SecNum | null = null;
    private static _minTakeoverCost: SecNum | null = null;
    private static _takeoverCoeff1: SecNum | null = null;
    private static _takeoverCoeff2: SecNum | null = null;
    private static _shinyCost: SecNum | null = null;
    private static _popupmc: bubblepopupRight | null = null;
    private static _popupdo: DisplayObject | null = null;
    private static _bookmarked: boolean = false;
    private static _protectedInRange: boolean = false;

    private _cell: MapRoomCell | null = null;
    private _mcMonsters: MovieClip | null = null;
    private _mcResources: MovieClip | null = null;
    private _message: Message | null = null;
    private _profilePic: Loader | null = null;
    private _profileBmp: Bitmap | null = null;

    constructor() {
        super();
        this.Center();
        this.tNameLabel.htmlText = "<b>" + KEYS.Get("popup_label_name") + "</b>";
        this.tLocationLabel.htmlText = "<b>" + KEYS.Get("popup_label_location") + "</b>";
        this.tHeightLabel.htmlText = "<b>" + KEYS.Get("popup_label_height") + "</b>";
        this.tYardHasLabel.htmlText = "<b>" + KEYS.Get("popup_label_thisyardhas") + "</b>";
        this.bAttack.SetupKey("map_attack_btn");
        this.bAttack.Highlight = true;
        this.bAttack.Enabled = true;
        this.bAttack.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfo.bind(this));
        this.bAttack.addEventListener(MouseEvent.MOUSE_OUT, (event: MouseEvent) => {
            this.PopupHide();
        });
        this.bAttack.addEventListener(MouseEvent.CLICK, this.Attack.bind(this));
        this.bView.SetupKey("map_view_btn");
        this.bView.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfo.bind(this));
        this.bView.addEventListener(MouseEvent.MOUSE_OUT, (event: MouseEvent) => {
            this.PopupHide();
        });
        this.bView.addEventListener(MouseEvent.CLICK, (event: MouseEvent) => {
            this.View();
        });
        this.bSendMessage.SetupKey("map_message_btn");
        this.bSendMessage.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfo.bind(this));
        this.bSendMessage.addEventListener(MouseEvent.MOUSE_OUT, (event: MouseEvent) => {
            this.PopupHide();
        });
        this.bSendMessage.addEventListener(MouseEvent.CLICK, (event: MouseEvent) => {
            this.ShowMessage();
        });
        this.bTruce.SetupKey("newmap_truce_btn");
        this.bTruce.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfo.bind(this));
        this.bTruce.addEventListener(MouseEvent.MOUSE_OUT, (event: MouseEvent) => {
            this.PopupHide();
        });
        this.bTruce.addEventListener(MouseEvent.CLICK, (event: MouseEvent) => {
            this.ShowTruce();
        });
        this.bAlliance.SetupKey("btn_invitetoalliance");
        this.bAlliance.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfo.bind(this));
        this.bAlliance.addEventListener(MouseEvent.MOUSE_OUT, (event: MouseEvent) => {
            this.PopupHide();
        });
        this.bAlliance.addEventListener(MouseEvent.CLICK, (event: MouseEvent) => {
            this.ShowAllianceInvite();
        });
        this.bBookmark.SetupKey("newmap_bookmark_btn");
        this.bBookmark.addEventListener(MouseEvent.MOUSE_OVER, this.ButtonInfo.bind(this));
        this.bBookmark.addEventListener(MouseEvent.MOUSE_OUT, (event: MouseEvent) => {
            this.PopupHide();
        });
        this.bBookmark.addEventListener(MouseEvent.CLICK, (event: MouseEvent) => {
            if (!PopupInfoEnemy._bookmarked) {
                MapRoom._mc.ShowBookmarkAddPopup(this._cell);
            } else {
                GLOBAL.Message(KEYS.Get("newmap_bm_done"));
            }
        });
        PopupInfoEnemy._minTakeoverCost = new SecNum(2000000);
        PopupInfoEnemy._takeoverCoeff1 = new SecNum(5000000);
        PopupInfoEnemy._takeoverCoeff2 = new SecNum(20000000);
        (this.mcFrame as frame).Setup();
    }

    public Hide(event: MouseEvent | null = null): void {
        if (Boolean(this._profilePic) && Boolean(this._profilePic!.parent)) {
            this._profilePic!.parent.removeChild(this._profilePic!);
            this._profilePic = null;
        }
        if (Boolean(this._profileBmp) && Boolean(this._profileBmp!.parent)) {
            this._profileBmp!.parent.removeChild(this._profileBmp!);
            this._profileBmp = null;
        }
        MapRoom._mc.HideInfoEnemy();
    }

    public Setup(cell: MapRoomCell, inRange: boolean = false): void {
        this._cell = cell;
        let hasDeclareWar = false;
        let declareWarBonus = 0;
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_DECLAREWAR, "NORMAL")) {
            hasDeclareWar = true;
            declareWarBonus = POWERUPS.Apply(POWERUPS.ALLIANCE_DECLAREWAR, [0]);
        }
        GLOBAL._attackerCellsInRange = MapRoom._mc.GetCellsInRange(this._cell.X, this._cell.Y, 10 + declareWarBonus);
        MapRoom._flingerInRange = inRange;
        this.bAlliance.visible = true;
        for (const cellData of GLOBAL._attackerCellsInRange) {
            const mapCell = cellData.cell as MapRoomCell;
            const dist = cellData.range;
            if (mapCell && mapCell._mine && mapCell._flingerRange.Get() + declareWarBonus >= dist) {
                MapRoom._flingerInRange = true;
            }
            if (MapRoom._flingerInRange && PopupInfoEnemy._protectedInRange) {
                break;
            }
        }
        if (this._cell._base !== 2 && this._cell._destroyed && !this._cell._protected && (this._cell._locked === 0 || this._cell._locked === LOGIN._playerID) && MapRoom._flingerInRange) {
            this.bAttack.SetupKey("btn_takeover");
            this.bAttack.Enabled = !this.doesHaveMaxOutposts();
            this.bAttack.Highlight = !this.doesHaveMaxOutposts();
        } else {
            this.bAttack.SetupKey("map_attack_btn");
            if (this._cell._protected || this._cell._locked !== 0 && this._cell._locked !== LOGIN._playerID || !MapRoom._flingerInRange) {
                this.bAttack.Highlight = false;
            } else {
                this.bAttack.Highlight = true;
                this.bAttack.Enabled = true;
            }
        }
        if (this._cell._base === 3) {
            this.bSendMessage.Enabled = true;
            this.bTruce.Enabled = true;
            if (ALLIANCES._myAlliance) {
                this.bAlliance.Enabled = true;
            } else {
                this.bAlliance.Enabled = false;
                if (Boolean(GLOBAL._flags.viximo) || Boolean(GLOBAL._flags.kongregate)) {
                    this.bAlliance.visible = false;
                }
            }
            if (!this._cell._destroyed) {
                this.tName.htmlText = "<b>" + this._cell._name + "'s " + KEYS.Get("b_outpost") + "</b>";
                if (this._cell._alliance) {
                    this.tName.htmlText += "<br>" + this._cell._alliance.name;
                }
            } else {
                this.tName.htmlText = "<b>" + this._cell._name + "'s " + KEYS.Get("b_outpost") + " (" + KEYS.Get("newmap_inf_destroyed") + ")</b>";
                if (this._cell._alliance) {
                    this.tName.htmlText += "<br>" + this._cell._alliance.name;
                }
            }
            this.ProfilePic();
            if (this._cell._level) {
                this.mcLevel.visible = true;
                this.mcLevel.lv_txt.htmlText = "<b>" + this._cell._level + "</b>";
            } else {
                this.mcLevel.visible = false;
            }
            if (this._cell._alliance) {
                this.AlliancePic(AllyInfo._picURLs.sizeM, this.mcAlliancePic.mcImage, this.mcAlliancePic.mcBG, true);
            } else {
                this.mcAlliancePic.visible = false;
                this.mcRelations.visible = false;
            }
        } else if (this._cell._base === 2) {
            this.bSendMessage.Enabled = true;
            this.bTruce.Enabled = true;
            if (ALLIANCES._myAlliance) {
                this.bAlliance.Enabled = true;
            } else {
                this.bAlliance.Enabled = false;
                if (Boolean(GLOBAL._flags.viximo) || Boolean(GLOBAL._flags.kongregate)) {
                    this.bAlliance.visible = false;
                }
            }
            this.tName.htmlText = "<b>" + KEYS.Get("map_yardowner", { "v1": this._cell._name }) + "</b>";
            if (this._cell._alliance) {
                this.tName.htmlText += "<br>" + this._cell._alliance.name;
            }
            this.ProfilePic();
            if (this._cell._level) {
                this.mcLevel.visible = true;
                this.mcLevel.lv_txt.htmlText = "<b>" + this._cell._level + "</b>";
            } else {
                this.mcLevel.visible = false;
            }
            if (this._cell._alliance) {
                this.AlliancePic(AllyInfo._picURLs.sizeM, this.mcAlliancePic.mcImage, this.mcAlliancePic.mcBG, true);
            } else {
                this.mcAlliancePic.visible = false;
                this.mcRelations.visible = false;
            }
        } else if (this._cell._base === 1) {
            this.bSendMessage.Enabled = false;
            this.bTruce.Enabled = false;
            this.bAlliance.Enabled = false;
            this.bAlliance.visible = false;
            if (!this._cell._destroyed) {
                this.tName.htmlText = "<b>" + KEYS.Get("ai_tribe", { "v1": this._cell._name }) + "</b>";
            } else {
                this.tName.htmlText = "<b>" + KEYS.Get("ai_tribe", { "v1": this._cell._name }) + " (" + KEYS.Get("newmap_inf_destroyed") + ")</b>";
            }
            this.ProfilePic();
            if (this._cell._level) {
                this.mcLevel.visible = true;
                this.mcLevel.lv_txt.htmlText = "<b>" + this._cell._level + "</b>";
            } else {
                this.mcLevel.visible = false;
            }
            if (this._cell._alliance) {
                this.AlliancePic(AllyInfo._picURLs.sizeM, this.mcAlliancePic.mcImage, this.mcAlliancePic.mcBG, false);
            } else {
                this.mcAlliancePic.visible = false;
                this.mcRelations.visible = false;
            }
        }
        this.tLocation.htmlText = this._cell.X + "x" + this._cell.Y;
        this.tHeight.htmlText = this._cell._height - 100 + "m";
        let heightBonus = 0;
        if (this._cell._base === 2) {
            heightBonus = 0;
        } else {
            heightBonus = this._cell._height * 100 / GLOBAL._averageAltitude.Get() - 100;
        }
        let defenseBonus = 0;
        if (this._cell._base === 2) {
            defenseBonus = 0;
        } else {
            defenseBonus = 100 * GLOBAL._averageAltitude.Get() / this._cell._height - 100;
        }
        let heightBonusText: string;
        if (heightBonus >= 0) {
            heightBonusText = "<font color=\"#003300\">+" + KEYS.Get("newmap_h1", { "v1": heightBonus }) + "</font>";
        } else {
            heightBonusText = "<font color=\"#330000\">- " + KEYS.Get("newmap_h1", { "v1": Math.abs(heightBonus) }) + "</font>";
        }
        let defenseBonusText: string;
        if (defenseBonus >= 0) {
            defenseBonusText = "<font color=\"#003300\">+" + KEYS.Get("newmap_h2", { "v1": defenseBonus }) + "</font>";
        } else {
            defenseBonusText = "<font color=\"#330000\">- " + KEYS.Get("newmap_h2", { "v1": Math.abs(defenseBonus) }) + "</font>";
        }
        this.tBonus.htmlText = heightBonusText + "<br>" + defenseBonusText;
        if (this._cell._friend) {
            this.bView.SetupKey("btn_help");
        } else {
            this.bView.SetupKey("map_view_btn");
        }
        PopupInfoEnemy._bookmarked = false;
        this.bBookmark.Enabled = true;
        if (MapRoom._bookmarks) {
            for (let i = 0; i < MapRoom._bookmarks.length; i++) {
                if (MapRoom._bookmarks[i].location.x === this._cell.X && MapRoom._bookmarks[i].location.y === this._cell.Y) {
                    PopupInfoEnemy._bookmarked = true;
                    break;
                }
            }
            if (PopupInfoEnemy._bookmarked) {
                this.bBookmark.Enabled = false;
            } else {
                this.bBookmark.Enabled = true;
            }
        }
        this.Update();
    }

    public Cleanup(): void {
        this.bAttack.removeEventListener(MouseEvent.CLICK, this.Attack.bind(this));
        PopupInfoEnemy._minTakeoverCost = null;
        PopupInfoEnemy._takeoverCoeff1 = null;
        PopupInfoEnemy._takeoverCoeff2 = null;
        if (this.mcFrame) {
            (this.mcFrame as any).Clear();
            this.mcFrame = null;
        }
    }

    private ProfilePic(): void {
        const onImageLoad = (event: Event): void => {
            if (this._profilePic) {
                this._profilePic.width = this._profilePic.height = 50;
            }
        };
        const imageComplete = (name: string, bmd: BitmapData): void => {
            this._profileBmp = new Bitmap(bmd);
            this.mcProfilePic.mcBG.addChild(this._profileBmp);
        };
        const LoadImageError = (event: IOErrorEvent): void => {
        };
        if (!this._cell!._facebookID && this._cell!._base !== 1 && !this._cell!._pic_square) {
            return;
        }
        if (this._cell!._base > 1) {
            this._profilePic = new Loader();
            if (!GLOBAL._flags.viximo) {
                this._profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
                this._profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
                if (this._cell!._pic_square) {
                    this._profilePic.load(new URLRequest(this._cell!._pic_square));
                }
            } else {
                this._profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
                this._profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
                this._profilePic.load(new URLRequest("http://graph.facebook.com/" + this._cell!._facebookID + "/picture"));
            }
            this.mcProfilePic.mcBG.addChild(this._profilePic);
        } else {
            switch (this._cell!._name) {
                case "Dreadnought":
                case "Dreadnaut":
                    ImageCache.GetImageWithCallBack("monsters/tribe_dreadnaut_50.v2.jpg", imageComplete);
                    break;
                case "Kozu":
                    ImageCache.GetImageWithCallBack("monsters/tribe_kozu_50.v2.jpg", imageComplete);
                    break;
                case "Legionnaire":
                    ImageCache.GetImageWithCallBack("monsters/tribe_legionnaire_50.v2.jpg", imageComplete);
                    break;
                case "Abunakki":
                    ImageCache.GetImageWithCallBack("monsters/tribe_abunakki_50.v2.jpg", imageComplete);
            }
        }
    }

    private AlliancePic(size: string, container: MovieClip, containerBG: MovieClip | null = null, showRel: boolean = false): void {
        if (!this._cell!._facebookID || this._cell!._base <= 1) {
            this.mcAlliancePic.visible = false;
            this.mcRelations.visible = false;
            return;
        }
        if (this._cell!._base > 1 && Boolean(this._cell!._alliance)) {
            let k = this.mcAlliancePic.mcImage.numChildren;
            while (k--) {
                this.mcAlliancePic.mcImage.removeChildAt(k);
            }
            k = this.mcRelations.numChildren;
            while (k--) {
                this.mcRelations.removeChildAt(k);
            }
            this.mcAlliancePic.visible = true;
            const allyinfo = this._cell!._alliance;
            allyinfo.AlliancePic(size, container, containerBG, true);
        } else {
            this.mcAlliancePic.visible = false;
        }
    }

    private doesHaveMaxOutposts(): boolean {
        return Boolean(GLOBAL._mapOutpost) && GLOBAL._mapOutpost.length >= GLOBAL.k_MAX_NUMBER_OF_OUTPOSTS;
    }

    public Attack(event: MouseEvent): void {
        if (GLOBAL._flags.attacking === 0) {
            GLOBAL.Message(KEYS.Get("map_msg_attackingdisabled"));
            return;
        }
        if (this._cell!._base !== 2 && this._cell!._destroyed && !this._cell!._protected && (this._cell!._locked === 0 || this._cell!._locked === LOGIN._playerID) && MapRoom._flingerInRange) {
            let cost = PopupInfoEnemy._minTakeoverCost!.Get();
            if (GLOBAL._mapOutpost) {
                const outpostCount = GLOBAL._mapOutpost.length;
                if (this.doesHaveMaxOutposts()) {
                    GLOBAL.Message(KEYS.Get("mr2_opcap"));
                    return;
                }
                if (outpostCount > 0 && outpostCount <= 4) {
                    cost = PopupInfoEnemy._takeoverCoeff1!.Get() * outpostCount;
                } else if (outpostCount > 4) {
                    cost = PopupInfoEnemy._takeoverCoeff2!.Get() + PopupInfoEnemy._minTakeoverCost!.Get() * (outpostCount - 4);
                }
            }
            PopupInfoEnemy._takeoverCost = new SecNum(cost);
            PopupInfoEnemy._shinyCost = new SecNum(Math.ceil(Math.pow(Math.sqrt(PopupInfoEnemy._takeoverCost.Get() * 2), 0.75)));
            if (PopupInfoEnemy._takeoverCost.Get() === 0) {
                this.TakeOverConfirm();
            } else {
                GLOBAL.BlockerAdd(GLOBAL._layerTop);
                const popup = new PopupTakeover(this._cell!);
                GLOBAL._layerTop.addChild(popup);
            }
        } else if (this._cell!._locked !== 0 && this._cell!._locked !== LOGIN._playerID) {
            if (this._cell!._base === 1) {
                GLOBAL.Message(KEYS.Get("newmap_take2"));
            } else {
                GLOBAL.Message(KEYS.Get("newmap_take3"));
            }
        } else if (this._cell!._protected) {
            GLOBAL.Message(KEYS.Get("newmap_dp"));
        } else if (Boolean(this._cell!._truce) && this._cell!._truce > GLOBAL.Timestamp()) {
            GLOBAL.Message(KEYS.Get("newmap_truce"));
        } else if (Boolean(this._cell!._alliance) && this._cell!._allianceID === ALLIANCES._allianceID) {
            GLOBAL.Message(KEYS.Get("map_attack_ally", { "v1": this._cell!._name }), KEYS.Get("map_attack_btn"), this.DoAttack.bind(this));
        } else if (Boolean(this._cell!._alliance) && this._cell!._alliance.relationship > 0) {
            GLOBAL.Message(KEYS.Get("map_attack_allyfriend", { "v1": this._cell!._name }), KEYS.Get("map_attack_btn"), this.DoAttack.bind(this));
        } else if (this._cell!._friend) {
            GLOBAL.Message(KEYS.Get("map_msg_attackfriend", { "v1": this._cell!._name }), KEYS.Get("map_attack_btn"), this.DoAttack.bind(this));
        } else {
            MapRoom._mc.ShowAttack(this._cell);
        }
    }

    public DoAttack(): void {
        MapRoom._mc.ShowAttack(this._cell);
    }

    private TakeOverConfirm(): void {
        const takeoverSuccessful = (serverData: any): void => {
            PLEASEWAIT.Hide();
            if (serverData.error === 0) {
                BASE._takeoverFirstOpen = this._cell!._base === 1 ? 1 : 2;
                BASE._takeoverPreviousOwnersName = this._cell!._name;
                MapRoom.GetCell(this._cell!.X, this._cell!.Y, true);
                GLOBAL._mapOutpost.push(new Point(this._cell!.X, this._cell!.Y));
                GLOBAL._resources.r1max += GLOBAL._outpostCapacity.Get();
                GLOBAL._resources.r2max += GLOBAL._outpostCapacity.Get();
                GLOBAL._resources.r3max += GLOBAL._outpostCapacity.Get();
                GLOBAL._resources.r4max += GLOBAL._outpostCapacity.Get();
                MapRoom.ClearCells();
                MapRoomManager.instance.Hide();
                GLOBAL._attackerCellsInRange = [];
                GLOBAL._currentCell = this._cell;
                (GLOBAL._currentCell as MapRoomCell).baseType = 3;
                BASE.yardType = EnumYardType.OUTPOST;
                GLOBAL.BlockerRemove();
                BASE.LoadBase(null, 0, this._cell!._baseID, GLOBAL.e_BASE_MODE.BUILD, false, EnumYardType.OUTPOST);
                LOGGER.Stat([37, BASE._takeoverFirstOpen]);
            } else {
                GLOBAL.Message(KEYS.Get("err_takeoverproblem") + serverData.error);
            }
        };
        const takeoverError = (event: IOErrorEvent): void => {
            GLOBAL.Message(KEYS.Get("err_takeoverproblem") + event.text);
        };
        const takeoverVars: Array<any> = [["baseid", this._cell!._baseID], ["resources", JSON.encode({
            "r1": PopupInfoEnemy._takeoverCost!.Get(),
            "r2": PopupInfoEnemy._takeoverCost!.Get(),
            "r3": PopupInfoEnemy._takeoverCost!.Get(),
            "r4": PopupInfoEnemy._takeoverCost!.Get()
        })]];
        let possible = false;
        const r1 = PopupInfoEnemy._takeoverCost!.Get();
        const r2 = PopupInfoEnemy._takeoverCost!.Get();
        const r3 = PopupInfoEnemy._takeoverCost!.Get();
        const r4 = PopupInfoEnemy._takeoverCost!.Get();
        if (GLOBAL._resources) {
            if (-r1 <= GLOBAL._resources.r1.Get() && -r2 <= GLOBAL._resources.r2.Get() && -r3 <= GLOBAL._resources.r3.Get() && -r4 <= GLOBAL._resources.r4.Get()) {
                possible = true;
            }
        }
        if (possible) {
            PLEASEWAIT.Show(KEYS.Get("plsw_taking"));
            new URLLoaderApi().load(GLOBAL._mapURL + "takeovercell", takeoverVars, takeoverSuccessful, takeoverError);
        } else {
            GLOBAL.Message(KEYS.Get("newmap_take4"));
        }
    }

    public View(): void {
        MapRoom._mc.HideInfoEnemy();
        MapRoomManager.instance.Hide();
        if (MapRoom._mc) {
            GLOBAL._attackerCellsInRange = MapRoom._mc.GetCellsInRange(this._cell!.X, this._cell!.Y, 10);
        }
        GLOBAL._currentCell = this._cell;
        if (this._cell!._base === 1) {
            BASE.LoadBase(null, 0, this._cell!._baseID, GLOBAL.e_BASE_MODE.WMVIEW, false, EnumYardType.MAIN_YARD);
        } else {
            const yardType = this._cell!._base === 3 ? EnumYardType.OUTPOST : EnumYardType.MAIN_YARD;
            if (this._cell!._friend) {
                BASE.LoadBase(null, 0, this._cell!._baseID, GLOBAL.e_BASE_MODE.HELP, false, yardType);
            } else {
                BASE.LoadBase(null, 0, this._cell!._baseID, GLOBAL.e_BASE_MODE.VIEW, false, yardType);
            }
        }
    }

    public ShowMessage(): void {
        if (this._cell!._base < 2) {
            GLOBAL.Message(KEYS.Get("newmap_wmmsg"));
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
        this._message = new Message();
        this._message.picker.preloadSelection(contact);
        this._message.requestType = "message";
        this._message.body_txt.htmlText = "";
        this._message.x = 0;
        this._message.y = -450;
        GLOBAL.BlockerAdd(this.parent as MovieClip);
        (this.parent as MovieClip).addChild(this._message);
    }

    public ShowTruce(): void {
        if (this._cell!._base < 2) {
            GLOBAL.Message(KEYS.Get("newmap_wmtruce", { "v1": this._cell!._name }));
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
        this._message = new Message();
        this._message.picker.preloadSelection(contact);
        this._message.requestType = "trucerequest";
        this._message.subject_txt.htmlText = KEYS.Get("map_trucerequest") + " " + this._cell!._name;
        this._message.body_txt.htmlText = KEYS.Get("map_trucemessage");
        this._message.x = 0;
        this._message.y = -450;
        GLOBAL.BlockerAdd(this.parent as MovieClip);
        (this.parent as MovieClip).addChild(this._message);
    }

    public ShowAllianceInvite(): void {
        if (this._cell!._base < 2) {
            GLOBAL.Message(KEYS.Get("newmap_wmtruce", { "v1": this._cell!._name }));
            return;
        }
        ALLIANCES.AllianceInvite(this._cell!._userID);
    }

    public ButtonInfo(event: MouseEvent): void {
        let text = "";
        let posX = 0;
        let posY = 0;
        if ((event.currentTarget as any).name === "bAttack") {
            if (this._cell!._destroyed) {
                text = KEYS.Get("newmap_take5");
            } else {
                text = KEYS.Get("newmap_att4");
            }
            posX = this.bAttack.x - 5;
            posY = this.bAttack.y + this.bAttack.height / 2 - 0;
        } else if ((event.currentTarget as any).name === "bView") {
            text = KEYS.Get("newmap_view", { "v1": this._cell!._name });
            posX = this.bView.x - 5;
            posY = this.bView.y + this.bAttack.height / 2 - 0;
        } else if ((event.currentTarget as any).name === "bSendMessage") {
            text = KEYS.Get("newmap_msg");
            posX = this.bSendMessage.x - 5;
            posY = this.bSendMessage.y + this.bAttack.height / 2 - 0;
        } else if ((event.currentTarget as any).name === "bTruce") {
            text = KEYS.Get("newmap_reqtruce");
            posX = this.bTruce.x - 5;
            posY = this.bTruce.y + this.bAttack.height / 2 - 0;
        } else if ((event.currentTarget as any).name === "bBookmark") {
            text = KEYS.Get("newmap_bookmark");
            posX = this.bBookmark.x - 5;
            posY = this.bBookmark.y + this.bAttack.height / 2 - 0;
        } else if ((event.currentTarget as any).name === "bAlliance") {
            text = KEYS.Get("btn_invitetoalliance");
            posX = this.bAlliance.x - 5;
            posY = this.bAlliance.y + this.bAttack.height / 2 - 0;
        }
        posX += this.x;
        posY += this.y;
        this.PopupShowInternal(posX, posY, text);
    }

    private PopupShowInternal(x: number, y: number, text: string): void {
        this.PopupHide();
        PopupInfoEnemy._popupmc = new bubblepopupRight();
        PopupInfoEnemy._popupmc.Setup(x, y, text, 150);
        PopupInfoEnemy._popupmc.Nudge("left");
        if (PopupInfoEnemy._popupmc.mcArrow.x < PopupInfoEnemy._popupmc.mcBG.x + PopupInfoEnemy._popupmc.mcBG.width - 5) {
            PopupInfoEnemy._popupmc.mcArrow.x = PopupInfoEnemy._popupmc.mcBG.x + PopupInfoEnemy._popupmc.mcBG.width - 5;
        }
        PopupInfoEnemy._popupdo = this.parent.addChild(PopupInfoEnemy._popupmc);
    }

    public PopupHide(): void {
        if (PopupInfoEnemy._popupdo) {
            if (this.parent) {
                this.parent.removeChild(PopupInfoEnemy._popupdo);
            }
            PopupInfoEnemy._popupdo = null;
        }
    }

    private Update(): void {
        // Debug string building - kept for debugging purposes
    }

    private Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }
}
