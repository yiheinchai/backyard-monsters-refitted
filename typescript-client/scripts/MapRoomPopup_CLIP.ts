import MovieClip from 'openfl/display/MovieClip';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { frame1_CLIP } from './frame1_CLIP';

/**
 * MapRoomPopup_CLIP - Base UI clip class for Map Room Popup
 * Contains all UI element declarations for map room popup
 * Converted from ActionScript to TypeScript
 */
export class MapRoomPopup_CLIP extends MovieClip {
    public mcR1!: MovieClip;
    public mcFrame2!: frame_CLIP;
    public mcR2!: MovieClip;
    public mcR3!: MovieClip;
    public mcMask!: MovieClip;
    public mcR4!: MovieClip;
    public bHome!: Button_CLIP;
    public bBookmarks!: Button_CLIP;
    public mcInfo!: MovieClip;
    public mcBuffHolder!: MovieClip;
    public mcOutposts!: MovieClip;
    public mcFrame!: frame1_CLIP;
    public bJump!: Button_CLIP;

    constructor() {
        super();
    }
}
