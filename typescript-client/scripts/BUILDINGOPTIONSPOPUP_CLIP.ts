import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { bubblepopup6_CLIP } from './bubblepopup6_CLIP';

/**
 * BUILDINGOPTIONSPOPUP_CLIP - Base UI clip class for Building Options Popup
 * Contains all UI element declarations for the building options dialog
 * Converted from ActionScript to TypeScript
 */
export class BUILDINGOPTIONSPOPUP_CLIP extends MovieClip {
    public mcCBBG!: MovieClip;
    public mcBG!: frame_CLIP;
    public mcInstant!: MovieClip;
    public mcResources!: MovieClip;
    public mcImage!: MovieClip;
    public mcInfoCB!: bubblepopup6_CLIP;
    public tDescription!: TextField;

    constructor() {
        super();
    }
}
