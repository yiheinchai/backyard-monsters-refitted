import MovieClip from 'openfl/display/MovieClip';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { frame1_CLIP } from './frame1_CLIP';
import { Embed } from "./core/Embed";

/**
 * MapRoomPopup_CLIP - Map room popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="MapRoomPopup_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoomPopup_CLIP" })
export class MapRoomPopup_CLIP extends MovieClip {
    public mcR1: any; // Dynamic MovieClip with mcMask, mcBG
    public mcFrame2: frame_CLIP;
    public mcR2: any; // Dynamic MovieClip with mcMask, mcBG
    public mcR3: any; // Dynamic MovieClip with mcMask, mcBG
    public mcMask: MovieClip;
    public mcR4: any; // Dynamic MovieClip with mcMask, mcBG
    public bHome: Button_CLIP;
    public bBookmarks: Button_CLIP;
    public mcInfo: any; // Dynamic MovieClip with labelOwner, tAlliance, mcProfilePic, mcAlliancePic, tStatus, etc.
    public mcBuffHolder: MovieClip;
    public mcOutposts: any; // Dynamic MovieClip with mcMask, mcBG, tR
    public mcFrame: frame1_CLIP;
    public bJump: Button_CLIP;

    constructor() {
        super();
        this.mcR1 = new MovieClip();
        this.mcFrame2 = new frame_CLIP();
        this.mcR2 = new MovieClip();
        this.mcR3 = new MovieClip();
        this.mcMask = new MovieClip();
        this.mcR4 = new MovieClip();
        this.bHome = new Button_CLIP();
        this.bBookmarks = new Button_CLIP();
        this.mcInfo = new MovieClip();
        this.mcBuffHolder = new MovieClip();
        this.mcOutposts = new MovieClip();
        this.mcFrame = new frame1_CLIP();
        this.bJump = new Button_CLIP();
    }
}
