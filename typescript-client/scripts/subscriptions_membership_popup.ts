import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="subscriptions_membership_popup")]
export class subscriptions_membership_popup extends MovieClip {
    public bClose: Button_CLIP;
    public tRenew: TextField;
    public bCancel: Button_CLIP;
    public tTitle: TextField;
    public bChange: Button_CLIP;
    public tDescription: TextField;

    constructor() {
        super();
    }
}
