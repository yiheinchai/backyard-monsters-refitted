import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

/**
 * QUESTSPOPUP_CLIP - Base UI clip class for Quests Popup
 * Contains all UI element declarations for quests popup
 * Converted from ActionScript to TypeScript
 */
export class QUESTSPOPUP_CLIP extends MovieClip {
    public title_txt!: TextField;
    public mcFrame!: frame_CLIP;

    constructor() {
        super();
    }
}
