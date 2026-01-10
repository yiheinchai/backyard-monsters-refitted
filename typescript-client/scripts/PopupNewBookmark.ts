import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="PopupNewBookmark")]
@Embed({ source: "/_assets/assets.swf", symbol: "PopupNewBookmark" })
export class PopupNewBookmark extends MovieClip {
    public tName: TextField;
    public bSave: Button_CLIP;
    public mcFrame: frame_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
    }
}
