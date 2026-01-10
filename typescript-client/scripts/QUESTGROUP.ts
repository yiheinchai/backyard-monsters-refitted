import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="QUESTGROUP")]
@Embed({ source: "/_assets/assets.swf", symbol: "QUESTGROUP" })
export class QUESTGROUP extends MovieClip {
    public tLabel: TextField;

    constructor() {
        super();
    }
}
