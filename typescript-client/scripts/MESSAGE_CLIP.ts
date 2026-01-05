import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * MESSAGE_CLIP - Base UI clip class for Message
 * Contains all UI element declarations for messages
 * Converted from ActionScript to TypeScript
 */
export class MESSAGE_CLIP extends MovieClip {
    public bAction2!: Button_CLIP;
    public mcBG!: frame_CLIP;
    public bAction!: Button_CLIP;
    public tMessage!: TextField;

    constructor() {
        super();
    }
}
