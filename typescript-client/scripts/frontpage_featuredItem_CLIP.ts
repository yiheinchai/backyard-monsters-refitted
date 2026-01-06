import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * frontpage_featuredItem_CLIP - CLIP class for featured item on frontpage
 * Converted from ActionScript to TypeScript
 */
export class frontpage_featuredItem_CLIP extends MovieClip {
    public tBody: TextField;
    public tTitle: TextField;
    public mcOverlay: MovieClip;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;

    constructor() {
        super();
        this.tBody = new TextField();
        this.tTitle = new TextField();
        this.mcOverlay = new MovieClip();
        this.mcImage = new MovieClip();
        this.bAction = new Button_CLIP();
    }
}
