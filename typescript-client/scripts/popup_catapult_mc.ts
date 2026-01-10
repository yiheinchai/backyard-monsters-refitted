import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { CATAPULTITEM_view } from "./CATAPULTITEM_view";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_catapult_mc")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_catapult_mc" })
export class popup_catapult_mc extends MovieClip {
    public pb2: CATAPULTITEM_view;
    public pb3: CATAPULTITEM_view;
    public tTitlePebble: TextField;
    public tTitleTwig: TextField;
    public _bg: MovieClip;
    public tw0: CATAPULTITEM_view;
    public tw1: CATAPULTITEM_view;
    public pu0: CATAPULTITEM_view;
    public tw2: CATAPULTITEM_view;
    public pu1: CATAPULTITEM_view;
    public pu2: CATAPULTITEM_view;
    public pu3: CATAPULTITEM_view;
    public tTitlePutty: TextField;
    public pb0: CATAPULTITEM_view;
    public pb1: CATAPULTITEM_view;

    constructor() {
        super();
    }
}
