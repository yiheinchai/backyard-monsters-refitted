import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="icon_mail")]

/**
 * icon_mail - Icon component for mail display with counter
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "icon_mail" })
export class icon_mail extends MovieClip {
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
