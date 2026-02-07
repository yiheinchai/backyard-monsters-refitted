import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Loader from "openfl/display/Loader";
import Sprite from "openfl/display/Sprite";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import DropShadowFilter from "openfl/filters/DropShadowFilter";
import URLRequest from "openfl/net/URLRequest";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";

import { ALLIANCES } from "../alliances/ALLIANCES";
import { ImageCache } from "../display/ImageCache";
import { Message } from "../mailbox/Message";
import { Contact } from "../mailbox/model/Contact";
import { BookmarksManager } from "./bookmarks/BookmarksManager";
import { MapRoom3AllianceData } from "./data/MapRoom3AllianceData";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3AssetCache } from "./MapRoom3AssetCache";
import { MapRoom3Cell } from "./MapRoom3Cell";
import { MapRoom3CellGraphic } from "./MapRoom3CellGraphic";
import { MapRoom3CellMouseoverButton } from "./MapRoom3CellMouseoverButton";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }



/**
 * MapRoom3CellMouseover - Mouseover tooltip for Map Room 3 cells.
 */
export class MapRoom3CellMouseover extends Sprite {
    private static readonly PORTRAIT_WIDTH: number = 50;
    private static readonly PORTRAIT_HEIGHT: number = 50;
    private static readonly PORTRAIT_OFFSET_X: number = 2;
    private static readonly PORTRAIT_OFFSET_Y: number = 2;
    private static readonly ALLIANCE_ICON_OFFSET_X: number = 5;
    private static readonly ALLIANCE_ICON_OFFSET_Y: number = 2;
    private static readonly TRUCE_ICON_OFFSET_X: number = -10;
    private static readonly TRUCE_ICON_OFFSET_Y: number = -10;
    private static readonly INFO_DISPLAY_OFFSET_Y: number = 8;
    private static readonly INFO_TEXT_COLOR_DEFAULT: number = 0xFFFFFF;
    private static readonly INFO_TEXT_COLOR_BUFF_BLUE: number = 0x00A5FF;
    private static readonly INFO_TEXT_COLOR_BUFF_RED: number = 0xFF0000;

    private m_InfoDisplay: Sprite | null = null;
    private m_ButtonDisplay: Sprite | null = null;
    private m_TextDisplay: Sprite | null = null;
    private m_ScoutAttackButton: MapRoom3CellMouseoverButton | null = null;
    private m_EnterOwnedCellButton: MapRoom3CellMouseoverButton | null = null;
    private m_AddBookmarkButton: MapRoom3CellMouseoverButton | null = null;
    private m_RemoveBookmarkButton: MapRoom3CellMouseoverButton | null = null;
    private m_SendMessageButton: MapRoom3CellMouseoverButton | null = null;
    private m_InviteToAllianceButton: MapRoom3CellMouseoverButton | null = null;
    private m_RequestTruceButton: MapRoom3CellMouseoverButton | null = null;
    private m_Portrait: Sprite | null = null;
    private m_ProfilePicture: Loader | null = null;
    private m_WildMonsterPortrait: Bitmap | null = null;
    private m_DamageBarIcon: Bitmap | null = null;
    private m_AllianceIcon: Bitmap | null = null;
    private m_TruceIcon: Bitmap | null = null;
    private m_InfoTextCellName: TextField | null = null;
    private m_InfoTextAlliance: TextField | null = null;
    private m_InfoTextCellType: TextField | null = null;
    private m_InfoTextBuff1: TextField | null = null;
    private m_InfoTextBuff2: TextField | null = null;
    private m_SelectedCell: MapRoom3Cell | null = null;
    private m_MailboxMessage: Message | null = null;

    constructor() {
        super();
        this.mouseEnabled = false;
        this.mouseChildren = false;
        this.m_InfoDisplay = new Sprite();
        this.m_InfoDisplay.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BACKGROUND)));
        this.m_InfoDisplay.x = -(this.m_InfoDisplay.width * 0.5);
        this.m_InfoDisplay.y = MapRoom3CellMouseover.INFO_DISPLAY_OFFSET_Y - this.m_InfoDisplay.height;
        this.m_InfoDisplay.mouseEnabled = false;
        this.m_InfoDisplay.mouseChildren = false;
        this.addChild(this.m_InfoDisplay);
        this.m_ButtonDisplay = new Sprite();
        this.m_ButtonDisplay.mouseEnabled = false;
        this.addChild(this.m_ButtonDisplay);
        this.m_ScoutAttackButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_SCOUT_ATTACK), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_SCOUT_ATTACK_ROLLOVER), "mr3_scout_attack_tool_tip");
        this.m_ScoutAttackButton.addEventListener(MouseEvent.CLICK, this.OnScoutAttackClicked.bind(this));
        this.m_EnterOwnedCellButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_ENTER), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_ENTER_ROLLOVER), "mr3_enter_owned_base_tool_tip");
        this.m_EnterOwnedCellButton.addEventListener(MouseEvent.CLICK, this.OnEnterOwnedCellClicked.bind(this));
        this.m_AddBookmarkButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_ADD), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_ADD_ROLLOVER), "mr3_add_bookmark_tool_tip");
        this.m_AddBookmarkButton.addEventListener(MouseEvent.CLICK, this.OnAddBookmarkClicked.bind(this));
        this.m_RemoveBookmarkButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_REMOVE), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_REMOVE_ROLLOVER), "mr3_remove_bookmark_tool_tip");
        this.m_RemoveBookmarkButton.addEventListener(MouseEvent.CLICK, this.OnRemoveBookmarkClicked.bind(this));
        this.m_SendMessageButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_SEND_MESSAGE), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_SEND_MESSAGE_ROLLOVER), "mr3_send_message_tool_tip");
        this.m_SendMessageButton.addEventListener(MouseEvent.CLICK, this.OnSendMessageClicked.bind(this));
        this.m_InviteToAllianceButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_INVITE_TO_ALLIANCE), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_INVITE_TO_ALLIANCE_ROLLOVER), "mr3_invite_to_alliance_tool_tip");
        this.m_InviteToAllianceButton.addEventListener(MouseEvent.CLICK, this.OnInviteToAllianceClicked.bind(this));
        this.m_RequestTruceButton = new MapRoom3CellMouseoverButton(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_REQUEST_TRUCE), MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_REQUEST_TRUCE_ROLLOVER), "mr3_request_truce_tool_tip");
        this.m_RequestTruceButton.addEventListener(MouseEvent.CLICK, this.OnRequestTruceClicked.bind(this));
        this.m_Portrait = new Sprite();
        this.m_Portrait.x = MapRoom3CellMouseover.PORTRAIT_OFFSET_X;
        this.m_Portrait.y = MapRoom3CellMouseover.PORTRAIT_OFFSET_Y;
        this.m_InfoDisplay.addChild(this.m_Portrait);
        this.m_ProfilePicture = new Loader();
        this.m_ProfilePicture.visible = false;
        this.m_ProfilePicture.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.OnProfilePictureIOErrorEvent.bind(this), false, 0, true);
        this.m_Portrait.addChild(this.m_ProfilePicture);
        this.m_WildMonsterPortrait = new Bitmap();
        this.m_WildMonsterPortrait.visible = false;
        this.m_Portrait.addChild(this.m_WildMonsterPortrait);
        this.m_DamageBarIcon = new Bitmap(MapRoom3AssetCache.instance.GetDamageBarSegmentAsset(0));
        this.m_DamageBarIcon.visible = false;
        this.m_DamageBarIcon.x = (MapRoom3CellMouseover.PORTRAIT_WIDTH - this.m_DamageBarIcon.width) * 0.5;
        this.m_DamageBarIcon.y = this.m_InfoDisplay.height - MapRoom3CellMouseover.PORTRAIT_OFFSET_Y - this.m_DamageBarIcon.height;
        this.m_Portrait.addChild(this.m_DamageBarIcon);
        this.m_AllianceIcon = new Bitmap();
        this.m_AllianceIcon.visible = false;
        this.m_Portrait.addChild(this.m_AllianceIcon);
        this.m_TruceIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_ICON_TRUCE));
        this.m_TruceIcon.visible = false;
        this.m_TruceIcon.x = MapRoom3CellMouseover.TRUCE_ICON_OFFSET_X;
        this.m_TruceIcon.y = MapRoom3CellMouseover.TRUCE_ICON_OFFSET_Y;
        this.m_Portrait.addChild(this.m_TruceIcon);
        this.m_TextDisplay = new Sprite();
        this.m_TextDisplay.mouseEnabled = false;
        this.m_InfoDisplay.addChild(this.m_TextDisplay);
        const dropShadow = new DropShadowFilter();
        const textFormat = new TextFormat();
        textFormat.color = MapRoom3CellMouseover.INFO_TEXT_COLOR_DEFAULT;
        textFormat.font = "Verdana";
        textFormat.size = 11;
        this.m_InfoTextCellName = new TextField();
        this.m_InfoTextCellName.defaultTextFormat = textFormat;
        this.m_InfoTextCellName.x = 56;
        this.m_InfoTextCellName.width = 145;
        this.m_InfoTextCellName.height = 20;
        this.m_InfoTextCellName.filters = [dropShadow];
        this.m_InfoTextCellName.selectable = false;
        const textFormatSmall = new TextFormat();
        textFormatSmall.color = MapRoom3CellMouseover.INFO_TEXT_COLOR_DEFAULT;
        textFormatSmall.font = "Verdana";
        textFormatSmall.size = 10;
        this.m_InfoTextAlliance = new TextField();
        this.m_InfoTextAlliance.defaultTextFormat = textFormatSmall;
        this.m_InfoTextAlliance.x = 56;
        this.m_InfoTextAlliance.width = 145;
        this.m_InfoTextAlliance.height = 20;
        this.m_InfoTextAlliance.filters = [dropShadow];
        this.m_InfoTextAlliance.selectable = false;
        this.m_InfoTextCellType = new TextField();
        this.m_InfoTextCellType.defaultTextFormat = textFormat;
        this.m_InfoTextCellType.x = 56;
        this.m_InfoTextCellType.width = 145;
        this.m_InfoTextCellType.height = 20;
        this.m_InfoTextCellType.filters = [dropShadow];
        this.m_InfoTextCellType.selectable = false;
        const buffFormat = new TextFormat();
        buffFormat.font = "Verdana";
        buffFormat.size = 10;
        this.m_InfoTextBuff1 = new TextField();
        this.m_InfoTextBuff1.defaultTextFormat = buffFormat;
        this.m_InfoTextBuff1.x = 56;
        this.m_InfoTextBuff1.width = 145;
        this.m_InfoTextBuff1.height = 20;
        this.m_InfoTextBuff1.filters = [dropShadow];
        this.m_InfoTextBuff1.selectable = false;
        this.m_InfoTextBuff1.textColor = MapRoom3CellMouseover.INFO_TEXT_COLOR_BUFF_BLUE;
        this.m_InfoTextBuff2 = new TextField();
        this.m_InfoTextBuff2.defaultTextFormat = buffFormat;
        this.m_InfoTextBuff2.x = 56;
        this.m_InfoTextBuff2.width = 145;
        this.m_InfoTextBuff2.height = 20;
        this.m_InfoTextBuff2.filters = [dropShadow];
        this.m_InfoTextBuff2.selectable = false;
        this.m_InfoTextBuff2.textColor = MapRoom3CellMouseover.INFO_TEXT_COLOR_BUFF_RED;
    }

    private static MakeFacebookProfilePictureURL(facebookId: string): string {
        return "http://graph.facebook.com/" + facebookId + "/picture";
    }

    public get selectedCell(): MapRoom3Cell | null {
        return this.m_SelectedCell;
    }

    public get scoutAttackButton(): MapRoom3CellMouseoverButton | null {
        return this.m_ScoutAttackButton;
    }

    public Clear(): void {
        this.Hide();
        this.m_InfoTextCellName = null;
        this.m_InfoTextAlliance = null;
        this.m_InfoTextCellType = null;
        this.m_InfoTextBuff1 = null;
        this.m_InfoTextBuff2 = null;
        this.m_Portrait!.removeChild(this.m_TruceIcon!);
        this.m_TruceIcon = null;
        this.m_Portrait!.removeChild(this.m_AllianceIcon!);
        this.m_AllianceIcon = null;
        this.m_Portrait!.removeChild(this.m_DamageBarIcon!);
        this.m_DamageBarIcon = null;
        this.m_Portrait!.removeChild(this.m_WildMonsterPortrait!);
        this.m_WildMonsterPortrait = null;
        this.m_ProfilePicture!.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, this.OnProfilePictureIOErrorEvent.bind(this));
        this.m_Portrait!.removeChild(this.m_ProfilePicture!);
        this.m_ProfilePicture = null;
        this.m_InfoDisplay!.removeChild(this.m_Portrait!);
        this.m_Portrait = null;
        this.m_InfoDisplay!.removeChild(this.m_TextDisplay!);
        this.m_TextDisplay = null;
        this.m_ScoutAttackButton = null;
        this.m_EnterOwnedCellButton = null;
        this.m_AddBookmarkButton = null;
        this.m_RemoveBookmarkButton = null;
        this.m_SendMessageButton = null;
        this.m_InviteToAllianceButton = null;
        this.m_RequestTruceButton = null;
        this.removeChild(this.m_ButtonDisplay!);
        this.m_ButtonDisplay = null;
        while (this.m_InfoDisplay!.numChildren > 0) {
            const child = this.m_InfoDisplay!.removeChildAt(0) as Bitmap;
            if (child !== null) {
                child.bitmapData = null!;
            }
        }
        this.removeChild(this.m_InfoDisplay!);
    }

    public Show(cell: MapRoom3Cell, xPos: number, yPos: number, showButtons: boolean): void {
        this.SetInfo(cell);
        this.SetPosition(xPos, yPos);
        this.visible = true;
        this.ShowButtons(showButtons);
    }

    public Hide(): void {
        this.ClearInfo();
        this.visible = false;
    }

    private ShowButtons(show: boolean): void {
        if (show) {
            this.m_InfoDisplay!.y = MapRoom3CellMouseover.INFO_DISPLAY_OFFSET_Y - (this.m_InfoDisplay!.height + this.m_ButtonDisplay!.height);
            this.m_ButtonDisplay!.visible = true;
            this.mouseEnabled = true;
            this.mouseChildren = true;
            this.m_ButtonDisplay!.mouseEnabled = true;
        } else {
            this.m_InfoDisplay!.y = MapRoom3CellMouseover.INFO_DISPLAY_OFFSET_Y - this.m_InfoDisplay!.height;
            this.m_ButtonDisplay!.visible = false;
            this.mouseEnabled = false;
            this.mouseChildren = false;
            this.m_ButtonDisplay!.mouseEnabled = false;
        }
    }

    private SetPosition(xPos: number, yPos: number): void {
        const stageX = getGLOBAL().StageX;
        const stageRight = getGLOBAL().StageX + getGLOBAL().StageWidth;
        const stageTop = getGLOBAL().StageY + 80;
        const halfWidth = this.m_InfoDisplay!.width * 0.5;
        if (xPos - halfWidth < stageX) {
            xPos = stageX + halfWidth;
        } else if (xPos + halfWidth > stageRight) {
            xPos = stageRight - halfWidth;
        }
        this.x = xPos;
        if (yPos - this.m_InfoDisplay!.height < stageTop) {
            this.y = yPos + MapRoom3CellGraphic.HEX_EDGE_LENGTH * MapRoom3.mapRoom3Window.scrollingCanvas.scaleY * 0.5 + this.m_InfoDisplay!.height;
        } else {
            this.y = yPos - MapRoom3CellGraphic.HEX_EDGE_LENGTH * MapRoom3.mapRoom3Window.scrollingCanvas.scaleY * 0.5;
        }
    }

    private SetInfo(cell: MapRoom3Cell): void {
        this.ClearInfo();
        this.m_SelectedCell = cell;
        if (this.m_SelectedCell === null) {
            return;
        }
        if (cell.isOwnedByWildMonster) {
            ImageCache.GetImageWithCallBack("worldmap/rollover/tribe_" + cell.name.toLowerCase() + ".png", this.OnWildMonsterPortraitLoaded.bind(this), true, 1);
            this.m_WildMonsterPortrait!.visible = true;
        } else {
            this.m_ProfilePicture!.load(new URLRequest(MapRoom3CellMouseover.MakeFacebookProfilePictureURL(cell.facebookID)));
            this.m_ProfilePicture!.visible = true;
        }
        this.m_DamageBarIcon!.bitmapData = MapRoom3AssetCache.instance.GetDamageBarSegmentAsset(cell.damagePercentage);
        this.m_DamageBarIcon!.visible = true;
        const baseLevel = cell.baseLevel;
        const playerLevel = cell.playerLevel ? cell.playerLevel : baseLevel;
        this.m_InfoTextCellName!.htmlText = "<b>" + cell.name + " (" + playerLevel.toString() + ")</b>";
        this.m_TextDisplay!.addChild(this.m_InfoTextCellName!);
        const allianceData = cell.GetAllianceData();
        if (allianceData !== undefined) {
            this.m_InfoTextAlliance!.htmlText = allianceData.name;
            this.m_TextDisplay!.addChild(this.m_InfoTextAlliance!);
            const allianceIconPath = "alliances/" + allianceData.imageId + "_small.png";
            ImageCache.GetImageWithCallBack(allianceIconPath, this.OnAllianceIconLoaded.bind(this), true, 1);
            this.m_AllianceIcon!.visible = true;
        }
        this.m_InfoTextCellType!.htmlText = cell.GetLocalisedCellTypeName() + " (" + baseLevel.toString() + ")";
        this.m_TextDisplay!.addChild(this.m_InfoTextCellType!);
        if (cell.isInRangeOfStronghold) {
            let playerMonsterBuff = 0;
            let playerTowerBuff = 0;
            let enemyTowerBuff = 0;
            const strongholds = cell.inRangeOfStrongholds;
            if (strongholds) {
                const count = strongholds.length;
                for (let i = 0; i < count; i++) {
                    const stronghold = strongholds[i];
                    const buffPercent = this.GetPercentageBuffFromStrongholdLevel(stronghold.baseLevel);
                    if (stronghold.isOwnedByPlayer) {
                        playerMonsterBuff += buffPercent;
                        if (cell.isOwnedByPlayer) {
                            playerTowerBuff += buffPercent;
                        }
                    } else if (stronghold.userID === cell.userID && stronghold.wildMonsterTribeId === cell.wildMonsterTribeId) {
                        enemyTowerBuff += buffPercent;
                    }
                }
            }
            if (playerMonsterBuff > 0 && playerTowerBuff > 0 && playerMonsterBuff === playerTowerBuff) {
                this.m_InfoTextBuff1!.htmlText = getKEYS().Get("mr3_shbuff_towermonster", { "v1": playerMonsterBuff });
                this.m_TextDisplay!.addChild(this.m_InfoTextBuff1!);
            } else if (playerMonsterBuff > 0) {
                this.m_InfoTextBuff1!.htmlText = getKEYS().Get("mr3_shbuff_monster", { "v1": playerMonsterBuff });
                this.m_TextDisplay!.addChild(this.m_InfoTextBuff1!);
            } else if (playerTowerBuff > 0) {
                this.m_InfoTextBuff1!.htmlText = getKEYS().Get("mr3_shbuff_tower", { "v1": playerTowerBuff });
                this.m_TextDisplay!.addChild(this.m_InfoTextBuff1!);
            }
            if (enemyTowerBuff > 0) {
                this.m_InfoTextBuff2!.htmlText = getKEYS().Get("mr3_shbuff_tower", { "v1": enemyTowerBuff });
                this.m_TextDisplay!.addChild(this.m_InfoTextBuff2!);
            }
        }
        if (cell.isOwnedByPlayer) {
            this.m_ButtonDisplay!.addChild(this.m_EnterOwnedCellButton!);
        } else {
            this.m_ButtonDisplay!.addChild(this.m_ScoutAttackButton!);
            if (cell.isOwnedByWildMonster === false) {
                this.m_ButtonDisplay!.addChild(this.m_SendMessageButton!);
                if (ALLIANCES._myAlliance !== null && cell.allianceID !== ALLIANCES._allianceID) {
                    this.m_ButtonDisplay!.addChild(this.m_InviteToAllianceButton!);
                }
                if (cell.hasTruce === false) {
                    this.m_ButtonDisplay!.addChild(this.m_RequestTruceButton!);
                }
            }
        }
        if (BookmarksManager.instance.IsBookmarked(this.m_SelectedCell)) {
            this.m_ButtonDisplay!.addChild(this.m_RemoveBookmarkButton!);
        } else {
            this.m_ButtonDisplay!.addChild(this.m_AddBookmarkButton!);
        }
        this.m_TruceIcon!.visible = this.m_SelectedCell.hasTruce;
        let xOffset = 0;
        const buttonCount = this.m_ButtonDisplay!.numChildren;
        for (let i = 0; i < buttonCount; i++) {
            const button = this.m_ButtonDisplay!.getChildAt(i);
            button.x = xOffset;
            xOffset += button.width;
        }
        this.m_ButtonDisplay!.x = -(this.m_ButtonDisplay!.width * 0.5);
        this.m_ButtonDisplay!.y = -this.m_ButtonDisplay!.height;
        const textCount = this.m_TextDisplay!.numChildren;
        let yOffset = textCount <= 3 ? 6 : 0;
        for (let i = 0; i < textCount; i++) {
            const textField = this.m_TextDisplay!.getChildAt(i);
            textField.y = yOffset;
            yOffset += 12;
        }
    }

    private GetPercentageBuffFromStrongholdLevel(level: number): number {
        switch (level) {
            case 30:
                return 10;
            case 40:
                return 20;
            case 50:
                return 30;
            default:
                return 0;
        }
    }

    private OnProfilePictureIOErrorEvent(event: IOErrorEvent): void {
    }

    private ClearInfo(): void {
        this.m_ButtonDisplay!.visible = false;
        while (this.m_ButtonDisplay!.numChildren > 0) {
            this.m_ButtonDisplay!.removeChildAt(0);
        }
        while (this.m_TextDisplay!.numChildren > 0) {
            this.m_TextDisplay!.removeChildAt(0);
        }
        this.m_ProfilePicture!.unload();
        this.m_ProfilePicture!.visible = false;
        this.m_WildMonsterPortrait!.bitmapData = null!;
        this.m_WildMonsterPortrait!.visible = false;
        this.m_DamageBarIcon!.bitmapData = null!;
        this.m_DamageBarIcon!.visible = false;
        this.m_AllianceIcon!.bitmapData = null!;
        this.m_AllianceIcon!.visible = false;
        this.m_TruceIcon!.visible = false;
        this.m_InfoTextCellName!.htmlText = "";
        this.m_InfoTextAlliance!.htmlText = "";
        this.m_InfoTextCellType!.htmlText = "";
        this.m_InfoTextBuff1!.htmlText = "";
        this.m_InfoTextBuff2!.htmlText = "";
        this.m_SelectedCell = null;
    }

    private OnWildMonsterPortraitLoaded(path: string, bitmapData: BitmapData): void {
        this.m_WildMonsterPortrait!.bitmapData = bitmapData;
        this.m_WildMonsterPortrait!.width = MapRoom3CellMouseover.PORTRAIT_WIDTH;
        this.m_WildMonsterPortrait!.height = MapRoom3CellMouseover.PORTRAIT_HEIGHT;
    }

    private OnAllianceIconLoaded(path: string, bitmapData: BitmapData): void {
        this.m_AllianceIcon!.bitmapData = bitmapData;
        this.m_AllianceIcon!.x = MapRoom3CellMouseover.PORTRAIT_WIDTH - this.m_AllianceIcon!.width + MapRoom3CellMouseover.ALLIANCE_ICON_OFFSET_X;
        this.m_AllianceIcon!.y = MapRoom3CellMouseover.PORTRAIT_HEIGHT - this.m_AllianceIcon!.height + MapRoom3CellMouseover.ALLIANCE_ICON_OFFSET_Y;
    }

    private OnScoutAttackClicked(event: MouseEvent): void {
        if (this.m_SelectedCell !== null) {
            this.m_SelectedCell.LoadForAttack();
        }
    }

    private OnEnterOwnedCellClicked(event: MouseEvent): void {
        if (this.m_SelectedCell !== null) {
            this.m_SelectedCell.LoadForBuild();
        }
    }

    private OnAddBookmarkClicked(event: MouseEvent): void {
        if (this.m_SelectedCell === null) {
            return;
        }
        BookmarksManager.instance.AddBookmark(this.m_SelectedCell);
        const index = this.m_ButtonDisplay!.getChildIndex(this.m_AddBookmarkButton!);
        this.m_ButtonDisplay!.addChildAt(this.m_RemoveBookmarkButton!, index);
        this.m_RemoveBookmarkButton!.x = this.m_AddBookmarkButton!.x;
        this.m_RemoveBookmarkButton!.y = this.m_AddBookmarkButton!.y;
        this.m_ButtonDisplay!.removeChild(this.m_AddBookmarkButton!);
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    private OnRemoveBookmarkClicked(event: MouseEvent): void {
        if (this.m_SelectedCell === null) {
            return;
        }
        BookmarksManager.instance.RemoveBookmark(this.m_SelectedCell);
        const index = this.m_ButtonDisplay!.getChildIndex(this.m_RemoveBookmarkButton!);
        this.m_ButtonDisplay!.addChildAt(this.m_AddBookmarkButton!, index);
        this.m_AddBookmarkButton!.x = this.m_RemoveBookmarkButton!.x;
        this.m_AddBookmarkButton!.y = this.m_RemoveBookmarkButton!.y;
        this.m_ButtonDisplay!.removeChild(this.m_RemoveBookmarkButton!);
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    private OnInviteToAllianceClicked(event: MouseEvent): void {
        if (this.m_SelectedCell !== null) {
            ALLIANCES.AllianceInvite(this.m_SelectedCell.userID);
        }
    }

    private OnSendMessageClicked(event: MouseEvent): void {
        if (this.m_SelectedCell !== null) {
            this.ShowMailboxMessage("message");
        }
    }

    private OnRequestTruceClicked(event: MouseEvent): void {
        if (this.m_SelectedCell !== null) {
            const subject = getKEYS().Get("mr3_trucerequest", { "v1": this.m_SelectedCell.name });
            const body = getKEYS().Get("map_trucemessage");
            this.ShowMailboxMessage("trucerequest", subject, body);
        }
    }

    private ShowMailboxMessage(type: string, subject: string = "", body: string = ""): void {
        if (this.m_MailboxMessage !== null) {
            if (this.m_MailboxMessage.parent !== null) {
                this.m_MailboxMessage.parent.removeChild(this.m_MailboxMessage);
            }
            this.m_MailboxMessage = null;
        }
        const contactData = {
            "first_name": this.m_SelectedCell!.name,
            "last_name": "",
            "pic_square": MapRoom3CellMouseover.MakeFacebookProfilePictureURL(this.m_SelectedCell!.facebookID)
        };
        const contact = new Contact(this.m_SelectedCell!.userID.toString(), contactData);
        this.m_MailboxMessage = new Message();
        this.m_MailboxMessage.picker.preloadSelection(contact);
        this.m_MailboxMessage.requestType = type;
        this.m_MailboxMessage.subject_txt.htmlText = subject;
        this.m_MailboxMessage.body_txt.htmlText = body;
        getGLOBAL().BlockerAdd();
        getGLOBAL()._layerWindows.addChild(this.m_MailboxMessage);
    }
}
