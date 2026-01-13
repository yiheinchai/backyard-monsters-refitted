import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="subscriptions_cancelconfirm_popup")]
@Embed({ source: "/_assets/assets.swf", symbol: "subscriptions_cancelconfirm_popup" })
export class subscriptions_cancelconfirm_popup extends MovieClip {
    public bConfirm: Button_CLIP;
    public tTitle: TextField;
    public tDesc: TextField;
    public bCancel: Button_CLIP;

    constructor() {
        super();
    }
}
