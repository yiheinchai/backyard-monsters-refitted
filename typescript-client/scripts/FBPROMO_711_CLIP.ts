import MovieClip from 'openfl/display/MovieClip';
import { frame_CLIP } from './frame_CLIP';

/**
 * FBPROMO_711_CLIP - Facebook 7-11 Promo UI
 * Popup for 7-11 cross-promotion
 * Converted from ActionScript to TypeScript
 */
export class FBPROMO_711_CLIP extends MovieClip {
    public bAction3!: MovieClip;
    public bInfo!: MovieClip;
    public mcFrame!: frame_CLIP;
    public bAction4!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
