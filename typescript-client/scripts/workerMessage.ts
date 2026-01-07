import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

// [Embed(source="/_assets/assets.swf", symbol="workerMessage")]
export class workerMessage extends MovieClip {
    public txt: TextField;
    public mcBG: MovieClip;

    constructor() {
        super();
    }
}
