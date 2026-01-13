import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="icon_popups")]

/**
 * icon_popups - Icon component for popups display with counter
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "icon_popups" })
export class icon_popups extends MovieClip {
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
