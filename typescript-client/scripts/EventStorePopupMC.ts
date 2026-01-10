import { MovieClip } from 'openfl/display/MovieClip';
import { ButtonBrown_CLIP } from './ButtonBrown_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="EventStorePopupMC")]
@Embed({ source: "/_assets/assets.swf", symbol: "EventStorePopupMC" })
export class EventStorePopupMC extends MovieClip {
    public tabButton2: ButtonBrown_CLIP;
    public tabButton1: ButtonBrown_CLIP;
    public titleImageHolder: MovieClip;
    public experienceDisplay: MovieClip;
    public displayContainer: MovieClip;

    constructor() {
        super();
    }
}
