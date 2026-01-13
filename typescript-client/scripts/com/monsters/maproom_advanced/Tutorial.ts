import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { SOUNDS } from "../../../SOUNDS";
import { popup_mr2tutorial } from "../../../popup_mr2tutorial";

/**
 * Map Room 2 tutorial system.
 */
export class Tutorial {
    private static _instance: Tutorial | null = null;
    
    private _tutStep: number = 0;
    private _currImageUrl: string = "";
    private _bigPopup: popup_mr2tutorial | null = null;

    constructor() {
        this.Update();
    }

    public static ShowIfNeeded(): void {
        if (GLOBAL._mr2TutorialId < 2) {
            Tutorial.Hide();
            Tutorial._instance = new Tutorial();
        }
    }

    public static ForceShowAll(): void {
        GLOBAL._mr2TutorialId = 0;
        Tutorial.ShowIfNeeded();
    }

    public static Hide(): void {
        if (Tutorial._instance) {
            Tutorial._instance.HideBigDialog();
            Tutorial._instance = null;
        }
    }

    public Update(): void {
        while (this._tutStep <= 7) {
            if (GLOBAL._mr2TutorialId <= ((this._tutStep === 1 || this._tutStep === 5) ? 1 : 0)) {
                break;
            }
            this._tutStep++;
        }
        
        if (this._tutStep < 7) {
            this.ShowBigDialog(
                KEYS.Get("newmap_g" + (this._tutStep + 1)),
                "ui/mr2_tutorial_" + (this._tutStep + 1) + ".png"
            );
        } else if (this._tutStep === 7) {
            this.ShowSmallDialog(KEYS.Get("newmap_g" + (this._tutStep + 1)));
        } else {
            this.FinishTutorial();
        }
    }

    private AdvanceTutorial(event: Event | null = null): void {
        this._tutStep++;
        this.Update();
    }

    private FinishTutorial(event: Event | null = null): void {
        Tutorial.Hide();
        GLOBAL._mr2TutorialId = 2;
        BASE.Save();
    }

    private ShowBigDialog(text: string, imageUrl: string): void {
        this.HideBigDialog();
        GLOBAL.BlockerAdd();
        SOUNDS.Play("click1");
        
        this._bigPopup = new popup_mr2tutorial();
        this._bigPopup.tBody.htmlText = text;
        this._bigPopup.bAction.SetupKey("btn_continue");
        this._bigPopup.bAction.addEventListener(MouseEvent.CLICK, this.AdvanceTutorial.bind(this), false);
        this._bigPopup.bAction.Highlight = true;
        this._bigPopup.mcFrame.Setup(true, this.FinishTutorial.bind(this));
        
        this._currImageUrl = imageUrl;
        ImageCache.GetImageWithCallBack(this._currImageUrl, this.ImageLoaded.bind(this));
        
        GLOBAL._layerTop.addChild(this._bigPopup);
        POPUPSETTINGS.AlignToCenter(this._bigPopup);
        POPUPSETTINGS.ScaleUp(this._bigPopup);
    }

    private ImageLoaded(path: string, data: BitmapData): void {
        if (this._currImageUrl === path && this._bigPopup) {
            this._bigPopup.mcImageContainer.addChild(new Bitmap(data));
        }
    }

    private ShowSmallDialog(text: string): void {
        this.HideBigDialog();
        this._currImageUrl = "";
        GLOBAL.Message(text, KEYS.Get("btn_continue"), this.AdvanceTutorial.bind(this));
    }

    private HideBigDialog(): void {
        if (this._bigPopup) {
            GLOBAL.BlockerRemove();
            GLOBAL._layerTop.removeChild(this._bigPopup);
            this._bigPopup = null;
        }
    }
}
