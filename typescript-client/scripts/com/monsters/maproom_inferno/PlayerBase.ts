import Loader from "openfl/display/Loader";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import URLRequest from "openfl/net/URLRequest";
import LoaderContext from "openfl/system/LoaderContext";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";

import { SecNum } from "../../cc/utils/SecNum";
import { PlayerBaseInferno_CLIP } from "../../../PlayerBaseInferno_CLIP";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGIN(): any { return require("../../../LOGIN").LOGIN; }



/**
 * PlayerBase (Inferno) - represents the player's base on the inferno map room.
 */
export class PlayerBase extends PlayerBaseInferno_CLIP {
    public data: Record<string, any>;
    public mapX: number = 0;
    public mapY: number = 0;
    private loader: Loader;
    public image: Sprite;
    public nameBox: Sprite;
    private pin: Sprite | null = null;

    constructor(baseID: number, baseSeed: number) {
        super();
        const onLoadError = (event: IOErrorEvent): void => {
            // Empty error handler
        };
        this.data = {};
        this.data.baseid = new SecNum(baseID);
        this.data.baseseed = new SecNum(baseSeed);
        this.data.ownerName = "My Yard";
        this.loader = new Loader();
        try {
            if (getLOGIN()._playerPic.length > 5) {
                this.loader.load(new URLRequest(getLOGIN()._playerPic), new LoaderContext(true));
            }
        } catch (e: any) {
            // Ignore errors
        }
        this.loader.x = this.placeholder.x;
        this.loader.y = this.placeholder.y;
        this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onImageComplete.bind(this));
        this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
        this.image = new Sprite();
        this.addChild(this.image);
        this.image.addChild(this.photoFrame_mc);
        this.image.addChild(this.placeholder);
        this.image.addChild(this.loader);
        this.image.addChild(this.frame_mc);
        this.name_txt.autoSize = TextFieldAutoSize.LEFT;
        this.name_txt.htmlText = "<b>" + getKEYS().Get("map_mybase");
        this.name_txt.x = this.name_txt.textWidth * -0.5;
        this.nameBox = new Sprite();
        this.nameBox.addChild(this.box_mc);
        this.nameBox.addChild(this.name_txt);
        this.addChild(this.nameBox);
        this.nameBox.x = -2;
        const tgtWidth: number = this.name_txt.textWidth + 2 * 7;
        this.box_mc.width = tgtWidth < 51 ? 51 : tgtWidth;
        this.addChild(this.nail);
        this.mouseChildren = false;
    }

    private onImageComplete(event: Event): void {
        this.loader.width = this.loader.height = 44;
    }
}
