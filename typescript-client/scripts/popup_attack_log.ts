import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// Define interface for shell with body_txt
interface ShellWithBodyText extends MovieClip {
    body_txt: TextField;
}

// [Embed(source="/_assets/assets.swf", symbol="popup_attack_log")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_attack_log" })
export class popup_attack_log extends MovieClip {
    public maskMC: MovieClip;
    public title_txt: TextField;
    public shell: ShellWithBodyText;
    public b2: Button_CLIP;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;
    public Resize: (() => void) | null = null;

    constructor() {
        super();
    }
}
