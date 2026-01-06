import MovieClip from 'openfl/display/MovieClip';
import { frame_CLIP } from './frame_CLIP';

/**
 * popup_frontpage_CLIP - CLIP class for frontpage popup
 * Converted from ActionScript to TypeScript
 */
export class popup_frontpage_CLIP extends MovieClip {
    public bNext: MovieClip;
    public bPrev: MovieClip;
    public mcCarousel: MovieClip;
    public mcContainer: MovieClip;
    public mcNew: MovieClip;
    public mcFrame: frame_CLIP;
    public mcLoading: MovieClip;

    constructor() {
        super();
        this.bNext = new MovieClip();
        this.bPrev = new MovieClip();
        this.mcCarousel = new MovieClip();
        this.mcContainer = new MovieClip();
        this.mcNew = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.mcLoading = new MovieClip();
    }
}
