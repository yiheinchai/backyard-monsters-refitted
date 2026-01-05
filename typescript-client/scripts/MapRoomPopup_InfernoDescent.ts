import MovieClip from 'openfl/display/MovieClip';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';

export class MapRoomPopup_InfernoDescent extends MovieClip {
    public background_mc!: frame_CLIP;
    public bReturn!: Button_CLIP;
    public mcImage!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1);
    }

    public frame1(): void {
        this.stop();
    }
}
