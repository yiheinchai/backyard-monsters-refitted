import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="HellRaisersBattleSummary_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "HellRaisersBattleSummary_CLIP" })
export class HellRaisersBattleSummary_CLIP extends MovieClip {
    public tBody: TextField;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
