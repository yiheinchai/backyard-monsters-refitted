import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { MISSIONS_INFO } from "./MISSIONS_INFO";
import { UI_MISSIONS_ITEM_CLIP } from "../../../UI_MISSIONS_ITEM_CLIP";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }
function getSOUNDS(): any { return require("../../../SOUNDS").SOUNDS; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }



/**
 * Mission list item - represents a single mission in the missions menu.
 */
export class MISSIONS_ITEM extends UI_MISSIONS_ITEM_CLIP {
    public _Width: number = 340;
    public _Height: number = 32;
    public _missionObject: any;
    public _missionID: string;
    public _missionKey: string;
    public _isComplete: boolean = false;
    public _isDisable: boolean = false;
    private _skinTag: number = 0;

    constructor(missionID: string) {
        super();
        
        this._missionObject = getQUESTS()._quests[missionID];
        this._missionID = missionID;
        this._missionKey = this._missionObject.id;
        
        let nametxt = getKEYS().Get(this._missionObject.name, this._missionObject.keyvars);
        let description = getKEYS().Get(this._missionObject.description, this._missionObject.keyvars);
        
        description = description.replace("#installsgenerated#", String(getBASE()._installsGenerated));
        description = description.replace("#mushroomspicked#", String(getQUESTS()._global.mushroomspicked));
        description = description.replace("#goldmushroomspicked#", String(getQUESTS()._global.goldmushroomspicked));
        description = description.replace("#monstersblended#", String(getQUESTS()._global.monstersblended));
        description = description.replace("#giftssent#", String(getQUESTS()._global.bonus_gifts));
        description = description.replace("#sentgiftsaccepted#", String(getQUESTS()._global.gift_accept));
        
        this.tName.htmlText = "<b>" + nametxt + "</b>";
        
        if (description.length > 50) {
            description = description.substr(0, 46) + "...";
        }
        this.tDesc.htmlText = description;
        
        this.mouseChildren = false;
        
        if (this._missionObject.questicon) {
            const ImageLoaded = (path: string, data: BitmapData): void => {
                try {
                    this.mcImage.addChild(new Bitmap(data));
                } catch (e) {
                    // Ignore errors
                }
            };
            ImageCache.GetImageWithCallBack("missionicon/" + this._missionObject.questicon, ImageLoaded);
        }
        
        if (getQUESTS()._completed && getQUESTS()._completed[this._missionKey] === 1) {
            this._isComplete = true;
        } else {
            this._isComplete = false;
        }
        
        this.Init();
    }

    public Init(disable: boolean = false): void {
        this._isDisable = disable;
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && !disable) {
            this.buttonMode = true;
            this.useHandCursor = true;
            
            if (!this.hasEventListener(MouseEvent.CLICK)) {
                this.addEventListener(MouseEvent.CLICK, this.ShowMission(this._missionID));
                this.addEventListener(MouseEvent.ROLL_OVER, this.MissionRollOver(this._missionID));
            }
            
            if (this._isComplete) {
                this.gotoAndStop(2);
            } else {
                this.gotoAndStop(1);
            }
        } else {
            this.buttonMode = false;
            this.useHandCursor = false;
            
            this.removeEventListener(MouseEvent.CLICK, this.ShowMission(this._missionID));
            this.removeEventListener(MouseEvent.ROLL_OVER, this.MissionRollOver(this._missionID));
            
            if (this._isComplete) {
                this.gotoAndStop(3);
            } else {
                this.gotoAndStop(4);
            }
        }
    }

    public ShowMission(missionID: string): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && !this._isDisable) {
                const questId = this._missionObject.id;
                if (getTUTORIAL().hasFinished || (getQUESTS()._completed && getQUESTS()._completed[questId] === 1 && getTUTORIAL()._stage >= 26)) {
                    const missionInfo = new MISSIONS_INFO(missionID);
                    getPOPUPS().Push(missionInfo);
                    getSOUNDS().Play("click1");
                    getQUESTS()._open = true;
                }
            }
        };
    }

    public MissionRollOver(missionID: string): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            // Empty handler for roll over
        };
    }
}
