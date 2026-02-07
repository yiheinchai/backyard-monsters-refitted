import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { MapRoomPopup_Migrate_CLIP } from "../../../MapRoomPopup_Migrate_CLIP";
import { icon_costs } from "../../../icon_costs";

/**
 * Popup for migrating/upgrading the map room.
 */
export class PopupMigrate extends MapRoomPopup_Migrate_CLIP {
    private static instance: PopupMigrate | null = null;
    
    private _closeHandler: Function | null = null;

    constructor(closeHandler: Function | null = null) {
        super();
        
        this._closeHandler = closeHandler;
        
        const instantCost = GLOBAL._bMap.InstantUpgradeCost();
        const upgradeCost = GLOBAL._bMap.UpgradeCost();
        
        this.tTitle.htmlText = KEYS.Get("msg_mr2pop_title");
        this.tDescription.htmlText = KEYS.Get("msg_mr2pop_desc");
        
        ImageCache.GetImageWithCallBack("popups/outpost-takeover.png", this.onAssetLoaded.bind(this));
        
        this.mcInstant.tDescription.htmlText = KEYS.Get("buildoptions_upgradeinstant");
        this.mcInstant.bAction.Setup("<b>" + KEYS.Get("btn_useshiny", { v1: instantCost }) + "</b>");
        this.mcInstant.bAction.Highlight = true;
        this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, this.InstantUpgrade.bind(this), false);
        this.mcInstant.gCoin.mouseEnabled = false;
        this.mcInstant.gCoin.mouseChildren = false;
        
        (this.mcResources as any).bAction.SetupKey("buildoptions_resources");
        (this.mcResources as any).bAction.addEventListener(MouseEvent.CLICK, this.Upgrade.bind(this), false);
        
        const resourceNames = GLOBAL._resourceNames;
        
        for (let i = 1; i < 5; i++) {
            const costMC = this.mcResources["mcR" + i] as icon_costs;
            costMC.tTitle.htmlText = "<b>" + KEYS.Get(resourceNames[i - 1]) + "</b>";
            costMC.tValue.htmlText = "<b>" + GLOBAL.FormatNumber(upgradeCost["r" + i]) + "</b>";
            
            if (BASE._resources["r" + i] && BASE._resources["r" + i].Get() < upgradeCost["r" + i]) {
                costMC.tValue.htmlText = '<font color="#FF0000">' + costMC.tValue.htmlText + '</font>';
            }
            costMC.gotoAndStop(i);
        }
        
        (this.mcResources as any).mcTime.tTitle.htmlText = "<b>" + KEYS.Get(resourceNames[5]) + "</b>";
        (this.mcResources as any).mcTime.tValue.htmlText = "<b>" + GLOBAL.ToTime(upgradeCost.time, true, false) + "</b>";
        (this.mcResources as any).mcTime.gotoAndStop(6);
    }

    public static Show(closeHandler: Function | null = null): void {
        if (PopupMigrate.instance) {
            PopupMigrate.Hide();
        }
        PopupMigrate.instance = new PopupMigrate(closeHandler);
        GLOBAL._layerWindows.addChild(PopupMigrate.instance);
        POPUPSETTINGS.AlignToCenter(PopupMigrate.instance);
        POPUPSETTINGS.ScaleUp(PopupMigrate.instance);
    }

    public static Hide(): void {
        if (!PopupMigrate.instance) {
            return;
        }
        GLOBAL._layerWindows.removeChild(PopupMigrate.instance);
        PopupMigrate.instance = null;
    }

    public HideInstance(): void {
        if (this._closeHandler) {
            this._closeHandler();
        }
        PopupMigrate.Hide();
    }

    private onAssetLoaded(path: string, data: BitmapData): void {
        this.mcImage.addChild(new Bitmap(data));
    }

    private InstantUpgrade(event: Event): void {
        this.HideInstance();
        GLOBAL._bMap.DoInstantUpgrade();
    }

    private Upgrade(event: Event): void {
        this.HideInstance();
        GLOBAL._bMap.Upgrade();
    }
}
