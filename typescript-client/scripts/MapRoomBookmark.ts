import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { buttonClose_CLIP } from './buttonClose_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoomBookmark")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoomBookmark" })
export class MapRoomBookmark extends MovieClip {
    public tName: TextField;
    public mcBG: MovieClip;
    public bDelete: buttonClose_CLIP;

    constructor() {
        super();
    }
}
