import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * GUARDIANNAMEPOPUP_CLIP - Base UI clip class for Guardian Name Popup
 * Contains all UI element declarations for guardian name popup
 * Converted from ActionScript to TypeScript
 */
export class GUARDIANNAMEPOPUP_CLIP extends MovieClip {
    public mcGuard!: MovieClip;
    public mcBG!: frame_CLIP;
    public tInput!: TextField;
    public tTitle!: TextField;
    public tDescription!: TextField;
    public bAction!: Button_CLIP;

    constructor() {
        super();
    }
}
