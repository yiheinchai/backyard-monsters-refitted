import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="subscriptions_controlPanel_popup")]
export class subscriptions_controlPanel_popup extends MovieClip {
    public bMembership: Button_CLIP;
    public bPlaceDave: Button_CLIP;
    public tMembers_title: TextField;
    public mcImage_terrain: MovieClip;
    public mcDave1: MovieClip;
    public mcDave2: MovieClip;
    public bSave: Button_CLIP;
    public mcDave3: MovieClip;
    public mcTile1: MovieClip;
    public tMembers_desc: TextField;
    public mcTile2: MovieClip;
    public mcTile3: MovieClip;
    public mcTile4: MovieClip;

    constructor() {
        super();
    }
}
