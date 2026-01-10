import { MovieClip } from "openfl/display/MovieClip";
import { Event } from "openfl/events/Event";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.loading_52")]
@Embed({ source: "/_assets/assets.swf", symbol: "SWC_ALL_fla.loading_52" })
export class loading_52 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    public Tick(event: Event): void {
        this.rotation -= 12;
    }

    private frame1(): void {
        this.addEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
    }
}
