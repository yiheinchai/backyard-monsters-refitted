import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="workerMessage")]
@Embed({ source: "/_assets/assets.swf", symbol: "workerMessage" })
export class workerMessage extends MovieClip {
    public txt: TextField;
    public mcBG: MovieClip;

    constructor() {
        super();
    }
}
