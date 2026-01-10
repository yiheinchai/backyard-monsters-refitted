import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { creatureBar } from './creatureBar';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="GUARDIANCHAMBERPOPUP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "GUARDIANCHAMBERPOPUP_CLIP" })
export class GUARDIANCHAMBERPOPUP_CLIP extends MovieClip {
    public buff_txt: TextField;
    public bSpeed: creatureBar;
    public selectedImage: MovieClip;
    public mcMask: MovieClip;
    public bBuff: creatureBar;
    public bDamage: creatureBar;
    public health_txt: TextField;
    public tTitle: TextField;
    public tSpeed: TextField;
    public tHealth: TextField;
    public frame: frame_CLIP;
    public tEvoDesc: TextField;
    public tEvoStage: TextField;
    public tBuff: TextField;
    public mcBgCubes: MovieClip;
    public tDamage: TextField;
    public damage_txt: TextField;
    public speed_txt: TextField;
    public bHealth: creatureBar;
    public mcBgBot: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
