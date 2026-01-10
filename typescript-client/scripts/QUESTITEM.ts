import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="QUESTITEM")]
@Embed({ source: "/_assets/assets.swf", symbol: "QUESTITEM" })
export class QUESTITEM extends MovieClip {
    public mcTick: MovieClip;
    public tLabel: TextField;

    constructor() {
        super();
    }
}
