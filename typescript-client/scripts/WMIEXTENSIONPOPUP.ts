import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { WMIEXTENSIONPOPUP_CLIP } from './WMIEXTENSIONPOPUP_CLIP';

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }


export class WMIEXTENSIONPOPUP extends WMIEXTENSIONPOPUP_CLIP {
    private static _open: boolean = false;

    constructor() {
        const bannerComplete = (param1: string, param2: BitmapData): void => {
            const _loc3_ = new Bitmap(param2);
            _loc3_.smoothing = true;
            this.mcBanner.addChild(_loc3_);
            this.mcBanner.width = 672;
            this.mcBanner.height = 82;
        };
        const imageComplete = (param1: string, param2: BitmapData): void => {
            const _loc3_ = new Bitmap(param2);
            _loc3_.smoothing = true;
            this.mcImage.addChild(_loc3_);
            this.mcImage.width = 672;
            this.mcImage.height = 200;
        };
        super();
        ImageCache.GetImageWithCallBack(getSPECIALEVENT().BANNERIMAGE, bannerComplete);
        ImageCache.GetImageWithCallBack("specialevent/wmi2_4-v2.png", imageComplete);
        this.mcFrame.Setup(true);
        this.closeBtn.visible = false;
        this.mcText.htmlText = getKEYS().Get("wmi2_popup4");
        WMIEXTENSIONPOPUP._open = true;
    }

    public static get open(): boolean {
        return WMIEXTENSIONPOPUP._open;
    }

    public Hide(): void {
        WMIEXTENSIONPOPUP._open = false;
        getPOPUPS().Next();
    }

    private CloseButtonClicked(param1: MouseEvent): void {
        this.Hide();
    }
}
