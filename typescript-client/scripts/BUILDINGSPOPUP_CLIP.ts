import MovieClip from 'openfl/display/MovieClip';
import { BUILDINGSARROW } from './BUILDINGSARROW';
import { buttonClose_CLIP } from './buttonClose_CLIP';
import { Button_CLIP } from './Button_CLIP';

/**
 * BUILDINGSPOPUP_CLIP - Base UI clip class for Buildings Popup
 * Contains all UI element declarations for the building selection popup
 * Converted from ActionScript to TypeScript
 */
export class BUILDINGSPOPUP_CLIP extends MovieClip {
    public bNext!: BUILDINGSARROW;
    public bClose!: buttonClose_CLIP;
    public bPrevious!: BUILDINGSARROW;
    public b1!: Button_CLIP;
    public b2!: Button_CLIP;
    public b3!: Button_CLIP;
    public b4!: Button_CLIP;
    public mcNew!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
