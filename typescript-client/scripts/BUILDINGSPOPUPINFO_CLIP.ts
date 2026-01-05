import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { BUILDINGBUTTON_CLIP } from './BUILDINGBUTTON_CLIP';

/**
 * BUILDINGSPOPUPINFO_CLIP - Base UI clip class for Buildings Popup Info
 * Contains all UI element declarations for individual building info in the popup
 * Converted from ActionScript to TypeScript
 */
export class BUILDINGSPOPUPINFO_CLIP extends MovieClip {
    public mcBG!: frame_CLIP;
    public bBuild!: Button_CLIP;
    public mcBlocker!: MovieClip;
    public tDescription!: TextField;
    public mcIcon!: BUILDINGBUTTON_CLIP;
    public bTopup!: Button_CLIP;

    constructor() {
        super();
    }
}
