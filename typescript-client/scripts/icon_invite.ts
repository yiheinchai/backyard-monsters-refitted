import MovieClip from 'openfl/display/MovieClip';
//    [Embed(source="/_assets/assets.swf", symbol="icon_invite")]

/**
 * icon_invite - Icon component for invite display
 * Converted from ActionScript to TypeScript
 */
export class icon_invite extends MovieClip {
    public mcHit: MovieClip;
    public mcSpinner: MovieClip;

    constructor() {
        super();
        this.mcHit = new MovieClip();
        this.mcSpinner = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
