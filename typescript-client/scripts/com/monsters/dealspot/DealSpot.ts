import Loader from "openfl/display/Loader";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";
import LoaderContext from "openfl/system/LoaderContext";
import Security from "openfl/system/Security";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { UI_TOP } from "../../../UI_TOP";

// Forward declaration
declare class ExternalInterface {
    static available: boolean;
}

/**
 * DealSpot - TrialPay offer integration widget.
 */
export class DealSpot extends MovieClip {
    public _loader: Loader;
    public _icon: MovieClip | null = null;
    public _req: URLRequest;
    public _reqURL: string = "http://assets.tp-cdn.com/static3/swf/dealspot.swf?";
    public _reqAppID: string = "app_id=";
    public _reqSID: string = "&mode=fbpayments&sid=";
    public _reqCurrID: string = "&currency_url=";
    public _tp2: string = "&touchpoint=2";
    public _appIDVal: string;
    public _sidVal: string;
    public _currIDVal: string;
    public _hasOffers: boolean = true;
    public _isClick: boolean = false;
    public _top: UI_TOP;

    constructor(top: UI_TOP) {
        super();
        
        const context = new LoaderContext();
        context.checkPolicyFile = true;
        Security.allowDomain("*");
        
        this._appIDVal = GLOBAL._appid;
        this._sidVal = GLOBAL._tpid;
        this._currIDVal = GLOBAL._currencyURL;
        this._top = top;
        
        this._loader = new Loader();
        this._req = new URLRequest("" + this._reqURL + this._reqAppID + this._appIDVal + this._reqSID + this._sidVal + this._reqCurrID + this._currIDVal + this._tp2);
        
        this._loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, GLOBAL.handleLoadError);
        this._loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onLoaderFinish.bind(this));
        this._loader.addEventListener("trialpayClick", this.trialpayClick.bind(this));
        this._loader.addEventListener("onOfferUnavailable", this.trialpayOfferUnavailable.bind(this));
        
        if (ExternalInterface.available) {
            this._loader.load(this._req);
            this.addEventListener("trialpayClick", this.trialpayClick.bind(this));
            this.addEventListener("trialpayOfferUnavailable", this.trialpayOfferUnavailable.bind(this));
        }
    }

    public onLoaderFinish(e: Event): void {
        this.addChild(this._loader.content);
        this._loader.contentLoaderInfo.removeEventListener(Event.COMPLETE, this.onLoaderFinish.bind(this));
        this._loader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, GLOBAL.handleLoadError);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.onRollOver.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.onRollOut.bind(this));
        this._loader.removeEventListener("trialpayClick", this.trialpayClick.bind(this));
        this._loader.removeEventListener("onOfferUnavailable", this.trialpayOfferUnavailable.bind(this));
    }

    public onRollOver(e: MouseEvent): void {
        if (this._top._bubbleDo) {
            this._top.BubbleHide();
        }
        const text = KEYS.Get("popup_earnshiny");
        const xPos = this.parent.x + 80;
        const yPos = this.parent.y + 50;
        this._top.BubbleShow(xPos, yPos, text);
    }

    public onRollOut(e: MouseEvent): void {
        this._top.BubbleHide();
    }

    public trialpayClick(e: Event): void {
        this._isClick = true;
    }

    public trialpayOfferUnavailable(e: Event): void {
        this.visible = false;
        (this as any).enabled = false;
        this.removeEventListener("trialpayClick", this.trialpayClick.bind(this));
        this.removeEventListener("trialpayOfferUnavailable", this.trialpayOfferUnavailable.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.onRollOver.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_OUT, this.onRollOut.bind(this));
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
