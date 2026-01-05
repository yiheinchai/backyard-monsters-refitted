import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * GUARDIANBUTTON_CLIP - Base UI clip class for Guardian Button
 * Contains all UI element declarations for guardian selection buttons
 * Converted from ActionScript to TypeScript
 */
export class GUARDIANBUTTON_CLIP extends MovieClip {
    public _bg!: MovieClip;
    public txtName!: TextField;
    public bRetreat!: Button_CLIP;
    public bSend!: Button_CLIP;
    public mcImage!: MovieClip;

    constructor() {
        super();
    }
}
