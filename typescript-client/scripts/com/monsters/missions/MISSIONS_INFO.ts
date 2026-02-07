import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { PopupInfoMonster } from "../maproom_advanced/PopupInfoMonster";

import { MISSIONS_INFO_CLIP } from "../../../MISSIONS_INFO_CLIP";
import { Button } from "../../../Button";
import { SpecialRewardInfo } from "../../../SpecialRewardInfo";
import { SiegeWeapon } from "../siege/weapons/SiegeWeapon";

// Lazy imports to break circular dependency chains
function getSiegeWeapons(): any { return require("../siege/SiegeWeapons").SiegeWeapons; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }


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
        
        this.tReward.htmlText = "<b>" + getKEYS().Get("popup_label_reward") + "</b>";
        this._missionObject = getQUESTS()._quests[missionID];
        this._missionID = missionID;
        this._missionKey = getQUESTS()._quests[missionID].id;
        this._mcImage = this.mcImage;
        
        this.x = getGLOBAL()._SCREENCENTER.x;
        this.y = getGLOBAL()._SCREENCENTER.y;
        
        let description = "<b>" + getKEYS().Get(this._missionObject.description, this._missionObject.keyvars) + "</b><br>";
        description = description.replace("#installsgenerated#", String(getBASE()._installsGenerated));
        description = description.replace("#mushroomspicked#", String(getQUESTS()._global.mushroomspicked));
        description = description.replace("#goldmushroomspicked#", String(getQUESTS()._global.goldmushroomspicked));
        description = description.replace("#monstersblended#", String(getQUESTS()._global.monstersblended));
        description = description.replace("#giftssent#", String(getQUESTS()._global.bonus_gifts));
        description = description.replace("#sentgiftsaccepted#", String(getQUESTS()._global.gift_accept));
        
        if (getQUESTS()._completed && getQUESTS()._completed[this._missionKey] === 1) {
            this.tDescription.htmlText = "<b>" + getKEYS().Get("q_ui_completed") + "</b><br>" + description;
        } else {
            this.tDescription.htmlText = description;
        }
        
        if ((getQUESTS()._completed && getQUESTS()._completed[this._missionObject.id] === 1) || this._missionObject.hint === "") {
            this.tHint.htmlText = "";
        } else {
            const hintStr = getKEYS().Get(this._missionObject.hint, this._missionObject.keyvars);
            this.tHint.htmlText = "<b>" + getKEYS().Get("q_ui_hint") + "</b> <i>" + hintStr + "</i>";
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
                if (getGLOBAL().mode === getGLOBAL()._loadmode) {
                    (this as any)["R" + (qq + 1)].gotoAndStop(c + 1);
                } else {
                    (this as any)["R" + (qq + 1)].gotoAndStop(c + 7);
                }
                (this as any)["R" + (qq + 1)].tTitle.htmlText = getKEYS().Get(getGLOBAL()._resourceNames[c]);
                (this as any)["R" + (qq + 1)].tValue.htmlText = "<b>" + getGLOBAL().FormatNumber(this._missionObject.reward[c]) + "</b>";
                (this as any)["R" + (qq + 1)].visible = false;
            }
            
            this._monsterRewardMC = new PopupInfoMonster();
            this._monsterRewardMC.Setup(this.R1.x, this.R1.y, this._missionObject.reward_creatureid, this._missionObject.monster_reward);
            this.addChild(this._monsterRewardMC);
        } else if (this._missionObject.siegeweapon_reward) {
            for (let n = 1; n <= 5; n++) {
                (this as any)["R" + n].visible = false;
            }
            
            const weapon = getSiegeWeapons().getWeapon(this._missionObject.siegeweapon_reward) as SiegeWeapon;
            this._specialReward = new SpecialRewardInfo();
            this._specialReward.x = this.R1.x;
            this._specialReward.y = this.R1.y;
            this._specialReward.Setup(weapon.name, this._missionObject.siegeweapon_rewardcount, weapon.rewardImage);
            this.addChild(this._specialReward);
        } else {
            for (let c = 0; c < 5; c++) {
                if (getGLOBAL().mode === getGLOBAL()._loadmode) {
                    (this as any)["R" + (c + 1)].gotoAndStop(c + 1);
                } else {
                    (this as any)["R" + (c + 1)].gotoAndStop(c + 7);
                }
                (this as any)["R" + (c + 1)].tTitle.htmlText = getKEYS().Get(getGLOBAL()._resourceNames[c]);
                (this as any)["R" + (c + 1)].tValue.htmlText = "<b>" + getGLOBAL().FormatNumber(this._missionObject.reward[c]) + "</b>";
                (this as any)["R" + (c + 1)].visible = true;
            }
        }
        
        this.bCollect.SetupKey("btn_collect");
        
        if (getBASE()._pendingPurchase.length === 0) {
            this.bCollect.addEventListener(MouseEvent.CLICK, this.Collect(this._missionKey));
            if (!getQUESTS()._completed || getQUESTS()._completed[this._missionKey] !== 1) {
                (this.bCollect as Button).Enabled = false;
                this.mcArrow.visible = false;
            } else {
                (this.bCollect as Button).Highlight = true;
                this.mcArrow.visible = true;
            }
        } else {
            (this.bCollect as Button).Enabled = false;
        }
        
        if (getQUESTS()._completed && getQUESTS()._completed[this._missionObject.id] === 1) {
            this.gotoAndStop(2);
        } else {
            this.gotoAndStop(1);
        }
    }

    public Collect(questID: string): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            this.bCollect.enabled = false;
            const result = getQUESTS().CollectB(questID);
            if (result) {
                getQUESTS().Hide();
                return;
            }
        };
    }

    public Hide(): void {
        getQUESTS().Hide();
    }

    public Resize(): void {
        this.x = getGLOBAL()._SCREENCENTER.x;
        this.y = getGLOBAL()._SCREENCENTER.y;
    }
}
