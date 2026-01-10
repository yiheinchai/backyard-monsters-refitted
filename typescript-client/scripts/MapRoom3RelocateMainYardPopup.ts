import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3RelocateMainYardPopup")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoom3RelocateMainYardPopup" })
export class MapRoom3RelocateMainYardPopup extends MovieClip {
    public nameTitletext: TextField;
    public background: frame_CLIP;
    public contentsMask: MovieClip;
    public contentsContainer: MovieClip;
    public selectDescriptionText: TextField;
    public levelTitleText: TextField;
    public randomButton: Button_CLIP;
    public worldtTitleText: TextField;
    public contentsFrame: MovieClip;
    public titleText: TextField;
    public orText: TextField;
    public randomDescriptionText: TextField;

    constructor() {
        super();
    }
}
