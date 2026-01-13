import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";

import { BASE } from "../../../BASE";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { INFERNO_EMERGENCE_EVENT } from "../../../INFERNO_EMERGENCE_EVENT";
import { INFERNO_EMERGENCE_POPUPS } from "../../../INFERNO_EMERGENCE_POPUPS";
import { KEYS } from "../../../KEYS";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { SOUNDS } from "../../../SOUNDS";
import { WMATTACK } from "../../../WMATTACK";
import { popup_infernoemerge_aiattack } from "../../../popup_infernoemerge_aiattack";
import { bubblepopup3 } from "../../../bubblepopup3";

/**
 * Popup displayed when Inferno Emergence AI is about to attack.
 */
export class INFERNO_EMERGENCE_ATTACKPOPUP extends popup_infernoemerge_aiattack {
    public _type: number = 0;
    public _attackArray: any[][] = [];
    private d1: bubblepopup3;
    private d2: bubblepopup3;
    private d3: bubblepopup3;
    private d4: bubblepopup3;
    private d5: bubblepopup3;
    private bm: Bitmap | null = null;
    private _clips: any[] = [];
    private _descriptions: bubblepopup3[] = [];

    constructor(attackArray: any[][]) {
        super();
        
        const imageComplete = (path: string, data: BitmapData): void => {
            this.bm = new Bitmap(data);
            this.mcImage.addChild(this.bm);
        };
        
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.bAction.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        this.bAction.SetupKey("ai_engage_btn");
        
        ImageCache.GetImageWithCallBack("popups/portrait_moloch.png", imageComplete);
        this.mcFrame.Setup(false);
        
        this.d1 = new bubblepopup3();
        this.d1.x = 50;
        this.d1.y = 20;
        
        this.d2 = new bubblepopup3();
        this.d2.x = 50;
        this.d2.y = 20;
        
        this.d3 = new bubblepopup3();
        this.d3.x = 50;
        this.d3.y = 20;
        
        this.d4 = new bubblepopup3();
        this.d4.x = 50;
        this.d4.y = 20;
        this.addChild(this.d4);
        
        this.d5 = new bubblepopup3();
        this.d5.x = 50;
        this.d5.y = 20;
        
        this._clips = [this.c1, this.c2, this.c3, this.c4, this.c5];
        this._descriptions = [this.d1, this.d2, this.d3, this.d4, this.d5];
        this._attackArray = attackArray;
        
        this.tTitle.htmlText = KEYS.Get("ai_inferno_popupwarning_title");
        this.tName.htmlText = "";
        this.Resize();
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
        const creatureTypes: string[] = [];
        for (let i = 0; i < this._attackArray.length; i++) {
            creatureTypes.push(this._attackArray[i][0]);
        }
        
        switch (creatureTypes.length) {
            case 1:
                this.removeChild(this.c2);
                this.removeChild(this.c3);
                this.removeChild(this.c4);
                this.removeChild(this.c5);
                break;
            case 2:
                this.removeChild(this.c3);
                this.removeChild(this.c4);
                this.removeChild(this.c5);
                break;
            case 3:
                this.removeChild(this.c4);
                this.removeChild(this.c5);
                break;
            case 4:
                this.removeChild(this.c5);
                break;
        }
        
        for (let i = 0; i < creatureTypes.length; i++) {
            this._descriptions[i].Setup(50, 20, KEYS.Get("emerge_mondesc_" + CREATURELOCKER._creatures[creatureTypes[i]].description), 3);
        }
        
        this.c1.addChild(this.d1);
        this.c2.addChild(this.d2);
        this.c3.addChild(this.d3);
        this.c4.addChild(this.d4);
        this.c5.addChild(this.d5);
        
        for (let i = 0; i < creatureTypes.length; i++) {
            ImageCache.GetImageWithCallBack(
                "monsters/" + creatureTypes[i] + "-medium.jpg",
                this.IconLoaded.bind(this),
                true,
                1,
                "",
                [this._clips[i].mcIcon]
            );
            this._clips[i].tInfo.htmlText = "x" + this._attackArray[i][2];
            this._clips[i].tName.htmlText = "<b>" + KEYS.Get(CREATURELOCKER._creatures[creatureTypes[i]].name) + "</b>";
            this._descriptions[i].visible = false;
            this._clips[i].mouseChildren = false;
            this._clips[i].addEventListener(MouseEvent.MOUSE_OVER, this.showDescription.bind(this));
            this._clips[i].addEventListener(MouseEvent.MOUSE_OUT, this.hideDescription.bind(this));
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
        for (let i = 0; i < this._clips.length; i++) {
            if (event.target === this._clips[i]) {
                this._descriptions[i].visible = true;
                this.setChildIndex(this._clips[i], this.numChildren - 1);
            }
        }
    }

    private hideDescription(event: MouseEvent): void {
        for (let i = 0; i < this._clips.length; i++) {
            if (event.target === this._clips[i]) {
                this._descriptions[i].visible = false;
            }
        }
    }

    private sendDown(event: MouseEvent | null = null): void {
        SOUNDS.Play("click1");
        INFERNO_EMERGENCE_EVENT.TriggerAttack(event);
        this.closeDown();
    }

    private closeDown(event: MouseEvent | null = null): void {
        SOUNDS.Play("close");
        INFERNO_EMERGENCE_POPUPS.HideWarning();
    }

    public Resize(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }
}
