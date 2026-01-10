import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoomPopupInfoMonster_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoomPopupInfoMonster_CLIP" })
export class MapRoomPopupInfoMonster_CLIP extends MovieClip {
    public tName: TextField;
    public mcImage: MovieClip;

    constructor() {
        super();
    }
}
