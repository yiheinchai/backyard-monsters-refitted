import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="system_message")]
@Embed({ source: "/_assets/assets.swf", symbol: "system_message" })
export class system_message extends MovieClip {
    constructor() {
        super();
    }
}
