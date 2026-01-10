import { MovieClip } from 'openfl/display/MovieClip';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="FBPROMO_711_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "FBPROMO_711_CLIP" })
export class FBPROMO_711_CLIP extends MovieClip {
    public bAction3: MovieClip;
    public bInfo: MovieClip;
    public mcFrame: frame_CLIP;
    public bAction4: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
