
import { HATCHERYPOPUP_CLIP } from './HATCHERYPOPUP_CLIP';
import { BUILDING13 } from './BUILDING13';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { STORE } from './STORE';
import { CREATURELOCKER } from './CREATURELOCKER';
import { ImageCache } from './ImageCache'; // Assuming existing or stubbed
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { SOUNDS } from './SOUNDS';
import { POPUPS } from './POPUPS';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { HATCHERY } from './HATCHERY';
import { HOUSING } from './HOUSING';
import { CREATURES } from './CREATURES';
import { BRESOURCE } from './BRESOURCE';
import { TUTORIAL } from './TUTORIAL';
import { ResourcePackages } from './ResourcePackages';

import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';
import Sprite from 'openfl/display/Sprite';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import Point from 'openfl/geom/Point';
import MovieClip from 'openfl/display/MovieClip';

// Stubbing ScrollSet and external libs
const ScrollSet: any = { BROWN: 0 };
const TweenLite: any = { to: () => {} };
const Circ: any = { easeInOut: {} };

export class HATCHERYPOPUP extends HATCHERYPOPUP_CLIP {
    public _hatchery: BUILDING13;
    public _monsterSlots: any[];
    private MONSTERSLOTSIZE: Rectangle;
    private _scrollSet: any;
    private _scrollSetContainer: Sprite;
    public _guidePage: number = 1;

    constructor() {
        super();
        this.MONSTERSLOTSIZE = new Rectangle(0, 0, 65, 50);
        this.title_txt.htmlText = KEYS.Get(GLOBAL._bHatchery ? GLOBAL._bHatchery._buildingProps.name : "");
        this.bSpeedup.tName.htmlText = "<b>" + KEYS.Get("btn_speedup") + "</b>";
        this.bSpeedup.mouseChildren = false;
        if (!BASE.isInfernoMainYardOrOutpost) {
             this.bSpeedup.addEventListener(MouseEvent.CLICK, () => { STORE.Show(3, 2, ["HOD", "HOD2", "HOD3"]); });
        } else {
             this.bSpeedup.addEventListener(MouseEvent.CLICK, () => { STORE.Show(3, 2, ["HODI", "HOD2I", "HOD3I"]); });
        }
        this.bSpeedup.buttonMode = true;

        this.bFinish.tName.htmlText = "<b>" + KEYS.Get("str_finishnow") + "</b>";
        this.bFinish.mouseChildren = false;
        this.bFinish.addEventListener(MouseEvent.CLICK, this.FinishNow.bind(this));
        this.bFinish.buttonMode = true;

        // ScrollSet stub setup
        this._scrollSet = {}; 
        this._scrollSetContainer = new Sprite();
        this.addChild(this._scrollSetContainer);
        this.scroller.visible = false;
        
        this._monsterSlots = [];
        // Loading monster icons logic stubbed but would go here
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        let _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        if (param3 && param3[0] && param3[0].mcImage) {
             // param3[0].mcImage.removeChildAt(0); // Check children first in TS
             param3[0].mcImage.addChild(_loc4_);
             param3[0].mcImage.visible = true;
        }
    }

    public MonsterInfo(param1: number): (e: MouseEvent) => void {
        return (e: MouseEvent) => {
            this.MonsterInfoB(param1);
        };
    }

    public MonsterInfoB(creatureID: number): void {
        // Implementation stub for monster info
        this.MonsterInfoShow();
    }

    public MonsterInfoShow(): void {
        this.mcMonsterInfo.visible = true;
    }

    public MonsterInfoHide(param1: MouseEvent = null): void {
        this.mcMonsterInfo.visible = false;
    }

    public QueueAdd(param1: number): (e: MouseEvent) => void {
        return (e: MouseEvent) => {
            // Queue add logic stub
        };
    }
    
    // ... Charge, QueueRemove, RenderQueue, Setup, ShowRemove, HideRemove, Update, Help, FinishNow, DoFinish, Hide, Center, ScaleUp stubs ...

    public Setup(param1: BUILDING13): void {
        this._hatchery = param1;
        this.Update();
    }

    public Update(): void {
        this.RenderQueue();
        if (this._scrollSet && this._scrollSet.Update) this._scrollSet.Update();
    }

    public RenderQueue(): void {
        // Queue rendering logic stub
    }
    
    public FinishNow(param1: MouseEvent): void {
        if (!this.bFinish.Enabled) return;
        this.DoFinish();
        // Billing/confirmation logic omitted
    }

    public DoFinish(): void {
        if (this._hatchery) this._hatchery.FinishNow();
    }
    
    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }
    
    public Hide(param1: MouseEvent = null): void {
        HATCHERY.Hide(param1);
    }
}
