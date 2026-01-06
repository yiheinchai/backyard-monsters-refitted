import MovieClip from 'openfl/display/MovieClip';

/**
 * icon_gifts - Icon component for displaying gifts with counter
 * Converted from ActionScript to TypeScript
 */
export class icon_gifts extends MovieClip {
    public mcHit: MovieClip;
    public mcSpinner: MovieClip;
    public mcCounter: MovieClip;

    constructor() {
        super();
        this.mcHit = new MovieClip();
        this.mcSpinner = new MovieClip();
        this.mcCounter = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
