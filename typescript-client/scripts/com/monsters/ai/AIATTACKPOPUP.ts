import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { TRIBES } from "./TRIBES";

import { BASE } from "../../../BASE";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { SOUNDS } from "../../../SOUNDS";
import { WMATTACK } from "../../../WMATTACK";

// Declare external clip classes
declare class AIATTACKPOPUP_CLIP extends Sprite {
    mcImage: any;
    mcFrame: any;
    sendNow: any;
    waitBtn: any;
    title_txt: any;
    name_txt: any;
    c1: any;
    c2: any;
    c3: any;
}
declare class bubblepopup3 extends Sprite {
    Setup: (w: number, h: number, text: string, style: number) => void;
}

/**
 * Popup displayed when AI is about to attack player's base.
 */
export class AIATTACKPOPUP extends AIATTACKPOPUP_CLIP {
    public _type: number = 0;
    private d1: bubblepopup3;
    private d2: bubblepopup3;
    private d3: bubblepopup3;
    private bm: Bitmap | null = null;

    constructor(attackerType: number = 3) {
        super();
        
        const imageComplete = (path: string, data: BitmapData): void => {
            this.bm = new Bitmap(data);
            this.mcImage.addChild(this.bm);
        };
        
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.sendNow.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        this.sendNow.SetupKey("ai_engage_btn");
        this.waitBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.onWaitDown.bind(this));
        this.waitBtn.SetupKey("ai_preparedefenses_btn");
        
        ImageCache.GetImageWithCallBack(TRIBES.TribeForBaseID(WMATTACK._attackersBaseID)?.splash || "", imageComplete);
        this.mcFrame.Setup(false);
        
        this.d1 = new bubblepopup3();
        this.d1.x = 398;
        this.d1.y = 214;
        this.addChild(this.d1);
        
        this.d2 = new bubblepopup3();
        this.d2.x = 398;
        this.d2.y = 260;
        this.addChild(this.d2);
        
        this.d3 = new bubblepopup3();
        this.d3.x = 398;
        this.d3.y = 306;
        this.addChild(this.d3);
        
        this._type = attackerType;
        this.title_txt.htmlText = KEYS.Get("ai_popupwarning_title");
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y;
    }

    private onWaitDown(event: MouseEvent): void {
        SOUNDS.Play("click1");
        WMATTACK._queued.warned = 1;
        BASE.Save(0, false, true);
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    private onAdd(event: Event): void {
        const attack = WMATTACK._queued.attack;
        const creatureTypes: string[] = [];
        
        for (const key in attack) {
            if (attack[key] > 0) {
                creatureTypes.push(key);
            }
        }
        
        switch (creatureTypes.length) {
            case 1:
                this.removeChild(this.c2);
                this.removeChild(this.c3);
                break;
            case 2:
                this.removeChild(this.c3);
                break;
        }
        
        const bubbles = [this.d1, this.d2, this.d3];
        for (let i = 0; i < creatureTypes.length; i++) {
            bubbles[i].Setup(47, 23, KEYS.Get(CREATURELOCKER._creatures[creatureTypes[i]].description), 3);
        }
        
        this.c1.addChild(this.d1);
        this.c2.addChild(this.d2);
        this.c3.addChild(this.d3);
        
        const containers = [this.c1, this.c2, this.c3];
        for (let i = 0; i < creatureTypes.length; i++) {
            ImageCache.GetImageWithCallBack(
                "monsters/" + creatureTypes[i] + "-medium.jpg",
                this.IconLoaded.bind(this),
                true,
                1,
                "",
                [containers[i].mcIcon]
            );
            containers[i].tInfo.htmlText = "x" + attack[creatureTypes[i]];
            containers[i].tName.htmlText = "<b>" + KEYS.Get(CREATURELOCKER._creatures[creatureTypes[i]].name) + "</b>";
            bubbles[i].visible = false;
            containers[i].mouseChildren = false;
            containers[i].addEventListener(MouseEvent.MOUSE_OVER, this.showDescription.bind(this));
            containers[i].addEventListener(MouseEvent.MOUSE_OUT, this.hideDescription.bind(this));
        }
        
        const tribe = TRIBES.TribeForBaseID(WMATTACK._attackersBaseID);
        if (BASE.isInfernoMainYardOrOutpost) {
            this.name_txt.htmlText = "<b>" + KEYS.Get("inf_ai_tribe_mapview", { v1: tribe?.name || "" }) + "</b>";
        } else {
            this.name_txt.htmlText = "<b>" + KEYS.Get("ai_tribe", { v1: tribe?.name || "" }) + "</b>";
        }
    }

    public IconLoaded(path: string, data: BitmapData, args: any[] | null = null): void {
        const bm = new Bitmap(data);
        bm.smoothing = true;
        if (args) {
            args[0].mcImage.addChild(bm);
        }
    }

    private showDescription(event: MouseEvent): void {
        const containers = [this.c1, this.c2, this.c3];
        const bubbles = [this.d1, this.d2, this.d3];
        
        for (let i = 0; i < containers.length; i++) {
            if (event.target === containers[i]) {
                bubbles[i].visible = true;
                this.setChildIndex(containers[i], this.numChildren - 1);
            }
        }
    }

    private hideDescription(event: MouseEvent): void {
        const containers = [this.c1, this.c2, this.c3];
        const bubbles = [this.d1, this.d2, this.d3];
        
        for (let i = 0; i < containers.length; i++) {
            if (event.target === containers[i]) {
                bubbles[i].visible = false;
            }
        }
    }

    private sendDown(event: MouseEvent | null = null): void {
        SOUNDS.Play("click1");
        WMATTACK.Attack();
        this.closeDown();
    }

    private closeDown(event: MouseEvent | null = null): void {
        SOUNDS.Play("close");
        WMATTACK.HideWarning();
    }

    public Resize(): void {
        POPUPSETTINGS.AlignToCenter(this);
        if (this.bm) {
            this.bm.x = GLOBAL._SCREENCENTER.x - 520 - this.bm.width * 0.5;
            this.bm.y = GLOBAL._SCREENCENTER.y - 250 - this.bm.height * 0.5;
        }
    }
}
