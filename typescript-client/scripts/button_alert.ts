import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";
import { button_spinner } from "./button_spinner";

// [Embed(source="/_assets/assets.swf", symbol="button_alert")]
@Embed({ source: "/_assets/assets.swf", symbol: "button_alert" })
export class button_alert extends MovieClip {
    public mcSpin: button_spinner;
    public mcCounter: MovieClip;

    constructor() {
        super();
    }
}
