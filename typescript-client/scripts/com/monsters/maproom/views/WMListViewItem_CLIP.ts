import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "../../../Button_CLIP";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.WMListViewItem_CLIP")]

/**
 * Wild monster list view item clip - display for wild monster list item.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.views.WMListViewItem_CLIP" })
export class WMListViewItem_CLIP extends MovieClip {
    public icon_mc: MovieClip | null = null;
    public name_txt: TextField | null = null;
    public placeholder: MovieClip | null = null;
    public attackBtn: Button_CLIP | null = null;
    public status_txt: TextField | null = null;
    public dot: MovieClip | null = null;
    public attacks_txt: TextField | null = null;
    public helpBtn: Button_CLIP | null = null;
    public extraStatus_txt: TextField | null = null;

    constructor() {
        super();
    }
}
