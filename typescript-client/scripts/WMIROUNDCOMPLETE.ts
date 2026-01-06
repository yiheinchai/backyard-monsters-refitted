import { Bitmap } from 'openfl/display/Bitmap';
import { BitmapData } from 'openfl/display/BitmapData';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { ROUNDCOMPLETEPOPUP_CLIP } from './ROUNDCOMPLETEPOPUP_CLIP';
import { BFOUNDATION } from './BFOUNDATION';
import { BTOTEM } from './BTOTEM';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { POPUPS } from './POPUPS';
import { SOUNDS } from './SOUNDS';
import { SPECIALEVENT } from './SPECIALEVENT';
import { STORE } from './STORE';

export class WMIROUNDCOMPLETE extends ROUNDCOMPLETEPOPUP_CLIP {
    private static _open: boolean = false;
    private static _wave: number;
    private bm: Bitmap;

    constructor(wave: number = -1, surrendered: boolean = false) {
        const bannerComplete = (param1: string, param2: BitmapData): void => {
            const _loc3_ = new Bitmap(param2);
            this.mcBanner.addChild(_loc3_);
            this.mcBanner.width = 672;
            this.mcBanner.height = 82;
        };
        const imageComplete = (param1: string, param2: BitmapData): void => {
            const _loc3_ = new Bitmap(param2);
            _loc3_.smoothing = true;
            this.mcImage.addChild(_loc3_);
            this.mcImage.width = 200;
            this.mcImage.height = 200;
        };
        super();
        WMIROUNDCOMPLETE._wave = wave;
        ImageCache.GetImageWithCallBack(SPECIALEVENT.BANNERIMAGE, bannerComplete);
        if (wave == -1) {
            ImageCache.GetImageWithCallBack(WMIROUNDCOMPLETE.GetImageName(SPECIALEVENT.wave, false), imageComplete);
        } else {
            ImageCache.GetImageWithCallBack(WMIROUNDCOMPLETE.GetImageName(wave, true), imageComplete);
        }
        this.mcFrame.Setup(wave != 1);
        if (SPECIALEVENT.isMajorWave(wave)) {
            this.mcTitle.htmlText = KEYS.Get("wmi_winwavetitle");
            this.mcText.htmlText = KEYS.Get("wmi_winwave" + wave);
            if (wave == SPECIALEVENT.BONUSWAVE) {
                this.mcStats.htmlText = KEYS.Get("wmi_completedwave31");
            } else if (wave == SPECIALEVENT.BONUSWAVE2) {
                this.mcStats.htmlText = KEYS.Get("wmi_completedwave32");
            } else {
                this.mcStats.htmlText = KEYS.Get("wmi_completedwaves", { "v1": wave });
            }
            this.rBtn.Highlight = true;
            if (wave == 1) {
                BTOTEM.TotemReward();
                this.ButtonsVisible(false, false, true, false);
                this.rBtn.SetupKey("wmi_placetotembtn");
                this.rBtn.addEventListener(MouseEvent.CLICK, this.PlaceTotem.bind(this));
            } else {
                this.ButtonsVisible(false, false, false, true);
                this.bragBtn.SetupKey("btn_brag");
                this.bragBtn.Highlight = true;
                this.bragBtn.addEventListener(MouseEvent.CLICK, WMIROUNDCOMPLETE.Brag);
            }
            this.lBtn.visible = false;
        } else if (wave == -1) {
            if (surrendered) {
                this.mcTitle.htmlText = KEYS.Get("wmi2_surrendertitle");
                this.mcText.htmlText = KEYS.Get("wmi2_surrender");
            } else {
                this.mcTitle.htmlText = KEYS.Get("wmi_losewavetitle");
                this.mcText.htmlText = KEYS.Get("wmi2_losewave");
            }
            this.mcStats.htmlText = "";
            let numDamagedBuildings = 0;
            const buildingInstances = InstanceManager.getInstancesByClass(BFOUNDATION);
            for (const b of buildingInstances) {
                if ((b as BFOUNDATION).health < (b as BFOUNDATION).maxHealth) {
                    numDamagedBuildings++;
                }
            }
            if (numDamagedBuildings > 0) {
                this.ButtonsVisible(false, true, true, false);
                this.mBtn.SetupKey("btn_startrepairs");
                this.mBtn.addEventListener(MouseEvent.CLICK, this.StartRepairsClicked.bind(this));
                this.rBtn.SetupKey("btn_repairall");
                this.rBtn.Highlight = true;
                this.rBtn.addEventListener(MouseEvent.CLICK, this.RepairAllClicked.bind(this));
            } else {
                this.ButtonsVisible(false, false, false, false);
            }
        } else if (wave == SPECIALEVENT.EVENTEND) {
            this.mcTitle.htmlText = "";
            this.mcText.htmlText = KEYS.Get("wmi2_eventover");
            this.mcStats.htmlText = "";
            this.ButtonsVisible(false, false, false, true);
            this.bragBtn.SetupKey("btn_brag");
            this.bragBtn.Highlight = true;
            this.bragBtn.addEventListener(MouseEvent.CLICK, WMIROUNDCOMPLETE.Brag);
        } else {
            this.mcTitle.htmlText = KEYS.Get("wmi_winwavetitle");
            this.mcText.htmlText = KEYS.Get("wmi_winwave");
            this.mcStats.htmlText = KEYS.Get("wmi_completedwaves", { "v1": wave });
            let numDamagedBuildings = 0;
            const buildingInstances = InstanceManager.getInstancesByClass(BFOUNDATION);
            for (const b of buildingInstances) {
                if ((b as BFOUNDATION).health < (b as BFOUNDATION).maxHealth) {
                    numDamagedBuildings++;
                }
            }
            if (numDamagedBuildings == 0) {
                if (SPECIALEVENT.GetTimeUntilEnd() < 0) {
                    this.ButtonsVisible(false, false, false, false);
                } else {
                    this.ButtonsVisible(false, false, true, false);
                    this.rBtn.SetupKey("wmi_nextwavebtn");
                    this.rBtn.addEventListener(MouseEvent.CLICK, this.NextWaveClicked.bind(this));
                }
            } else {
                if (SPECIALEVENT.GetTimeUntilEnd() < 0) {
                    this.ButtonsVisible(false, true, true, false);
                } else {
                    this.ButtonsVisible(true, true, true, false);
                    this.lBtn.SetupKey("wmi_nextwavebtn");
                    this.lBtn.addEventListener(MouseEvent.CLICK, this.NextWaveClicked.bind(this));
                }
                this.mBtn.SetupKey("btn_startrepairs");
                this.mBtn.addEventListener(MouseEvent.CLICK, this.StartRepairsClicked.bind(this));
                this.rBtn.SetupKey("btn_repairall");
                this.rBtn.Highlight = true;
                this.rBtn.addEventListener(MouseEvent.CLICK, this.RepairAllClicked.bind(this));
            }
        }
        WMIROUNDCOMPLETE._open = true;
    }

    public static get open(): boolean {
        return WMIROUNDCOMPLETE._open;
    }

    private static Brag(param1: MouseEvent): void {
        switch (WMIROUNDCOMPLETE._wave) {
            case 1:
                GLOBAL.CallJS("sendFeed", ["wmi2totem-construct", KEYS.Get("wmi2_wave1streamtitle"), KEYS.Get("wmi2_wave1streamdesc"), "wmitotemfeed2_1.png"]);
                break;
            case 10:
                GLOBAL.CallJS("sendFeed", ["wmi2totem-construct", KEYS.Get("wmi2_wave10streamtitle"), KEYS.Get("wmi2_wave10streamdesc"), "wmitotemfeed2_2.png"]);
                break;
            case 20:
                GLOBAL.CallJS("sendFeed", ["wmi2totem-construct", KEYS.Get("wmi2_wave20streamtitle"), KEYS.Get("wmi2_wave20streamdesc"), "wmitotemfeed2_3.png"]);
                break;
            case 30:
                GLOBAL.CallJS("sendFeed", ["wmi2totem-construct", KEYS.Get("wmi2_wave30streamtitle"), KEYS.Get("wmi2_wave30streamdesc"), "wmitotemfeed2_4.png"]);
                break;
            case 31:
                GLOBAL.CallJS("sendFeed", ["wmi2totem-construct", KEYS.Get("wmi2_wave31streamtitle"), KEYS.Get("wmi2_wave31streamdesc"), "wmitotemfeed2_5.png"]);
                break;
            case 32:
                GLOBAL.CallJS("sendFeed", ["wmi2totem-construct", KEYS.Get("wmi2_wave32streamtitle"), KEYS.Get("wmi2_wave32streamdesc"), "wmitotemfeed2_6.png"]);
                break;
            case 33:
                GLOBAL.CallJS("sendFeed", ["wmi2-eventover", KEYS.Get("wmi2_eventoverstreamtitle"), KEYS.Get("wmi2_eventoverstreamdesc", { "v1": SPECIALEVENT.GetStat("wmi2_wave") }), "wmi2_aftermath.v2.png"]);
        }
        POPUPS.Next();
    }

    private static GetImageName(param1: number, param2: boolean): string {
        if (param2) {
            switch (param1) {
                case 1:
                    return "popups/building-wmi2totem1.png";
                case 10:
                    return "popups/building-wmi2totem2.png";
                case 20:
                    return "popups/building-wmi2totem3.png";
                case 30:
                    return "popups/building-wmi2totem4.png";
                case 31:
                    return "popups/building-wmi2totem5.png";
                case 32:
                    return "popups/building-wmi2totem6.png";
                case 33:
                    return "popups/wmi2eventend.jpg";
                default:
                    if (param1 < 10) {
                        return "specialevent/wmi2_1.jpg";
                    }
                    if (param1 < 20) {
                        return "specialevent/wmi2_2.jpg";
                    }
                    return "specialevent/wmi2_3.jpg";
            }
        } else {
            if (param1 < 10) {
                return "specialevent/wmi2_1.jpg";
            }
            if (param1 < 20) {
                return "specialevent/wmi2_2.jpg";
            }
            return "specialevent/wmi2_3.jpg";
        }
    }

    public Hide(): void {
        WMIROUNDCOMPLETE._open = false;
        POPUPS.Next();
    }

    private ButtonsVisible(param1: boolean, param2: boolean, param3: boolean, param4: boolean): void {
        this.lBtn.visible = param1;
        this.mBtn.visible = param2;
        this.rBtn.visible = param3;
        this.bragBtn.visible = param4;
    }

    private PlaceholderButtonClicked(param1: MouseEvent): void {
        this.Hide();
    }

    private NextWaveClicked(param1: MouseEvent): void {
        SPECIALEVENT.StartRound();
        this.Hide();
    }

    private StartRepairsClicked(param1: MouseEvent): void {
        const _loc2_ = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const _loc3_ of _loc2_) {
            const building = _loc3_ as BFOUNDATION;
            if (building.health < building.maxHealth && building._repairing == 0) {
                building.Repair();
            }
        }
        SOUNDS.Play("repair1", 0.25);
        this.Hide();
    }

    private RepairAllClicked(param1: MouseEvent): void {
        STORE.ShowB(3, 1, ["FIX"], true);
        this.Hide();
    }

    private PlaceTotem(param1: MouseEvent): void {
        BTOTEM.TotemPlace();
        this.Hide();
    }
}
