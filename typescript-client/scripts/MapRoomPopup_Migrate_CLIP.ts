import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoomPopup_Migrate_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoomPopup_Migrate_CLIP" })
export class MapRoomPopup_Migrate_CLIP extends MovieClip {
    public mcBG: frame_CLIP;
    public mcInstant: MovieClip;
    public tTitle: TextField;
    public mcResources: MovieClip;
    public mcImage: MovieClip;
    public tDescription: TextField;

    constructor() {
        super();
    }
}
