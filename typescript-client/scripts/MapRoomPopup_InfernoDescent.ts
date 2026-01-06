import { MovieClip } from 'openfl/display/MovieClip';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="MapRoomPopup_InfernoDescent")]
export class MapRoomPopup_InfernoDescent extends MovieClip {
    public background_mc: frame_CLIP;
    public bReturn: Button_CLIP;
    public mcImage: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
