import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";

import { MapRoom3AssetCache } from "./MapRoom3AssetCache";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { SOUNDS } from "../../../SOUNDS";
import { bubblepopup5 } from "../../../bubblepopup5";

/**
 * Map room 3 cell mouseover button - interactive button with tooltip.
 */
export class MapRoom3CellMouseoverButton extends Sprite {
    private static s_ButtonToolTip: bubblepopup5 | null = null;

    private m_BackgroundImage: Bitmap;
    private m_ButtonImage: Bitmap;
    private m_ButtonRolloverImage: Bitmap;
    private m_ToolTip: string;

    constructor(buttonBitmap: BitmapData, rolloverBitmap: BitmapData, tooltip: string) {
        super();
        this.m_ToolTip = tooltip;
        this.buttonMode = true;
        this.m_BackgroundImage = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.MOUSEOVER_BUTTON_BACKGROUND));
        this.addChild(this.m_BackgroundImage);
        this.m_ButtonImage = new Bitmap(buttonBitmap);
        this.addChild(this.m_ButtonImage);
        this.m_ButtonRolloverImage = new Bitmap(rolloverBitmap);
        this.m_ButtonRolloverImage.visible = false;
        this.addChild(this.m_ButtonRolloverImage);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.OnMouseOver.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.OnMouseOut.bind(this));
        SOUNDS.Play("ui_over");
        if (MapRoom3CellMouseoverButton.s_ButtonToolTip === null) {
            MapRoom3CellMouseoverButton.s_ButtonToolTip = new bubblepopup5();
            MapRoom3CellMouseoverButton.s_ButtonToolTip.mouseEnabled = false;
            MapRoom3CellMouseoverButton.s_ButtonToolTip.mouseChildren = false;
            MapRoom3CellMouseoverButton.s_ButtonToolTip.mcText.autoSize = TextFieldAutoSize.LEFT;
            MapRoom3CellMouseoverButton.s_ButtonToolTip.x = this.width * 0.5;
            MapRoom3CellMouseoverButton.s_ButtonToolTip.y = this.height;
        }
    }

    public OnMouseOver(event: MouseEvent): void {
        this.m_ButtonImage.visible = false;
        this.m_ButtonRolloverImage.visible = true;
        MapRoom3CellMouseoverButton.s_ButtonToolTip!.mcText.htmlText = "<b>" + KEYS.Get(this.m_ToolTip) + "</b>";
        let tooltipPos: Point = new Point(this.width * 0.5, this.height);
        tooltipPos = GLOBAL._layerUI.globalToLocal(this.localToGlobal(tooltipPos));
        MapRoom3CellMouseoverButton.s_ButtonToolTip!.x = tooltipPos.x;
        MapRoom3CellMouseoverButton.s_ButtonToolTip!.y = tooltipPos.y;
        MapRoom3CellMouseoverButton.s_ButtonToolTip!.mcBG.width = MapRoom3CellMouseoverButton.s_ButtonToolTip!.mcText.width + 10;
        GLOBAL._layerUI.addChild(MapRoom3CellMouseoverButton.s_ButtonToolTip!);
    }

    public OnMouseOut(event: MouseEvent): void {
        this.m_ButtonImage.visible = true;
        this.m_ButtonRolloverImage.visible = false;
        MapRoom3CellMouseoverButton.s_ButtonToolTip!.mcText.htmlText = "";
        if (MapRoom3CellMouseoverButton.s_ButtonToolTip!.parent === GLOBAL._layerUI) {
            GLOBAL._layerUI.removeChild(MapRoom3CellMouseoverButton.s_ButtonToolTip!);
        }
    }
}
