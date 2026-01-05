import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import { DEFENSEEVENTPOPUP_CLIP } from './DEFENSEEVENTPOPUP_CLIP';
import { KEYS } from './KEYS';
import { POPUPS } from './POPUPS';
import { GLOBAL } from './GLOBAL';
// import { SPECIALEVENT } from './SPECIALEVENT'; // TODO: Convert SPECIALEVENT
// import { ImageCache } from './com/monsters/display/ImageCache'; // TODO: Convert ImageCache

/**
 * DEFENSEEVENTPOPUP_WM1 - Defense event popup (WMI1)
 * Legacy WMI event popup implementation
 * Converted from ActionScript to TypeScript
 */
export class DEFENSEEVENTPOPUP_WM1 extends DEFENSEEVENTPOPUP_CLIP {
    private static _open: boolean = false;
    private bm!: Bitmap;

    constructor(param1: number = 0) {
        super();
        var popupnum: number = param1;
        var bannerComplete = (param1: string, param2: BitmapData): void => {
            this.bm = new Bitmap(param2);
            this.mcBanner.addChild(this.bm);
            this.mcBanner.width = 672;
            this.mcBanner.height = 82;
        };
        var imageComplete = (param1: string, param2: BitmapData): void => {
            var _loc3_: Bitmap = new Bitmap(param2);
            _loc3_.smoothing = true;
            this.mcImage.addChild(_loc3_);
            this.mcImage.width = 200;
            this.mcImage.height = 200;
        };
        
        if (popupnum == -1) {
            popupnum = Math.floor(Math.random() * 3) + 1;
        }

        // Stubbing SPECIALEVENT logic
        var specialEventWave: number = 1; // SPECIALEVENT.wave
        if (popupnum == 4) {
            if (specialEventWave == 1) {
                this.rsvpBtn.Setup(KEYS.Get("wmi_buttonpopup2"), false, 0, 0);
                this.rsvpBtn.addEventListener(MouseEvent.CLICK, this.startDown.bind(this));
            } else {
                this.rsvpBtn.visible = false;
            }
        } else if (popupnum == 5) {
            this.rsvpBtn.Setup(KEYS.Get("str_zazzle"), false, 0, 0);
            this.rsvpBtn.Highlight = true;
            this.rsvpBtn.addEventListener(MouseEvent.CLICK, this.merchandiseDown.bind(this));
        } else {
            this.rsvpBtn.Setup(KEYS.Get("wmi_buttonpopup1"), false, 0, 0);
            this.rsvpBtn.addEventListener(MouseEvent.CLICK, this.rsvpDown.bind(this));
        }

        // Stubbing ImageCache calls
        // ImageCache.GetImageWithCallBack("specialevent/monsterinvasionbannerred.jpg", bannerComplete);
        if (popupnum > 0 && popupnum < 5) {
            // ImageCache.GetImageWithCallBack("specialevent/200x200_" + popupnum + ".jpg", imageComplete);
            this.mcText.htmlText = KEYS.Get("wmi_popup" + popupnum);
        } else if (popupnum == 5) {
            // ImageCache.GetImageWithCallBack("specialevent/tshirt_v2.png", imageComplete);
            this.mcText.htmlText = KEYS.Get("wmi_tshirt");
        }

        this.mcFrame.Setup(true);
        DEFENSEEVENTPOPUP_WM1._open = true;
    }

    public static get open(): boolean {
        return DEFENSEEVENTPOPUP_WM1._open;
    }

    public rsvpDown(param1: MouseEvent): void {
        GLOBAL.gotoURL("https://backyard-monsters.fandom.com/wiki/Wild_Monster_Invasion", null, true, null);
        POPUPS.Next();
    }

    public startDown(param1: MouseEvent): void {
        this.Hide();
    }

    private merchandiseDown(param1: MouseEvent): void {
        GLOBAL.gotoURL("http://www.zazzle.com/ultimate_i_survived_wild_monster_invasion_t_shirt-235246313457240737", null, true, [63, 1]);
        POPUPS.Next();
    }

    public Hide(): void {
        DEFENSEEVENTPOPUP_WM1._open = false;
        POPUPS.Next();
    }
}
