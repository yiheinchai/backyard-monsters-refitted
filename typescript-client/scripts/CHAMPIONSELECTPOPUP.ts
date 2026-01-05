import { GUARDIANSELECTPOPUP_CLIP } from './GUARDIANSELECTPOPUP_CLIP';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSetH } from './ScrollSetH_CLIP'; // Stubbed
import { guardianselect_selectportrait_CLIP } from './guardianselect_selectportrait_CLIP';
import Sprite from 'openfl/display/Sprite';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';

export class CHAMPIONSELECTPOPUP extends GUARDIANSELECTPOPUP_CLIP {
    private _guardCage: CHAMPIONCAGE | null;

    constructor() {
        super();
        this._guardCage = GLOBAL._bCage as CHAMPIONCAGE;
        // this.tTitle.htmlText = KEYS.Get("popup_championselecttitle"); // Stubbed access
        this.createScrollBar(this.createSlots());
    }

    private createScrollBar(param1: Sprite): void {
        const _loc2_ = new ScrollSetH();
        this.addChild(_loc2_ as any);
    }

    private createSlots(): Sprite {
        return new Sprite(); // Stub
    }

    public Hide(param1: MouseEvent | null = null): void {
        CHAMPIONCAGE.Hide(param1);
    }

    public Center(): void {
        // POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        // POPUPSETTINGS.ScaleUp(this);
    }
}
