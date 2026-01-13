import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { DEFENSEEVENTPOPUP_CLIP } from './DEFENSEEVENTPOPUP_CLIP';
import { SPECIALEVENT } from './SPECIALEVENT';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { POPUPS } from './POPUPS';

/**
 * DEFENSEEVENTPOPUP_WM1 - Original defense event popup for Wild Monster Invasion 1
 * This is the original DEFENSEEVENTPOPUP.as class archived when WMI2 was released.
 * Converted from ActionScript to TypeScript
 */
export class DEFENSEEVENTPOPUP_WM1 extends DEFENSEEVENTPOPUP_CLIP {
    private static _open: boolean = false;
    private bm: Bitmap | null = null;

    constructor(param1: number = 0) {
        super();
        
        let popupnum: number = param1;
        
        const bannerComplete = (param1: string, param2: BitmapData): void => {
            this.bm = new Bitmap(param2);
            this.mcBanner.addChild(this.bm);
            this.mcBanner.width = 672;
            this.mcBanner.height = 82;
        };
        
        const imageComplete = (param1: string, param2: BitmapData): void => {
            const _loc3_: Bitmap = new Bitmap(param2);
            _loc3_.smoothing = true;
            this.mcImage.addChild(_loc3_);
            this.mcImage.width = 200;
            this.mcImage.height = 200;
        };
        
        if (popupnum == -1) {
            popupnum = Math.floor(Math.random() * 3) + 1;
        }
        
        if (popupnum == 4) {
            if (SPECIALEVENT.wave == 1) {
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
        
        ImageCache.GetImageWithCallBack("specialevent/monsterinvasionbannerred.jpg", bannerComplete);
        
        if (popupnum > 0 && popupnum < 5) {
            ImageCache.GetImageWithCallBack("specialevent/200x200_" + popupnum + ".jpg", imageComplete);
            this.mcText.htmlText = KEYS.Get("wmi_popup" + popupnum);
        } else if (popupnum == 5) {
            ImageCache.GetImageWithCallBack("specialevent/tshirt_v2.png", imageComplete);
            this.mcText.htmlText = KEYS.Get("wmi_tshirt");
        }
        
        this.mcFrame.Setup(true);
        DEFENSEEVENTPOPUP_WM1._open = true;
    }

    public static get open(): boolean {
        return DEFENSEEVENTPOPUP_WM1._open;
    }

    public rsvpDown(param1: MouseEvent): void {
        // GLOBAL.gotoURL("http://www.facebook.com/event.php?eid=141841065917218", null, true, null);
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
