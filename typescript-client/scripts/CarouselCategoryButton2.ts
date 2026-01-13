import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="CarouselCategoryButton2")]

/**
 * CarouselCategoryButton2 - Carousel category button component
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "CarouselCategoryButton2" })
export class CarouselCategoryButton2 extends MovieClip {
    public mcHit: MovieClip;
    public mcMask: MovieClip;
    public tLabel: TextField;
    public mcBar: MovieClip;

    constructor() {
        super();
        this.mcHit = new MovieClip();
        this.mcMask = new MovieClip();
        this.tLabel = new TextField();
        this.mcBar = new MovieClip();
    }
}
