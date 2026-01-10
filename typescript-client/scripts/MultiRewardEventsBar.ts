import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { EventRewardRibbon } from './EventRewardRibbon';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MultiRewardEventsBar")]
@Embed({ source: "/_assets/assets.swf", symbol: "MultiRewardEventsBar" })
export class MultiRewardEventsBar extends MovieClip {
    public mcBackground: MovieClip;
    public progressBarOverlay: MovieClip;
    public buttonAction: MovieClip;
    public reward0: EventRewardRibbon;
    public reward1: EventRewardRibbon;
    public reward2: EventRewardRibbon;
    public buttonActionLabel: TextField;
    public timeLabel: TextField;
    public buttonHelp: MovieClip;
    public eventImage: MovieClip;
    public progressBarFill: MovieClip;
    public logoImage: MovieClip;
    public tScore: TextField;
    public progressBarFillMask: MovieClip;

    constructor() {
        super();
    }
}
