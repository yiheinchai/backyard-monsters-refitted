import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="icon_worker_inferno")]

/**
 * icon_worker_inferno - Icon component for inferno worker display
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "icon_worker_inferno" })
export class icon_worker_inferno extends MovieClip {
    public label_txt: TextField;
    public mcIcon: MovieClip;

    constructor() {
        super();
        this.label_txt = new TextField();
        this.mcIcon = new MovieClip();
    }
}
