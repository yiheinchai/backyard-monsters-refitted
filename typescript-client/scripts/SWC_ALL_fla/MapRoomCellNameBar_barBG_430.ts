import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.MapRoomCellNameBar_barBG_430")]
@Embed({ source: "/_assets/assets.swf", symbol: "SWC_ALL_fla.MapRoomCellNameBar_barBG_430" })
export class MapRoomCellNameBar_barBG_430 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
