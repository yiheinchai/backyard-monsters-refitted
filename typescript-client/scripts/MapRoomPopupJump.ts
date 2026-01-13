import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoomPopupJump")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoomPopupJump" })
export class MapRoomPopupJump extends MovieClip {
    public mcFrame: frame_CLIP;
    public tX: TextField;
    public bJump: Button_CLIP;
    public tY: TextField;
    public tMessage: TextField;

    constructor() {
        super();
    }
}
