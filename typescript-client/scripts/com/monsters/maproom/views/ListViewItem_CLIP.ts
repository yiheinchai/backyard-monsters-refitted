import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "../../../Button_CLIP";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.ListViewItem_CLIP")]

/**
 * List view item clip - display for player list item in map room.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.views.ListViewItem_CLIP" })
export class ListViewItem_CLIP extends MovieClip {
    public online_txt: TextField | null = null;
    public name_txt: TextField | null = null;
    public placeholder: MovieClip | null = null;
    public userid_txt: TextField | null = null;
    public levelStar: MovieClip | null = null;
    public attackBtn: Button_CLIP | null = null;
    public status_txt: TextField | null = null;
    public dot: MovieClip | null = null;
    public attacks_txt: TextField | null = null;
    public helpBtn: Button_CLIP | null = null;
    public msgBtn: Button_CLIP | null = null;
    public truceBtn: Button_CLIP | null = null;
    public extraStatus_txt: TextField | null = null;

    constructor() {
        super();
    }
}
