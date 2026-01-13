import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { PopupInfoMonster } from "../maproom_advanced/PopupInfoMonster";
import { SiegeWeapons } from "../siege/SiegeWeapons";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { POPUPS } from "../../../POPUPS";
import { QUESTS } from "../../../QUESTS";

// Forward declarations
declare class MISSIONS_INFO_CLIP extends Sprite {
    tReward: any;
    tDescription: any;
    tHint: any;
    mcImage: any;
    R1: any;
    R2: any;
    R3: any;
    R4: any;
    R5: any;
    bCollect: any;
    mcArrow: any;
    gotoAndStop(frame: number): void;
}

declare class Button extends Sprite {
    Enabled: boolean;
    Highlight: boolean;
    enabled: boolean;
}

declare class SpecialRewardInfo extends Sprite {
    Setup(name: string, count: number, image: string): void;
}

declare class SiegeWeapon {
    name: string;
    rewardImage: string;
}

/**
 * Mission info popup - shows details about a specific mission/quest.
 */
export class MISSIONS_INFO extends MISSIONS_INFO_CLIP {
    private _text: string = "";
    private _textCur: number = 0;
    private _monsterRewardMC: PopupInfoMonster | null = null;
    private _specialReward: SpecialRewardInfo | null = null;
    private _missionID: string;
    private _missionObject: any;
    private _missionKey: string;
    private _mcImage: MovieClip;

    constructor(missionID: string) {
        super();
        
        this.tReward.htmlText = "<b>" + KEYS.Get("popup_label_reward") + "</b>";
        this._missionObject = QUESTS._quests[missionID];
        this._missionID = missionID;
        this._missionKey = QUESTS._quests[missionID].id;
        this._mcImage = this.mcImage;
        
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y;
        
        let description = "<b>" + KEYS.Get(this._missionObject.description, this._missionObject.keyvars) + "</b><br>";
        description = description.replace("#installsgenerated#", BASE._installsGenerated);
        description = description.replace("#mushroomspicked#", QUESTS._global.mushroomspicked);
        description = description.replace("#goldmushroomspicked#", QUESTS._global.goldmushroomspicked);
        description = description.replace("#monstersblended#", QUESTS._global.monstersblended);
        description = description.replace("#giftssent#", QUESTS._global.bonus_gifts);
        description = description.replace("#sentgiftsaccepted#", QUESTS._global.gift_accept);
        
        if (QUESTS._completed && QUESTS._completed[this._missionKey] === 1) {
            this.tDescription.htmlText = "<b>" + KEYS.Get("q_ui_completed") + "</b><br>" + description;
        } else {
            this.tDescription.htmlText = description;
        }
        
        if ((QUESTS._completed && QUESTS._completed[this._missionObject.id] === 1) || this._missionObject.hint === "") {
            this.tHint.htmlText = "";
        } else {
            const hintStr = KEYS.Get(this._missionObject.hint, this._missionObject.keyvars);
            this.tHint.htmlText = "<b>" + KEYS.Get("q_ui_hint") + "</b> <i>" + hintStr + "</i>";
        }
        
        if (this._missionObject.questimage) {
            const ImageLoaded = (path: string, data: BitmapData): void => {
                try {
                    let k = this._mcImage.numChildren;
                    while (k--) {
                        this._mcImage.removeChildAt(k);
                    }
                    const bmp = new Bitmap(data);
                    this._mcImage.addChild(bmp);
                } catch (e) {
                    // Ignore errors
                }
            };
            ImageCache.GetImageWithCallBack("popups/" + this._missionObject.questimage, ImageLoaded);
        }
        
        if (this._missionObject.monster_reward !== undefined) {
            for (let qq = 0; qq < 5; qq++) {
                const c = 0;
                if (GLOBAL.mode === GLOBAL._loadmode) {
                    (this as any)["R" + (qq + 1)].gotoAndStop(c + 1);
                } else {
                    (this as any)["R" + (qq + 1)].gotoAndStop(c + 7);
                }
                (this as any)["R" + (qq + 1)].tTitle.htmlText = KEYS.Get(GLOBAL._resourceNames[c]);
                (this as any)["R" + (qq + 1)].tValue.htmlText = "<b>" + GLOBAL.FormatNumber(this._missionObject.reward[c]) + "</b>";
                (this as any)["R" + (qq + 1)].visible = false;
            }
            
            this._monsterRewardMC = new PopupInfoMonster();
            this._monsterRewardMC.Setup(this.R1.x, this.R1.y, this._missionObject.reward_creatureid, this._missionObject.monster_reward);
            this.addChild(this._monsterRewardMC);
        } else if (this._missionObject.siegeweapon_reward) {
            for (let n = 1; n <= 5; n++) {
                (this as any)["R" + n].visible = false;
            }
            
            const weapon = SiegeWeapons.getWeapon(this._missionObject.siegeweapon_reward) as SiegeWeapon;
            this._specialReward = new SpecialRewardInfo();
            this._specialReward.x = this.R1.x;
            this._specialReward.y = this.R1.y;
            this._specialReward.Setup(weapon.name, this._missionObject.siegeweapon_rewardcount, weapon.rewardImage);
            this.addChild(this._specialReward);
        } else {
            for (let c = 0; c < 5; c++) {
                if (GLOBAL.mode === GLOBAL._loadmode) {
                    (this as any)["R" + (c + 1)].gotoAndStop(c + 1);
                } else {
                    (this as any)["R" + (c + 1)].gotoAndStop(c + 7);
                }
                (this as any)["R" + (c + 1)].tTitle.htmlText = KEYS.Get(GLOBAL._resourceNames[c]);
                (this as any)["R" + (c + 1)].tValue.htmlText = "<b>" + GLOBAL.FormatNumber(this._missionObject.reward[c]) + "</b>";
                (this as any)["R" + (c + 1)].visible = true;
            }
        }
        
        this.bCollect.SetupKey("btn_collect");
        
        if (BASE._pendingPurchase.length === 0) {
            this.bCollect.addEventListener(MouseEvent.CLICK, this.Collect(this._missionKey));
            if (!QUESTS._completed || QUESTS._completed[this._missionKey] !== 1) {
                (this.bCollect as Button).Enabled = false;
                this.mcArrow.visible = false;
            } else {
                (this.bCollect as Button).Highlight = true;
                this.mcArrow.visible = true;
            }
        } else {
            (this.bCollect as Button).Enabled = false;
        }
        
        if (QUESTS._completed && QUESTS._completed[this._missionObject.id] === 1) {
            this.gotoAndStop(2);
        } else {
            this.gotoAndStop(1);
        }
    }

    public Collect(questID: string): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            this.bCollect.enabled = false;
            const result = QUESTS.CollectB(questID);
            if (result) {
                QUESTS.Hide();
                return;
            }
        };
    }

    public Hide(): void {
        QUESTS.Hide();
    }

    public Resize(): void {
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y;
    }
}
