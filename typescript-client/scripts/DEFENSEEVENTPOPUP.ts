import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { DEFENSEEVENTPOPUP_CLIP } from './DEFENSEEVENTPOPUP_CLIP';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { POPUPS } from './POPUPS';
import { SPECIALEVENT } from './SPECIALEVENT';

/**
 * DEFENSEEVENTPOPUP - Defense event popup with banner and RSVP button
 * Converted from ActionScript to TypeScript
 */
export class DEFENSEEVENTPOPUP extends DEFENSEEVENTPOPUP_CLIP {
    private static _open: boolean = false;
    private bm: Bitmap;

    constructor(param1: number = 0) {
        super();
        const self = this;
        let popupnum: number = param1;
        
        const bannerComplete = (param1: string, param2: BitmapData): void => {
            self.bm = new Bitmap(param2);
            self.mcBanner.addChild(self.bm);
            self.mcBanner.width = 672;
            self.mcBanner.height = 82;
        };
        
        const imageComplete = (param1: string, param2: BitmapData): void => {
            const _loc3_: Bitmap = new Bitmap(param2);
            _loc3_.smoothing = true;
            self.mcImage.addChild(_loc3_);
            self.mcImage.width = 200;
            self.mcImage.height = 200;
        };
        
        if (popupnum == -1) {
            popupnum = Math.floor(Math.random() * 3) + 1;
        }
        this.rsvpBtn.Setup(KEYS.Get("wmi_buttonpopup1"), false, 0, 0);
        this.rsvpBtn.addEventListener(MouseEvent.CLICK, this.rsvpDown.bind(this));
        ImageCache.GetImageWithCallBack(SPECIALEVENT.BANNERIMAGE, bannerComplete);
        if (popupnum > 0 && popupnum < 4) {
            ImageCache.GetImageWithCallBack("specialevent/wmi2_" + popupnum + ".jpg", imageComplete);
            this.mcText.htmlText = KEYS.Get("wmi2_popup" + popupnum);
        }
        this.mcFrame.Setup(true);
        DEFENSEEVENTPOPUP._open = true;
    }

    public static get open(): boolean {
        return DEFENSEEVENTPOPUP._open;
    }

    public rsvpDown(param1: MouseEvent): void {
        this.Hide();
        GLOBAL.gotoURL("https://backyard-monsters.fandom.com/wiki/Wild_Monster_Invasion_2", null, true, null);
    }

    public startDown(param1: MouseEvent): void {
        this.Hide();
    }

    public Hide(): void {
        DEFENSEEVENTPOPUP._open = false;
        POPUPS.Next();
    }
}
