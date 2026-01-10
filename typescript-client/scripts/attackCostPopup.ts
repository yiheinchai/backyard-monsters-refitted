import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="attackCostPopup")]

@Embed({ source: "/_assets/assets.swf", symbol: "attackCostPopup" })
export class attackCostPopup extends MovieClip {
    public mcBG: frame_CLIP;
    public tBody: TextField;
    public mcInstant: MovieClip;
    public mcResources: MovieClip;

    constructor() {
        super();
    }
}
